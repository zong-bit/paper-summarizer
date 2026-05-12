import { NextResponse } from 'next/server'
import { logApiCall } from '@/lib/api-logger'
import { findToken } from '@/lib/tokens'

// ── Rate limiter for anonymous/free users ──
// Per-IP rate limit: 1 request per 10 minutes (anti-abuse)
const rateLimit = new Map<string, { count: number; resetAt: number }>()

function getRateLimitInfo(ip: string): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now()
  const entry = rateLimit.get(ip)

  if (entry && entry.resetAt < now) {
    rateLimit.delete(ip)
  }

  const windowMs = 10 * 60 * 1000 // 10 minutes
  const maxRequests = 1

  if (!entry || entry.resetAt < now) {
    rateLimit.set(ip, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: maxRequests - 1, resetIn: windowMs }
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetIn: entry.resetAt - now }
  }

  entry.count++
  return { allowed: true, remaining: maxRequests - entry.count, resetIn: entry.resetAt - now }
}

// ── Daily free usage tracker (per IP, 3 per day) ──
const freeDailyUsage = new Map<string, { date: string; count: number }>()

function getFreeDailyKey(ip: string): string {
  const today = new Date().toISOString().split('T')[0]
  return `free:${today}:${ip}`
}

function getFreeDailyUsage(ip: string): { date: string; count: number } {
  const key = getFreeDailyKey(ip)
  const today = new Date().toISOString().split('T')[0]
  const entry = freeDailyUsage.get(key)
  if (!entry || entry.date !== today) {
    return { date: today, count: 0 }
  }
  return entry
}

function incrementFreeDailyUsage(ip: string): number {
  const key = getFreeDailyKey(ip)
  const today = new Date().toISOString().split('T')[0]
  const entry = getFreeDailyUsage(ip)
  freeDailyUsage.set(key, { date: today, count: entry.count + 1 })
  return entry.count + 1
}

// ── Token / Pro verification helper ──
function extractProToken(request: Request): { token: string | null; isPro: boolean } {
  // Check Authorization header first
  const authHeader = request.headers.get('authorization') || ''
  const tokenMatch = authHeader.match(/^Bearer\s+(\S+)$/)
  const userToken = tokenMatch ? tokenMatch[1] : null

  if (userToken) {
    const tokenEntry = findToken(userToken)
    if (tokenEntry) {
      // Check expiry
      if (tokenEntry.expiresAt && new Date(tokenEntry.expiresAt) < new Date()) {
        return { token: userToken, isPro: false }
      }
      return { token: userToken, isPro: tokenEntry.plan === 'pro' }
    }
  }

  return { token: null, isPro: false }
}

export async function POST(request: Request) {
  // Collect request info early (before any early returns)
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
             request.headers.get('x-real-ip') || 
             'unknown'
  const ua = request.headers.get('user-agent') || 'unknown'

  try {
    const { text } = await request.json()

    // ── 1. Check Pro token ──
    const { isPro } = extractProToken(request)

    // ── 2. Rate limiting ──
    if (!isPro) {
      // Free users: check daily limit first (3 per day)
      const dailyUsage = getFreeDailyUsage(ip)
      if (dailyUsage.count >= 3) {
        logApiCall({ timestamp: new Date().toISOString(), ip, ua, path: 'summarize', status: 'rejected', textLength: text?.length || 0, errorMsg: 'daily_limit_3' })
        return NextResponse.json(
          {
            error: 'Daily free limit reached (3/3). Upgrade to Pro for unlimited summaries.',
            remaining: 0,
            resetIn: 86400000, // 24 hours
          },
          { status: 429 }
        )
      }

      // Free users: also apply 10-minute cooldown
      const rateInfo = getRateLimitInfo(ip)
      if (!rateInfo.allowed) {
        logApiCall({ timestamp: new Date().toISOString(), ip, ua, path: 'summarize', status: 'rejected', textLength: text?.length || 0, errorMsg: 'rate_limited' })
        return NextResponse.json(
          {
            error: `Rate limit exceeded. Try again in ${Math.ceil(rateInfo.resetIn / 60000)} minutes.`,
            remaining: 0,
            resetIn: rateInfo.resetIn
          },
          {
            status: 429,
            headers: {
              'Retry-After': String(Math.ceil(rateInfo.resetIn / 1000)),
              'X-RateLimit-Remaining': '0',
            }
          }
        )
      }
    }

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 })
    }

    // Log request (fire & forget)
    logApiCall({ timestamp: new Date().toISOString(), ip, ua, path: 'summarize', status: 'success', textLength: text?.length || 0 })

    // Limit text length to prevent abuse
    const maxChars = 15000
    const truncatedText = text.slice(0, maxChars)

    const apiKey = process.env.DEEPSEEK_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    const prompt = `You are a paper summarizer. Summarize the following academic paper and return ONLY valid JSON (no markdown, no code blocks, no extra text). Format:
{
  "oneSentence": "one sentence summary",
  "keyFindings": ["finding 1", "finding 2", "finding 3", "finding 4", "finding 5"],
  "methodology": "one sentence about methodology",
  "conclusion": "main conclusion"
}

Paper text:
${truncatedText}

Return ONLY the JSON object, nothing else.`

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      logApiCall({ timestamp: new Date().toISOString(), ip, ua, path: 'summarize', status: 'error', textLength: text?.length || 0, errorMsg: errorData.error?.message || 'deepseek_api_error' })
      return NextResponse.json(
        { error: errorData.error?.message || 'Failed to generate summary' },
        { status: response.status }
      )
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      return NextResponse.json({ error: 'No response from API' }, { status: 500 })
    }

    // Try to parse JSON, handling potential markdown code blocks
    let parsedContent
    try {
      parsedContent = JSON.parse(content)
    } catch {
      const jsonMatch = content.match(/\`\`\`(?:json)?\s*([\s\S]*?)\`\`\`/)
      if (jsonMatch) {
        try {
          parsedContent = JSON.parse(jsonMatch[1])
        } catch {
          return NextResponse.json({ error: 'Invalid response format from AI' }, { status: 500 })
        }
      } else {
        return NextResponse.json({ error: 'Invalid response format from AI' }, { status: 500 })
      }
    }

    // Increment daily usage only for free users
    if (!isPro) {
      incrementFreeDailyUsage(ip)
    }

    return NextResponse.json({
      ...parsedContent,
      _pro: isPro,
      _remaining: isPro ? -1 : Math.max(0, 3 - (getFreeDailyUsage(ip).count + (isPro ? 0 : 1))),
    })
  } catch (error) {
    console.error('Error:', error)
    const errMsg = error instanceof Error ? error.message : 'unknown_error'
    logApiCall({ timestamp: new Date().toISOString(), ip, ua, path: 'summarize', status: 'error', textLength: 0, errorMsg: errMsg })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

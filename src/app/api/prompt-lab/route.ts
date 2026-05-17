import { NextResponse } from 'next/server'
import { findToken } from '@/lib/tokens'
import { getPromptById, type Prompt } from '@/data/prompts'

// IP-based daily free usage tracker
const freeUsage = new Map<string, { date: string; count: number }>()

function getFreeUsageKey(ip: string): string {
  const today = new Date().toISOString().split('T')[0]
  return `free:${today}:${ip}`
}

function getFreeUsage(ip: string): { date: string; count: number } {
  const key = getFreeUsageKey(ip)
  const today = new Date().toISOString().split('T')[0]
  const entry = freeUsage.get(key)
  if (!entry || entry.date !== today) {
    return { date: today, count: 0 }
  }
  return entry
}

function incrementFreeUsage(ip: string): { date: string; count: number } {
  const key = getFreeUsageKey(ip)
  const today = new Date().toISOString().split('T')[0]
  const entry = getFreeUsage(ip)
  freeUsage.set(key, { date: today, count: entry.count + 1 })
  return { date: today, count: entry.count + 1 }
}

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
             request.headers.get('x-real-ip') || 
             request.headers.get('x-forwarded-for') || 'unknown'

  try {
    const { promptId, variables } = await request.json()

    if (!promptId) {
      return NextResponse.json({ error: 'Missing promptId' }, { status: 400 })
    }

    if (!variables || typeof variables !== 'object') {
      return NextResponse.json({ error: 'Missing or invalid variables' }, { status: 400 })
    }

    // Look up prompt
    const prompt: Prompt | undefined = getPromptById(promptId)
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 })
    }

    // Build the prompt text by replacing [变量] placeholders
    let promptText = prompt.template
    for (const [key, value] of Object.entries(variables)) {
      if (typeof value === 'string' && value.trim()) {
        promptText = promptText.replaceAll(`[${key}]`, value.trim())
      }
    }

    // Check token-based access
    const authHeader = request.headers.get('authorization') || ''
    const tokenMatch = authHeader.match(/^Bearer\s+(\S+)$/)
    const userToken = tokenMatch ? tokenMatch[1] : null

    let isPro = false
    if (userToken) {
      const tokenEntry = await findToken(userToken)
      if (tokenEntry) {
        // Check expiry
        if (tokenEntry.expiresAt && new Date(tokenEntry.expiresAt) < new Date()) {
          return NextResponse.json(
            { error: 'Your Pro token has expired.' },
            { status: 403 }
          )
        }
        isPro = tokenEntry.plan === 'pro'
      }
    }

    // Check free usage limit
    if (!isPro) {
      const usage = getFreeUsage(ip)
      if (usage.count >= 3) {
        return NextResponse.json(
          { 
            error: 'Daily free limit reached (3/3). Upgrade to Pro for unlimited use.',
            remaining: 0,
            resetIn: 86400000, // 24 hours in ms
          },
          { status: 429 }
        )
      }
    }

    const apiKey = process.env.DEEPSEEK_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: '服务正在维护中，请稍后再试。我们正在升级AI引擎以提供更高质量的摘要。', maintenance: true, estimatedRestore: '24-48小时' }, { status: 503 })
    }

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
            content: promptText,
          },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: errorData.error?.message || 'Failed to generate response' },
        { status: response.status }
      )
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      return NextResponse.json({ error: 'No response from API' }, { status: 500 })
    }

    // Increment free usage for non-Pro users
    if (!isPro) {
      incrementFreeUsage(ip)
    }

    return NextResponse.json({
      result: content,
      promptId,
      remaining: isPro ? -1 : 3 - getFreeUsage(ip).count,
    })
  } catch (error) {
    console.error('Prompt Lab error:', error)
    const errMsg = error instanceof Error ? error.message : 'unknown_error'
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

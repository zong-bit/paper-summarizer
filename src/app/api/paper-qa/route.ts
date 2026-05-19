import { NextResponse } from 'next/server'
import { findToken } from '@/lib/tokens'

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
             request.headers.get('x-real-ip') || 'unknown'

  try {
    const { text, question } = await request.json()

    if (!text || !text.trim()) {
      return NextResponse.json({ error: 'No paper text provided' }, { status: 400 })
    }

    if (!question || !question.trim()) {
      return NextResponse.json({ error: 'No question provided' }, { status: 400 })
    }

    // ── Token / Pro verification ──
    const authHeader = request.headers.get('authorization') || ''
    const tokenMatch = authHeader.match(/^Bearer\s+(\S+)$/)
    const userToken = tokenMatch ? tokenMatch[1] : null

    let isPro = false
    if (userToken) {
      const tokenEntry = await findToken(userToken)
      if (tokenEntry) {
        if (tokenEntry.expiresAt && new Date(tokenEntry.expiresAt) < new Date()) {
          return NextResponse.json(
            { error: 'Your Pro token has expired.' },
            { status: 403 }
          )
        }
        isPro = tokenEntry.plan === 'pro'
      }
    }

    if (!isPro) {
      return NextResponse.json(
        { error: 'This is a Pro-only feature. Upgrade to Pro to use Paper Q&A.' },
        { status: 403 }
      )
    }

    const apiKey = process.env.DEEPSEEK_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Service is currently under maintenance. Please try again later. We are upgrading our AI engine for better quality summaries.', maintenance: true, estimatedRestore: '24-48 hours' }, { status: 503 })
    }

    // Limit text length
    const maxChars = 12000
    const truncatedText = text.slice(0, maxChars)
    const truncatedQuestion = question.slice(0, 2000)

    const prompt = `You are an AI research assistant. Given the following academic paper text, answer the user's question based solely on the paper content. If the paper doesn't contain enough information to answer the question, say so.

Paper text:
${truncatedText}

Question: ${truncatedQuestion}

Provide a detailed, well-structured answer. Include relevant quotes from the paper when applicable.`

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
        max_tokens: 2000,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: errorData.error?.message || 'Failed to generate answer' },
        { status: response.status }
      )
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      return NextResponse.json({ error: 'No response from API' }, { status: 500 })
    }

    return NextResponse.json({
      answer: content,
    })
  } catch (error) {
    console.error('Paper Q&A error:', error)
    const errMsg = error instanceof Error ? error.message : 'unknown_error'
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

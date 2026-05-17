import { NextResponse } from 'next/server'
import { findToken } from '@/lib/tokens'

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
             request.headers.get('x-real-ip') || 'unknown'

  try {
    const { topic, context, language } = await request.json()

    if (!topic || !topic.trim()) {
      return NextResponse.json({ error: 'No topic provided' }, { status: 400 })
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
        { error: 'This is a Pro-only feature. Upgrade to Pro to use Literature Outline.' },
        { status: 403 }
      )
    }

    const apiKey = process.env.DEEPSEEK_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: '服务正在维护中，请稍后再试。我们正在升级AI引擎以提供更高质量的摘要。', maintenance: true, estimatedRestore: '24-48小时' }, { status: 503 })
    }

    const truncatedTopic = topic.slice(0, 2000)
    const truncatedContext = context ? context.slice(0, 3000) : ''
    const lang = language === 'zh' ? 'Chinese' : 'English'

    const prompt = `You are an expert in academic literature review. Generate a comprehensive literature review outline for the given research topic. Return ONLY valid JSON (no markdown, no code blocks, no extra text). Format:
{
  "title": "Suggested review title",
  "overview": "Brief overview of the research area (2-3 sentences)",
  "sections": [
    {
      "sectionTitle": "Section title",
      "subsections": [
        {
          "title": "Subsection title",
          "description": "What this subsection should cover",
          "keyQuestions": ["question 1", "question 2"],
          "suggestedPapers": 3
        }
      ]
    }
  ],
  "researchTrends": ["trend 1", "trend 2", "trend 3"],
  "gapsAndFutureDirections": ["gap 1", "gap 2", "gap 3"],
  "recommendedDatabases": ["database 1", "database 2"],
  "timeline": {
    "literatureSearch": "2-3 weeks",
    "initialReading": "2 weeks",
    "detailedAnalysis": "3-4 weeks",
    "writing": "4-6 weeks",
    "total": "3-4 months"
  }
}

Research Topic: ${truncatedTopic}
${truncatedContext ? `Additional Context: ${truncatedContext}` : ''}
Generate the outline in ${lang}.

Return ONLY the JSON object, nothing else. Include 4-6 main sections, each with 2-4 subsections.`

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
        max_tokens: 4000,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: errorData.error?.message || 'Failed to generate outline' },
        { status: response.status }
      )
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      return NextResponse.json({ error: 'No response from API' }, { status: 500 })
    }

    // Try to parse JSON
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

    return NextResponse.json(parsedContent)
  } catch (error) {
    console.error('Literature Outline error:', error)
    const errMsg = error instanceof Error ? error.message : 'unknown_error'
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { findToken } from '@/lib/tokens'

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
             request.headers.get('x-real-ip') || 'unknown'

  try {
    const { papers } = await request.json()

    if (!papers || !Array.isArray(papers) || papers.length < 2 || papers.length > 5) {
      return NextResponse.json(
        { error: 'Please provide 2-5 papers for comparison' },
        { status: 400 }
      )
    }

    // Validate all papers have text
    for (let i = 0; i < papers.length; i++) {
      if (!papers[i].text || !papers[i].text.trim()) {
        return NextResponse.json(
          { error: `Paper ${i + 1} has no text` },
          { status: 400 }
        )
      }
      if (!papers[i].title) {
        papers[i].title = `Paper ${i + 1}`
      }
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
        { error: 'This is a Pro-only feature. Upgrade to Pro to use Paper Comparison.' },
        { status: 403 }
      )
    }

    const apiKey = process.env.DEEPSEEK_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Service is currently under maintenance. Please try again later. We are upgrading our AI engine for better quality summaries.', maintenance: true, estimatedRestore: '24-48 hours' }, { status: 503 })
    }

    // Truncate each paper
    const maxChars = 5000
    const truncatedPapers = papers.map((p: { title: string; text: string }) => ({
      title: p.title,
      text: p.text.slice(0, maxChars),
    }))

    const papersForPrompt = truncatedPapers
      .map((p: { title: string; text: string }, i: number) => `Paper ${i + 1}: "${p.title}"\n${p.text}`)
      .join('\n\n---\n\n')

    const prompt = `You are a research paper comparison expert. Compare the following academic papers and return ONLY valid JSON (no markdown, no code blocks, no extra text). Format:
{
  "summary": "Overall comparison summary (2-3 sentences)",
  "comparisonTable": [
    {
      "dimension": "Research Focus",
      "paper1": "...",
      "paper2": "...",
      ... (one entry per paper)
    },
    ...
  ],
  "keyDifferences": ["difference 1", "difference 2", "difference 3"],
  "commonGrounds": ["common 1", "common 2", "common 3"],
  "recommendation": "Which paper is more suitable for what scenario and why"
}

Papers to compare:

${papersForPrompt}

Return ONLY the JSON object, nothing else. The comparisonTable should have these dimensions: Research Focus, Methodology, Key Findings, Dataset Used, Limitations, Novelty. Each dimension should have a value for every paper.`

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
        max_tokens: 3000,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: errorData.error?.message || 'Failed to generate comparison' },
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
    console.error('Paper Compare error:', error)
    const errMsg = error instanceof Error ? error.message : 'unknown_error'
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

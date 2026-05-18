import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { url } = await request.json()
    
    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'No URL provided' }, { status: 400 })
    }

    const response = await fetch(url, {
      headers: { 'User-Agent': 'Paper-Summarizer/1.0 (Academic Tool)' },
      signal: AbortSignal.timeout(15000)
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch URL' }, { status: 502 })
    }

    const html = await response.text()
    
    // Extract text from HTML
    let text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&[^;]+;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()

    // For arXiv, try to get the abstract specifically
    const abstractMatch = html.match(/<meta\s+name="citation_abstract"[^>]+content="([^"]+)"/i)
    if (abstractMatch) {
      text = abstractMatch[1]
    }

    const maxChars = 15000
    const truncatedText = text.slice(0, maxChars)

    if (truncatedText.length < 50) {
      return NextResponse.json({ error: 'Could not extract meaningful content' }, { status: 422 })
    }

    return NextResponse.json({ text: truncatedText })
  } catch (error: any) {
    console.error('Fetch URL error:', error)
    return NextResponse.json({ error: error.message || 'Failed to fetch' }, { status: 500 })
  }
}

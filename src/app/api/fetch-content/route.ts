import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { url } = await request.json()
    
    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'No URL provided' }, { status: 400 })
    }

    // For arXiv: try to download the PDF and extract text
    const arxivMatch = url.match(/arxiv\.org\/(?:abs|pdf)\/(\d+\.\d+)/i)
    if (arxivMatch) {
      const paperId = arxivMatch[1]
      
      // First get the abstract page for metadata
      const absResponse = await fetch(`https://arxiv.org/abs/${paperId}`, {
        headers: { 'User-Agent': 'Paper-Summarizer/1.0' },
        signal: AbortSignal.timeout(10000)
      })
      
      if (absResponse.ok) {
        const html = await absResponse.text()
        
        // Extract abstract from meta tags
        const abstractMatch = html.match(/<meta\s+name="citation_abstract"[^>]+content="([^"]+)"/i)
        let text = abstractMatch ? abstractMatch[1] : ''
        
        // Also try to get full text from the PDF
        // Try PDF extraction as well
        try {
          const pdfUrl = `https://arxiv.org/pdf/${paperId}`
          const pdfResponse = await fetch(pdfUrl, {
            headers: { 'User-Agent': 'Paper-Summarizer/1.0' },
            signal: AbortSignal.timeout(30000)
          })
          
          if (pdfResponse.ok) {
            const pdfBuffer = await pdfResponse.arrayBuffer()
            // pdf-parse is already used elsewhere in the project
            const pdf = (await import('pdf-parse')).default
            const pdfData = await pdf(Buffer.from(pdfBuffer))
            
            if (pdfData.text && pdfData.text.length > text.length) {
              text = pdfData.text
            }
          }
        } catch (e) {
          // PDF download/parse failed, use abstract text only
          console.log('PDF download failed, using abstract text')
        }
        
        const maxChars = 30000
        const truncatedText = text.slice(0, maxChars)
        
        if (truncatedText.length < 50) {
          return NextResponse.json({ error: 'Could not extract meaningful content' }, { status: 422 })
        }
        
        return NextResponse.json({ text: truncatedText })
      }
    }

    // For other URLs: basic HTML text extraction
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Paper-Summarizer/1.0' },
      signal: AbortSignal.timeout(15000)
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch URL' }, { status: 502 })
    }

    const html = await response.text()
    let text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&[^;]+;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()

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

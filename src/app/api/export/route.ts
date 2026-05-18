import { NextResponse } from 'next/server'

interface ExportPayload {
  format: 'bibtex' | 'ris' | 'plain'
  title: string
  authors: string[]
  journal: string
  year: string | number
  volume?: string | number
  issue?: string | number
  pages?: string
  doi?: string
  url?: string
  abstract?: string
}

function slugifyAuthors(authors: string[]): string {
  const first = authors[0]?.split(' ').pop()?.replace(/[^a-zA-Z\u4e00-\u9fff]/g, '').toLowerCase().slice(0, 10) || 'author'
  return `${first}${String(new Date().getFullYear()).slice(-2)}`
}

function formatBibtex(data: ExportPayload): string {
  const key = slugifyAuthors(data.authors)
  let bibtex = `@article{${key},\n`
  bibtex += `  title={${data.title}},\n`
  bibtex += `  author={${data.authors.join(' and ')}},\n`
  bibtex += `  journal={${data.journal}},\n`
  bibtex += `  year={${data.year}}`
  if (data.volume) bibtex += `,\n  volume={${data.volume}}`
  if (data.issue) bibtex += `,\n  number={${data.issue}}`
  if (data.pages) bibtex += `,\n  pages={${data.pages}}`
  if (data.doi) bibtex += `,\n  doi={${data.doi}}`
  if (data.url) bibtex += `,\n  url={${data.url}}`
  bibtex += '\n}'
  return bibtex
}

function formatRis(data: ExportPayload): string {
  let ris = 'TY  - JOUR\n'
  ris += `TI  - ${data.title}\n`
  for (const author of data.authors) {
    ris += `AU  - ${author}\n`
  }
  ris += `PY  - ${data.year}\n`
  if (data.journal) ris += `JF  - ${data.journal}\n`
  if (data.volume) ris += `VL  - ${data.volume}\n`
  if (data.issue) ris += `IS  - ${data.issue}\n`
  if (data.pages) ris += `SP  - ${data.pages}\n`
  if (data.doi) ris += `DO  - ${data.doi}\n`
  if (data.url) ris += `UR  - ${data.url}\n`
  if (data.abstract) ris += `AB  - ${data.abstract}\n`
  ris += 'ER  - '
  return ris
}

function formatPlain(data: ExportPayload): string {
  const authorStr = data.authors.join(', ')
  let text = `${authorStr} (${data.year}). ${data.title}. ${data.journal}`
  if (data.volume) text += `. ${data.volume}`
  if (data.issue) text += `(${data.issue})`
  if (data.pages) text += `, ${data.pages}`
  if (data.doi) text += `. https://doi.org/${data.doi}`
  text += '.\n'
  if (data.abstract) text += `\n${data.abstract}\n`
  return text
}

export async function POST(request: Request) {
  let data: ExportPayload
  try {
    data = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { format, title, authors, journal, year } = data
  if (!title || !authors?.length || !journal || !year) {
    return NextResponse.json({ error: 'Missing required fields: title, authors, journal, year' }, { status: 400 })
  }

  let content: string
  let ext: string
  let mime: string

  switch (format) {
    case 'bibtex':
      content = formatBibtex(data)
      ext = 'bib'
      mime = 'text/x-bibtex'
      break
    case 'ris':
      content = formatRis(data)
      ext = 'ris'
      mime = 'text/x-research-info-systems'
      break
    case 'plain':
      content = formatPlain(data)
      ext = 'txt'
      mime = 'text/plain'
      break
    default:
      return NextResponse.json({ error: 'Invalid format. Use bibtex, ris, or plain.' }, { status: 400 })
  }

  const safeName = title.replace(/[^a-zA-Z0-9\u4e00-\u9fff\s-]/g, '').replace(/\s+/g, '-').toLowerCase().slice(0, 80) || 'export'

  return new NextResponse(content, {
    status: 200,
    headers: {
      'Content-Type': mime,
      'Content-Disposition': `attachment; filename="${safeName}.${ext}"`,
    },
  })
}

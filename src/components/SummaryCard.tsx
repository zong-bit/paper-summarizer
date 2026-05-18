'use client'

import { useState } from 'react'

interface KeyFinding {
  text: string
  source_page?: number
  source_paragraph?: number
}

interface SummaryCardProps {
  summary: {
    oneSentence: string
    keyFindings: (string | KeyFinding)[]
    methodology: string
    conclusion: string
    _rate?: { remaining: number; resetIn: number }
  }
  title?: string
}

const SHARE_MESSAGE = 'I just used AI to summarize a research paper in seconds! Try it free at summarizai.app'

function ShareButtons({ onShare }: { onShare: () => void }) {
  const shareUrl = 'https://www.summarizeai.app'
  const encodedText = encodeURIComponent(SHARE_MESSAGE)
  const encodedUrl = encodeURIComponent(shareUrl)

  const handleShare = (platform: string) => {
    let url = ''
    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`
        break
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
        break
      case 'copy':
        navigator.clipboard.writeText(`${SHARE_MESSAGE}\n${shareUrl}`)
        onShare()
        return
    }
    if (url) {
      window.open(url, '_blank', 'width=600,height=400')
      onShare()
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleShare('twitter')}
        className="p-2 bg-bg-hover hover:bg-primary/20 rounded-lg transition-colors"
        title="Share on Twitter"
      >
        <svg className="w-5 h-5 text-text-secondary" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      </button>
      <button
        onClick={() => handleShare('linkedin')}
        className="p-2 bg-bg-hover hover:bg-primary/20 rounded-lg transition-colors"
        title="Share on LinkedIn"
      >
        <svg className="w-5 h-5 text-text-secondary" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      </button>
      <button
        onClick={() => handleShare('copy')}
        className="p-2 bg-bg-hover hover:bg-primary/20 rounded-lg transition-colors"
        title="Copy link"
      >
        <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      </button>
    </div>
  )
}

function ExportButtons({ title, keyFindings }: { title: string; keyFindings: (string | KeyFinding)[] }) {
  const [loading, setLoading] = useState<string | null>(null)

  const authors = Array.from({ length: 5 }, (_, i) => `Author${i + 1}`)
  const year = new Date().getFullYear()

  const buildPayload = (format: string) => ({
    format,
    title,
    authors,
    journal: 'Journal',
    year,
    volume: '',
    issue: '',
    pages: '',
    doi: '',
    url: '',
    abstract: '',
  })

  const handleExport = async (format: 'bibtex' | 'ris' | 'plain') => {
    setLoading(format)
    try {
      const res = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload(format)),
      })
      if (!res.ok) throw new Error('Export failed')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const safeName = title.replace(/[^a-zA-Z0-9\u4e00-\u9fff\s-]/g, '').replace(/\s+/g, '-').toLowerCase().slice(0, 80)
      const extMap = { bibtex: 'bib', ris: 'ris', plain: 'txt' }
      a.download = `${safeName}.${extMap[format]}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error(`Export ${format} error:`, err)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="flex items-center gap-1">
      {(['bibtex', 'ris', 'plain'] as const).map((fmt) => (
        <button
          key={fmt}
          onClick={() => handleExport(fmt)}
          disabled={!!loading}
          className="px-2.5 py-1 text-xs bg-bg-hover hover:bg-primary/20 text-text-secondary hover:text-primary rounded-md transition-colors font-mono disabled:opacity-50"
          title={`Export as ${fmt}`}
        >
          {loading === fmt ? (
            <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : fmt.toUpperCase()}
        </button>
      ))}
    </div>
  )
}

function AnchorLink({ page, paragraph }: { page: number | undefined; paragraph: number | undefined }) {
  if (!page || !paragraph) return null
  return (
    <span className="inline-block ml-1.5 text-[11px] text-blue-500 hover:text-blue-700 cursor-pointer select-none font-mono bg-blue-50 hover:bg-blue-100 px-1.5 py-0.5 rounded transition-colors" title={`Source: page ${page}, paragraph ${paragraph}`}>
      [{page}.{paragraph}]
    </span>
  )
}

function normalizeFindings(findings: (string | KeyFinding)[]): KeyFinding[] {
  return findings.map((f) =>
    typeof f === 'string' ? { text: f, source_page: 0, source_paragraph: 0 } : f
  )
}

export default function SummaryCard({ summary, title }: SummaryCardProps) {
  const [copied, setCopied] = useState(false)
  const [shared, setShared] = useState(0)
  const [exporting, setExporting] = useState(false)

  const findings = normalizeFindings(summary.keyFindings)

  const handleExportPdf = async () => {
    setExporting(true)
    try {
      const pdfTitle = title || 'Research Paper Summary'
      const res = await fetch('/api/export-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: pdfTitle,
          oneSentence: summary.oneSentence,
          keyFindings: summary.keyFindings,
          methodology: summary.methodology,
          conclusion: summary.conclusion,
        }),
      })
      if (!res.ok) throw new Error('Export failed')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const safeName = title?.replace(/[^a-zA-Z0-9\u4e00-\u9fff\s-]/g, '').replace(/\s+/g, '-').toLowerCase().slice(0, 80) || 'summary'
      a.download = `${safeName}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('PDF export error:', err)
    } finally {
      setExporting(false)
    }
  }

  const copyToClipboard = async () => {
    const text = `Summary: ${summary.oneSentence}\n\nKey Findings:\n${findings.map((f, i) => `${i + 1}. ${f.text}`).join('\n')}\n\nMethodology: ${summary.methodology}\n\nConclusion: ${summary.conclusion}`
    
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleShare = () => {
    const newCount = shared + 1
    setShared(newCount)
    if (typeof window !== 'undefined') {
      const total = parseInt(localStorage.getItem('ps_shares') || '0', 10)
      localStorage.setItem('ps_shares', String(total + 1))
    }
  }

  const remaining = summary._rate?.remaining ?? 0

  return (
    <div className="bg-bg-card border border-border rounded-2xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-text">Paper Summary</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportPdf}
            disabled={exporting}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 disabled:bg-green-800 text-white rounded-lg transition-colors text-sm font-medium"
            title="Export as PDF"
          >
            {exporting ? (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707v1.591a1 1 0 01-.293.707l-3 3a2 2 0 01-1.414.586 2 2 0 01-1.414-.586z" />
              </svg>
            )}
            {exporting ? 'Exporting...' : 'Export PDF'}
          </button>
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors text-sm font-medium"
          >
          {copied ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
    </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-text-secondary mb-2">Summary</h3>
          <p className="text-text leading-relaxed">{summary.oneSentence}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-text-secondary mb-2">Key Findings</h3>
          <ul className="space-y-2">
            {findings.map((finding, index) => (
              <li key={index} className="flex items-start gap-2 text-text">
                <span className="flex-shrink-0 w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </span>
                <span>{finding.text}<AnchorLink page={finding.source_page} paragraph={finding.source_paragraph} /></span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-text-secondary mb-2">Methodology</h3>
          <p className="text-text leading-relaxed">{summary.methodology}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-text-secondary mb-2">Conclusion</h3>
          <p className="text-text leading-relaxed">{summary.conclusion}</p>
        </div>
      </div>

      {/* Share section */}
      <div className="border-t border-border pt-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShareButtons onShare={handleShare} />
            {shared > 0 && (
              <span className="text-xs text-success font-medium">+{shared} share{shared > 1 ? 's' : ''}</span>
            )}
          </div>
          <ExportButtons title={title || 'Research Paper Summary'} keyFindings={summary.keyFindings} />
          <span className="text-xs text-text-secondary/60">
            {remaining > 0 ? `${remaining} use${remaining > 1 ? 's' : ''} left` : 'Limit reached'}
          </span>
        </div>
        <p className="text-xs text-text-secondary/50">
          Share to support the free tool! Your shared count helps unlock more features in the future.
        </p>
      </div>
    </div>
  )
}

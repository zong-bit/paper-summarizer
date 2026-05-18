'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

interface KeyFinding {
  text: string
  source_page?: number
  source_paragraph?: number
  source_text?: string
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
  originalText?: string
  domain?: string
  onSaveToLibrary?: (info: { title: string; content: string; domain: string }) => void
}

const SHARE_MESSAGE = 'I just used AI to summarize a research paper in seconds! Try it at summarizeai.app'

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
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 0 00-5.656-5.656l-1.1 1.1" />
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

function AnchorLink({ page, paragraph, onClick }: { page: number | undefined; paragraph: number | undefined; onClick?: () => void }) {
  if (!page || !paragraph) return null
  return (
    <span
      className="inline-block ml-1.5 text-[11px] text-blue-500 hover:text-blue-700 cursor-pointer select-none font-mono bg-blue-50 hover:bg-blue-100 px-1.5 py-0.5 rounded transition-colors"
      title={`Source: page ${page}, paragraph ${paragraph}`}
      onClick={(e) => {
        e.stopPropagation()
        onClick?.()
      }}
    >
      [{page}.{paragraph}]
    </span>
  )
}

function normalizeFindings(findings: (string | KeyFinding)[]): KeyFinding[] {
  return findings.map((f) =>
    typeof f === 'string' ? { text: f, source_page: 0, source_paragraph: 0, source_text: '' } : f
  )
}

/**
 * Split text into paragraphs (split by double newline or single newline).
 * Returns array of paragraph strings.
 */
function splitParagraphs(text: string): string[] {
  if (!text || !text.trim()) return []
  // Split by double newline first, then single newline if result is too few
  let paragraphs = text.split(/\n\s*\n/)
  if (paragraphs.length < 3) {
    paragraphs = text.split(/\n+/)
  }
  return paragraphs
    .map(p => p.trim())
    .filter(p => p.length > 0)
}

/**
 * Find the paragraph index that best matches the given source_text.
 * Uses similarity scoring to find the best match.
 */
function findBestMatchIndex(paragraphs: string[], sourceText: string, page: number, paragraphNum: number): number {
  if (!sourceText || !sourceText.trim()) {
    // Fallback: use estimated paragraph number (0-indexed)
    return Math.max(0, Math.min(paragraphs.length - 1, (paragraphNum || 1) - 1))
  }

  const normalizedSource = sourceText.toLowerCase().trim()
  let bestScore = 0
  let bestIndex = 0

  // If source_text is short (< 20 chars), use exact paragraph number as primary
  if (normalizedSource.length < 20) {
    const fallback = Math.max(0, Math.min(paragraphs.length - 1, (paragraphNum || 1) - 1))
    // Also check nearby paragraphs for a better match
    const range = 5
    for (let i = Math.max(0, fallback - range); i <= Math.min(paragraphs.length - 1, fallback + range); i++) {
      const score = computeSimilarity(normalizedSource, paragraphs[i].toLowerCase().trim())
      if (score > bestScore) {
        bestScore = score
        bestIndex = i
      }
    }
    return bestIndex
  }

  for (let i = 0; i < paragraphs.length; i++) {
    const score = computeSimilarity(normalizedSource, paragraphs[i].toLowerCase().trim())
    if (score > bestScore) {
      bestScore = score
      bestIndex = i
    }
  }

  return bestIndex
}

/**
 * Simple text similarity score (0-1) based on shared words.
 */
function computeSimilarity(a: string, b: string): number {
  if (!a || !b) return 0
  const wordsA = new Set(a.split(/\s+/))
  const wordsB = new Set(b.split(/\s+/))
  if (wordsA.size === 0 || wordsB.size === 0) return 0
  let matches = 0
  for (const w of wordsA) {
    if (wordsB.has(w)) matches++
  }
  return matches / Math.max(wordsA.size, wordsB.size)
}

export default function SummaryCard({ summary, title, originalText, domain, onSaveToLibrary }: SummaryCardProps) {
  const [copied, setCopied] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [showOriginal, setShowOriginal] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null)
  const [savingToLibrary, setSavingToLibrary] = useState(false)
  const [savedToLibrary, setSavedToLibrary] = useState(false)

  const originalPanelRef = useRef<HTMLDivElement>(null)
  const highlightedRef = useRef<HTMLDivElement>(null)

  const findings = normalizeFindings(summary.keyFindings)

  const paperTitle = title || summary.oneSentence || 'Research Paper'

  const handleSaveToLibrary = async () => {
    if (savingToLibrary || savedToLibrary) return
    setSavingToLibrary(true)
    try {
      const content = [
        `Summary: ${summary.oneSentence}`,
        '',
        'Key Findings:',
        ...findings.map((f, i) => `${i + 1}. ${f.text}`),
        '',
        `Methodology: ${summary.methodology}`,
        '',
        `Conclusion: ${summary.conclusion}`,
      ].join('\n')

      const res = await fetch('/api/library', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: paperTitle,
          content,
          domain: domain || 'General',
          source: 'summarizeai',
        }),
      })

      const data = await res.json()
      if (res.ok) {
        setSavedToLibrary(true)
        onSaveToLibrary?.({ title: paperTitle, content, domain: domain || 'General' })
      }
    } catch (err) {
      console.error('Save to library error:', err)
    } finally {
      setSavingToLibrary(false)
    }
  }

  // Check localStorage for saved state on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && paperTitle) {
      const saved = localStorage.getItem(`ps-library-saved:${paperTitle}`)
      if (saved === 'true') {
        setSavedToLibrary(true)
      }
    }
  }, [paperTitle])

  // Save state to localStorage when saved
  useEffect(() => {
    if (savedToLibrary && paperTitle) {
      localStorage.setItem(`ps-library-saved:${paperTitle}`, 'true')
    }
  }, [savedToLibrary, paperTitle])

  // Scroll to highlighted paragraph after render
  useEffect(() => {
    if (highlightedIndex !== null && highlightedRef.current && showOriginal) {
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        highlightedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      })
    }
  }, [highlightedIndex, showOriginal])

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

  const remaining = summary._rate?.remaining ?? 0

  // Split original text into paragraphs for display
  const paragraphs = originalText ? splitParagraphs(originalText) : []

  /**
   * Handle clicking an anchor link: expand the original text panel and highlight the paragraph.
   */
  const handleAnchorClick = useCallback((index: number) => {
    setShowOriginal(true)
    setHighlightedIndex(index)
    // Delay scroll to next tick so DOM has updated
    setTimeout(() => {
      highlightedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 100)
  }, [])

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
            onClick={handleSaveToLibrary}
            disabled={savingToLibrary || savedToLibrary}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
              savedToLibrary
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
            } disabled:bg-slate-700 disabled:text-slate-500`}
          >
            {savingToLibrary ? (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : savedToLibrary ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            )}
            {savingToLibrary ? 'Saving...' : savedToLibrary ? 'Saved' : 'Save to Library'}
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
                <span className="flex-1">{finding.text}<AnchorLink page={finding.source_page} paragraph={finding.source_paragraph} onClick={() => handleAnchorClick(index)} /></span>
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

      {/* Original Text Reference Panel */}
      {originalText && paragraphs.length > 0 && (
        <div ref={originalPanelRef} className="border-t border-border pt-4">
          <button
            onClick={() => setShowOriginal(!showOriginal)}
            className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-dark transition-colors w-full"
          >
            <svg
              className={`w-4 h-4 transition-transform ${showOriginal ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            原文对照 ({paragraphs.length} paragraphs)
          </button>

          {showOriginal && (
            <div className="mt-3 bg-bg-hover rounded-xl p-4 space-y-3 max-h-[60vh] overflow-y-auto">
              <p className="text-xs text-text-secondary mb-2">
                Click on any [page.paragraph] anchor above to highlight the corresponding original text.
              </p>
              {paragraphs.map((paragraph, index) => {
                const isHighlighted = highlightedIndex !== null && index === highlightedIndex
                // Also highlight paragraphs near the highlighted one
                const isNearHighlighted = highlightedIndex !== null && Math.abs(index - highlightedIndex) <= 2 && index !== highlightedIndex
                
                return (
                  <div
                    key={index}
                    ref={isHighlighted ? highlightedRef : undefined}
                    className={`rounded-lg p-3 transition-all duration-300 ${
                      isHighlighted
                        ? 'bg-amber-100 dark:bg-amber-900/30 border-l-4 border-amber-500 shadow-sm'
                        : isNearHighlighted
                          ? 'bg-bg-card border border-border/50'
                          : 'border border-transparent'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="flex-shrink-0 text-xs text-text-secondary/50 font-mono mt-0.5 w-6 text-right">
                        {index + 1}
                      </span>
                      <p className={`text-sm leading-relaxed whitespace-pre-wrap ${
                        isHighlighted ? 'text-amber-900 dark:text-amber-100 font-medium' : 'text-text-secondary'
                      }`}>
                        {paragraph}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Share section */}
      <div className="border-t border-border pt-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShareButtons onShare={() => {}} />
          </div>
          <ExportButtons title={title || 'Research Paper Summary'} keyFindings={summary.keyFindings} />
        </div>
        <p className="text-xs text-text-secondary/50">
          Share this tool with your peers.
        </p>
      </div>
    </div>
  )
}

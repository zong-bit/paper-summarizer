'use client'

import { useState } from 'react'
import Link from 'next/link'
import Footer from '../../../components/Footer'
import LanguageSwitcher from '../../../components/LanguageSwitcher'
import { useTranslation } from '@/i18n/provider'

interface PaperInput {
  title: string
  text: string
}

interface ComparisonResult {
  summary: string
  comparisonTable: Array<{
    dimension: string
    [key: string]: string
  }>
  keyDifferences: string[]
  commonGrounds: string[]
  recommendation: string
}

export default function PaperComparePage() {
  const { t, tArray } = useTranslation()
  const [papers, setPapers] = useState<PaperInput[]>([
    { title: '', text: '' },
    { title: '', text: '' },
  ])
  const [result, setResult] = useState<ComparisonResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addPaper = () => {
    if (papers.length >= 5) return
    setPapers([...papers, { title: '', text: '' }])
  }

  const removePaper = (index: number) => {
    if (papers.length <= 2) return
    setPapers(papers.filter((_, i) => i !== index))
    setResult(null)
  }

  const updatePaper = (index: number, field: 'title' | 'text', value: string) => {
    const updated = [...papers]
    updated[index] = { ...updated[index], [field]: value }
    setPapers(updated)
    setResult(null)
  }

  const handleSubmit = async () => {
    const validPapers = papers.filter(p => p.text.trim())
    if (validPapers.length < 2) {
      setError(t('paperCompare.error'))
      return
    }

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch('/api/paper-compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ papers: validPapers }),
      })

      const data = await res.json()

      if (res.ok) {
        setResult(data)
      } else if (res.status === 403) {
        setError(data.error || 'Pro feature. Please upgrade.')
      } else {
        setError(data.error || 'Failed to generate comparison')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    setPapers([{ title: '', text: '' }, { title: '', text: '' }])
    setResult(null)
    setError(null)
  }

  const paperCount = papers.filter(p => p.text.trim()).length

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border bg-bg-card/50 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-text hover:text-primary transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-bold">Paper Summarizer</span>
          </Link>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <span className="px-2.5 py-1 bg-primary/20 text-primary rounded-lg text-xs font-medium">{t('tools.proFeature')}</span>
            <Link href="/premium" className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-sm font-medium transition-colors border border-primary/20">
              ⭐ {t('tools.upgrade')}
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Title */}
        <div className="text-center space-y-3">
          <div className="inline-block px-4 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">
            {t('tools.proFeature')}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-text">
            {t('paperCompare.title')}
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            {t('paperCompare.subtitle')}
          </p>
        </div>

        {/* Input Area */}
        <div className="space-y-4">
          {papers.map((paper, index) => (
            <div key={index} className="bg-bg-card border border-border rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-text">{t('paperCompare.paperN', { n: index + 1 })}</h3>
                {papers.length > 2 && (
                  <button
                    onClick={() => removePaper(index)}
                    className="text-xs text-error hover:underline"
                  >
                    {t('paperCompare.remove')}
                  </button>
                )}
              </div>
              <input
                type="text"
                value={paper.title}
                onChange={(e) => updatePaper(index, 'title', e.target.value)}
                placeholder={t('paperCompare.paperTitle')}
                className="w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-text placeholder-text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                disabled={isLoading}
              />
              <textarea
                value={paper.text}
                onChange={(e) => updatePaper(index, 'text', e.target.value)}
                placeholder={t('paperCompare.paperPlaceholder', { n: index + 1 })}
                className="w-full h-28 bg-bg border border-border rounded-xl p-3 text-text placeholder-text-secondary/40 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 scrollbar-thin text-sm"
                disabled={isLoading}
              />
            </div>
          ))}

          {/* Add Paper Button */}
          {papers.length < 5 && (
            <button
              onClick={addPaper}
              disabled={isLoading}
              className="w-full py-3 border-2 border-dashed border-border hover:border-primary/40 text-text-secondary hover:text-text rounded-2xl transition-colors text-sm font-medium"
            >
              {t('paperCompare.addAnother', { n: papers.length })}
            </button>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={isLoading || paperCount < 2}
              className="flex-1 py-3.5 bg-primary hover:bg-primary-dark disabled:bg-primary/50 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('paperCompare.comparing')}
                </>
              ) : (
                t('paperCompare.compareN', { n: paperCount })
              )}
            </button>
            <button
              onClick={handleClear}
              className="px-6 py-3.5 bg-bg-hover hover:bg-border text-text-secondary rounded-xl transition-colors"
            >
              {t('paperCompare.clearAll')}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-error/10 border border-error/30 rounded-xl p-4 text-error text-sm">
              {error}
              {error.includes('Pro') && (
                <Link href="/premium" className="block mt-2 text-primary hover:underline">
                  {t('common.upgradeToPro')}
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Result */}
        {result && (
          <div className="space-y-6">
            {/* Summary */}
            <div className="bg-bg-card border border-border rounded-2xl p-6">
              <h2 className="font-semibold text-text mb-3">{t('paperCompare.resultSummary')}</h2>
              <p className="text-text-secondary text-sm leading-relaxed">{result.summary}</p>
            </div>

            {/* Comparison Table */}
            <div className="bg-bg-card border border-border rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <h2 className="font-semibold text-text">{t('paperCompare.resultTable')}</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-5 py-3 text-text-secondary font-medium">{t('paperCompare.resultDimension')}</th>
                      {papers.filter(p => p.text.trim()).map((_, i) => (
                        <th key={i} className="text-left px-5 py-3 text-text font-medium">
                          Paper {i + 1}{papers[i]?.title ? `: ${papers[i].title}` : ''}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.comparisonTable.map((row, i) => (
                      <tr key={i} className="border-b border-border last:border-b-0">
                        <td className="px-5 py-3 text-text font-medium whitespace-nowrap">{row.dimension}</td>
                        {papers.filter(p => p.text.trim()).map((_, j) => {
                          const key = `paper${j + 1}`
                          return (
                            <td key={j} className="px-5 py-3 text-text-secondary">
                              {row[key] || '-'}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Key Differences & Common Grounds */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-bg-card border border-border rounded-2xl p-6">
                <h2 className="font-semibold text-text mb-3">{t('paperCompare.resultDifferences')}</h2>
                <ul className="space-y-2">
                  {result.keyDifferences.map((d, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                      <span className="text-error mt-0.5">•</span>
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-bg-card border border-border rounded-2xl p-6">
                <h2 className="font-semibold text-text mb-3">{t('paperCompare.resultCommon')}</h2>
                <ul className="space-y-2">
                  {result.commonGrounds.map((g, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                      <span className="text-success mt-0.5">•</span>
                      {g}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recommendation */}
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/30 rounded-2xl p-6">
              <h2 className="font-semibold text-text mb-3">{t('paperCompare.resultRecommendation')}</h2>
              <p className="text-text-secondary text-sm leading-relaxed">{result.recommendation}</p>
            </div>
          </div>
        )}

        {/* Back link */}
        <div className="text-center pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-bg-card border border-border hover:border-primary/40 text-text rounded-xl text-sm transition-colors"
          >
            {t('common.backToHome')}
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}

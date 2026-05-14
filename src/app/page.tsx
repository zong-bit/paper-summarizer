'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import AdPlaceholder from '../components/AdPlaceholder'
import Footer from '../components/Footer'
import VisitorCounter from '../components/VisitorCounter'
import SummaryCard from '../components/SummaryCard'
import LanguageSwitcher from '../components/LanguageSwitcher'
import { useTranslation } from '@/i18n/provider'

type SummaryData = {
  oneSentence: string
  keyFindings: string[]
  methodology: string
  conclusion: string
}

export default function Home() {
  const { t } = useTranslation()
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [summary, setSummary] = useState<SummaryData | null>(null)
  const [error, setError] = useState('')
  const [rateLimitTimer, setRateLimitTimer] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/extract-pdf', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      if (response.ok) {
        setInputText(data.text)
      } else {
        setError(data.error || 'Failed to extract text from PDF')
      }
    } catch (err) {
      setError('Failed to process PDF')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!inputText.trim()) {
      setError(t('hero.pasteText'))
      return
    }

    setIsLoading(true)
    setError('')
    setSummary(null)

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      })

      const data = await response.json()
      if (response.ok) {
        setSummary(data)
        setRateLimitTimer(null)
      } else if (response.status === 429) {
        setError('')
        setRateLimitTimer(data.resetIn || 600000)
      } else {
        setError(data.error || 'Failed to generate summary')
      }
    } catch (err) {
      setError('Failed to generate summary')
    } finally {
      setIsLoading(false)
    }
  }

  const SAMPLE_TEXT = `Deep learning has revolutionized the field of natural language processing in recent years. This paper presents a comprehensive survey of transformer-based architectures and their applications across various NLP tasks. We analyze the evolution from the original Transformer model to modern variants including BERT, GPT, RoBERTa, and T5. Our study covers pre-training objectives, model architectures, and fine-tuning strategies. We find that larger models consistently outperform smaller ones across all benchmarks, with diminishing returns beyond 1.5 billion parameters. The study also reveals that domain-specific pre-training significantly improves performance on specialized tasks. Our analysis shows that transformer models achieve state-of-the-art results on 89% of evaluated NLP benchmarks. Key challenges include computational cost, data efficiency, and model interpretability. We propose several directions for future research including more efficient architectures and better evaluation methodologies.`

  const handleExample = () => {
    setInputText(SAMPLE_TEXT)
    setSummary(null)
    setError('')
  }

  const handleClear = () => {
    setInputText('')
    setSummary(null)
    setError('')
    setRateLimitTimer(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Rate limit countdown
  useEffect(() => {
    if (rateLimitTimer === null || rateLimitTimer <= 0) return
    const interval = setInterval(() => {
      setRateLimitTimer(prev => {
        if (prev === null || prev <= 1000) {
          clearInterval(interval)
          return null
        }
        return prev - 1000
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [rateLimitTimer !== null])

  const formatTimer = (ms: number) => {
    const min = Math.ceil(ms / 60000)
    if (min >= 1) return `${min} min`
    const sec = Math.ceil(ms / 1000)
    return `${sec}s`
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border bg-bg-card/50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-text">Paper Summarizer</span>
          </div>
          <div className="flex items-center gap-3">
            <VisitorCounter />
            <LanguageSwitcher />
            <Link
              href="/premium"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-sm font-medium transition-colors border border-primary/20"
            >
              ⭐ {t('nav.premium')}
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 space-y-8">
        {!summary ? (
          <>
            <div className="text-center space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold text-text">
                {t('hero.title')}
              </h1>
              <p className="text-text-secondary text-lg">
                {t('hero.subtitle')}
              </p>
            </div>

            <AdPlaceholder />

            <div className="bg-bg-card border border-border rounded-2xl p-6 space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-secondary hover:bg-secondary/80 text-white rounded-xl transition-colors font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  {t('hero.uploadPdf')}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isLoading}
                />
                <button
                  onClick={handleExample}
                  className="px-6 py-3 bg-accent/20 hover:bg-accent/30 text-accent rounded-xl transition-colors font-medium border border-accent/30"
                >
                  {t('hero.tryExample')}
                </button>
                <button
                  onClick={handleClear}
                  className="px-6 py-3 bg-bg-hover hover:bg-border text-text-secondary rounded-xl transition-colors font-medium"
                >
                  {t('hero.clear')}
                </button>
              </div>

              <div className="relative">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={t('hero.placeholder')}
                  className="w-full h-64 bg-bg border border-border rounded-xl p-4 text-text placeholder-text-secondary/60 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 scrollbar-thin"
                  disabled={isLoading}
                />
                <div className="absolute bottom-3 right-3 text-xs text-text-secondary/50">
                  {inputText.length.toLocaleString()} {t('hero.charCount')}
                </div>
              </div>

              {rateLimitTimer !== null ? (
                <div className="bg-warning/10 border border-warning/30 rounded-xl p-4 text-center space-y-2">
                  <div className="text-warning font-semibold">{t('hero.usageLimit')}</div>
                  <div className="text-text-secondary text-sm">
                    {t('hero.tryAgainIn').replace('<span>{time}</span>', `<span class="font-mono font-bold text-warning">${formatTimer(rateLimitTimer)}</span>`)}
                    {/* We use dangerouslySetInnerHTML below as a fallback */}
                  </div>
                  <div className="text-text-secondary/60 text-xs">
                    {t('hero.shareToUnlock')}
                  </div>
                </div>
              ) : error && (
                <div className="text-error text-sm">{error}</div>
              )}

              <button
                onClick={handleSubmit}
                disabled={isLoading || !inputText.trim()}
                className="w-full py-4 bg-primary hover:bg-primary-dark disabled:bg-primary/50 disabled:cursor-not-allowed text-white rounded-xl font-semibold text-lg transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t('hero.summarizing')}
                  </>
                ) : inputText === SAMPLE_TEXT ? (
                  t('hero.runExample')
                ) : (
                  t('hero.cta')
                )}
              </button>
            </div>

            <AdPlaceholder />

            <div className="text-center text-text-secondary/50 text-xs space-y-1">
              <p>{t('hero.poweredBy')}</p>
              <p>{t('hero.charsInfo')}</p>
            </div>

            {/* CTA for Pro */}
            <div className="text-center">
              <Link
                href="/premium"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl text-sm font-medium transition-colors border border-primary/20"
              >
                {t('hero.upgradeToPro')}
              </Link>
            </div>

            {/* Pricing Comparison */}
            <div className="bg-gradient-to-br from-bg-card to-bg-card/50 border border-border rounded-2xl p-8 space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-text">{t('pricing.title')}</h2>
                <p className="text-text-secondary">{t('pricing.subtitle')}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Free Card */}
                <div className="bg-bg-card border border-border rounded-2xl p-6 space-y-4">
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-bold text-text">{t('pricing.free')}</h3>
                    <div className="text-3xl font-bold text-text">{t('pricing.freePrice')}</div>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2 text-sm text-text-secondary">
                      <span className="text-green-500">✓</span>
                      {t('pricing.freeSummary')}
                    </li>
                    <li className="flex items-center gap-2 text-sm text-text-secondary">
                      <span className="text-green-500">✓</span>
                      {t('pricing.freePdf')}
                    </li>
                    <li className="flex items-center gap-2 text-sm text-text-secondary">
                      <span className="text-green-500">✓</span>
                      {t('pricing.freeFormats')}
                    </li>
                  </ul>
                  <Link
                    href="/"
                    className="block w-full text-center py-3 bg-bg-card border border-border hover:bg-bg-hover text-text rounded-xl font-medium transition-colors"
                  >
                    {t('pricing.getStarted')}
                  </Link>
                </div>
                {/* Pro Card */}
                <div className="bg-bg-card border border-primary/50 ring-1 ring-primary/30 rounded-2xl p-6 space-y-4 relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full">{t('pricing.popular')}</span>
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-bold text-text">{t('pricing.pro')}</h3>
                    <div className="text-3xl font-bold text-text">
                      {t('pricing.proPrice')}
                      <span className="text-sm text-text-secondary font-normal">{t('pricing.proPriceSuffix')}</span>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2 text-sm text-text-secondary">
                      <span className="text-green-500">✓</span>
                      {t('pricing.proUnlimited')}
                    </li>
                    <li className="flex items-center gap-2 text-sm text-text-secondary">
                      <span className="text-green-500">✓</span>
                      {t('pricing.proPriority')}
                    </li>
                    <li className="flex items-center gap-2 text-sm text-text-secondary">
                      <span className="text-green-500">✓</span>
                      {t('pricing.proPdf')}
                    </li>
                    <li className="flex items-center gap-2 text-sm text-text-secondary">
                      <span className="text-green-500">✓</span>
                      {t('pricing.proFormats')}
                    </li>
                    <li className="flex items-center gap-2 text-sm text-text-secondary">
                      <span className="text-green-500">✓</span>
                      {t('pricing.proToken')}
                    </li>
                    <li className="flex items-center gap-2 text-sm text-text-secondary">
                      <span className="text-green-500">✓</span>
                      {t('pricing.proSupport')}
                    </li>
                  </ul>
                  <Link
                    href="/premium"
                    className="block w-full text-center py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium transition-colors"
                  >
                    {t('pricing.upgrade')}
                  </Link>
                </div>
              </div>
            </div>

            {/* Tools Section */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-text text-center">{t('tools.moreTools')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/tools/paper-qa" className="bg-bg-card border border-border rounded-2xl p-5 text-center hover:border-primary/40 transition-all group relative overflow-hidden">
                  <div className="text-3xl mb-2">💬</div>
                  <div className="font-semibold text-text group-hover:text-primary transition-colors">{t('tools.paperQa')}
                    <span className="ml-2 px-1.5 py-0.5 bg-primary/20 text-primary text-xs rounded">{t('tools.proFeature')}</span>
                  </div>
                  <div className="text-sm text-text-secondary mt-1">{t('tools.paperQaDesc')}</div>
                </Link>
                <Link href="/tools/paper-compare" className="bg-bg-card border border-border rounded-2xl p-5 text-center hover:border-primary/40 transition-all group relative overflow-hidden">
                  <div className="text-3xl mb-2">🔬</div>
                  <div className="font-semibold text-text group-hover:text-primary transition-colors">{t('tools.paperCompare')}
                    <span className="ml-2 px-1.5 py-0.5 bg-primary/20 text-primary text-xs rounded">{t('tools.proFeature')}</span>
                  </div>
                  <div className="text-sm text-text-secondary mt-1">{t('tools.paperCompareDesc')}</div>
                </Link>
                <Link href="/tools/citation-export" className="bg-bg-card border border-border rounded-2xl p-5 text-center hover:border-primary/40 transition-all group relative overflow-hidden">
                  <div className="text-3xl mb-2">📚</div>
                  <div className="font-semibold text-text group-hover:text-primary transition-colors">{t('tools.citationGenerator')}
                    <span className="ml-2 px-1.5 py-0.5 bg-green-500/20 text-green-500 text-xs rounded">{t('tools.freeTool')}</span>
                  </div>
                  <div className="text-sm text-text-secondary mt-1">{t('tools.citationGeneratorDesc')}</div>
                </Link>
                <Link href="/tools/literature-outline" className="bg-bg-card border border-border rounded-2xl p-5 text-center hover:border-primary/40 transition-all group relative overflow-hidden">
                  <div className="text-3xl mb-2">📝</div>
                  <div className="font-semibold text-text group-hover:text-primary transition-colors">{t('tools.literatureOutline')}
                    <span className="ml-2 px-1.5 py-0.5 bg-primary/20 text-primary text-xs rounded">{t('tools.proFeature')}</span>
                  </div>
                  <div className="text-sm text-text-secondary mt-1">{t('tools.literatureOutlineDesc')}</div>
                </Link>
              </div>
            </div>

            <Link href="/tools/prompt-lab" className="block bg-gradient-to-r from-accent/20 via-primary/10 to-secondary/10 border border-accent/30 rounded-2xl p-6 text-center hover:border-accent/60 transition-all group">
              <div className="text-3xl mb-2">🧪</div>
              <div className="text-lg font-semibold text-text group-hover:text-accent transition-colors">{t('tools.promptLab')}</div>
              <div className="text-sm text-text-secondary mt-1">{t('tools.promptLabDesc')}</div>
            </Link>

            <Link href="/games" className="block bg-gradient-to-r from-primary/20 via-secondary/10 to-accent/10 border border-primary/30 rounded-2xl p-6 text-center hover:border-primary/60 transition-all group">
              <div className="text-3xl mb-2">🎮</div>
              <div className="text-lg font-semibold text-text group-hover:text-primary transition-colors">{t('tools.games')}</div>
              <div className="text-sm text-text-secondary mt-1">{t('tools.gamesDesc')}</div>
            </Link>
          </>
        ) : (
          <>
            <div className="flex items-center gap-4">
              <button
                onClick={handleClear}
                className="flex items-center gap-2 px-4 py-2 bg-bg-card border border-border hover:bg-bg-hover text-text rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                {t('common.back')}
              </button>
            </div>

            <SummaryCard summary={summary} />

            <AdPlaceholder />
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}

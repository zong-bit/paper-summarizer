'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import AdPlaceholder from '../components/AdPlaceholder'
import Footer from '../components/Footer'
import VisitorCounter from '../components/VisitorCounter'
import SummaryCard from '../components/SummaryCard'
import ShareInsight from '../components/ShareInsight'
import { useTranslation } from '@/i18n/provider'

type SummaryData = {
  oneSentence: string
  keyFindings: string[]
  methodology: string
  conclusion: string
}

export default function Home() {
  const { t, locale } = useTranslation()
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

  // Show result or main content
  if (summary) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 max-w-4xl mx-auto px-4 py-8 space-y-6">
          <div className="flex items-center gap-4">
            <button
              onClick={handleClear}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {t('common.back')}
            </button>
          </div>
          <SummaryCard summary={summary} title="Research Paper Summary" />
          <ShareInsight
            paperTitle={summary.oneSentence || 'Research Paper'}
            summaryPreview={summary.oneSentence}
            className="mt-4"
          />
          <AdPlaceholder />
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* ===== Hero Section ===== */}
        <section className="relative overflow-hidden">
          {/* Subtle gradient background */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950" />
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-600/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-indigo-600/8 rounded-full blur-[100px]" />
          </div>

          <div className="relative max-w-3xl mx-auto px-4 pt-16 pb-12 md:pt-24 md:pb-16 text-center space-y-6">
            {/* Logo / Brand */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-800/60 border border-slate-700/60 rounded-full text-sm text-slate-400">
              <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-indigo-500 rounded flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span>Paper Summarizer</span>
            </div>

            {/* Main heading */}
            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight tracking-tight">
              'Summarize Any\nResearch Paper\nin Seconds'
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              {t('hero.subtitle')}
            </p>

            {/* Upload / Input area */}
            <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/60 rounded-2xl p-4 md:p-6 space-y-4 max-w-2xl mx-auto text-left">
              {/* Upload buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors font-medium text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl transition-colors font-medium text-sm border border-slate-600"
                >
                  {t('hero.tryExample')}
                </button>
                <button
                  onClick={handleClear}
                  className="px-5 py-2.5 bg-transparent hover:bg-slate-700 text-slate-500 hover:text-slate-300 rounded-xl transition-colors font-medium text-sm border border-slate-700"
                >
                  {t('hero.clear')}
                </button>
              </div>

              {/* Textarea */}
              <div className="relative">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={t('hero.placeholder')}
                  className="w-full h-48 bg-slate-900/60 border border-slate-700/60 rounded-xl p-4 text-slate-200 placeholder-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 text-sm leading-relaxed"
                  disabled={isLoading}
                />
                <div className="absolute bottom-3 right-3 text-xs text-slate-500">
                  {inputText.length.toLocaleString()} {t('hero.charCount')}
                </div>
              </div>

              {/* Error / Rate limit */}
              {rateLimitTimer !== null ? (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-center text-sm text-amber-400">
                  <span className="font-medium">{t('hero.usageLimit')}</span>
                  {' '}
                  <span
                    dangerouslySetInnerHTML={{
                      __html: t('hero.tryAgainIn').replace(
                        '{time}',
                        `<span class="font-mono font-bold">${formatTimer(rateLimitTimer)}</span>`
                      ),
                    }}
                  />
                </div>
              ) : error ? (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-center text-sm text-red-400">
                  {error}
                </div>
              ) : null}

              {/* Submit button */}
              <button
                onClick={handleSubmit}
                disabled={isLoading || !inputText.trim()}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-xl font-semibold text-base transition-colors flex items-center justify-center gap-2"
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
                  <>
                    {t('hero.runExample')}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                ) : (
                  <>
                    {t('hero.cta')}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </div>

            {/* Trust line under hero */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {t('trust.privacyDesc')}
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {t('trust.formatsDesc')}
              </span>
            </div>
          </div>
        </section>

        {/* ===== Features Section ===== */}
        <section className="bg-slate-950 py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center space-y-2 mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-white">{t('features.title')}</h2>
              <p className="text-slate-400">{t('features.subtitle')}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card 1 - PDF Summary */}
              <Link href="/" className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 text-center hover:border-blue-500/30 transition-all group block cursor-pointer">
                <div className="w-12 h-12 mx-auto mb-4 bg-blue-500/10 rounded-xl flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-white mb-2">{t('features.pdfSummary')}</h3>
                <p className="text-sm text-slate-400">{t('features.pdfSummaryDesc')}</p>
                <span className="inline-block mt-3 text-sm text-blue-400 group-hover:text-blue-300 font-medium">{t('features.tryNow')}</span>
              </Link>
              {/* Card 2 - Paper Q&A */}
              <Link href="/tools/paper-qa" className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 text-center hover:border-indigo-500/30 transition-all group block cursor-pointer">
                <div className="w-12 h-12 mx-auto mb-4 bg-indigo-500/10 rounded-xl flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                  <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-white mb-2">{t('features.paperQa')}</h3>
                <p className="text-sm text-slate-400">{t('features.paperQaDesc')}</p>
                <span className="inline-block mt-3 text-sm text-indigo-400 group-hover:text-indigo-300 font-medium">{t('features.tryNow')}</span>
              </Link>
              {/* Card 3 - Paper Comparison */}
              <Link href="/tools/paper-compare" className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 text-center hover:border-violet-500/30 transition-all group block cursor-pointer">
                <div className="w-12 h-12 mx-auto mb-4 bg-violet-500/10 rounded-xl flex items-center justify-center group-hover:bg-violet-500/20 transition-colors">
                  <svg className="w-6 h-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-white mb-2">{t('features.paperCompare')}</h3>
                <p className="text-sm text-slate-400">{t('features.paperCompareDesc')}</p>
                <span className="inline-block mt-3 text-sm text-violet-400 group-hover:text-violet-300 font-medium">{t('features.tryNow')}</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ===== Trust Section ===== */}
        <section className="bg-slate-900/50 py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center space-y-2 mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-white">{t('trust.title')}</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Trust 1 */}
              <div className="text-center p-4">
                <div className="w-10 h-10 mx-auto mb-3 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-white text-sm mb-1">{t('trust.privacy')}</h3>
                <p className="text-xs text-slate-400">{t('trust.privacyDesc')}</p>
              </div>
              {/* Trust 2 */}
              <div className="text-center p-4">
                <div className="w-10 h-10 mx-auto mb-3 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-white text-sm mb-1">{t('trust.formats')}</h3>
                <p className="text-xs text-slate-400">{t('trust.formatsDesc')}</p>
              </div>
              {/* Trust 3 */}
              <div className="text-center p-4">
                <div className="w-10 h-10 mx-auto mb-3 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-white text-sm mb-1">{t('trust.researchers')}</h3>
                <p className="text-xs text-slate-400">{t('trust.researchersDesc')}</p>
              </div>
              {/* Trust 4 */}
              <div className="text-center p-4">
                <div className="w-10 h-10 mx-auto mb-3 bg-amber-500/10 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-white text-sm mb-1">{t('trust.poweredBy')}</h3>
                <p className="text-xs text-slate-400">{t('trust.poweredByDesc')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== Pricing Section (kept) ===== */}
        <section className="bg-slate-950 py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white">{t('pricing.title')}</h2>
              <p className="text-slate-400">{t('pricing.subtitle')}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Free Card */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold text-white">{t('pricing.free')}</h3>
                  <div className="text-3xl font-bold text-white">{t('pricing.freePrice')}</div>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-sm text-slate-400">
                    <span className="text-green-500">✓</span>
                    {t('pricing.freeSummary')}
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-400">
                    <span className="text-green-500">✓</span>
                    {t('pricing.freePdf')}
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-400">
                    <span className="text-green-500">✓</span>
                    {t('pricing.freeFormats')}
                  </li>
                </ul>
                <Link
                  href="/"
                  className="block w-full text-center py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors border border-slate-700"
                >
                  {t('pricing.getStarted')}
                </Link>
              </div>
              {/* Pro Card */}
              <div className="bg-slate-900/80 border border-blue-500/40 ring-1 ring-blue-500/20 rounded-2xl p-6 space-y-4 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-blue-600 text-white text-xs px-3 py-0.5 rounded-full font-medium">{t('pricing.popular')}</span>
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold text-white">{t('pricing.pro')}</h3>
                  <div className="text-3xl font-bold text-white">
                    {t('pricing.proPrice')}
                    <span className="text-sm text-slate-400 font-normal">{t('pricing.proPriceSuffix')}</span>
                  </div>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-sm text-slate-400">
                    <span className="text-green-500">✓</span>
                    {t('pricing.proUnlimited')}
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-400">
                    <span className="text-green-500">✓</span>
                    {t('pricing.proPriority')}
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-400">
                    <span className="text-green-500">✓</span>
                    {t('pricing.proPdf')}
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-400">
                    <span className="text-green-500">✓</span>
                    {t('pricing.proFormats')}
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-400">
                    <span className="text-green-500">✓</span>
                    {t('pricing.proToken')}
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-400">
                    <span className="text-green-500">✓</span>
                    {t('pricing.proSupport')}
                  </li>
                </ul>
                <Link
                  href="/premium"
                  className="block w-full text-center py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors"
                >
                  {t('pricing.upgrade')}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ===== More Tools Section ===== */}
        <section className="bg-slate-900/50 py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8">{t('tools.moreTools')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/tools/paper-qa" className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 text-center hover:border-blue-500/30 transition-all group">
                <div className="text-3xl mb-2">💬</div>
                <div className="font-semibold text-white group-hover:text-blue-400 transition-colors">{t('tools.paperQa')}
                  <span className="ml-2 px-1.5 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded">{t('tools.proFeature')}</span>
                </div>
                <div className="text-sm text-slate-400 mt-1">{t('tools.paperQaDesc')}</div>
              </Link>
              <Link href="/tools/paper-compare" className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 text-center hover:border-indigo-500/30 transition-all group">
                <div className="text-3xl mb-2">🔬</div>
                <div className="font-semibold text-white group-hover:text-indigo-400 transition-colors">{t('tools.paperCompare')}
                  <span className="ml-2 px-1.5 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded">{t('tools.proFeature')}</span>
                </div>
                <div className="text-sm text-slate-400 mt-1">{t('tools.paperCompareDesc')}</div>
              </Link>
              <Link href="/tools/citation-export" className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 text-center hover:border-green-500/30 transition-all group">
                <div className="text-3xl mb-2">📚</div>
                <div className="font-semibold text-white group-hover:text-green-400 transition-colors">{t('tools.citationGenerator')}
                  <span className="ml-2 px-1.5 py-0.5 bg-green-500/20 text-green-400 text-xs rounded">{t('tools.freeTool')}</span>
                </div>
                <div className="text-sm text-slate-400 mt-1">{t('tools.citationGeneratorDesc')}</div>
              </Link>
              <Link href="/tools/literature-outline" className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 text-center hover:border-violet-500/30 transition-all group">
                <div className="text-3xl mb-2">📝</div>
                <div className="font-semibold text-white group-hover:text-violet-400 transition-colors">{t('tools.literatureOutline')}
                  <span className="ml-2 px-1.5 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded">{t('tools.proFeature')}</span>
                </div>
                <div className="text-sm text-slate-400 mt-1">{t('tools.literatureOutlineDesc')}</div>
              </Link>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/tools/prompt-lab" className="bg-gradient-to-r from-slate-800 to-slate-800/50 border border-slate-700 rounded-xl p-6 text-center hover:border-amber-500/30 transition-all group">
                <div className="text-3xl mb-2">🧪</div>
                <div className="text-lg font-semibold text-white group-hover:text-amber-400 transition-colors">{t('tools.promptLab')}</div>
                <div className="text-sm text-slate-400 mt-1">{t('tools.promptLabDesc')}</div>
              </Link>
              <Link href="/games" className="bg-gradient-to-r from-slate-800 to-slate-800/50 border border-slate-700 rounded-xl p-6 text-center hover:border-blue-500/30 transition-all group">
                <div className="text-3xl mb-2">🎮</div>
                <div className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">{t('tools.games')}</div>
                <div className="text-sm text-slate-400 mt-1">{t('tools.gamesDesc')}</div>
              </Link>
            </div>
          </div>
        </section>

        {/* ===== Bottom CTA ===== */}
        <section className="bg-slate-950 py-12">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <p className="text-slate-500 text-sm mb-4">{t('hero.poweredBy')}</p>
            <p className="text-slate-600 text-xs mb-6">{t('hero.charsInfo')}</p>
            <Link
              href="/premium"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 rounded-xl text-sm font-medium transition-colors border border-blue-500/20"
            >
              {t('hero.upgradeToPro')}
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import AdPlaceholder from '../components/AdPlaceholder'
import Footer from '../components/Footer'
import VisitorCounter from '../components/VisitorCounter'
import SummaryCard from '../components/SummaryCard'

type SummaryData = {
  oneSentence: string
  keyFindings: string[]
  methodology: string
  conclusion: string
}

export default function Home() {
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [summary, setSummary] = useState<SummaryData | null>(null)
  const [error, setError] = useState('')
  const [token, setToken] = useState('')
  const [tokenStatus, setTokenStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // --- Daily limit (localStorage) ---
  const DAILY_LIMIT = 3

  const getDailyUsage = (): number => {
    if (typeof window === 'undefined') return 0
    const today = new Date().toISOString().split('T')[0]
    const stored = localStorage.getItem(`paper-summarizer-usage-${today}`)
    return stored ? parseInt(stored, 10) : 0
  }

  const incrementDailyUsage = () => {
    const today = new Date().toISOString().split('T')[0]
    const current = getDailyUsage()
    localStorage.setItem(`paper-summarizer-usage-${today}`, String(current + 1))
  }

  const [dailyUsage, setDailyUsage] = useState(0)
  const [dailyLimitReached, setDailyLimitReached] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const usage = getDailyUsage()
      setDailyUsage(usage)
      setDailyLimitReached(usage >= DAILY_LIMIT)
    }
  }, [])

  const remaining = DAILY_LIMIT - dailyUsage

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
      setError('Please paste text or upload a PDF')
      return
    }

    // Check daily limit (only when not using premium token)
    if (!token.trim() && dailyUsage >= DAILY_LIMIT) {
      setError(`Daily free limit reached (${DAILY_LIMIT}/${DAILY_LIMIT}). Upgrade to Pro for unlimited summaries!`)
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
          ...(token.trim() ? { 'Authorization': `Bearer ${token.trim()}` } : {}),
        },
        body: JSON.stringify({ text: inputText }),
      })

      const data = await response.json()
      if (response.ok) {
        setSummary(data)
        // Increment daily usage on successful summary (only without premium token)
        if (!token.trim()) {
          incrementDailyUsage()
          setDailyUsage(prev => prev + 1)
        }
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
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleVerifyToken = async () => {
    if (!token.trim()) return
    setTokenStatus('loading')
    try {
      const res = await fetch(`/api/verify-token?token=${encodeURIComponent(token.trim())}`)
      const data = await res.json()
      if (data.valid) {
        setTokenStatus('ok')
      } else {
        setTokenStatus('error')
      }
    } catch {
      setTokenStatus('error')
    }
  }

  const handleRemoveToken = () => {
    setToken('')
    setTokenStatus('idle')
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
          <VisitorCounter />
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 space-y-8">
        {!summary ? (
          <>
            <div className="text-center space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold text-text">
                Summarize Any Paper in Seconds
              </h1>
              <p className="text-text-secondary text-lg">
                Paste your academic paper text or upload a PDF, and our AI will generate a comprehensive summary with key findings, methodology, and conclusions.
              </p>
            </div>

            <AdPlaceholder />

            {/* Daily Limit Banner */}
            <div className="bg-bg-card border border-border rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-sm font-medium text-text">
                    {token.trim() ? (
                      <>🔓 Premium — Unlimited Summaries</>
                    ) : dailyLimitReached ? (
                      <span className="text-error">⛔ Daily limit reached — {remaining === 0 ? '0' : remaining} free uses left today</span>
                    ) : (
                      <>📊 Free Plan — {remaining} / {DAILY_LIMIT} summaries used today</>
                    )}
                  </span>
                </div>
                {!token.trim() && (
                  <Link
                    href="/premium"
                    className="px-4 py-1.5 bg-gradient-to-r from-primary to-secondary text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                  >
                    ⚡ Upgrade to Pro ¥9.9/mo
                  </Link>
                )}
              </div>
              {/* Progress bar */}
              {!token.trim() && !dailyLimitReached && (
                <div className="w-full bg-bg-hover rounded-full h-1.5">
                  <div
                    className="bg-gradient-to-r from-primary to-secondary h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${(dailyUsage / DAILY_LIMIT) * 100}%` }}
                  />
                </div>
              )}
              {dailyLimitReached && !token.trim() && (
                <p className="text-xs text-text-secondary/70">
                  You've used all {DAILY_LIMIT} free summaries today.{' '}
                  <Link href="/premium" className="text-primary hover:underline">Upgrade to Pro →</Link>
                </p>
              )}
            </div>

            <div className="bg-bg-card border border-border rounded-2xl p-6 space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-secondary hover:bg-secondary/80 text-white rounded-xl transition-colors font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Upload PDF
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
                  📝 Try Example
                </button>
                <button
                  onClick={handleClear}
                  className="px-6 py-3 bg-bg-hover hover:bg-border text-text-secondary rounded-xl transition-colors font-medium"
                >
                  Clear
                </button>
              </div>

              <div className="relative">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste your paper text here or upload a PDF..."
                  className="w-full h-64 bg-bg border border-border rounded-xl p-4 text-text placeholder-text-secondary/60 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 scrollbar-thin"
                  disabled={isLoading}
                />
                <div className="absolute bottom-3 right-3 text-xs text-text-secondary/50">
                  {inputText.length.toLocaleString()} / 15,000 chars max
                </div>
              </div>

              {error && (
                <div className="text-error text-sm">{error}</div>
              )}

              {/* Token Section */}
              <div className="border-t border-border pt-4 space-y-3">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  <span className="text-sm font-medium text-text">Premium Access Token (optional)</span>
                </div>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={token}
                    onChange={e => { setToken(e.target.value); setTokenStatus('idle') }}
                    placeholder="ps-xxxxxxxx..."
                    className="flex-1 bg-bg border border-border rounded-lg px-3 py-2 text-sm text-text placeholder-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  {tokenStatus === 'idle' ? (
                    <button
                      onClick={handleVerifyToken}
                      disabled={!token.trim()}
                      className="px-4 py-2 bg-bg-hover hover:bg-border text-text-secondary rounded-lg text-sm transition-colors disabled:opacity-40"
                    >
                      Verify
                    </button>
                  ) : tokenStatus === 'loading' ? (
                    <span className="text-sm text-text-secondary">Checking...</span>
                  ) : tokenStatus === 'ok' ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-green-600">✓ Verified</span>
                      <button onClick={handleRemoveToken} className="text-xs text-text-secondary hover:text-error transition-colors">Remove</button>
                    </div>
                  ) : (
                    <span className="text-sm text-error">✗ Invalid</span>
                  )}
                </div>
                {!token && (
                  <p className="text-xs text-text-secondary/50">
                    Got a premium token? Paste it above. <Link href="/premium" className="text-primary hover:underline">Get one →</Link>
                  </p>
                )}
              </div>

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
                    Summarizing...
                  </>
                ) : inputText === SAMPLE_TEXT ? (
                  '🚀 Run Example →'
                ) : (
                  'Generate Summary'
                )}
              </button>
            </div>

            <AdPlaceholder />

            <div className="text-center text-text-secondary/50 text-xs space-y-1">
              <p>Free: 3 summaries/day · Pro: Unlimited · 15,000 characters max per request</p>
              <p>Powered by DeepSeek AI · Free to use</p>
              <p>Need more? <a href="/premium" className="text-primary hover:text-primary-dark transition-colors">Upgrade to Pro</a> · ¥9.9/month</p>
            </div>

            <Link href="/games" className="block bg-gradient-to-r from-primary/20 via-secondary/10 to-accent/10 border border-primary/30 rounded-2xl p-6 text-center hover:border-primary/60 transition-all group">
              <div className="text-3xl mb-2">🎮</div>
              <div className="text-lg font-semibold text-text group-hover:text-primary transition-colors">Need a Break? Play Academic Games!</div>
              <div className="text-sm text-text-secondary mt-1">Paper Bingo, Citation Quiz & more — no download needed</div>
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
                Back
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

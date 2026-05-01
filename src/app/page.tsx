'use client'

import { useState, useRef } from 'react'
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
      setError('Please paste text or upload a PDF')
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
      } else {
        setError(data.error || 'Failed to generate summary')
      }
    } catch (err) {
      setError('Failed to generate summary')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    setInputText('')
    setSummary(null)
    setError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
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
                ) : (
                  'Generate Summary'
                )}
              </button>
            </div>

            <AdPlaceholder />

            <div className="text-center text-text-secondary/50 text-xs space-y-1">
              <p>Limit: 5 summaries per 10 minutes · 15,000 characters max per request</p>
              <p>Powered by DeepSeek AI · Free to use</p>
              <p>Need higher limits? <a href="mailto:selina_zxw@qq.com" className="text-primary hover:text-primary-dark transition-colors">Contact us</a></p>
            </div>
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

'use client'
import { useTranslation } from '@/i18n/provider'

import { useState } from 'react'
import Link from 'next/link'
import Footer from '../../../components/Footer'
import ShareButton from '../../../components/ShareButton'

const SAMPLE_PAPER = `Deep learning has revolutionized the field of natural language processing in recent years. This paper presents a comprehensive survey of transformer-based architectures and their applications across various NLP tasks. We analyze the evolution from the original Transformer model to modern variants including BERT, GPT, RoBERTa, and T5. Our study covers pre-training objectives, model architectures, and fine-tuning strategies. We find that larger models consistently outperform smaller ones across all benchmarks, with diminishing returns beyond 1.5 billion parameters. The study also reveals that domain-specific pre-training significantly improves performance on specialized tasks. Our analysis shows that transformer models achieve state-of-the-art results on 89% of evaluated NLP benchmarks. Key challenges include computational cost, data efficiency, and model interpretability. We propose several directions for future research including more efficient architectures and better evaluation methodologies.`

export default function PaperQAPage() {
  const { t } = useTranslation()
  const [paperText, setPaperText] = useState('')
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleSubmit = async () => {
    if (!paperText.trim() || !question.trim()) {
      setError(t('paperQa.errorBothRequired'))
      return
    }

    setIsLoading(true)
    setError(null)
    setAnswer(null)

    try {
      const res = await fetch('/api/paper-qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: paperText, question }),
      })

      const data = await res.json()

      if (res.ok) {
        setAnswer(data.answer)
      } else if (res.status === 403) {
        setError(data.error || t('paperQa.errorPro'))
      } else {
        setError(data.error || 'Failed to get answer')
      }
    } catch {
      setError(t('common.networkError'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = () => {
    if (answer) {
      navigator.clipboard.writeText(answer)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleClear = () => {
    setPaperText('')
    setQuestion('')
    setAnswer(null)
    setError(null)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border bg-bg-card/50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-text hover:text-primary transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-bold">Paper Summarizer</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 bg-primary/20 text-primary rounded-lg text-xs font-medium">{t('tools.proFeature')}</span>
            <Link href="/premium" className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-sm font-medium transition-colors border border-primary/20">
              ⭐ {t('tools.upgrade')}
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Title */}
        <div className="text-center space-y-3">
          <div className="inline-block px-4 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">
            🎯 {t('tools.proFeature')}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-text">
            Paper Q&A
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            {t('paperQa.subtitle')}
          </p>
        </div>

        <div className="bg-bg-card border border-border rounded-2xl p-6 space-y-4">
          {/* Paper Text */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">{t('paperQa.paperText')}</label>
            <textarea
              value={paperText}
              onChange={(e) => setPaperText(e.target.value)}
              placeholder={t('paperQa.paperPlaceholder')}
              className="w-full h-48 bg-bg border border-border rounded-xl p-4 text-text placeholder-text-secondary/60 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 scrollbar-thin"
              disabled={isLoading}
            />
            <div className="flex justify-between mt-2">
              <button
                onClick={() => setPaperText(SAMPLE_PAPER)}
                className="text-xs text-primary hover:underline"
              >
                {t('paperQa.useSamplePaper')}
              </button>
              <span className="text-xs text-text-secondary/50">{paperText.length.toLocaleString()} chars</span>
            </div>
          </div>

          {/* Question */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">{t('paperQa.yourQuestion')}</label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !isLoading) handleSubmit() }}
              placeholder={t('paperQa.questionPlaceholder')}
              className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-text placeholder-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
              disabled={isLoading}
            />
          </div>

          {/* Example questions */}
          <div className="flex flex-wrap gap-2">
            {[
              t('paperQa.sampleQuestions.contribution'),
              t('paperQa.sampleQuestions.methodology'),
              t('paperQa.sampleQuestions.findings'),
              t('paperQa.sampleQuestions.limitations'),
            ].map((q) => (
              <button
                key={q}
                onClick={() => setQuestion(q)}
                className="px-3 py-1.5 bg-bg border border-border hover:border-primary/40 text-text-secondary hover:text-text rounded-lg text-xs transition-colors"
              >
                {q}
              </button>
            ))}
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

          {/* Submit & Clear */}
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={isLoading || !paperText.trim() || !question.trim()}
              className="flex-1 py-3.5 bg-primary hover:bg-primary-dark disabled:bg-primary/50 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('paperQa.analyzing')}
                </>
              ) : (
                t('paperQa.askQuestion')
              )}
            </button>
            <button
              onClick={handleClear}
              className="px-6 py-3.5 bg-bg-hover hover:bg-border text-text-secondary rounded-xl transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Answer */}
        {answer && (
          <div className="bg-bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <h2 className="font-semibold text-text">{t('paperQa.answer')}</h2>
              <button
                onClick={handleCopy}
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                {copied ? t('common.copied') : t('common.copy')}
              </button>
            </div>
            <div className="px-5 py-4">
              <pre className="text-sm text-text whitespace-pre-wrap font-sans leading-relaxed">
                {answer}
              </pre>
            </div>
          </div>
        )}

        {/* Share */}
        <div className="pt-8">
          <ShareButton title="Paper Q&A - Paper Summarizer" description="AI-powered question answering for research papers" />
        </div>

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

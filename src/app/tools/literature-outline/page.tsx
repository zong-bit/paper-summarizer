'use client'

import { useState } from 'react'
import Link from 'next/link'
import Footer from '../../../components/Footer'
import ShareButton from '../../../components/ShareButton'
import LanguageSwitcher from '../../../components/LanguageSwitcher'
import { useTranslation } from '@/i18n/provider'

interface Section {
  sectionTitle: string
  subsections: Array<{
    title: string
    description: string
    keyQuestions: string[]
    suggestedPapers: number
  }>
}

interface OutlineResult {
  title: string
  overview: string
  sections: Section[]
  researchTrends: string[]
  gapsAndFutureDirections: string[]
  recommendedDatabases: string[]
  timeline: Record<string, string>
}

export default function LiteratureOutlinePage() {
  const { t } = useTranslation()
  const [topic, setTopic] = useState('')
  const [context, setContext] = useState('')
  const [language, setLanguage] = useState<'en' | 'zh'>('en')
  const [result, setResult] = useState<OutlineResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleSubmit = async () => {
    if (!topic.trim()) {
      setError('Please provide a research topic.')
      return
    }

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch('/api/literature-outline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic.trim(), context: context.trim() || undefined, language }),
      })

      const data = await res.json()

      if (res.ok) {
        setResult(data)
      } else if (res.status === 403) {
        setError(data.error || 'Pro feature. Please upgrade.')
      } else {
        setError(data.error || 'Failed to generate outline')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = () => {
    if (result) {
      const text = `# ${result.title}\n\n${result.overview}\n\n${result.sections.map(s =>
        `## ${s.sectionTitle}\n${s.subsections.map(ss =>
          `### ${ss.title}\n${ss.description}\nKey Questions: ${ss.keyQuestions.join(', ')}\nSuggested Papers: ${ss.suggestedPapers}`
        ).join('\n\n')}`
      ).join('\n\n')}\n\n## Research Trends\n${result.researchTrends.map(t => `- ${t}`).join('\n')}\n\n## Gaps & Future Directions\n${result.gapsAndFutureDirections.map(g => `- ${g}`).join('\n')}\n\n## Recommended Databases\n${result.recommendedDatabases.map(d => `- ${d}`).join('\n')}\n\n## Timeline\n${Object.entries(result.timeline).map(([k, v]) => `- ${k}: ${v}`).join('\n')}`
      navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleClear = () => {
    setTopic('')
    setContext('')
    setResult(null)
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
            <LanguageSwitcher />
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
            {t('tools.proFeature')}
          </div>
          <h1 className='text-3xl md:text-4xl font-bold text-text'>
            {t('literatureOutline.title')}
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            {t('literatureOutline.subtitle')}
          </p>
        </div>

        {/* Input Form */}
        <div className="bg-bg-card border border-border rounded-2xl p-6 space-y-4">
          {/* Language Toggle */}
          <div className="flex items-center gap-3">
            <span className='text-sm text-text-secondary'>{t('literatureOutline.outputLanguage')}</span>
            <div className="flex bg-bg border border-border rounded-xl overflow-hidden">
              <button
                onClick={() => setLanguage('en')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  language === 'en' ? 'bg-primary text-white' : 'text-text-secondary hover:text-text'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('zh')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  language === 'zh' ? 'bg-primary text-white' : 'text-text-secondary hover:text-text'
                }`}
              >
                中文
              </button>
            </div>
          </div>

          {/* Topic */}
          <div>
            <label className='block text-sm font-medium text-text mb-2'>{t('literatureOutline.researchTopic')}</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !isLoading) handleSubmit() }}
              placeholder={language === 'zh' ? t('literatureOutline.topicPlaceholderZh') : t('literatureOutline.topicPlaceholderEn')}
              className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-text placeholder-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
              disabled={isLoading}
            />
          </div>

          {/* Context */}
          <div>
            <label className='block text-sm font-medium text-text mb-2'>
              {t('literatureOutline.additionalContext')}
            </label>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder={language === 'zh' ? t('literatureOutline.contextPlaceholderZh') : t('literatureOutline.contextPlaceholderEn')}
              className="w-full h-28 bg-bg border border-border rounded-xl p-4 text-text placeholder-text-secondary/40 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 scrollbar-thin"
              disabled={isLoading}
            />
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

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={isLoading || !topic.trim()}
              className="flex-1 py-3.5 bg-primary hover:bg-primary-dark disabled:bg-primary/50 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('literatureOutline.generating')}
                </>
              ) : (
                t('literatureOutline.generate')
              )}
            </button>
            <button
              onClick={handleClear}
              className="px-6 py-3.5 bg-bg-hover hover:bg-border text-text-secondary rounded-xl transition-colors"
            >
              {t('common.clear')}
            </button>
          </div>
        </div>

        {/* Result */}
        {result && (
          <div className="space-y-4">
            {/* Title & Overview */}
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/30 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-text mb-3">{result.title}</h2>
              <p className="text-text-secondary text-sm leading-relaxed">{result.overview}</p>
            </div>

            {/* Sections */}
            {result.sections.map((section, i) => (
              <div key={i} className="bg-bg-card border border-border rounded-2xl p-6 space-y-4">
                <h3 className="font-semibold text-text text-lg">{section.sectionTitle}</h3>
                <div className="space-y-4">
                  {section.subsections.map((sub, j) => (
                    <div key={j} className="bg-bg border border-border rounded-xl p-4">
                      <h4 className="font-medium text-text mb-2">{sub.title}</h4>
                      <p className="text-text-secondary text-sm mb-3">{sub.description}</p>
                      {sub.keyQuestions.length > 0 && (
                        <div>
                          <p className='text-xs text-text-secondary mb-1'>{t('literatureOutline.keyQuestions')}</p>
                          <ul className="space-y-1">
                            {sub.keyQuestions.map((q, k) => (
                              <li key={k} className="flex items-start gap-1.5 text-xs text-text-secondary">
                                <span className="text-primary mt-0.5">•</span>
                                {q}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {sub.suggestedPapers > 0 && (
                        <p className="text-xs text-text-secondary/60 mt-2">
                          {t('literatureOutline.suggestedPapers', { n: sub.suggestedPapers })}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Research Trends */}
            <div className="bg-bg-card border border-border rounded-2xl p-6">
              <h3 className="font-semibold text-text mb-3">{t('literatureOutline.researchTrends')}</h3>
              <ul className="space-y-2">
                {result.researchTrends.map((trend, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                    <span className="text-primary mt-0.5">•</span>
                    {trend}
                  </li>
                ))}
              </ul>
            </div>

            {/* Gaps & Future Directions */}
            <div className="bg-bg-card border border-border rounded-2xl p-6">
              <h3 className="font-semibold text-text mb-3">{t('literatureOutline.gapsAndFuture')}</h3>
              <ul className="space-y-2">
                {result.gapsAndFutureDirections.map((gap, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                    <span className="text-accent mt-0.5">•</span>
                    {gap}
                  </li>
                ))}
              </ul>
            </div>

            {/* Databases & Timeline */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-bg-card border border-border rounded-2xl p-5">
                <h3 className="font-semibold text-text mb-3">{t('literatureOutline.recommendedDatabases')}</h3>
                <ul className="space-y-2">
                  {result.recommendedDatabases.map((db, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                      <span className="text-success mt-0.5">•</span>
                      {db}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-bg-card border border-border rounded-2xl p-5">
                <h3 className="font-semibold text-text mb-3">{t('literatureOutline.timeline')}</h3>
                <div className="space-y-2">
                  {Object.entries(result.timeline).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-text-secondary capitalize">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}:
                      </span>
                      <span className="text-text font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Copy button */}
            <div className="text-center">
              <button
                onClick={handleCopy}
                className="px-6 py-3 bg-bg-card border border-border hover:border-primary/40 text-text rounded-xl text-sm transition-colors"
              >
                {copied ? t('literatureOutline.copied') : t('literatureOutline.copyFull')}
              </button>
            </div>
          </div>
        )}

        {/* Share */}
        <div className="pt-8">
          <ShareButton title="Literature Review Outline - Paper Summarizer" description="Generate a structured literature review outline from your papers" />
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

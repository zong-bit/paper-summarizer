'use client'

import { useState } from 'react'
import Link from 'next/link'
import Footer from '../../../components/Footer'
import LanguageSwitcher from '../../../components/LanguageSwitcher'
import { useTranslation } from '@/i18n/provider'
import { prompts, categories, getPromptById, type Prompt } from '@/data/prompts'

export default function PromptLabPage() {
  const { t } = useTranslation()
  const [selectedCategory, setSelectedCategory] = useState<string>('summary')
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null)
  const [variables, setVariables] = useState<Record<string, string>>({})
  const [result, setResult] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [remaining, setRemaining] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)

  const filteredPrompts = prompts.filter(p => p.category === selectedCategory)

  // Extract variable names from template
  const extractVariables = (template: string): string[] => {
    const matches = template.match(/\[([^\]]+)\]/g)
    if (!matches) return []
    return [...new Set(matches.map(m => m.slice(1, -1)))]
  }

  const handlePromptSelect = (prompt: Prompt) => {
    setSelectedPrompt(prompt)
    setResult(null)
    setError(null)
    setRemaining(null)
    const vars = extractVariables(prompt.template)
    const initialVars: Record<string, string> = {}
    vars.forEach(v => { initialVars[v] = '' })
    setVariables(initialVars)
  }

  const handleGenerate = async () => {
    if (!selectedPrompt) return

    // Check all variables are filled
    const vars = extractVariables(selectedPrompt.template)
    for (const v of vars) {
      if (!variables[v]?.trim()) {
        setError(`Please fill in "[${v}]"`)
        return
      }
    }

    setIsLoading(true)
    setError(null)
    setResult(null)
    setRemaining(null)

    try {
      const res = await fetch('/api/prompt-lab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          promptId: selectedPrompt.id,
          variables,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setResult(data.result)
        setRemaining(data.remaining ?? null)
      } else {
        if (res.status === 429) {
          setError(data.error || 'Daily limit reached')
          setRemaining(data.remaining ?? null)
        } else {
          setError(data.error || 'Failed to generate')
        }
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleClear = () => {
    setResult(null)
    setError(null)
    setRemaining(null)
    setSelectedPrompt(null)
    setVariables({})
  }

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
            <Link href="/premium" className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-sm font-medium transition-colors border border-primary/20">
              ⭐ Pro
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Title */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold text-text">
            {t('promptLab.title')}
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            {t('promptLab.subtitle')}
          </p>
          {remaining !== null && remaining >= 0 && (
            <div className="text-sm text-text-secondary">
              Free remaining today: <span className="font-bold text-text">{remaining}</span>/3
              {' · '}
              <Link href="/premium" className="text-primary hover:underline">Upgrade to Pro →</Link>
            </div>
          )}
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map(cat => {
            const count = prompts.filter(p => p.category === cat.key).length
            const isActive = selectedCategory === cat.key
            return (
              <button
                key={cat.key}
                onClick={() => { setSelectedCategory(cat.key); setSelectedPrompt(null); setResult(null); setError(null) }}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'bg-bg-card border border-border text-text-secondary hover:border-primary/40 hover:text-text'
                }`}
              >
                {cat.label} <span className="opacity-60">({count})</span>
              </button>
            )
          })}
        </div>

        {/* Main Content: Prompt List + Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Prompt List */}
          <div className="bg-bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="font-semibold text-text">
                {t(`promptLab.categories.${selectedCategory}`)} Prompts
              </h2>
            </div>
            <div className="max-h-[600px] overflow-y-auto scrollbar-thin">
              {filteredPrompts.map(prompt => (
                <button
                  key={prompt.id}
                  onClick={() => handlePromptSelect(prompt)}
                  className={`w-full text-left px-5 py-4 border-b border-border last:border-b-0 transition-colors ${
                    selectedPrompt?.id === prompt.id
                      ? 'bg-primary/10 border-l-4 border-l-primary'
                      : 'hover:bg-bg-hover'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                      selectedPrompt?.id === prompt.id
                        ? 'bg-primary text-white'
                        : 'bg-bg-hover text-text-secondary'
                    }`}>
                      {prompt.id}
                    </span>
                    <div className="min-w-0">
                      <div className="font-medium text-text text-sm truncate">{prompt.title}</div>
                      <div className="text-xs text-text-secondary mt-0.5 truncate">{prompt.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Prompt Detail */}
          <div className="bg-bg-card border border-border rounded-2xl overflow-hidden flex flex-col">
            {!selectedPrompt ? (
              <div className="flex-1 flex items-center justify-center p-8 text-center">
                <div className="space-y-3">
                  <div className="text-5xl">👈</div>
                  <p className="text-text-secondary">Select a prompt from the left to get started</p>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col">
                {/* Prompt Header */}
                <div className="px-5 py-4 border-b border-border">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center text-xs font-bold">
                      {selectedPrompt.id}
                    </span>
                    <h3 className="font-semibold text-text">{selectedPrompt.title}</h3>
                  </div>
                  <p className="text-sm text-text-secondary">{selectedPrompt.description}</p>
                </div>

                {/* Template Preview */}
                <div className="px-5 py-3 border-b border-border bg-bg/50">
                  <div className="text-xs font-medium text-text-secondary mb-1">Template Preview:</div>
                  <pre className="text-xs text-text-secondary/70 whitespace-pre-wrap font-mono max-h-32 overflow-y-auto scrollbar-thin">
                    {selectedPrompt.template}
                  </pre>
                </div>

                {/* Variables Form */}
                <div className="px-5 py-4 space-y-3 flex-1">
                  {Object.keys(variables).map(v => (
                    <div key={v}>
                      <label className="block text-sm font-medium text-text mb-1">
                        [{v}]
                      </label>
                      <input
                        type="text"
                        value={variables[v]}
                        onChange={e => setVariables(prev => ({ ...prev, [v]: e.target.value }))}
                        placeholder={`Enter ${v}...`}
                        className="w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-text placeholder-text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                        disabled={isLoading}
                      />
                    </div>
                  ))}
                </div>

                {/* Error */}
                {error && (
                  <div className="mx-5 mb-3 bg-error/10 border border-error/30 rounded-xl p-3 text-error text-sm">
                    {error}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="px-5 py-4 border-t border-border space-y-3">
                  <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="w-full py-3.5 bg-primary hover:bg-primary-dark disabled:bg-primary/50 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Generate with AI
                      </>
                    )}
                  </button>

                  {result && (
                    <button
                      onClick={handleClear}
                      className="w-full py-2.5 bg-bg-hover hover:bg-border text-text-secondary rounded-xl text-sm transition-colors"
                    >
                      Clear & Start Over
                    </button>
                  )}
                </div>

                {/* Result */}
                {result && (
                  <div className="border-t border-border">
                    <div className="px-5 py-3 flex items-center justify-between bg-bg/50">
                      <span className="text-sm font-medium text-text">Result</span>
                      <button
                        onClick={handleCopy}
                        className="text-xs text-primary hover:underline flex items-center gap-1"
                      >
                        {copied ? '✓ Copied!' : '📋 Copy'}
                      </button>
                    </div>
                    <pre className="px-5 pb-5 text-sm text-text whitespace-pre-wrap font-mono max-h-80 overflow-y-auto scrollbar-thin">
                      {result}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Links */}
        <div className="flex flex-wrap justify-center gap-4 pt-4 pb-8">
          <Link
            href="/"
            className="px-5 py-2.5 bg-bg-card border border-border hover:border-primary/40 text-text rounded-xl text-sm transition-colors"
          >
            {t('promptLab.backToHome')}
          </Link>
          <Link
            href="/premium"
            className="px-5 py-2.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl text-sm font-medium transition-colors border border-primary/20"
          >
            ⚡ Upgrade to Pro — Unlimited Use →
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}

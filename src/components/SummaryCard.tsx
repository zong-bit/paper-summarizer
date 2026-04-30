interface SummaryCardProps {
  summary: {
    oneSentence: string
    keyFindings: string[]
    methodology: string
    conclusion: string
  }
}

export default function SummaryCard({ summary }: SummaryCardProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    const text = `Summary: ${summary.oneSentence}\n\nKey Findings:\n${summary.keyFindings.map((f, i) => `${i + 1}. ${f}`).join('\n')}\n\nMethodology: ${summary.methodology}\n\nConclusion: ${summary.conclusion}`
    
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="bg-bg-card border border-border rounded-2xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-text">Paper Summary</h2>
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

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-text-secondary mb-2">Summary</h3>
          <p className="text-text leading-relaxed">{summary.oneSentence}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-text-secondary mb-2">Key Findings</h3>
          <ul className="space-y-2">
            {summary.keyFindings.map((finding, index) => (
              <li key={index} className="flex items-start gap-2 text-text">
                <span className="flex-shrink-0 w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </span>
                <span>{finding}</span>
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
    </div>
  )
}

import { useState } from 'react'

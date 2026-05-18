'use client'

import { useState, useCallback } from 'react'

export default function FeedbackButton() {
  const [open, setOpen] = useState(false)
  const [description, setDescription] = useState('')
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''

  const handleSubmit = useCallback(async () => {
    if (!description.trim()) return
    setSending(true)
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, email, url: currentUrl }),
      })
      setSent(true)
      setTimeout(() => {
        setOpen(false)
        setSent(false)
        setDescription('')
        setEmail('')
      }, 2000)
    } catch {
      // fallback to mailto
      const mailtoLink = `mailto:selina_zxw@qq.com?subject=Paper-Summarizer Feedback&body=${encodeURIComponent(description + '\n\nURL: ' + currentUrl)}`
      window.location.href = mailtoLink
    } finally {
      setSending(false)
    }
  }, [description, email, currentUrl])

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all text-sm font-medium flex items-center gap-2"
        aria-label="Report an issue"
      >
        🐛 Found an issue? Report it
      </button>

      {/* Modal overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 flex items-end sm:items-center justify-center"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Feedback form"
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md mx-4 mb-4 sm:mb-0 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">🐛 Report an Issue</h3>
              <button
                onClick={() => setOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {sent ? (
              <div className="text-center py-8 text-green-400 font-medium">
                ✓ Thank you! Your feedback has been submitted.
              </div>
            ) : (
              <>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the issue or give feedback..."
                  className="w-full h-32 bg-slate-800 border border-slate-700 rounded-xl p-3 text-slate-200 placeholder-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/40 text-sm leading-relaxed"
                  disabled={sending}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email (optional)"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 text-sm"
                  disabled={sending}
                />
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSubmit}
                    disabled={sending || !description.trim()}
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-xl font-medium text-sm transition-colors"
                  >
                    {sending ? 'Submitting...' : 'Submit Feedback'}
                  </button>
                  <a
                    href={`mailto:selina_zxw@qq.com?subject=Paper-Summarizer Feedback&body=${encodeURIComponent('Description:\n\nURL: ' + currentUrl)}`}
                    className="px-4 py-2.5 text-sm text-slate-400 hover:text-white transition-colors whitespace-nowrap"
                  >
                    📧 Email
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

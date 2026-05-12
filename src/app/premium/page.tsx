'use client'

import { useState } from 'react'
import Link from 'next/link'
import Footer from '../../components/Footer'

export default function PremiumPage() {
  const [token, setToken] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const [tokenInfo, setTokenInfo] = useState<any>(null)

  const verifyToken = async () => {
    if (!token.trim()) return
    setStatus('loading')
    try {
      const res = await fetch(`/api/verify-token?token=${encodeURIComponent(token.trim())}`)
      const data = await res.json()
      if (data.valid) {
        setStatus('ok')
        setTokenInfo(data)
      } else {
        setStatus('error')
        setTokenInfo(data)
      }
    } catch {
      setStatus('error')
      setTokenInfo({ error: 'Verification failed' })
    }
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
          <Link href="/#premium" className="text-sm text-primary hover:underline">Back to Home</Link>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-4 py-12 space-y-10">
        {/* Hero */}
        <div className="text-center space-y-4">
          <div className="inline-block px-4 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">
            ⚡ Upgrade to Pro
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-text">
            ¥9.9/month — Unlimited Summaries
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Free users get 3 summaries per day. Pro users get unlimited summaries with priority processing.
          </p>
        </div>

        {/* Token Checker */}
        <div className="bg-bg-card border border-border rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-semibold text-text">Check Your Token</h2>
          <p className="text-text-secondary text-sm">
            Enter the access token you received to verify your plan and remaining limits.
          </p>
          <div className="flex gap-3">
            <input
              type="text"
              value={token}
              onChange={e => { setToken(e.target.value); setStatus('idle'); setTokenInfo(null) }}
              placeholder="ps-xxxxxxxxxxxx..."
              className="flex-1 bg-bg border border-border rounded-xl px-4 py-3 text-text placeholder-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button
              onClick={verifyToken}
              disabled={status === 'loading'}
              className="px-6 py-3 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white rounded-xl font-medium transition-colors"
            >
              {status === 'loading' ? 'Checking...' : 'Verify'}
            </button>
          </div>

          {status === 'ok' && tokenInfo && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-green-600 font-medium">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Token Valid — {tokenInfo.plan} Plan
              </div>
              <div className="text-sm text-text-secondary">
                Name: {tokenInfo.name} · Max: {tokenInfo.maxRequests} requests per {(tokenInfo.windowMs / 60000).toFixed(0)} min · Remaining: {tokenInfo.remaining}
              </div>
            </div>
          )}

          {status === 'error' && tokenInfo && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-500 text-sm">
              {tokenInfo.error}
            </div>
          )}
        </div>

        {/* Pricing Hero */}
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/30 rounded-2xl p-8 space-y-6 text-center">
          <div className="text-4xl">💎</div>
          <h2 className="text-2xl font-bold text-text">Pro Plan — ¥9.9/month</h2>
          <p className="text-text-secondary">
            Unlock unlimited daily summaries and priority processing.
          </p>
          <div className="inline-block bg-bg-card border border-primary/30 rounded-2xl p-6">
            <div className="text-sm text-text-secondary mb-1">Monthly Subscription</div>
            <div className="text-4xl font-bold text-primary">¥9.9<span className="text-lg text-text-secondary font-normal">/month</span></div>
            <div className="mt-4 text-text-secondary text-sm space-y-2 text-left">
              <p>✓ Unlimited daily summaries</p>
              <p>✓ 15,000 chars per request</p>
              <p>✓ Priority processing queue</p>
              <p>✓ PDF upload support</p>
              <p>✓ Email support</p>
            </div>
          </div>
        </div>

        {/* Afdian Payment */}
        <div className="bg-bg-card border border-border rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-semibold text-text">💡 Pay with Afdian (爱发电)</h2>
          <p className="text-text-secondary text-sm">
            Support the project via 爱发电 (Chinese patronage platform). Instant verification after payment.
          </p>

          <a
            href="https://afdian.com/p/566dd4464d3111f1bd1352540025c377"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl block text-center"
          >
            🚀 Go to Afdian — Pay ¥9.9/month
          </a>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 text-sm text-text-secondary">
            <strong className="text-text">📋 How it works:</strong>
            <ol className="mt-2 space-y-1 list-decimal list-inside">
              <li>Click the button above, pay ¥9.9 on 爱发电</li>
              <li>After payment verification, enter your 爱发电 order number below to activate Pro</li>
              <li>Enjoy unlimited summaries! No email needed — direct activation</li>
            </ol>
          </div>
        </div>

        {/* Alternative: Contact for Invoice */}
        <div className="bg-bg-card border border-border rounded-2xl p-6 space-y-3">
          <h2 className="text-xl font-semibold text-text">📧 Alternative: Contact Us</h2>
          <p className="text-text-secondary text-sm">
            Need a different payment method or invoice? Reach out directly.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="mailto:selina_zxw@qq.com?subject=Pro%20Payment%20Inquiry&body=I%20want%20to%20upgrade%20to%20Pro%20(%C2%A59.9%2Fmonth).%20Please%20send%20payment%20instructions."
              className="px-5 py-2.5 bg-bg-hover hover:bg-border text-text rounded-lg text-sm transition-colors border border-border"
            >
              📧 Email Us
            </a>
          </div>
        </div>

        {/* Pricing Comparison */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-bg-card border border-border rounded-2xl p-6 space-y-3">
            <h3 className="text-xl font-semibold text-text">Free</h3>
            <div className="text-3xl font-bold text-text">¥0</div>
            <div className="text-text-secondary text-sm space-y-1">
              <p>• 3 summaries per day</p>
              <p>• 15,000 chars max per request</p>
              <p>• Paper text summary</p>
              <p>• PDF upload</p>
            </div>
            <Link href="/" className="block text-center py-3 bg-bg-hover hover:bg-border text-text rounded-xl font-medium transition-colors">
              Continue Free
            </Link>
          </div>

          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/40 rounded-2xl p-6 space-y-3 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-primary text-white text-xs font-medium rounded-full">
              Recommended
            </div>
            <h3 className="text-xl font-semibold text-text">Pro</h3>
            <div className="text-3xl font-bold text-primary">¥9.9<span className="text-sm text-text-secondary font-normal">/month</span></div>
            <div className="text-text-secondary text-sm space-y-1">
              <p>• Unlimited daily summaries</p>
              <p>• 15,000 chars max per request</p>
              <p>• Priority processing</p>
              <p>• PDF upload</p>
              <p>• Email support</p>
            </div>
            <a
              href="https://afdian.com/p/566dd4464d3111f1bd1352540025c377"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition-colors"
            >
              Upgrade on Afdian →
            </a>
          </div>
        </div>

        {/* How it works */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-text">How It Works</h2>
          <div className="space-y-3 text-text-secondary">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-medium">1</span>
              <p><strong className="text-text">Choose a payment method</strong> above and complete the payment (¥9.9/month).</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-medium">2</span>
              <p><strong className="text-text">Receive your token</strong> via email within 24 hours. No registration, no account needed.</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-medium">3</span>
              <p><strong className="text-text">Paste your token</strong> on the home page or in the API headers. Enjoy unlimited summaries!</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

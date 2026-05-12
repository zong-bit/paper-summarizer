'use client'

import { useState } from 'react'
import Link from 'next/link'
import Footer from '../../components/Footer'

// Gumroad product links — replace with actual Gumroad product URLs after publishing
const GUMROAD_MONTHLY = 'https://paper-summarizer.gumroad.com/l/pro-monthly'
const GUMROAD_YEARLY = 'https://paper-summarizer.gumroad.com/l/pro-yearly'

// Lemon Squeezy checkout URLs — replace with your actual Lemon Squeezy checkout links
// After creating products/variants in Lemon Squeezy dashboard, set these as env variables or hardcode
// Format: https://{store-name}.lemonsqueezy.com/checkout/buy/{variant-id}
const LS_CHECKOUT_MONTHLY = process.env.NEXT_PUBLIC_LS_MONTHLY_URL || 'https://paper-summarizer.lemonsqueezy.com/checkout/buy/monthly'
const LS_CHECKOUT_YEARLY = process.env.NEXT_PUBLIC_LS_YEARLY_URL || 'https://paper-summarizer.lemonsqueezy.com/checkout/buy/yearly'

export default function BuyPage() {
  const [orderId, setOrderId] = useState('')
  const [claimStatus, setClaimStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const [claimInfo, setClaimInfo] = useState<any>(null)

  const [token, setToken] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const [tokenInfo, setTokenInfo] = useState<any>(null)

  const claimToken = async () => {
    if (!orderId.trim() || orderId.trim().length < 6) return
    setClaimStatus('loading')
    setClaimInfo(null)
    try {
      const res = await fetch(`/api/claim-token?order_id=${encodeURIComponent(orderId.trim())}`)
      const data = await res.json()
      if (data.valid) {
        setClaimStatus('ok')
        setClaimInfo(data)
        setToken(data.token)
      } else {
        setClaimStatus('error')
        setClaimInfo(data)
      }
    } catch {
      setClaimStatus('error')
      setClaimInfo({ error: 'Failed to claim token. Please try again later.' })
    }
  }

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
          <Link href="/premium" className="text-sm text-primary hover:underline">Compare Plans</Link>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-4 py-12 space-y-10">
        {/* Hero */}
        <div className="text-center space-y-4">
          <div className="inline-block px-4 py-1 bg-green-500/20 text-green-500 rounded-full text-sm font-medium">
            🌍 International Payment Now Available
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-text">
            Buy Paper Summarizer Pro
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Choose a plan that fits your needs. Pay securely with credit card, PayPal, or Apple Pay via Gumroad.
            Your Pro token will be issued automatically after purchase.
          </p>
        </div>

        {/* Payment Provider Tabs */}
        <div className="flex justify-center gap-2 mb-2">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-full">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            Gumroad (Credit Card / PayPal / Apple Pay)
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 text-purple-500 text-sm font-medium rounded-full">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Lemon Squeezy (Credit Card / PayPal / Google Pay)
          </div>
        </div>

        {/* Gumroad Pricing Cards */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-text text-center">Pay with Gumroad</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Pro Monthly */}
            <div className="bg-bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-6 flex flex-col">
              <div>
                <h2 className="text-xl font-semibold text-text">Pro Monthly</h2>
                <p className="text-text-secondary text-sm mt-1">Best for trying out</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-text">
                  $9.99
                  <span className="text-lg text-text-secondary font-normal">/month</span>
                </div>
                <div className="text-sm text-text-secondary mt-1">≈ ¥72 / month</div>
              </div>
              <div className="flex-1 text-text-secondary text-sm space-y-2">
                <p>✓ 500 summaries per day</p>
                <p>✓ 15,000 chars per request</p>
                <p>✓ Priority processing queue</p>
                <p>✓ PDF upload support</p>
                <p>✓ Email support</p>
                <p>✓ Instant token delivery via email</p>
              </div>
              <a
                href={GUMROAD_MONTHLY}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center py-3.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold text-lg transition-colors"
              >
                Buy Now — $9.99/month
              </a>
            </div>

            {/* Pro Yearly */}
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/40 rounded-2xl p-6 sm:p-8 space-y-6 flex flex-col relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-primary text-white text-xs font-medium rounded-full">
                Best Value
              </div>
              <div>
                <h2 className="text-xl font-semibold text-text">Pro Yearly</h2>
                <p className="text-text-secondary text-sm mt-1">Save 33% vs monthly</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary">
                  $79.99
                  <span className="text-lg text-text-secondary font-normal">/year</span>
                </div>
                <div className="text-sm text-text-secondary mt-1">
                  $6.67/month · ≈ ¥576 / year
                </div>
              </div>
              <div className="flex-1 text-text-secondary text-sm space-y-2">
                <p>✓ Everything in Monthly</p>
                <p>✓ 500 summaries per day</p>
                <p>✓ 15,000 chars per request</p>
                <p>✓ Priority processing queue</p>
                <p>✓ PDF upload support</p>
                <p>✓ Email support</p>
                <p>✓ Best value — 33% savings</p>
              </div>
              <a
                href={GUMROAD_YEARLY}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center py-3.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold text-lg transition-colors"
              >
                Buy Now — $79.99/year
              </a>
            </div>
          </div>
        </div>

        {/* Lemon Squeezy Pricing Cards */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-text text-center">Pay with Lemon Squeezy</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Pro Monthly */}
            <div className="bg-bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-6 flex flex-col">
              <div>
                <h2 className="text-xl font-semibold text-text">Pro Monthly</h2>
                <p className="text-text-secondary text-sm mt-1">Best for trying out</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-text">
                  $9.99
                  <span className="text-lg text-text-secondary font-normal">/month</span>
                </div>
                <div className="text-sm text-text-secondary mt-1">≈ ¥72 / month</div>
              </div>
              <div className="flex-1 text-text-secondary text-sm space-y-2">
                <p>✓ 500 summaries per day</p>
                <p>✓ 15,000 chars per request</p>
                <p>✓ Priority processing queue</p>
                <p>✓ PDF upload support</p>
                <p>✓ Email support</p>
                <p>✓ Instant token delivery</p>
              </div>
              <a
                href={LS_CHECKOUT_MONTHLY}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold text-lg transition-colors"
              >
                Buy Now — $9.99/month
              </a>
            </div>

            {/* Pro Yearly */}
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/40 rounded-2xl p-6 sm:p-8 space-y-6 flex flex-col relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-purple-600 text-white text-xs font-medium rounded-full">
                Best Value
              </div>
              <div>
                <h2 className="text-xl font-semibold text-text">Pro Yearly</h2>
                <p className="text-text-secondary text-sm mt-1">Save 33% vs monthly</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-500">
                  $79.99
                  <span className="text-lg text-text-secondary font-normal">/year</span>
                </div>
                <div className="text-sm text-text-secondary mt-1">
                  $6.67/month · ≈ ¥576 / year
                </div>
              </div>
              <div className="flex-1 text-text-secondary text-sm space-y-2">
                <p>✓ Everything in Monthly</p>
                <p>✓ 500 summaries per day</p>
                <p>✓ 15,000 chars per request</p>
                <p>✓ Priority processing queue</p>
                <p>✓ PDF upload support</p>
                <p>✓ Email support</p>
                <p>✓ Best value — 33% savings</p>
              </div>
              <a
                href={LS_CHECKOUT_YEARLY}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold text-lg transition-colors"
              >
                Buy Now — $79.99/year
              </a>
            </div>
          </div>
        </div>

        {/* How token delivery works */}
        <div className="bg-bg-card border border-border rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-semibold text-text">🔑 How You Get Your Token</h2>
          <div className="space-y-3 text-text-secondary">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-7 h-7 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center text-sm font-medium">1</span>
              <div>
                <p className="text-text font-medium">Choose a plan & pay</p>
                <p className="text-sm">Click &quot;Buy Now&quot; above. Pay securely via Gumroad (credit card, PayPal, Apple Pay) or Lemon Squeezy (credit card, PayPal, Google Pay).</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-7 h-7 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center text-sm font-medium">2</span>
              <div>
                <p className="text-text font-medium">Receive token instantly via email</p>
                <p className="text-sm">After purchase, your token is created automatically. <strong>For Gumroad</strong>: you&apos;ll also receive an email. <strong>For Lemon Squeezy</strong>: use your order ID to claim your token below. <strong>Check your spam folder if you don&apos;t see the email.</strong></p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-7 h-7 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center text-sm font-medium">3</span>
              <div>
                <p className="text-text font-medium">Use your token</p>
                <p className="text-sm">Paste your token on the <Link href="/" className="text-primary hover:underline">home page</Link> or send it in the <code className="bg-bg-hover px-1.5 py-0.5 rounded text-xs">Authorization: Bearer &lt;token&gt;</code> header for API access.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Claim Token (manual backup) */}
        <div className="bg-bg-card border border-border rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-semibold text-text">🔁 Manual Claim (Backup)</h2>
          <p className="text-text-secondary text-sm">
            Didn&apos;t receive the email? Enter your Gumroad sale ID or Lemon Squeezy order ID to look up your token.
          </p>
          <div className="flex gap-3">
            <input
              type="text"
              value={orderId}
              onChange={e => { setOrderId(e.target.value); setClaimStatus('idle'); setClaimInfo(null) }}
              placeholder="Gumroad sale ID / Lemon Squeezy order ID..."
              className="flex-1 bg-bg border border-border rounded-xl px-4 py-3 text-text placeholder-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button
              onClick={claimToken}
              disabled={claimStatus === 'loading' || orderId.trim().length < 6}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-50 text-white rounded-xl font-medium transition-colors"
            >
              {claimStatus === 'loading' ? 'Looking up...' : 'Claim Token'}
            </button>
          </div>

          {claimStatus === 'ok' && claimInfo && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-green-600 font-medium text-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                🎉 Token Found!
              </div>
              <div className="bg-bg rounded-xl p-4">
                <p className="text-xs text-text-secondary mb-1">Your Pro Token (save this):</p>
                <p className="text-lg font-mono font-bold text-primary break-all select-all">{claimInfo.token}</p>
              </div>
              <div className="text-sm text-text-secondary space-y-1">
                <p>Plan: {claimInfo.plan} · Expires: {new Date(claimInfo.expiresAt).toLocaleDateString()}</p>
                {claimInfo.variantName && <p>Product: {claimInfo.variantName}</p>}
                <p>Use this token on the home page to unlock Pro features!</p>
              </div>
            </div>
          )}

          {claimStatus === 'error' && claimInfo && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-500 text-sm">
              {claimInfo.error}
            </div>
          )}
        </div>

        {/* Token Checker */}
        <div className="bg-bg-card border border-border rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-semibold text-text">Check Your Token</h2>
          <p className="text-text-secondary text-sm">
            Already have a token? Enter it here to check your plan and remaining limits.
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
                Name: {tokenInfo.name} · Max: {tokenInfo.maxRequests} requests per window · Remaining: {tokenInfo.remaining}
              </div>
            </div>
          )}

          {status === 'error' && tokenInfo && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-500 text-sm">
              {tokenInfo.error}
            </div>
          )}
        </div>

        {/* FAQ */}
        <div className="bg-bg-card border border-border rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-semibold text-text">❓ Frequently Asked Questions</h2>
          <div className="space-y-4 text-sm text-text-secondary">
            <div>
              <h3 className="text-text font-medium">Do I need an account to purchase?</h3>
              <p className="mt-1">Not necessarily. <strong>Gumroad</strong>: Check out as a guest with PayPal or credit card. <strong>Lemon Squeezy</strong>: Check out with credit card, PayPal, or Google Pay.</p>
            </div>
            <div>
              <h3 className="text-text font-medium">How long does token delivery take?</h3>
              <p className="mt-1">It&apos;s instant. As soon as the payment is confirmed, our system creates your token. For Gumroad, you&apos;ll also receive an email. For Lemon Squeezy, use the Manual Claim form above with your order ID.</p>
            </div>
            <div>
              <h3 className="text-text font-medium">What if I don&apos;t receive the email (Gumroad)?</h3>
              <p className="mt-1">Check your spam folder first. If it&apos;s not there, look up the Gumroad sale ID from your receipt and use the Manual Claim form above to retrieve your token.</p>
            </div>
            <div>
              <h3 className="text-text font-medium">What if I lost my Lemon Squeezy order ID?</h3>
              <p className="mt-1">You can find it in your Lemon Squeezy purchase confirmation email. Alternatively, contact us at selina_zxw@qq.com with the email you used to purchase and we can look it up.</p>
            </div>
            <div>
              <h3 className="text-text font-medium">Can I get a refund?</h3>
              <p className="mt-1"><strong>Gumroad</strong>: Offers refunds within 30 days of purchase. <strong>Lemon Squeezy</strong>: Please contact us directly for refund requests. If you get a refund, your token will be deactivated.</p>
            </div>
            <div>
              <h3 className="text-text font-medium">Can I use both Gumroad and Lemon Squeezy tokens?</h3>
              <p className="mt-1">Absolutely. Your token works the same way regardless of where you purchased it. You can even use the same token for both the web app and API.</p>
            </div>
            <div>
              <h3 className="text-text font-medium">Is there a free trial?</h3>
              <p className="mt-1">Free users get 3 summaries per day to try out the service. No credit card required.</p>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="text-center text-text-secondary text-sm">
          <p>Questions? Email <a href="mailto:selina_zxw@qq.com" className="text-primary hover:underline">selina_zxw@qq.com</a></p>
          <p className="mt-1">
            <Link href="/premium" className="text-primary hover:underline">Chinese users: pay with 爱发电 instead</Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}

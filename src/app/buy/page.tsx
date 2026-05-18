'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import Footer from '../../components/Footer'

import PaddlePricingCards from '../../components/PaddlePricingCards'
import { useTranslation } from '@/i18n/provider'

// Gumroad product links — replace with actual Gumroad product URLs after publishing
const GUMROAD_MONTHLY = 'https://selinazw.gumroad.com/l/qkcjod'
const GUMROAD_YEARLY = 'https://selinazw.gumroad.com/l/kzfhr'



export default function BuyPage() {
  const { t, tArray } = useTranslation()
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
          <div className="flex items-center gap-3">
            
            <Link href="/premium" className="text-sm text-primary hover:underline">{t('buy.comparePlans')}</Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-4 py-12 space-y-10">
        {/* Hero */}
        <div className="text-center space-y-4">
          <div className="inline-block px-4 py-1 bg-green-500/20 text-green-500 rounded-full text-sm font-medium">
            {t('buy.badge')}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-text">
            {t('buy.title')}
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            {t('buy.subtitle')}
          </p>
        </div>

        {/* Payment Provider Tabs */}
        <div className="flex justify-center gap-2 mb-2">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-full">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            {t('buy.tabs.gumroad')}
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-500 text-sm font-medium rounded-full">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            Paddle
          </div>
        </div>

        {/* Gumroad Pricing Cards */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-text text-center">{t('buy.payGumroad')}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Pro Monthly */}
            <div className="bg-bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-6 flex flex-col">
              <div>
                <h2 className="text-xl font-semibold text-text">{t('buy.monthly')}</h2>
                <p className="text-text-secondary text-sm mt-1">{t('buy.monthlyDesc')}</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-text">
                  {t('buy.monthlyPrice')}
                  <span className="text-lg text-text-secondary font-normal">{t('buy.monthlyPriceSuffix')}</span>
                </div>
                <div className="text-sm text-text-secondary mt-1">{t('buy.monthlyApprox')}</div>
              </div>
              <div className="flex-1 text-text-secondary text-sm space-y-2">
                {(tArray('buy.features') as string[]).map((feature, i) => (
                  <p key={i}>{feature}</p>
                ))}
              </div>
              <a
                href={GUMROAD_MONTHLY}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center py-3.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold text-lg transition-colors"
              >
                {t('buy.buyMonthlyGumroad')}
              </a>
            </div>

            {/* Pro Yearly */}
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/40 rounded-2xl p-6 sm:p-8 space-y-6 flex flex-col relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-primary text-white text-xs font-medium rounded-full">
                {t('buy.bestValue')}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-text">{t('buy.yearly')}</h2>
                <p className="text-text-secondary text-sm mt-1">{t('buy.yearlyDesc')}</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary">
                  {t('buy.yearlyPrice')}
                  <span className="text-lg text-text-secondary font-normal">{t('buy.yearlyPriceSuffix')}</span>
                </div>
                <div className="text-sm text-text-secondary mt-1">
                  {t('buy.yearlyApprox')}
                </div>
              </div>
              <div className="flex-1 text-text-secondary text-sm space-y-2">
                {(tArray('buy.yearlyFeatures') as string[]).map((feature, i) => (
                  <p key={i}>{feature}</p>
                ))}
              </div>
              <a
                href={GUMROAD_YEARLY}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center py-3.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold text-lg transition-colors"
              >
                {t('buy.buyYearlyGumroad')}
              </a>
            </div>
          </div>
        </div>



        {/* Paddle Pricing Cards */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-text text-center">{t('buy.payPaddle')}</h2>
          <PaddlePricingCards />
        </div>

        {/* How token delivery works */}
        <div className="bg-bg-card border border-border rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-semibold text-text">{t('buy.howTokenDelivery')}</h2>
          <div className="space-y-3 text-text-secondary">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-7 h-7 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center text-sm font-medium">1</span>
              <div>
                <p className="text-text font-medium">{t('buy.step1')}</p>
                <p className="text-sm">{t('buy.step1Desc')}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-7 h-7 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center text-sm font-medium">2</span>
              <div>
                <p className="text-text font-medium">{t('buy.step2')}</p>
                <p className="text-sm">{t('buy.step2DescGumroad')}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-7 h-7 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center text-sm font-medium">3</span>
              <div>
                <p className="text-text font-medium">{t('buy.step3')}</p>
                <p className="text-sm">{t('buy.step3Desc')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Auto-Claim Success (shown after payment redirect) */}
        <Suspense fallback={
          <div className="bg-bg-card border border-border rounded-2xl p-6 text-center space-y-4">
            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"></div>
            <p className="text-text-secondary">Checking for pending tokens...</p>
          </div>
        }>
          <AutoClaimToken />
        </Suspense>

        {/* Manual claim (backup for auto-claim failures) */}
        <div className="bg-bg-card border border-border rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-semibold text-text">{t('buy.manualClaim')}</h2>
          <p className="text-text-secondary text-sm">
            {t('buy.manualClaimDesc')}
          </p>
          <ClaimTokenForm />
        </div>

        {/* Token Checker */}
        <div className="bg-bg-card border border-border rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-semibold text-text">{t('buy.checkToken')}</h2>
          <p className="text-text-secondary text-sm">
            {t('buy.checkTokenDesc')}
          </p>
          <div className="flex gap-3">
            <input
              type="text"
              value={token}
              onChange={e => { setToken(e.target.value); setStatus('idle'); setTokenInfo(null) }}
              placeholder={t('buy.tokenPlaceholder')}
              className="flex-1 bg-bg border border-border rounded-xl px-4 py-3 text-text placeholder-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button
              onClick={verifyToken}
              disabled={status === 'loading'}
              className="px-6 py-3 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white rounded-xl font-medium transition-colors"
            >
              {status === 'loading' ? t('buy.checking') : t('buy.verify')}
            </button>
          </div>

          {status === 'ok' && tokenInfo && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-green-600 font-medium">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {t('buy.tokenValid', { plan: tokenInfo.plan })}
              </div>
              <div className="text-sm text-text-secondary">
                {t('buy.tokenInfo', { name: tokenInfo.name, max: tokenInfo.maxRequests, remaining: tokenInfo.remaining })}
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
          <h2 className="text-xl font-semibold text-text">{t('buy.faq')}</h2>
          <div className="space-y-4 text-sm text-text-secondary">
            <div>
              <h3 className="text-text font-medium">{t('buy.faqAccount')}</h3>
              <p className="mt-1" dangerouslySetInnerHTML={{ __html: t('buy.faqAccountAns') }} />
            </div>
            <div>
              <h3 className="text-text font-medium">{t('buy.faqDelivery')}</h3>
              <p className="mt-1">{t('buy.faqDeliveryAns')}</p>
            </div>
            <div>
              <h3 className="text-text font-medium">{t('buy.faqEmail')}</h3>
              <p className="mt-1">{t('buy.faqEmailAns')}</p>
            </div>
            <div>
              <h3 className="text-text font-medium">{t('buy.faqLostOrderId')}</h3>
              <p className="mt-1">{t('buy.faqLostOrderIdAns')}</p>
            </div>
            <div>
              <h3 className="text-text font-medium">{t('buy.faqRefund')}</h3>
              <p className="mt-1" dangerouslySetInnerHTML={{ __html: t('buy.faqRefundAnsGumroad') }} />
            </div>
            <div>
              <h3 className="text-text font-medium">{t('buy.faqBoth')}</h3>
              <p className="mt-1">{t('buy.faqBothAns')}</p>
            </div>
            <div>
              <h3 className="text-text font-medium">{t('buy.faqTrial')}</h3>
              <p className="mt-1">{t('buy.faqTrialAns')}</p>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="text-center text-text-secondary text-sm">
          <p dangerouslySetInnerHTML={{ __html: t('buy.footerNote').replace('{email}', '<a href="mailto:selina_zxw@qq.com" class="text-primary hover:underline">selina_zxw@qq.com</a>') }} />
          <p className="mt-1">
            <Link href="/premium" className="text-primary hover:underline">{t('buy.chineseUsers')}</Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}

// Auto-claim component — wrapped in Suspense to satisfy Next.js requirements
function AutoClaimToken() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [autoClaimStatus, setAutoClaimStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const [autoClaimInfo, setAutoClaimInfo] = useState<any>(null)

  useEffect(() => {
    const email = searchParams.get('email')
    if (!email) return
    setAutoClaimStatus('loading')
    fetch(`/api/claim-token?email=${encodeURIComponent(email)}`)
      .then(res => res.json())
      .then(data => {
        if (data.valid) {
          setAutoClaimStatus('ok')
          setAutoClaimInfo(data)
          // Copy to clipboard
          navigator.clipboard?.writeText(data.token)
          // Auto-redirect to dashboard after 2 seconds
          setTimeout(() => {
            router.push('/dashboard')
          }, 2000)
        } else {
          setAutoClaimStatus('error')
          setAutoClaimInfo(data)
        }
      })
      .catch(() => {
        setAutoClaimStatus('error')
        setAutoClaimInfo({ error: 'Failed to claim token. Please try again later.' })
      })
  }, [searchParams, router])

  if (autoClaimStatus === 'loading') {
    return (
      <div className="bg-bg-card border border-border rounded-2xl p-6 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"></div>
        <p className="text-text-secondary">Claiming your token... Redirecting to dashboard</p>
      </div>
    )
  }

  if (autoClaimStatus === 'ok' && autoClaimInfo) {
    return (
      <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 text-green-600 font-medium text-lg">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Token claimed successfully! Redirecting to dashboard...
        </div>
        <div className="bg-bg rounded-xl p-4">
          <p className="text-xs text-text-secondary mb-1">Your token (copied to clipboard)</p>
          <p className="text-lg font-mono font-bold text-primary break-all select-all" id="auto-claim-token">{autoClaimInfo.token}</p>
        </div>
        <div className="text-sm text-text-secondary space-y-1">
          <p>Plan: {autoClaimInfo.plan} | Expires: {new Date(autoClaimInfo.expiresAt).toLocaleDateString()}</p>
          <p>Your token has been automatically saved to your account. You can also use it directly in the dashboard.</p>
        </div>
      </div>
    )
  }

  if (autoClaimStatus === 'error' && autoClaimInfo) {
    return (
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6 text-yellow-600 text-sm">
        <p className="font-medium mb-1">⚠️ Auto-claim failed</p>
        <p>{autoClaimInfo.error}</p>
        <p className="mt-2">Don't worry — your token is still ready! Check your payment confirmation email for the order ID, then paste it below to claim it manually.</p>
      </div>
    )
  }

  return null
}

// Reusable claim token form component
function ClaimTokenForm() {
  const [orderId, setOrderId] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const [info, setInfo] = useState<any>(null)

  const claimToken = async () => {
    if (!orderId.trim() || orderId.trim().length < 6) return
    setStatus('loading')
    setInfo(null)
    try {
      const res = await fetch(`/api/claim-token?order_id=${encodeURIComponent(orderId.trim())}`)
      const data = await res.json()
      if (data.valid) {
        setStatus('ok')
        setInfo(data)
        // Copy to clipboard
        navigator.clipboard?.writeText(data.token)
      } else {
        setStatus('error')
        setInfo(data)
      }
    } catch {
      setStatus('error')
      setInfo({ error: 'Failed to claim token. Please try again later.' })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <input
          type="text"
          value={orderId}
          onChange={e => { setOrderId(e.target.value); setStatus('idle'); setInfo(null) }}
          placeholder="Enter your order ID from Gumroad / Paddle"
          className="flex-1 bg-bg border border-border rounded-xl px-4 py-3 text-text placeholder-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <button
          onClick={claimToken}
          disabled={status === 'loading' || orderId.trim().length < 6}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-50 text-white rounded-xl font-medium transition-colors"
        >
          {status === 'loading' ? 'Looking up...' : 'Claim Token'}
        </button>
      </div>

      {status === 'ok' && info && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-green-600 font-medium text-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Token claimed! Copied to clipboard.
          </div>
          <div className="bg-bg rounded-xl p-4">
            <p className="text-xs text-text-secondary mb-1">Your token</p>
            <p className="text-lg font-mono font-bold text-primary break-all select-all">{info.token}</p>
          </div>
          <div className="text-sm text-text-secondary space-y-1">
            <p>Plan: {info.plan} | Expires: {new Date(info.expiresAt).toLocaleDateString()}</p>
            <p>Use this token in the dashboard to activate your Pro plan.</p>
          </div>
        </div>
      )}

      {status === 'error' && info && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-500 text-sm">
          {info.error}
        </div>
      )}
    </div>
  )
}

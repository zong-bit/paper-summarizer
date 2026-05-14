'use client'

import { useState } from 'react'
import Link from 'next/link'
import Footer from '../../components/Footer'
import LanguageSwitcher from '../../components/LanguageSwitcher'
import { useTranslation } from '@/i18n/provider'

export default function PremiumPage() {
  const { t, locale, tArray } = useTranslation()
  const [token, setToken] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const [tokenInfo, setTokenInfo] = useState<any>(null)

  const [orderId, setOrderId] = useState('')
  const [claimStatus, setClaimStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const [claimInfo, setClaimInfo] = useState<any>(null)

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
            <Link href="/" className="text-sm text-primary hover:underline">{t('nav.backToHome')}</Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-4 py-12 space-y-10">
        {/* Hero */}
        <div className="text-center space-y-4">
          <div className="inline-block px-4 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">
            {t('premium.heroBadge')}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-text">
            {t('premium.title')}
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            {t('premium.subtitle')}
          </p>
        </div>

        {/* Claim Token (for new buyers) */}
        <div className="bg-bg-card border border-border rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-semibold text-text">{t('premium.claimToken')}</h2>
          <p className="text-text-secondary text-sm">
            {t('premium.claimTokenDesc')}
          </p>
          <div className="flex gap-3">
            <input
              type="text"
              value={orderId}
              onChange={e => { setOrderId(e.target.value); setClaimStatus('idle'); setClaimInfo(null) }}
              placeholder={t('premium.orderIdPlaceholder')}
              className="flex-1 bg-bg border border-border rounded-xl px-4 py-3 text-text placeholder-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button
              onClick={claimToken}
              disabled={claimStatus === 'loading' || orderId.trim().length < 6}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 text-white rounded-xl font-medium transition-colors"
            >
              {claimStatus === 'loading' ? t('premium.claiming') : t('premium.claimTokenBtn')}
            </button>
          </div>

          {claimStatus === 'ok' && claimInfo && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-green-600 font-medium text-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {t('premium.tokenActivated')}
              </div>
              <div className="bg-bg rounded-xl p-4">
                <p className="text-xs text-text-secondary mb-1">{t('premium.yourToken')}</p>
                <p className="text-lg font-mono font-bold text-primary break-all select-all">{claimInfo.token}</p>
              </div>
              <div className="text-sm text-text-secondary space-y-1">
                <p>{t('premium.tokenExpiry', { plan: claimInfo.plan, date: new Date(claimInfo.expiresAt).toLocaleDateString() })}</p>
                <p>{t('premium.tokenUsage')}</p>
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
          <h2 className="text-xl font-semibold text-text">{t('premium.checkToken')}</h2>
          <p className="text-text-secondary text-sm">
            {t('premium.checkTokenDesc')}
          </p>
          <div className="flex gap-3">
            <input
              type="text"
              value={token}
              onChange={e => { setToken(e.target.value); setStatus('idle'); setTokenInfo(null) }}
              placeholder={t('premium.tokenPlaceholder')}
              className="flex-1 bg-bg border border-border rounded-xl px-4 py-3 text-text placeholder-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button
              onClick={verifyToken}
              disabled={status === 'loading'}
              className="px-6 py-3 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white rounded-xl font-medium transition-colors"
            >
              {status === 'loading' ? t('premium.checking') : t('premium.verify')}
            </button>
          </div>

          {status === 'ok' && tokenInfo && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-green-600 font-medium">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {t('premium.tokenValid', { plan: tokenInfo.plan })}
              </div>
              <div className="text-sm text-text-secondary">
                {t('premium.tokenInfo', { name: tokenInfo.name, max: tokenInfo.maxRequests, window: (tokenInfo.windowMs / 60000).toFixed(0), remaining: tokenInfo.remaining })}
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
          <h2 className="text-2xl font-bold text-text">{t('premium.proPlan')}</h2>
          <p className="text-text-secondary">
            {t('premium.proPlanDesc')}
          </p>
          <div className="inline-block bg-bg-card border border-primary/30 rounded-2xl p-6">
            <div className="text-sm text-text-secondary mb-1">{t('premium.monthlySubscription')}</div>
            <div className="text-4xl font-bold text-primary">{t('premium.proPrice')}<span className="text-lg text-text-secondary font-normal">{t('premium.proPriceSuffix')}</span></div>
            <div className="mt-4 text-text-secondary text-sm space-y-2 text-left">
              <p>{t('premium.features.unlimited')}</p>
              <p>{t('premium.features.chars')}</p>
              <p>{t('premium.features.priority')}</p>
              <p>{t('premium.features.pdf')}</p>
              <p>{t('premium.features.email')}</p>
            </div>
          </div>
        </div>

        {/* Payment Options */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Afdian Payment */}
          <div className="bg-bg-card border border-border rounded-2xl p-6 space-y-4">
            <h2 className="text-xl font-semibold text-text">{t('premium.payment.afdian')}</h2>
            <p className="text-text-secondary text-sm">
              {t('premium.payment.afdianDesc')}
            </p>

            <a
              href="https://ifdian.net/item/8631b7544da611f1b57c52540025c377"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-6 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl block text-center"
            >
              {t('premium.payment.goAfdian')}
            </a>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 text-sm text-text-secondary">
              <strong className="text-text">{t('premium.payment.howAfdian')}</strong>
              <ol className="mt-2 space-y-1 list-decimal list-inside">
                <li>{t('premium.payment.afdianStep1')}</li>
                <li>{t('premium.payment.afdianStep2')}</li>
                <li>{t('premium.payment.afdianStep3')}</li>
              </ol>
            </div>
          </div>

          {/* Gumroad Payment */}
          <div className="bg-bg-card border border-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl p-6 space-y-4">
            <h2 className="text-xl font-semibold text-text">{t('premium.payment.gumroad')}</h2>
            <p className="text-text-secondary text-sm">
              {t('premium.payment.gumroadDesc')}
            </p>

            <Link
              href="/buy"
              className="flex items-center justify-center gap-3 px-6 py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl block text-center"
            >
              {t('premium.payment.goGumroad')}
            </Link>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 text-sm text-text-secondary">
              <strong className="text-text">{t('premium.payment.gumroadPlans')}</strong>
              <ul className="mt-2 space-y-1 list-disc list-inside">
                <li>{t('premium.payment.gumroadMonthly')}</li>
                <li>{t('premium.payment.gumroadYearly')}</li>
              </ul>
            </div>
          </div>

          {/* Lemon Squeezy Payment */}
          <div className="bg-bg-card border border-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-6 space-y-4">
            <h2 className="text-xl font-semibold text-text">{t('premium.payment.lemonSqueezy')}</h2>
            <p className="text-text-secondary text-sm">
              {t('premium.payment.lemonSqueezyDesc')}
            </p>

            <Link
              href="/buy"
              className="flex items-center justify-center gap-3 px-6 py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl block text-center"
            >
              {t('premium.payment.goLemonSqueezy')}
            </Link>

            <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 text-sm text-text-secondary">
              <strong className="text-text">{t('premium.payment.lsPlans')}</strong>
              <ul className="mt-2 space-y-1 list-disc list-inside">
                <li>{t('premium.payment.lsMonthly')}</li>
                <li>{t('premium.payment.lsYearly')}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Alternative: Contact for Invoice */}
        <div className="bg-bg-card border border-border rounded-2xl p-6 space-y-3">
          <h2 className="text-xl font-semibold text-text">{t('premium.alternative')}</h2>
          <p className="text-text-secondary text-sm">
            {t('premium.alternativeDesc')}
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="mailto:selina_zxw@qq.com?subject=Pro%20Payment%20Inquiry&body=I%20want%20to%20upgrade%20to%20Pro%20(%C2%A59.9%2Fmonth).%20Please%20send%20payment%20instructions."
              className="px-5 py-2.5 bg-bg-hover hover:bg-border text-text rounded-lg text-sm transition-colors border border-border"
            >
              {t('premium.emailUs')}
            </a>
          </div>
        </div>

        {/* Pricing Comparison */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-bg-card border border-border rounded-2xl p-6 space-y-3">
            <h3 className="text-xl font-semibold text-text">{t('premium.freePlan')}</h3>
            <div className="text-3xl font-bold text-text">{t('pricing.freePrice')}</div>
            <div className="text-text-secondary text-sm space-y-1">
              {(tArray('premium.freeFeatures') as string[]).map((feature, i) => (
                <p key={i}>{feature}</p>
              ))}
            </div>
            <Link href="/" className="block text-center py-3 bg-bg-hover hover:bg-border text-text rounded-xl font-medium transition-colors">
              {t('premium.continueFree')}
            </Link>
          </div>

          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/40 rounded-2xl p-6 space-y-3 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-primary text-white text-xs font-medium rounded-full">
              {t('pricing.popular')}
            </div>
            <h3 className="text-xl font-semibold text-text">{t('pricing.pro')}</h3>
            <div className="text-3xl font-bold text-primary">{t('pricing.proPrice')}<span className="text-sm text-text-secondary font-normal">{t('pricing.proPriceSuffix')}</span></div>
            <div className="text-text-secondary text-sm space-y-1">
              {(tArray('premium.proFeatures') as string[]).map((feature, i) => (
                <p key={i}>{feature}</p>
              ))}
            </div>
                <div className="space-y-3">
              <a
                href="https://ifdian.net/item/8631b7544da611f1b57c52540025c377"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition-colors"
              >
                {t('premium.buyAfdian')}
              </a>
              <Link
                href="/buy"
                className="block text-center py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors"
              >
                {t('premium.buyGumroad')}
              </Link>
              <Link
                href="/buy#lemon-squeezy"
                className="block text-center py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors"
              >
                {t('premium.buyLemonSqueezy')}
              </Link>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-text">{t('premium.howItWorks')}</h2>
          <div className="space-y-3 text-text-secondary">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-medium">1</span>
              <p dangerouslySetInnerHTML={{ __html: t('premium.step1') }} />
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-medium">2</span>
              <p dangerouslySetInnerHTML={{ __html: t('premium.step2') }} />
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-medium">3</span>
              <p dangerouslySetInnerHTML={{ __html: t('premium.step3') }} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import Footer from '../../components/Footer'
import LanguageSwitcher from '../../components/LanguageSwitcher'
import { useTranslation } from '@/i18n/provider'

// Gumroad product links — replace with actual Gumroad product URLs after publishing
const GUMROAD_MONTHLY = 'https://selinazw.gumroad.com/l/qkcjod'
const GUMROAD_YEARLY = 'https://selinazw.gumroad.com/l/kzfhr'

// Lemon Squeezy checkout URLs
const LS_CHECKOUT_MONTHLY = process.env.NEXT_PUBLIC_LS_MONTHLY_URL || 'https://paper-summarizer.lemonsqueezy.com/checkout/buy/monthly'
const LS_CHECKOUT_YEARLY = process.env.NEXT_PUBLIC_LS_YEARLY_URL || 'https://paper-summarizer.lemonsqueezy.com/checkout/buy/yearly'

// Paddle checkout URLs
const PADDLE_URL_MONTHLY = 'https://checkout.paddle.com/start/pri_01krk617mdepfbhe493b2adfqn'
const PADDLE_URL_YEARLY = 'https://checkout.paddle.com/start/pri_01krk61am9rvh6p2a61armcgyv'

export default function BuyPage() {
  const { t, tArray } = useTranslation()
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
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 text-purple-500 text-sm font-medium rounded-full">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            {t('buy.tabs.lemonSqueezy')}
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

        {/* Lemon Squeezy Pricing Cards */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-text text-center">{t('buy.payLemonSqueezy')}</h2>
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
                href={LS_CHECKOUT_MONTHLY}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold text-lg transition-colors"
              >
                {t('buy.buyMonthlyLS')}
              </a>
            </div>

            {/* Pro Yearly */}
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/40 rounded-2xl p-6 sm:p-8 space-y-6 flex flex-col relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-purple-600 text-white text-xs font-medium rounded-full">
                {t('buy.bestValue')}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-text">{t('buy.yearly')}</h2>
                <p className="text-text-secondary text-sm mt-1">{t('buy.yearlyDesc')}</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-500">
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
                href={LS_CHECKOUT_YEARLY}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold text-lg transition-colors"
              >
                {t('buy.buyYearlyLS')}
              </a>
            </div>
          </div>
        </div>

        {/* Paddle Pricing Cards */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-text text-center">{t('buy.payPaddle')}</h2>
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
                href={PADDLE_URL_MONTHLY}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-lg transition-colors"
              >
                {t('buy.buyMonthlyPaddle')}
              </a>
            </div>

            {/* Pro Yearly */}
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/40 rounded-2xl p-6 sm:p-8 space-y-6 flex flex-col relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-blue-600 text-white text-xs font-medium rounded-full">
                {t('buy.bestValue')}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-text">{t('buy.yearly')}</h2>
                <p className="text-text-secondary text-sm mt-1">{t('buy.yearlyDesc')}</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-500">
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
                href={PADDLE_URL_YEARLY}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-lg transition-colors"
              >
                {t('buy.buyYearlyPaddle')}
              </a>
            </div>
          </div>
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
                <p className="text-sm" dangerouslySetInnerHTML={{ __html: t('buy.step2DescGumroad') }} />
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-7 h-7 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center text-sm font-medium">3</span>
              <div>
                <p className="text-text font-medium">{t('buy.step3')}</p>
                <p className="text-sm" dangerouslySetInnerHTML={{ __html: t('buy.step3Desc').replace('<a>', '<a href="/" class="text-primary hover:underline">').replace('</a>', '</a>') }} />
              </div>
            </div>
          </div>
        </div>

        {/* Claim Token (manual backup) */}
        <div className="bg-bg-card border border-border rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-semibold text-text">{t('buy.manualClaim')}</h2>
          <p className="text-text-secondary text-sm">
            {t('buy.manualClaimDesc')}
          </p>
          <div className="flex gap-3">
            <input
              type="text"
              value={orderId}
              onChange={e => { setOrderId(e.target.value); setClaimStatus('idle'); setClaimInfo(null) }}
              placeholder={t('buy.orderIdPlaceholder')}
              className="flex-1 bg-bg border border-border rounded-xl px-4 py-3 text-text placeholder-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button
              onClick={claimToken}
              disabled={claimStatus === 'loading' || orderId.trim().length < 6}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-50 text-white rounded-xl font-medium transition-colors"
            >
              {claimStatus === 'loading' ? t('buy.lookingUp') : t('buy.lookup')}
            </button>
          </div>

          {claimStatus === 'ok' && claimInfo && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-green-600 font-medium text-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {t('buy.tokenFound')}
              </div>
              <div className="bg-bg rounded-xl p-4">
                <p className="text-xs text-text-secondary mb-1">{t('buy.tokenSaved')}</p>
                <p className="text-lg font-mono font-bold text-primary break-all select-all">{claimInfo.token}</p>
              </div>
              <div className="text-sm text-text-secondary space-y-1">
                <p>{t('buy.tokenDetails', { plan: claimInfo.plan, date: new Date(claimInfo.expiresAt).toLocaleDateString() })}</p>
                {claimInfo.variantName && <p>{t('buy.tokenProduct', { name: claimInfo.variantName })}</p>}
                <p>{t('buy.tokenUsage')}</p>
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

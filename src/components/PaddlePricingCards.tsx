'use client'

import { useState } from 'react'
import { useTranslation } from '@/i18n/provider'

export default function PaddlePricingCards() {
  const { t, tArray } = useTranslation()
  const [loading, setLoading] = useState<'monthly' | 'yearly' | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handlePaddleClick = async (plan: 'monthly' | 'yearly') => {
    setLoading(plan)
    setError(null)

    try {
      // Create transaction server-side and redirect to checkout URL
      const res = await fetch(`/api/paddle-pay-link?plan=${plan}`)
      const data = await res.json()

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      } else {
        setError('Payment unavailable. Please use Gumroad instead.')
      }
    } catch {
      setError('Payment unavailable. Please use Gumroad instead.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
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
        <button
          onClick={() => handlePaddleClick('monthly')}
          disabled={loading === 'monthly'}
          className="block w-full text-center py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-xl font-semibold text-lg transition-colors"
        >
          {loading === 'monthly' ? 'Redirecting...' : t('buy.buyMonthlyPaddle')}
        </button>
      </div>

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
        <button
          onClick={() => handlePaddleClick('yearly')}
          disabled={loading === 'yearly'}
          className="block w-full text-center py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-xl font-semibold text-lg transition-colors"
        >
          {loading === 'yearly' ? 'Redirecting...' : t('buy.buyYearlyPaddle')}
        </button>
      </div>

      {error && (
        <div className="col-span-full bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-500 text-sm text-center">
          {error}
        </div>
      )}
    </div>
  )
}

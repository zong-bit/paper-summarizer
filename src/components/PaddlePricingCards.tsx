'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from '@/i18n/provider'

const PADDLE_PRICE_MONTHLY = 'pri_01krk617mdepfbhe493b2adfqn'
const PADDLE_PRICE_YEARLY = 'pri_01krk61am9rvh6p2a61armcgyv'

export default function PaddlePricingCards() {
  const { t, tArray } = useTranslation()
  const [monthlyUrl, setMonthlyUrl] = useState('')
  const [yearlyUrl, setYearlyUrl] = useState('')

  useEffect(() => {
    async function fetchUrls() {
      try {
        const [mRes, yRes] = await Promise.all([
          fetch(`/api/paddle-pay-link?plan=monthly`),
          fetch(`/api/paddle-pay-link?plan=yearly`),
        ])
        const mData = await mRes.json()
        const yData = await yRes.json()
        setMonthlyUrl(mData.url || `https://checkout.paddle.com/start/${PADDLE_PRICE_MONTHLY}`)
        setYearlyUrl(yData.url || `https://checkout.paddle.com/start/${PADDLE_PRICE_YEARLY}`)
      } catch {
        setMonthlyUrl(`https://checkout.paddle.com/start/${PADDLE_PRICE_MONTHLY}`)
        setYearlyUrl(`https://checkout.paddle.com/start/${PADDLE_PRICE_YEARLY}`)
      }
    }
    fetchUrls()
  }, [])

  return (
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
          href={monthlyUrl}
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
          href={yearlyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-lg transition-colors"
        >
          {t('buy.buyYearlyPaddle')}
        </a>
      </div>
    </div>
  )
}

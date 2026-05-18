'use client'

import Link from 'next/link'
import { useTranslation } from '@/i18n/provider'

export default function PricingComparison() {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Free Plan */}
        <div className="bg-bg-card border border-border rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-text">{t('pricing.free')}</h3>
            <span className="text-2xl">🆓</span>
          </div>
          <div className="text-3xl font-bold text-text">{t('pricing.freePrice')}</div>
          <div className="text-text-secondary text-sm space-y-1">
            <p>{t('pricing.freeSummary')}</p>
            <p>{t('pricing.freePdf')}</p>
            <p>{t('pricing.freeFormats')}</p>
          </div>
          <Link
            href="/"
            className="block text-center py-3 bg-bg-hover hover:bg-border text-text rounded-xl font-medium transition-colors"
          >
            {t('pricing.getStarted')}
          </Link>
        </div>

        {/* Pro Plan */}
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-2 border-blue-500/50 rounded-2xl p-6 space-y-4 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-blue-600 text-white text-xs font-medium rounded-full whitespace-nowrap">
            ⭐ {t('pricing.popular')}
          </div>
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-text">{t('pricing.pro')}</h3>
            <span className="text-2xl">💎</span>
          </div>
          <div className="text-3xl font-bold text-blue-500">
            {t('pricing.proPrice')}<span className="text-sm text-text-secondary font-normal">{t('pricing.proPriceSuffix')}</span>
          </div>
          <div className="text-text-secondary text-sm space-y-1">
            <p>{t('pricing.proUnlimited')}</p>
            <p>{t('pricing.proPriority')}</p>
            <p>{t('pricing.proPdf')}</p>
            <p>{t('pricing.proFormats')}</p>
            <p>{t('pricing.proToken')}</p>
            <p>{t('pricing.proSupport')}</p>
          </div>
          <div className="space-y-2">
            <a
              href="https://ifdian.net/item/8631b7544da611f1b57c52540025c377"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
            >
              🇨🇳 {t('premium.buyAfdian')}
            </a>
            <Link
              href="/buy"
              className="block text-center py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors"
            >
              🌍 {t('premium.buyGumroad')}
            </Link>
          </div>
        </div>
      </div>

      {/* Why Upgrade */}
      <div className="bg-gradient-to-r from-orange-50 to-blue-50 border border-orange-200/50 rounded-2xl p-5 text-center">
        <p className="text-text-secondary">
          <span className="font-semibold text-text">💡 {t('premium.howItWorks')}: </span>
          {t('premium.step1')}
          {' '}
          {t('premium.step2')}
          {' '}
          {t('premium.step3')}
        </p>
      </div>
    </div>
  )
}

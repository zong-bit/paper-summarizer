'use client'

import { useTranslation } from '@/i18n/provider'

export default function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation()

  return (
    <button
      onClick={() => setLocale(locale === 'zh' ? 'en' : 'zh')}
      className="flex items-center gap-1 px-2.5 py-1.5 bg-bg border border-border hover:border-primary/40 text-text-secondary hover:text-text rounded-lg text-xs font-medium transition-colors"
      title={locale === 'zh' ? 'Switch to English' : '切换到中文'}
    >
      {locale === 'zh' ? 'EN' : '中'}
    </button>
  )
}

'use client'

import { useTranslation } from '@/i18n/provider'

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="border-t border-slate-800 bg-slate-900/50 py-8">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 text-slate-400">
          <span>Powered by</span>
          <a
            href="https://www.deepseek.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
          >
            DeepSeek
          </a>
        </div>
        <p className="mt-4 text-slate-500 text-sm">
          {t('footer.tagline')}
        </p>
        <div className="mt-2 flex items-center justify-center gap-4 text-xs text-slate-600">
          <a href="/premium" className="hover:text-blue-400 transition-colors">⭐ {t('nav.premium')}</a>
        </div>
      </div>
    </footer>
  )
}

'use client'

import { useTranslation } from '@/i18n/provider'

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="border-t border-border bg-bg-card/50 py-8">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 text-text-secondary">
          <span>{t('footer.poweredBy')}</span>
          <a 
            href="https://www.deepseek.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:text-primary-dark transition-colors font-medium"
          >
            DeepSeek
          </a>
        </div>
        <p className="mt-4 text-text-secondary/60 text-sm">
          {t('footer.tagline')}
        </p>
        <div className="mt-2 flex items-center justify-center gap-4 text-xs text-text-secondary/40">
          <a href="/premium" className="hover:text-primary transition-colors">⭐ {t('nav.premium')}</a>
          <span>·</span>
          <a href="https://afdian.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">爱发电</a>
        </div>
      </div>
    </footer>
  )
}

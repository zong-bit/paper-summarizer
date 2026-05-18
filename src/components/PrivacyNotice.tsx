'use client'

import Link from 'next/link'
import { useTranslation } from '@/i18n/provider'

interface PrivacyNoticeProps {
  className?: string
}

export default function PrivacyNotice({ className = '' }: PrivacyNoticeProps) {
  const { t } = useTranslation()

  return (
    <div className={`flex items-center justify-center gap-2 text-xs text-text-secondary ${className}`}>
      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
      <span>
        {t('privacy.zeroRetention')}
        {' '}
        <Link href="/privacy" className="text-primary hover:underline">
          {t('privacy.learnMore')}
        </Link>
      </span>
    </div>
  )
}

'use client'

'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from '@/i18n/provider'

export default function VisitorCounter() {
  const { t } = useTranslation()
  const [count, setCount] = useState(0)

  useEffect(() => {
    const storedCount = localStorage.getItem('visitorCount')
    const currentCount = storedCount ? parseInt(storedCount, 10) : 0
    const newCount = currentCount + 1
    localStorage.setItem('visitorCount', newCount.toString())
    setCount(newCount)
  }, [])

  return (
    <div className="text-text-secondary/60 text-xs">
      {t('visitor.label')}{count.toLocaleString()}
    </div>
  )
}

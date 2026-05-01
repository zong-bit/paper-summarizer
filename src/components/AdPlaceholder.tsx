'use client'

import { useEffect } from 'react'

export default function AdPlaceholder() {
  useEffect(() => {
    try {
      // @ts-expect-error - AdSense types
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (e) {
      console.error('AdSense error:', e)
    }
  }, [])

  return (
    <div className="bg-bg-card border border-border rounded-xl p-6 text-center">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-6809828426585070"
        data-ad-slot=""
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}

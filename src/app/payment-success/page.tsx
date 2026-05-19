'use client'

import { useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function PaymentHandler() {
  const searchParams = useSearchParams()
  const txnId = searchParams.get('_ptxn')

  useEffect(() => {
    if (!txnId) return

    // Load Paddle.js with client-side token
    // Paddle.js will auto-detect _ptxn in URL and open the checkout
    const script = document.createElement('script')
    script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js'
    script.async = true
    script.onload = () => {
      try {
        const w = window as any
        w.Paddle.Initialize({ token: 'live_6e5d20a975210bb79d7cf7a3ed1' })
      } catch (e) {
        console.error('Paddle init error:', e)
      }
    }
    document.head.appendChild(script)
  }, [txnId])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center px-4">
      <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border border-slate-700">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-white mb-2">Redirecting to Payment</h1>
        <p className="text-slate-400 mb-6">Please wait while we connect you to the secure payment gateway...</p>
        <p className="text-slate-500 text-xs">
          If nothing happens, try{' '}
          <a href="https://selinazw.gumroad.com/l/qkcjod" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
            Gumroad
          </a>
        </p>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <PaymentHandler />
    </Suspense>
  )
}

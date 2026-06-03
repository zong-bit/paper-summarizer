'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sendingLink, setSendingLink] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)

  // Redirect to dashboard if already logged in
  useEffect(() => {
    const checkSession = async () => {
      try {
        const supabase = getSupabaseClient()
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          router.replace('/dashboard')
          return
        }
      } catch (err) {
        console.error('[login] Session check error:', err)
      } finally {
        setCheckingSession(false)
      }
    }
    checkSession()
  }, [router])

  if (checkingSession) {
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
      } else {
        router.push('/dashboard')
      }
    } catch (err: any) {
      if (err?.status === 0 || err?.code === 'ERR_NETWORK' || err?.message?.includes('NetworkError') || err?.message?.includes('fetch failed')) {
        setError('Cannot connect to server. Please check your network and try again.')
      } else if (err?.code === 'invalid_credentials' || err?.message?.includes('Invalid login credentials')) {
        setError(err.message || 'Invalid email or password. Please try again.')
      } else if (err?.code === 'user_not_found' || err?.message?.includes('User not found')) {
        setError('No account found with this email. Please sign up first.')
      } else if (err?.code === 'email_not_confirmed') {
        setError('Email not confirmed yet. Please check your inbox for the confirmation email.')
      } else {
        setError(`Login failed (${err?.code || 'unknown'}): ${err?.message || 'Unknown error. Please try again.'}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleMagicLink = async () => {
    setError('')
    setSendingLink(true)

    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      })

      if (error) {
        setError(error.message)
      } else {
        alert('Login link sent! Please check your email.')
      }
    } catch (err: any) {
      if (err?.status === 0 || err?.code === 'ERR_NETWORK' || err?.message?.includes('NetworkError') || err?.message?.includes('fetch failed')) {
        setError('Cannot connect to server. Please check your network and try again.')
      } else if (err?.message?.includes('rate limit') || err?.code === 'rate_limit') {
        setError('Too many requests. Please try again later.')
      } else {
        setError(`Failed to send login link (${err?.code || 'unknown'}): ${err?.message || 'Unknown error. Please try again.'}`)
      }
    } finally {
      setSendingLink(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="font-bold text-lg text-white">Paper Summarizer</span>
          </Link>
        </div>

        {/* Login card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
            <p className="text-slate-400 text-sm">Sign in to access your Pro features</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                required
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-900 text-slate-500">or</span>
            </div>
          </div>

          <button
            onClick={handleMagicLink}
            disabled={sendingLink || !email}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-colors border border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sendingLink ? 'Sending...' : 'Send Magic Link to Email'}
          </button>

          <div className="text-center text-sm text-slate-500">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-blue-400 hover:underline font-medium">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

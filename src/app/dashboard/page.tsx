'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase'
import type { SupabaseClient, AuthUser } from '@supabase/supabase-js'

interface UserProfile {
  id: string
  email: string
  name: string | null
  created_at: string
}

interface Subscription {
  id: string
  user_id: string
  plan: string
  gumroad_order_id: string | null
  status: string
  expires_at: string | null
  created_at: string
}

interface Token {
  id: string
  token: string
  user_id: string
  plan: string
  max_requests: number
  used_requests: number
  expires_at: string | null
  created_at: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [tokens, setTokens] = useState<Token[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchData = useCallback(async (supabase: SupabaseClient) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) {
        router.push('/login')
        return
      }
      setUser(session.user)

      const { data: profileData, error: profileErr } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle()
      if (profileErr && !profileData) {
        console.error('[dashboard] Failed to fetch profile:', profileErr)
      }
      setProfile(profileData)

      const { data: subData, error: subErr } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (subErr && !subData) {
        console.error('[dashboard] Failed to fetch subscription:', subErr)
      }
      setSubscription(subData)

      const { data: tokenData } = await supabase
        .from('tokens')
        .select('*')
        .eq('user_id', session.user.id)
        .is('expires_at', null)
        .or(`expires_at.gt.${new Date().toISOString()}`)
        .order('created_at', { ascending: false })
      setTokens(tokenData || [])
    } catch (err: any) {
      if (err?.message?.includes('getSession') || err?.message?.includes('session')) {
        setError('Session not found, please try logging in again')
      } else if (err?.message?.includes('users') || err?.code === 'PGRST301') {
        setError(`Failed to query users table: ${err?.message || 'Unknown error'}`)
      } else if (err?.message?.includes('subscriptions') || err?.code === 'PGRST301') {
        setError(`Failed to query subscriptions table: ${err?.message || 'Unknown error'}`)
      } else if (err?.message?.includes('tokens') || err?.code === 'PGRST301') {
        setError(`Failed to query tokens table: ${err?.message || 'Unknown error'}`)
      } else {
        setError(`Failed to load data: ${err?.message || 'Unknown error'}`)
      }
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    const supabase = getSupabaseClient()
    fetchData(supabase)

    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push('/login')
      }
    })

    return () => authSub.unsubscribe()
  }, [fetchData, router])

  const handleSignOut = async () => {
    const supabase = getSupabaseClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
        <div className="text-center space-y-4">
          <div className="text-4xl">⚠️</div>
          <p className="text-red-400">{error}</p>
          <Link href="/" className="inline-block px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-colors">
            Go Home
          </Link>
        </div>
      </div>
    )
  }

  const totalRequests = subscription?.plan === 'pro' ? Infinity : 3
  const usedRequests = tokens.length > 0 ? tokens.reduce((sum, t) => sum + t.used_requests, 0) : 0
  const remainingRequests = subscription?.plan === 'pro' ? Infinity : Math.max(0, 3 - usedRequests)
  const progressPercent = subscription?.plan === 'free'
    ? Math.min(100, (usedRequests / 3) * 100)
    : 0

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="border-b border-slate-800 bg-slate-900/50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="font-bold text-lg text-white">Paper Summarizer</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 font-bold text-sm">
                {(profile?.name || profile?.email || 'U').charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:inline">{profile?.name || profile?.email}</span>
            </div>
            <button
              onClick={handleSignOut}
              className="px-3 py-1.5 text-sm text-slate-400 hover:text-red-400 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Welcome */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">
            Welcome{profile?.name ? `, ${profile.name}` : ''}!
          </h1>
          <p className="text-slate-400">Manage your account and usage</p>
        </div>

        {/* Plan Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Your Plan</h2>
              <p className="text-slate-400 text-sm">{subscription?.plan === 'pro' ? 'Pro' : 'Free'}</p>
            </div>
            {subscription?.plan === 'free' && (
              <Link
                href="/premium"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition-colors"
              >
                Upgrade to Pro
              </Link>
            )}
          </div>

          {subscription?.plan === 'free' && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Free summaries today</span>
                <span className="text-white font-medium">
                  {usedRequests} / 3
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2.5">
                <div
                  className="bg-blue-500 h-2.5 rounded-full transition-all"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              <p className="text-xs text-slate-400">
                {remainingRequests === 0
                  ? 'Daily limit reached. Upgrade to Pro for unlimited summaries.'
                  : `${remainingRequests} free summaries remaining today`}
              </p>
            </div>
          )}

          {subscription?.plan === 'pro' && (
            <div className="flex items-center gap-2 text-green-500 text-sm">
              <span>✓</span>
              <span>Unlimited summaries</span>
            </div>
          )}
        </div>

        {/* Account Info */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-white">Account Info</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Email</span>
              <span className="text-white">{profile?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Name</span>
              <span className="text-white">{profile?.name || 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Member since</span>
              <span className="text-white">
                {profile?.created_at
                  ? new Date(profile.created_at).toLocaleDateString('zh-CN')
                  : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Active Tokens */}
        {tokens.length > 0 && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-white">Active Tokens</h2>
            <div className="space-y-3">
              {tokens.map((t) => {
                const isExpired = t.expires_at && new Date(t.expires_at) < new Date()
                const progress = t.max_requests > 0 ? (t.used_requests / t.max_requests) * 100 : 0

                return (
                  <div key={t.id} className={`border border-slate-800 rounded-xl p-4 space-y-2 ${isExpired ? 'opacity-50' : ''}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm text-white bg-slate-800 px-2 py-1 rounded">
                        {t.token.slice(0, 12)}...
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        isExpired ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-500'
                      }`}>
                        {isExpired ? 'Expired' : 'Active'}
                      </span>
                    </div>
                    {t.max_requests > 0 && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-slate-400">
                          <span>Usage</span>
                          <span>{t.used_requests} / {t.max_requests}</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5">
                          <div
                            className="bg-blue-500 h-1.5 rounded-full"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    {t.expires_at && (
                      <p className="text-xs text-slate-400">
                        Expires: {new Date(t.expires_at).toLocaleDateString('zh-CN')}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/"
            className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 text-center hover:border-blue-500/40 transition-all group"
          >
            <div className="text-3xl mb-2">📝</div>
            <div className="font-semibold text-white group-hover:text-blue-400 transition-colors">Start Summarizing</div>
            <div className="text-sm text-slate-400 mt-1">Go to the main tool</div>
          </Link>
          <Link
            href="/premium"
            className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 text-center hover:border-blue-500/40 transition-all group"
          >
            <div className="text-3xl mb-2">⭐</div>
            <div className="font-semibold text-white group-hover:text-blue-400 transition-colors">Upgrade to Pro</div>
            <div className="text-sm text-slate-400 mt-1">Get unlimited summaries</div>
          </Link>
        </div>
      </main>
    </div>
  )
}

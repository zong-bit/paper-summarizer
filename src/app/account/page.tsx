'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getSupabaseClient, checkAndExpireSubscription } from '@/lib/supabase'
import type { SupabaseClient, AuthUser } from '@supabase/supabase-js'
import Footer from '@/components/Footer'
import { useTranslation } from '@/i18n/provider'

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
  status: string
  expires_at: string | null
}

interface Token {
  id: string
  token: string
  max_requests: number
  used_requests: number
  expires_at: string | null
}

export default function AccountPage() {
  const router = useRouter()
  const { t } = useTranslation()
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

      const { data: profileData } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single()
      setProfile(profileData)

      const { data: subData } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('status', 'active')
        .eq('source', 'paper-summarizer')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      // Check if subscription has expired
      if (subData) {
        await checkAndExpireSubscription(supabase, subData)
        // Refresh subscription data after potential update
        const { data: refreshedSub } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('status', 'active')
          .eq('source', 'paper-summarizer')
          .order('created_at', { ascending: false })
          .limit(1)
          .single()
        setSubscription(refreshedSub)
      } else {
        setSubscription(subData)
      }

      const { data: tokenData } = await supabase
        .from('tokens')
        .select('*')
        .eq('user_id', session.user.id)
        .is('expires_at', null)
        .or(`expires_at.gt.${new Date().toISOString()}`)
        .order('created_at', { ascending: false })
      setTokens(tokenData || [])
    } catch (err: any) {
      setError(err?.message || 'Failed to load account data')
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
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"></div>
          <p className="text-text-secondary">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg px-4">
        <div className="text-center space-y-4">
          <div className="text-4xl">⚠️</div>
          <p className="text-error">{error}</p>
          <Link href="/" className="inline-block px-6 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors">
            {t('common.backToHome')}
          </Link>
        </div>
      </div>
    )
  }

  const totalRequests = subscription?.plan === 'pro' ? Infinity : 3
  const usedRequests = tokens.length > 0 ? tokens.reduce((sum, tok) => sum + tok.used_requests, 0) : 0
  const remainingRequests = subscription?.plan === 'pro' ? Infinity : Math.max(0, 3 - usedRequests)
  const progressPercent = subscription?.plan === 'free'
    ? Math.min(100, (usedRequests / 3) * 100)
    : 0

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 space-y-8 w-full">
        {/* Welcome */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-text">
            {t('account.welcome')}{profile?.name ? `, ${profile.name}` : ''}!
          </h1>
          <p className="text-text-secondary">{t('account.manageAccount')}</p>
        </div>

        {/* Plan Card */}
        <div className="bg-bg-card border border-border rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-text">{t('account.yourPlan')}</h2>
              <p className="text-text-secondary text-sm">
                {subscription?.plan === 'pro' ? t('account.pro') : t('account.free')}
              </p>
            </div>
            {subscription?.plan === 'free' && (
              <Link
                href="/premium"
                className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-medium transition-colors"
              >
                {t('account.upgradeToPro')}
              </Link>
            )}
          </div>

          {/* Subscription expiry info */}
          {subscription?.status === 'active' && subscription?.expires_at && (
            <div className="text-sm">
              {new Date(subscription.expires_at) <= new Date() ? (
                <p className="text-error">
                  {t('account.expiredOn', { date: new Date(subscription.expires_at).toLocaleDateString('zh-CN') })}
                </p>
              ) : (
                <p className="text-text-secondary">
                  {t('account.validUntil', { date: new Date(subscription.expires_at).toLocaleDateString('zh-CN') })}
                </p>
              )}
            </div>
          )}
          {subscription?.status === 'active' && !subscription?.expires_at && (
            <p className="text-sm text-text-secondary">{t('account.lifetime')}</p>
          )}
          {subscription?.status === 'expired' && (
            <p className="text-error text-sm">{t('account.subscriptionExpired')}</p>
          )}

          {subscription?.plan === 'free' && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">{t('account.freeSummariesToday')}</span>
                <span className="text-text font-medium">
                  {usedRequests} / 3
                </span>
              </div>
              <div className="w-full bg-border rounded-full h-2.5">
                <div
                  className="bg-primary h-2.5 rounded-full transition-all"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              <p className="text-xs text-text-secondary">
                {remainingRequests === 0
                  ? t('account.dailyLimitReached')
                  : `${remainingRequests} ${t('account.freeSummariesRemaining')}`}
              </p>
            </div>
          )}

          {subscription?.plan === 'pro' && (
            <div className="flex items-center gap-2 text-green-500 text-sm">
              <span>✓</span>
              <span>{t('account.unlimitedSummaries')}</span>
            </div>
          )}
        </div>

        {/* Account Info */}
        <div className="bg-bg-card border border-border rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-text">{t('account.accountInfo')}</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-text-secondary">{t('account.email')}</span>
              <span className="text-text">{profile?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">{t('account.name')}</span>
              <span className="text-text">{profile?.name || 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">{t('account.memberSince')}</span>
              <span className="text-text">
                {profile?.created_at
                  ? new Date(profile.created_at).toLocaleDateString('zh-CN')
                  : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Active Tokens */}
        {tokens.length > 0 && (
          <div className="bg-bg-card border border-border rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-text">{t('account.activeTokens')}</h2>
            <div className="space-y-3">
              {tokens.map((tok) => {
                const isExpired = tok.expires_at && new Date(tok.expires_at) < new Date()
                const progress = tok.max_requests > 0 ? (tok.used_requests / tok.max_requests) * 100 : 0

                return (
                  <div key={tok.id} className={`border border-border rounded-xl p-4 space-y-2 ${isExpired ? 'opacity-50' : ''}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm text-text bg-bg px-2 py-1 rounded">
                        {tok.token.slice(0, 12)}...
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        isExpired ? 'bg-error/10 text-error' : 'bg-green-500/10 text-green-500'
                      }`}>
                        {isExpired ? t('account.expired') : t('account.active')}
                      </span>
                    </div>
                    {tok.max_requests > 0 && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-text-secondary">
                          <span>{t('account.tokenUsage')}</span>
                          <span>{tok.used_requests} / {tok.max_requests}</span>
                        </div>
                        <div className="w-full bg-border rounded-full h-1.5">
                          <div
                            className="bg-primary h-1.5 rounded-full"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    {tok.expires_at && (
                      <p className="text-xs text-text-secondary">
                        {t('account.tokenExpiry', { date: new Date(tok.expires_at).toLocaleDateString('zh-CN') })}
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
            className="bg-bg-card border border-border rounded-2xl p-6 text-center hover:border-primary/40 transition-all group"
          >
            <div className="text-3xl mb-2">📝</div>
            <div className="font-semibold text-text group-hover:text-primary transition-colors">{t('account.startSummarizing')}</div>
            <div className="text-sm text-text-secondary mt-1">{t('account.goToMainTool')}</div>
          </Link>
          <Link
            href="/premium"
            className="bg-bg-card border border-border rounded-2xl p-6 text-center hover:border-primary/40 transition-all group"
          >
            <div className="text-3xl mb-2">⭐</div>
            <div className="font-semibold text-text group-hover:text-primary transition-colors">{t('account.upgradeToPro')}</div>
            <div className="text-sm text-text-secondary mt-1">{t('account.getUnlimited')}</div>
          </Link>
        </div>

        {/* Sign Out */}
        <div className="text-center">
          <button
            onClick={handleSignOut}
            className="px-6 py-2 text-error hover:bg-error/10 rounded-xl transition-colors font-medium"
          >
            {t('account.signOut')}
          </button>
        </div>
      </main>

      <Footer />
    </div>
  )
}

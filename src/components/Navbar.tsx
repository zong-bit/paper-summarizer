'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getSupabaseClient } from '@/lib/supabase'
import type { AuthUser } from '@supabase/supabase-js'
import LanguageSwitcher from './LanguageSwitcher'

interface NavbarProps {
  currentPage?: string
}

export default function Navbar({ currentPage }: NavbarProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = getSupabaseClient()

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    const supabase = getSupabaseClient()
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <header className="border-b border-border bg-bg-card/50 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-text hover:text-primary transition-colors">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span className="font-bold text-lg">Paper Summarizer</span>
        </Link>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          {loading ? (
            <div className="w-20 h-8 bg-border/50 rounded-lg animate-pulse"></div>
          ) : user ? (
            <>
              <Link
                href="/account"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
                  currentPage === 'account'
                    ? 'bg-primary/10 text-primary border-primary/20'
                    : 'bg-bg-hover hover:bg-border text-text-secondary border-border'
                }`}
              >
                <div className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-xs">
                  {(user.user_metadata?.name || user.email || 'U').charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline">{user.user_metadata?.name || user.email?.split('@')[0]}</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="px-3 py-1.5 text-sm text-text-secondary hover:text-error transition-colors"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-3 py-1.5 text-sm text-text hover:text-primary transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="px-3 py-1.5 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-medium transition-colors"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

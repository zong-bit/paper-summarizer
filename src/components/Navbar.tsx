'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getSupabaseClient } from '@/lib/supabase'
import type { AuthUser } from '@supabase/supabase-js'


interface NavbarProps {
  currentPage?: string
}

export default function Navbar({ currentPage }: NavbarProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = getSupabaseClient()

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

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
    <header className="border-b border-slate-800 bg-slate-900/50 sticky top-0 z-10 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span className="font-bold text-lg text-white">Paper Summarizer</span>
        </Link>
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="w-20 h-8 bg-slate-800/50 rounded-lg animate-pulse"></div>
          ) : user ? (
            <>
              <Link
                href="/account"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
                  currentPage === 'account'
                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border-slate-700'
                }`}
              >
                <div className="w-5 h-5 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 font-bold text-xs">
                  {(user.user_metadata?.name || user.email || 'U').charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline">{user.user_metadata?.name || user.email?.split('@')[0]}</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="px-3 py-1.5 text-sm text-slate-400 hover:text-red-400 transition-colors"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-3 py-1.5 text-sm text-slate-300 hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { generateMetadata } from './metadata'

interface LibraryItem {
  id: string
  title: string
  content: string
  domain: string
  source: string
  createdAt: string
}

const DOMAIN_COLORS: Record<string, string> = {
  CS: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Biology: 'bg-green-500/20 text-green-400 border-green-500/30',
  Medicine: 'bg-red-500/20 text-red-400 border-red-500/30',
  General: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
}

const DOMAIN_LABELS: Record<string, string> = {
  CS: 'CS',
  Biology: 'Biology',
  Medicine: 'Medicine',
  General: 'General',
}

export default function LibraryPage() {
  const [items, setItems] = useState<LibraryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchLibrary = async () => {
    try {
      const res = await fetch('/api/library')
      if (res.ok) {
        const data = await res.json()
        setItems(data)
      }
    } catch (err) {
      console.error('Failed to fetch library:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLibrary()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this item from your library?')) return
    setDeletingId(id)
    try {
      const res = await fetch('/api/library', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (res.ok) {
        setItems(prev => prev.filter(item => item.id !== id))
      }
    } catch (err) {
      console.error('Failed to delete:', err)
    } finally {
      setDeletingId(null)
    }
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Navbar currentPage="library" />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">📚 My Library</h1>
            <p className="text-sm text-slate-400 mt-1">Saved paper summaries</p>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 animate-pulse">
                <div className="h-5 bg-slate-800 rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-slate-800 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-slate-400 mb-2">No saved papers yet</h3>
            <p className="text-slate-500 text-sm mb-6">
              Go to the home page, generate a summary, and save it to your library.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition-colors"
            >
              Start Summarizing
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map(item => (
              <div
                key={item.id}
                className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-white truncate">{item.title}</h3>
                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                      <span className={`px-2 py-0.5 rounded-full border ${DOMAIN_COLORS[item.domain] || DOMAIN_COLORS.General}`}>
                        {DOMAIN_LABELS[item.domain] || item.domain}
                      </span>
                      <span>Source: {item.source}</span>
                      <span>•</span>
                      <span>{formatDate(item.createdAt)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={deletingId === item.id}
                    className="flex-shrink-0 p-2 text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
                    title="Delete"
                  >
                    {deletingId === item.id ? (
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

// Export metadata for use client component
export { generateMetadata }

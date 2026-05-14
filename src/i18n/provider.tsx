'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import zh from './zh.json'
import en from './en.json'

export type Locale = 'zh' | 'en'
type TranslationValue = string | string[] | Record<string, unknown>

const messages: Record<Locale, Record<string, TranslationValue>> = { zh, en }

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string, params?: Record<string, string | number>) => string
  tArray: (key: string) => string[]
}

const I18nContext = createContext<I18nContextType>({
  locale: 'zh',
  setLocale: () => {},
  t: (key: string) => key,
  tArray: () => [],
})

function getNestedValue(obj: Record<string, unknown>, path: string): TranslationValue | undefined {
  const keys = path.split('.')
  let current: unknown = obj
  for (const key of keys) {
    if (current && typeof current === 'object') {
      current = (current as Record<string, unknown>)[key]
    } else {
      return undefined
    }
  }
  return current as TranslationValue | undefined
}

function replaceParams(text: string, params?: Record<string, string | number>): string {
  if (!params) return text
  let result = text
  for (const [key, value] of Object.entries(params)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value))
  }
  return result
}

function getBrowserLocale(): Locale {
  if (typeof window === 'undefined') return 'zh'
  const lang = navigator.language || ''
  if (lang.startsWith('zh')) return 'zh'
  return 'en'
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('zh')

  useEffect(() => {
    // Try URL param first, then localStorage, then browser language
    const params = new URLSearchParams(window.location.search)
    const langParam = params.get('lang') as Locale | null
    if (langParam && (langParam === 'zh' || langParam === 'en')) {
      setLocaleState(langParam)
      localStorage.setItem('locale', langParam)
      return
    }

    const stored = localStorage.getItem('locale') as Locale | null
    if (stored && (stored === 'zh' || stored === 'en')) {
      setLocaleState(stored)
      return
    }

    setLocaleState(getBrowserLocale())
  }, [])

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem('locale', newLocale)
    // Update URL without reload
    const url = new URL(window.location.href)
    url.searchParams.set('lang', newLocale)
    window.history.replaceState({}, '', url.toString())
    // Update html lang
    document.documentElement.lang = newLocale === 'zh' ? 'zh-CN' : 'en'
  }, [])

  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    const msg = messages[locale]
    if (!msg) return key
    const value = getNestedValue(msg as Record<string, unknown>, key)
    if (typeof value === 'string') {
      return replaceParams(value, params)
    }
    return key
  }, [locale])

  const tArray = useCallback((key: string): string[] => {
    const msg = messages[locale]
    if (!msg) return [key]
    const value = getNestedValue(msg as Record<string, unknown>, key)
    if (Array.isArray(value)) {
      return value as string[]
    }
    return [key]
  }, [locale])

  // Update html lang
  useEffect(() => {
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en'
  }, [locale])

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, tArray }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useTranslation() {
  return useContext(I18nContext)
}

'use client'

import React, { createContext, useContext } from 'react'
import en from './en.json'

type TranslationValue = string | string[] | Record<string, unknown>

const messages: Record<string, TranslationValue> = en

interface I18nContextType {
  locale: 'en'
  setLocale: (locale: 'en') => void
  t: (key: string, params?: Record<string, string | number>) => string
  tArray: (key: string) => string[]
}

const I18nContext = createContext<I18nContextType>({
  locale: 'en',
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

function t(key: string, params?: Record<string, string | number>): string {
  const value = getNestedValue(messages as Record<string, unknown>, key)
  if (typeof value === 'string') {
    return replaceParams(value, params)
  }
  return key
}

function tArray(key: string): string[] {
  const value = getNestedValue(messages as Record<string, unknown>, key)
  if (Array.isArray(value)) {
    return value as string[]
  }
  return [key]
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  return (
    <I18nContext.Provider value={{ locale: 'en', setLocale: () => {}, t, tArray }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useTranslation() {
  return useContext(I18nContext)
}

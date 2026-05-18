// Token storage — uses Supabase tokens table (serverless-safe)
// Tokens table: id, token (unique), user_id, plan, max_requests, used_requests, expires_at

import { getSupabaseAdmin } from '@/lib/supabase'

interface TokenRow {
  id: string
  token: string
  user_id: string | null
  plan: string
  max_requests: number
  used_requests: number
  expires_at: string | null
  created_at: string
  updated_at: string
}

interface TokenEntry {
  token: string
  name: string
  plan: 'pro' | 'free'
  maxRequests: number
  windowMs: number
  createdAt: string
  expiresAt?: string
}

/**
 * Map a Supabase token row to our TokenEntry shape.
 */
function rowToEntry(row: TokenRow): TokenEntry {
  return {
    token: row.token,
    name: '', // not stored in Supabase tokens table
    plan: row.plan as 'pro' | 'free',
    maxRequests: row.max_requests,
    windowMs: 24 * 60 * 60 * 1000, // default daily window
    createdAt: row.created_at,
    expiresAt: row.expires_at || undefined,
  }
}

/**
 * Create a token in Supabase tokens table.
 * For webhook flows (no user_id), we store with user_id = null and track it externally.
 */
export async function createToken(planId: PlanId, name?: string): Promise<TokenEntry> {
  const plan = PLANS[planId]
  if (!plan) {
    throw new Error(`Unknown plan: ${planId}`)
  }
  const expiresAt = new Date(Date.now() + plan.expiryDays * 24 * 60 * 60 * 1000).toISOString()
  const token = generateToken()

  const supabase = getSupabaseAdmin()
  const result = await supabase
    .from('tokens')
    .insert({
      token,
      user_id: null, // webhook-created tokens have no user association yet
      plan: plan.plan as 'pro' | 'free',
      max_requests: plan.maxRequests,
      used_requests: 0,
      expires_at: expiresAt,
    })
    .select()
    .single()

  if (result.error) {
    console.error('[tokens] createToken error:', result.error)
    throw result.error
  }

  const data = result.data
  return {
    token: data.token,
    name: name || plan.name,
    plan: data.plan as 'pro' | 'free',
    maxRequests: data.max_requests,
    windowMs: plan.windowMs,
    createdAt: data.created_at,
    expiresAt: data.expires_at || undefined,
  }
}

/**
 * Add a token to Supabase (used by payment webhooks).
 */
export async function addToken(entry: Omit<TokenEntry, 'createdAt'>): Promise<TokenEntry> {
  const supabase = getSupabaseAdmin()
  const result = await supabase
    .from('tokens')
    .insert({
      token: entry.token,
      user_id: null,
      plan: entry.plan,
      max_requests: entry.maxRequests,
      used_requests: 0,
      expires_at: entry.expiresAt || null,
    })
    .select()
    .single()

  if (result.error) {
    console.error('[tokens] addToken error:', result.error)
    throw result.error
  }

  const data = result.data
  return {
    token: data.token,
    name: entry.name,
    plan: data.plan as 'pro' | 'free',
    maxRequests: data.max_requests,
    windowMs: entry.windowMs,
    createdAt: data.created_at,
    expiresAt: data.expires_at || undefined,
  }
}

/**
 * Find a token by its token string.
 * Note: callers must await this. Returns null if not found.
 */
export async function findToken(tokenStr: string): Promise<TokenEntry | null> {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from('tokens')
    .select('*')
    .eq('token', tokenStr)
    .single()

  if (error || !data) return null
  return rowToEntry(data)
}

/**
 * Remove a token from Supabase.
 */
export async function removeToken(tokenStr: string): Promise<boolean> {
  const supabase = getSupabaseAdmin()
  const { error } = await supabase
    .from('tokens')
    .delete()
    .eq('token', tokenStr)

  return !error
}

/**
 * List all tokens from Supabase.
 */
export async function listTokens(): Promise<{ id: string; name: string; plan: string; createdAt: string; expiresAt?: string }[]> {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from('tokens')
    .select('token, plan, created_at, expires_at')

  if (error || !data) return []

  return data.map(t => ({
    id: t.token,
    name: '',
    plan: t.plan,
    createdAt: t.created_at,
    expiresAt: t.expires_at || undefined,
  }))
}

/**
 * Generate a unique token string.
 */
function generateToken(): string {
  const random = Math.random().toString(36).slice(2, 10)
  const hash = Buffer.from(`${Date.now()}-${Math.random()}`).toString('base64url').slice(0, 20)
  return `ps-${hash}-${random}`
}

/**
 * Plan definitions for Gumroad purchases.
 */
export const PLANS = {
  'pro-monthly': {
    name: 'Pro Monthly',
    price: 9.99,
    maxRequests: 500,
    windowMs: 24 * 60 * 60 * 1000,
    expiryDays: 30,
    plan: 'pro',
  },
  'pro-yearly': {
    name: 'Pro Yearly',
    price: 79.99,
    maxRequests: 500,
    windowMs: 24 * 60 * 60 * 1000,
    expiryDays: 365,
    plan: 'pro',
  },
} as const

export type PlanId = keyof typeof PLANS

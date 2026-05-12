// Simple token-based paywall system
// Tokens are stored as a JSON file on disk — no external dependencies needed.

import fs from 'fs'
import path from 'path'

// Use /tmp on Vercel (read-only filesystem), or ./data locally
const DATA_DIR = process.env.VERCEL ? path.join('/tmp', 'data') : path.join(process.cwd(), 'data')
const TOKENS_FILE = path.join(DATA_DIR, 'tokens.json')

interface TokenEntry {
  token: string
  name: string
  plan: 'pro' | 'free'
  maxRequests: number
  windowMs: number
  createdAt: string
  expiresAt?: string
}

interface TokensStore {
  tokens: TokenEntry[]
}

function ensureFile() {
  const dir = path.dirname(TOKENS_FILE)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  if (!fs.existsSync(TOKENS_FILE)) {
    fs.writeFileSync(TOKENS_FILE, JSON.stringify({ tokens: [] }, null, 2))
  }
}

export function getTokens(): TokenEntry[] {
  ensureFile()
  const raw = fs.readFileSync(TOKENS_FILE, 'utf-8')
  return JSON.parse(raw).tokens
}

export function addToken(entry: Omit<TokenEntry, 'createdAt'>): TokenEntry {
  ensureFile()
  const tokens = getTokens()
  const newEntry: TokenEntry = {
    ...entry,
    createdAt: new Date().toISOString(),
  }
  tokens.push(newEntry)
  fs.writeFileSync(TOKENS_FILE, JSON.stringify({ tokens }, null, 2))
  return newEntry
}

export function findToken(token: string): TokenEntry | null {
  const tokens = getTokens()
  return tokens.find(t => t.token === token) ?? null
}

export function removeToken(token: string): boolean {
  ensureFile()
  const tokens = getTokens()
  const filtered = tokens.filter(t => t.token !== token)
  if (filtered.length === tokens.length) return false
  fs.writeFileSync(TOKENS_FILE, JSON.stringify({ tokens: filtered }, null, 2))
  return true
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
    windowMs: 24 * 60 * 60 * 1000, // daily
    expiryDays: 30,
    plan: 'pro',
  },
  'pro-yearly': {
    name: 'Pro Yearly',
    price: 79.99,
    maxRequests: 500,
    windowMs: 24 * 60 * 60 * 1000, // daily
    expiryDays: 365,
    plan: 'pro',
  },
} as const

export type PlanId = keyof typeof PLANS

/**
 * Create a token for a given plan.
 * Generates the token string, sets up maxRequests/windowMs/expiry based on the plan.
 */
export function createToken(planId: PlanId, name?: string): TokenEntry {
  const plan = PLANS[planId]
  if (!plan) {
    throw new Error(`Unknown plan: ${planId}`)
  }
  const expiresAt = new Date(Date.now() + plan.expiryDays * 24 * 60 * 60 * 1000).toISOString()
  const token = generateToken()
  return addToken({
    token,
    name: name || plan.name,
    plan: plan.plan as 'pro' | 'free',
    maxRequests: plan.maxRequests,
    windowMs: plan.windowMs,
    expiresAt,
  })
}

export function listTokens(): { id: string; name: string; plan: string; createdAt: string; expiresAt?: string }[] {
  const tokens = getTokens()
  return tokens.map(t => ({
    id: t.token,
    name: t.name,
    plan: t.plan,
    createdAt: t.createdAt,
    expiresAt: t.expiresAt,
  }))
}

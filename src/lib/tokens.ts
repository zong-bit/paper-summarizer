// Simple token-based paywall system
// Tokens are stored as a JSON file on disk — no external dependencies needed.

import fs from 'fs'
import path from 'path'

const TOKENS_FILE = path.join(process.cwd(), 'data', 'tokens.json')

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

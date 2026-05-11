import { NextResponse } from 'next/server'
import { addToken, removeToken, listTokens } from '@/lib/tokens'

// Simple token generation: random string + hash
function generateToken(name: string): string {
  const random = Math.random().toString(36).slice(2, 10)
  const hash = Buffer.from(`${name}-${Date.now()}-${Math.random()}`).toString('base64url').slice(0, 20)
  return `ps-${hash}-${random}`
}

// Admin API — requires a secret key from env
const ADMIN_SECRET = process.env.ADMIN_SECRET

export async function GET() {
  const auth = getAuthHeader()
  if (!verifyAuth(auth)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const tokens = listTokens()
  return NextResponse.json({ tokens })
}

export async function POST(request: Request) {
  const auth = getAuthHeader()
  if (!verifyAuth(auth)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { name, plan = 'pro', maxRequests = 100, windowMs = 60 * 60 * 1000, expiresAt } = body

  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 })
  }

  const token = generateToken(name)
  const entry = addToken({
    token,
    name,
    plan: plan || 'pro',
    maxRequests: maxRequests || 100,
    windowMs: windowMs || 60 * 60 * 1000,
    expiresAt: expiresAt || undefined,
  })

  return NextResponse.json({
    success: true,
    token,
    name: entry.name,
    plan: entry.plan,
    maxRequests: entry.maxRequests,
    windowMs: entry.windowMs,
    expiresAt: entry.expiresAt,
  })
}

export async function DELETE(request: Request) {
  const auth = getAuthHeader()
  if (!verifyAuth(auth)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.json({ error: 'Missing token parameter' }, { status: 400 })
  }

  const removed = removeToken(token)
  if (!removed) {
    return NextResponse.json({ error: 'Token not found' }, { status: 404 })
  }

  return NextResponse.json({ success: true, message: 'Token removed' })
}

function getAuthHeader(): string | null {
  return process.env.ADMIN_SECRET || null
}

function verifyAuth(header: string | null): boolean {
  if (!header) return false
  const auth = process.env.ADMIN_SECRET
  if (!auth) return false
  return header === auth
}

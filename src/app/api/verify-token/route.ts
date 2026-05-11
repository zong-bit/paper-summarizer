import { NextResponse } from 'next/server'
import { findToken } from '@/lib/tokens'

// Token-based rate limiter (persistent across requests via file)
const rateLimit = new Map<string, { count: number; resetAt: number }>()

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'

  if (!token) {
    return NextResponse.json({ valid: false, error: 'Missing token parameter' }, { status: 400 })
  }

  const entry = findToken(token)

  if (!entry) {
    return NextResponse.json(
      { valid: false, error: 'Invalid token. Contact us for access.' },
      { status: 403 }
    )
  }

  // Check expiry
  if (entry.expiresAt && new Date(entry.expiresAt) < new Date()) {
    return NextResponse.json(
      { valid: false, error: 'Token has expired.' },
      { status: 403 }
    )
  }

  // Check rate limit
  const now = Date.now()
  const ipKey = `${token}:${ip}`
  const rateEntry = rateLimit.get(ipKey)

  let allowed = true
  let remaining = entry.maxRequests
  let resetIn = entry.windowMs

  if (rateEntry && rateEntry.resetAt < now) {
    rateLimit.delete(ipKey)
  }

  if (rateEntry && rateEntry.count >= entry.maxRequests && rateEntry.resetAt > now) {
    allowed = false
    remaining = 0
    resetIn = rateEntry.resetAt - now
  } else if (rateEntry) {
    rateEntry.count++
    remaining = entry.maxRequests - rateEntry.count
  } else {
    rateLimit.set(ipKey, { count: 1, resetAt: now + entry.windowMs })
    remaining = entry.maxRequests - 1
  }

  return NextResponse.json({
    valid: true,
    plan: entry.plan,
    name: entry.name,
    remaining,
    resetIn,
    maxRequests: entry.maxRequests,
    windowMs: entry.windowMs,
  })
}

export async function POST(request: Request) {
  const body = await request.json()
  const token = body.token

  if (!token) {
    return NextResponse.json({ valid: false, error: 'Missing token' }, { status: 400 })
  }

  const entry = findToken(token)

  if (!entry) {
    return NextResponse.json(
      { valid: false, error: 'Invalid token. Contact us for access.' },
      { status: 403 }
    )
  }

  if (entry.expiresAt && new Date(entry.expiresAt) < new Date()) {
    return NextResponse.json(
      { valid: false, error: 'Token has expired.' },
      { status: 403 }
    )
  }

  return NextResponse.json({
    valid: true,
    plan: entry.plan,
    name: entry.name,
    maxRequests: entry.maxRequests,
    windowMs: entry.windowMs,
  })
}

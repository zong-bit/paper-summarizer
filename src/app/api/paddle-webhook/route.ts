import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createToken } from '@/lib/tokens'
import fs from 'fs'
import path from 'path'

// Use /tmp on Vercel (serverless read-only filesystem)
const DATA_DIR = process.env.VERCEL ? path.join('/tmp', 'data') : path.join(process.cwd(), 'data')
const SALE_FILE = path.join(DATA_DIR, 'paddle_sales.json')

// Our known price IDs
const PADDLE_PRICE_MONTHLY = 'pri_01krk617mdepfbhe493b2adfqn'
const PADDLE_PRICE_YEARLY = 'pri_01krk61am9rvh6p2a61armcgyv'

// Paddle's public key URL for webhook verification
const PADDLE_PUBLIC_KEY_URL = 'https://paddle.com/.well-known/paddle-public-key.pem'

interface PaddleSale {
  eventId: string
  transactionId: string
  email: string
  plan: string
  token: string
  price: number
  currency: string
  paidAt: string
  expiresAt: string
  refunded: boolean
  subscriptionId?: string
  subscriptionStatus?: string
}

function loadSales(): PaddleSale[] {
  try {
    const dir = path.dirname(SALE_FILE)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    if (!fs.existsSync(SALE_FILE)) return []
    return JSON.parse(fs.readFileSync(SALE_FILE, 'utf-8'))
  } catch {
    return []
  }
}

function saveSales(sales: PaddleSale[]) {
  const dir = path.dirname(SALE_FILE)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(SALE_FILE, JSON.stringify(sales, null, 2))
}

/**
 * Fetch and cache Paddle's public key for webhook verification.
 */
let cachedPublicKey: string | null = null
let lastFetch = 0
const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours

async function fetchPaddlePublicKey(): Promise<string | null> {
  const now = Date.now()
  if (cachedPublicKey && now - lastFetch < CACHE_TTL) {
    return cachedPublicKey
  }
  try {
    const res = await fetch(PADDLE_PUBLIC_KEY_URL, { cache: 'no-store' })
    if (!res.ok) {
      console.warn('[Paddle] Failed to fetch public key:', res.status)
      return cachedPublicKey // return cached key even if stale
    }
    const key = await res.text()
    cachedPublicKey = key
    lastFetch = now
    return key
  } catch (err) {
    console.warn('[Paddle] Error fetching public key:', err)
    return cachedPublicKey
  }
}

/**
 * Verify Paddle webhook signature.
 *
 * Paddle sends a `Paddle-Signature` header with format: ts=<timestamp>;h1=<base64_sig>
 * The signed payload is: `${timestamp}.${rawBody}`
 * Verification uses Paddle's RSA public key.
 */
async function verifySignature(rawBody: string, paddleSignature: string | null): Promise<boolean> {
  if (!paddleSignature) {
    console.warn('[Paddle] No Paddle-Signature header')
    return false
  }

  const publicKeyPem = await fetchPaddlePublicKey()
  if (!publicKeyPem) {
    console.warn('[Paddle] No public key available — signature verification disabled')
    return true // skip verification if key not available
  }

  // Parse the signature header: ts=1712345678;h1=<base64>
  const tsMatch = paddleSignature.match(/ts=(\d+)/)
  const h1Match = paddleSignature.match(/h1=([A-Za-z0-9+/=_-]+)/)

  if (!tsMatch || !h1Match) {
    console.warn('[Paddle] Invalid Paddle-Signature format')
    return false
  }

  const timestamp = tsMatch[1]
  const signatureBase64 = h1Match[1].replace(/-/g, '+').replace(/_/g, '/')

  // Build the signed content: timestamp + "." + raw body
  const signedContent = `${timestamp}.${rawBody}`

  try {
    const verifier = crypto.createVerify('RSA-SHA256')
    verifier.update(signedContent)
    return verifier.verify(publicKeyPem, signatureBase64, 'base64')
  } catch (err) {
    console.warn('[Paddle] Signature verification failed:', err)
    return false
  }
}

/**
 * Detect plan from a Paddle price ID.
 */
function detectPlanFromPriceId(priceId: string): 'pro-monthly' | 'pro-yearly' {
  if (priceId === PADDLE_PRICE_YEARLY) return 'pro-yearly'
  return 'pro-monthly' // default to monthly for unknown price IDs
}

/**
 * Detect plan from transaction items array.
 */
function detectPlanFromItems(items: any[]): 'pro-monthly' | 'pro-yearly' {
  if (!items || items.length === 0) return 'pro-monthly'
  // Check first item's price_id for yearly
  const priceId = items[0]?.price?.id || items[0]?.price_id || ''
  return detectPlanFromPriceId(priceId)
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.clone().text()
    const paddleSignature = request.headers.get('Paddle-Signature')

    // Verify signature
    const valid = await verifySignature(rawBody, paddleSignature)
    if (!valid) {
      console.warn('[Paddle] Invalid signature — rejecting')
      return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 401 })
    }

    let payload: any
    try {
      payload = JSON.parse(rawBody)
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 })
    }

    const eventId = payload.event_id || ''
    const eventType = payload.event_type || ''
    const data = payload.data || {}
    const attrs = data.attributes || {}

    console.log(`[Paddle] Event received: ${eventType}`, { eventId })

    // =========================================================
    // transaction.completed — single payment or subscription payment
    // =========================================================
    if (eventType === 'transaction.completed') {
      const transactionId = data.id || ''
      const email = attrs.customer_email || ''
      const status = attrs.status || ''
      const currency = attrs.currency_code || attrs.currency || 'USD'
      const total = attrs.details?.totals?.grand_total
        ? parseFloat(attrs.details.totals.grand_total)
        : parseFloat(attrs.total) || 0
      const subscriptionId = attrs.subscription_id || null
      const items = attrs.items || attrs.details?.line_items || []

      // Detect plan
      const planId = detectPlanFromItems(items)

      console.log(`[Paddle] Payment captured:`, {
        transactionId,
        email,
        planId,
        total,
        currency,
        status,
        subscriptionId,
      })

      // Skip if refunded
      if (status === 'refunded' || status === 'chargeback') {
        const sales = loadSales()
        const existing = sales.find(s => s.transactionId === transactionId)
        if (existing) {
          existing.refunded = true
          saveSales(sales)
          console.log(`[Paddle] Transaction ${transactionId} refunded, token marked as refunded`)
        }
        return NextResponse.json({ success: true })
      }

      // Skip if we already processed this transaction
      const existingSales = loadSales()
      if (existingSales.find(s => s.transactionId === transactionId)) {
        console.log(`[Paddle] Transaction ${transactionId} already processed, skipping`)
        return NextResponse.json({ success: true })
      }

      // Create the token
      const tokenEntry = createToken(planId, email || 'Paddle User')

      // Persist the sale record
      const sale: PaddleSale = {
        eventId,
        transactionId: transactionId || `pdl-${Date.now()}`,
        email: email || 'unknown@email.com',
        plan: planId,
        token: tokenEntry.token,
        price: total,
        currency,
        paidAt: new Date().toISOString(),
        expiresAt: tokenEntry.expiresAt!,
        refunded: false,
        subscriptionId: subscriptionId || undefined,
        subscriptionStatus: subscriptionId ? 'active' : undefined,
      }
      existingSales.push(sale)
      saveSales(existingSales)

      console.log(`[Paddle] Token created for ${email}: ${tokenEntry.token} (plan: ${planId})`)
      return NextResponse.json({ success: true })
    }

    // ============================
    // subscription.created
    // ============================
    if (eventType === 'subscription.created') {
      const subscriptionId = data.id || ''
      const email = attrs.customer_email || ''
      const status = attrs.status || ''
      const items = attrs.items || []
      const scheduledChange = attrs.scheduled_change || null

      const planId = detectPlanFromItems(items)

      console.log(`[Paddle] Subscription created:`, {
        subscriptionId,
        email,
        planId,
        status,
      })

      // Check if we already have a token for this subscription
      const existingSales = loadSales()
      if (existingSales.find(s => s.subscriptionId === subscriptionId)) {
        console.log(`[Paddle] Subscription ${subscriptionId} already processed, skipping`)
        return NextResponse.json({ success: true })
      }

      // Create the token
      const tokenEntry = createToken(planId, email || 'Paddle User')

      const sale: PaddleSale = {
        eventId,
        transactionId: `sub-${subscriptionId}`,
        email: email || 'unknown@email.com',
        plan: planId,
        token: tokenEntry.token,
        price: 0,
        currency: 'USD',
        paidAt: new Date().toISOString(),
        expiresAt: tokenEntry.expiresAt!,
        refunded: false,
        subscriptionId,
        subscriptionStatus: status,
      }
      existingSales.push(sale)
      saveSales(existingSales)

      console.log(`[Paddle] Token created from subscription for ${email}: ${tokenEntry.token}`)
      return NextResponse.json({ success: true })
    }

    // ============================
    // subscription.updated (handle status changes)
    // ============================
    if (eventType === 'subscription.updated') {
      const subscriptionId = data.id || ''
      const status = attrs.status || ''
      const email = attrs.customer_email || ''

      console.log(`[Paddle] Subscription updated: ${subscriptionId}, status: ${status}`)

      const sales = loadSales()
      const existing = sales.find(s => s.subscriptionId === subscriptionId)

      if (existing) {
        existing.subscriptionStatus = status

        // If cancelled/expired/paused, revoke token
        if (['cancelled', 'expired', 'paused'].includes(status)) {
          existing.refunded = true
        }

        saveSales(sales)
        console.log(`[Paddle] Subscription ${subscriptionId} updated, token ${['cancelled', 'expired', 'paused'].includes(status) ? 'revoked' : 'updated'}`)
      }

      return NextResponse.json({ success: true })
    }

    // ============================
    // subscription.canceled (Paddle Billing uses American English)
    // ============================
    if (eventType === 'subscription.canceled') {
      const subscriptionId = data.id || ''

      console.log(`[Paddle] Subscription cancelled: ${subscriptionId}`)

      const sales = loadSales()
      const existing = sales.find(s => s.subscriptionId === subscriptionId)

      if (existing) {
        existing.refunded = true
        existing.subscriptionStatus = 'cancelled'
        saveSales(sales)
        console.log(`[Paddle] Subscription ${subscriptionId} cancelled, token revoked`)
      }

      return NextResponse.json({ success: true })
    }

    // Unknown event — acknowledge but log
    console.log(`[Paddle] Unhandled event: ${eventType}`)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[Paddle Webhook Error]', err)
    // Always return 200 so Paddle doesn't keep retrying
    return NextResponse.json({ success: true })
  }
}

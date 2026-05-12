import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createToken, findToken } from '@/lib/tokens'
import fs from 'fs'
import path from 'path'

// Use /tmp on Vercel (serverless read-only filesystem)
const DATA_DIR = process.env.VERCEL ? path.join('/tmp', 'data') : path.join(process.cwd(), 'data')
const SALE_FILE = path.join(DATA_DIR, 'lemon_squeezy_sales.json')

interface LemonSqueezySale {
  orderId: string           // Lemon Squeezy order ID (e.g., the `data.id`)
  orderNumber: number       // Human-friendly order number
  email: string
  variantName: string
  variantId: number
  plan: string              // 'pro-monthly' | 'pro-yearly'
  token: string
  total: number             // total in cents
  currency: string
  paidAt: string
  expiresAt: string
  refunded: boolean
  subscriptionId?: string   // for subscription purchases
  subscriptionStatus?: string
}

function loadSales(): LemonSqueezySale[] {
  try {
    const dir = path.dirname(SALE_FILE)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    if (!fs.existsSync(SALE_FILE)) return []
    return JSON.parse(fs.readFileSync(SALE_FILE, 'utf-8'))
  } catch {
    return []
  }
}

function saveSales(sales: LemonSqueezySale[]) {
  const dir = path.dirname(SALE_FILE)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(SALE_FILE, JSON.stringify(sales, null, 2))
}

/**
 * Verify Lemon Squeezy webhook signature.
 * Header: X-Signature = HMAC-SHA256(rawBody, webhookSecret), base64-encoded
 */
function verifySignature(rawBody: string, signature: string | null): boolean {
  if (!signature) return false
  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET
  if (!secret) {
    console.warn('[LemonSqueezy] LEMON_SQUEEZY_WEBHOOK_SECRET not set, skipping verification')
    return true
  }
  const expected = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('base64')
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
}

/**
 * Determine the plan ID from the Lemon Squeezy variant name.
 * Returns 'pro-monthly', 'pro-yearly', or null if unrecognised.
 */
function detectPlan(variantName: string): 'pro-monthly' | 'pro-yearly' | null {
  const lower = (variantName || '').toLowerCase()
  if (lower.includes('yearly') || lower.includes('annual') || lower.includes('year')) {
    return 'pro-yearly'
  }
  if (lower.includes('monthly') || lower.includes('month')) {
    return 'pro-monthly'
  }
  // Default to monthly
  return 'pro-monthly'
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.clone().text()
    const signature = request.headers.get('X-Signature')

    // Verify signature
    if (!verifySignature(rawBody, signature)) {
      console.warn('[LemonSqueezy] Invalid signature — possible spoofed request')
      return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 401 })
    }

    let payload: any
    try {
      payload = JSON.parse(rawBody)
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 })
    }

    const eventName = payload.meta?.event_name || ''
    const data = payload.data
    const attrs = data?.attributes || {}

    console.log(`[LemonSqueezy] Event received: ${eventName}`, {
      orderNumber: attrs.order_number,
      email: attrs.customer_email,
      status: attrs.status,
    })

    // Handle order_created (one-time purchase or initial subscription payment)
    if (eventName === 'order_created') {
      const orderId = data.id
      const orderNumber = attrs.order_number
      const email = attrs.customer_email
      const total = attrs.total || 0
      const currency = attrs.currency || 'USD'
      const status = attrs.status || 'paid'

      // Get the first order item variant info
      const firstItem = attrs.first_order_item || {}
      const variantName = firstItem.variant_name || ''
      const variantId = firstItem.variant_id

      // Get the subscription ID if this order created a subscription
      const subscriptionId = firstItem.subscription_id || null

      console.log(`[LemonSqueezy] Order ${orderNumber}:`, {
        email,
        variantName,
        variantId,
        total,
        currency,
        status,
        subscriptionId,
      })

      // Handle refunds
      if (status === 'refunded') {
        const sales = loadSales()
        const existing = sales.find(s => s.orderId === orderId || s.orderNumber === orderNumber)
        if (existing) {
          existing.refunded = true
          saveSales(sales)
          console.log(`[LemonSqueezy] Order ${orderNumber} refunded, token marked as refunded`)
        }
        return NextResponse.json({ success: true })
      }

      // Skip if we already processed this order
      const existingSales = loadSales()
      if (existingSales.find(s => s.orderId === orderId)) {
        console.log(`[LemonSqueezy] Order ${orderId} already processed, skipping`)
        return NextResponse.json({ success: true })
      }

      // Detect which plan was purchased
      const planId = detectPlan(variantName)
      if (!planId) {
        console.warn(`[LemonSqueezy] Unknown variant: ${variantName}, defaulting to pro-monthly`)
      }

      // Create the token
      const tokenEntry = createToken(planId || 'pro-monthly', email || 'LemonSqueezy User')

      // Persist the sale record
      const sale: LemonSqueezySale = {
        orderId: orderId || `ls-${Date.now()}`,
        orderNumber: orderNumber || 0,
        email: email || 'unknown@email.com',
        variantName,
        variantId: variantId || 0,
        plan: planId || 'pro-monthly',
        token: tokenEntry.token,
        total,
        currency,
        paidAt: new Date().toISOString(),
        expiresAt: tokenEntry.expiresAt!,
        refunded: false,
        subscriptionId: subscriptionId || undefined,
        subscriptionStatus: 'active',
      }
      existingSales.push(sale)
      saveSales(existingSales)

      console.log(`[LemonSqueezy] Token created for ${email}: ${tokenEntry.token} (plan: ${planId})`)
      return NextResponse.json({ success: true })
    }

    // Handle subscription_created
    if (eventName === 'subscription_created') {
      const subscriptionId = data.id
      const email = attrs.customer_email
      const variantName = attrs.variant_name || ''
      const variantId = attrs.variant_id
      const status = attrs.status || ''
      const renewsAt = attrs.renews_at
      const endsAt = attrs.ends_at
      const trialEndsAt = attrs.trial_ends_at

      console.log(`[LemonSqueezy] Subscription created:`, {
        subscriptionId,
        email,
        variantName,
        variantId,
        status,
        renewsAt,
      })

      // Don't create a new token if we already got one from order_created for this subscription
      const existingSales = loadSales()
      if (existingSales.find(s => s.subscriptionId === subscriptionId)) {
        console.log(`[LemonSqueezy] Subscription ${subscriptionId} already processed via order_created, skipping`)
        return NextResponse.json({ success: true })
      }

      const planId = detectPlan(variantName)
      const tokenEntry = createToken(planId || 'pro-monthly', email || 'LemonSqueezy User')

      const sale: LemonSqueezySale = {
        orderId: `sub-${subscriptionId}`,
        orderNumber: 0,
        email: email || 'unknown@email.com',
        variantName,
        variantId: variantId || 0,
        plan: planId || 'pro-monthly',
        token: tokenEntry.token,
        total: 0,
        currency: 'USD',
        paidAt: new Date().toISOString(),
        expiresAt: tokenEntry.expiresAt!,
        refunded: false,
        subscriptionId,
        subscriptionStatus: status,
      }
      existingSales.push(sale)
      saveSales(existingSales)

      console.log(`[LemonSqueezy] Token created from subscription for ${email}: ${tokenEntry.token}`)
      return NextResponse.json({ success: true })
    }

    // Handle subscription_updated (status changes, renewals)
    if (eventName === 'subscription_updated') {
      const subscriptionId = data.id
      const status = attrs.status || ''
      const email = attrs.customer_email
      const renewsAt = attrs.renews_at
      const endsAt = attrs.ends_at

      console.log(`[LemonSqueezy] Subscription updated: ${subscriptionId}, status: ${status}`)

      const sales = loadSales()
      const existing = sales.find(s => s.subscriptionId === subscriptionId)

      if (existing) {
        existing.subscriptionStatus = status

        // If cancelled, mark as refunded (revoke token)
        if (status === 'cancelled' || status === 'expired' || status === 'paused') {
          existing.refunded = true
        }

        // Update expiry if ends_at is provided
        if (endsAt && (status === 'active' || status === 'cancelled')) {
          existing.expiresAt = endsAt
        }

        saveSales(sales)
        console.log(`[LemonSqueezy] Subscription ${subscriptionId} updated, token ${status === 'cancelled' || status === 'expired' ? 'revoked' : 'updated'}`)
      }

      return NextResponse.json({ success: true })
    }

    // Handle subscription_cancelled
    if (eventName === 'subscription_cancelled') {
      const subscriptionId = data.id
      const endsAt = attrs.ends_at

      console.log(`[LemonSqueezy] Subscription cancelled: ${subscriptionId}`)

      const sales = loadSales()
      const existing = sales.find(s => s.subscriptionId === subscriptionId)

      if (existing) {
        existing.refunded = true
        existing.subscriptionStatus = 'cancelled'
        if (endsAt) {
          existing.expiresAt = endsAt
        }
        saveSales(sales)
        console.log(`[LemonSqueezy] Subscription ${subscriptionId} cancelled, token revoked`)
      }

      return NextResponse.json({ success: true })
    }

    // Unknown event — acknowledge but log
    console.log(`[LemonSqueezy] Unhandled event: ${eventName}`)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[LemonSqueezy Webhook Error]', err)
    // Always return 200 so Lemon Squeezy doesn't keep retrying
    return NextResponse.json({ success: true })
  }
}

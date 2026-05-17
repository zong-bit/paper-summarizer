import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createToken } from '@/lib/tokens'
import { getSupabaseAdmin } from '@/lib/supabase'

const PADDLE_PRICE_MONTHLY = 'pri_01krk617mdepfbhe493b2adfqn'
const PADDLE_PRICE_YEARLY = 'pri_01krk61am9rvh6p2a61armcgyv'
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

let cachedPublicKey: string | null = null
let lastFetch = 0
const CACHE_TTL = 24 * 60 * 60 * 1000

async function fetchPaddlePublicKey(): Promise<string | null> {
  const now = Date.now()
  if (cachedPublicKey && now - lastFetch < CACHE_TTL) return cachedPublicKey
  try {
    const res = await fetch(PADDLE_PUBLIC_KEY_URL, { cache: 'no-store' })
    if (!res.ok) {
      console.warn('[Paddle] Failed to fetch public key:', res.status)
      return cachedPublicKey
    }
    cachedPublicKey = await res.text()
    lastFetch = now
    return cachedPublicKey
  } catch (err) {
    console.warn('[Paddle] Error fetching public key:', err)
    return cachedPublicKey
  }
}

async function verifySignature(rawBody: string, paddleSignature: string | null): Promise<boolean> {
  if (!paddleSignature) {
    console.warn('[Paddle] No Paddle-Signature header')
    return false
  }

  const publicKeyPem = await fetchPaddlePublicKey()
  if (!publicKeyPem) {
    console.warn('[Paddle] No public key available — signature verification disabled')
    return true
  }

  const tsMatch = paddleSignature.match(/ts=(\d+)/)
  const h1Match = paddleSignature.match(/h1=([A-Za-z0-9+/=_-]+)/)

  if (!tsMatch || !h1Match) {
    console.warn('[Paddle] Invalid Paddle-Signature format')
    return false
  }

  const timestamp = tsMatch[1]
  const signatureBase64 = h1Match[1].replace(/-/g, '+').replace(/_/g, '/')
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

function detectPlanFromPriceId(priceId: string): 'pro-monthly' | 'pro-yearly' {
  if (priceId === PADDLE_PRICE_YEARLY) return 'pro-yearly'
  return 'pro-monthly'
}

function detectPlanFromItems(items: any[]): 'pro-monthly' | 'pro-yearly' {
  if (!items || items.length === 0) return 'pro-monthly'
  const priceId = items[0]?.price?.id || items[0]?.price_id || ''
  return detectPlanFromPriceId(priceId)
}

async function isDuplicatePaddle(transactionId: string, subscriptionId?: string): Promise<boolean> {
  const supabase = getSupabaseAdmin()
  const { data } = await supabase
    .from('paddle_sales')
    .select('id')
    .or(`transaction_id.eq.${transactionId},subscription_id.eq.${subscriptionId}`)
    .maybeSingle()
  return !!data
}

async function recordPaddleSale(sale: PaddleSale): Promise<void> {
  const supabase = getSupabaseAdmin()
  await supabase.from('paddle_sales').insert({
    event_id: sale.eventId,
    transaction_id: sale.transactionId,
    email: sale.email,
    plan: sale.plan,
    token: sale.token,
    price: sale.price,
    currency: sale.currency,
    paid_at: sale.paidAt,
    expires_at: sale.expiresAt,
    refunded: sale.refunded,
    subscription_id: sale.subscriptionId || null,
    subscription_status: sale.subscriptionStatus || null,
  })
}

async function markPaddleRefunded(transactionId?: string, subscriptionId?: string): Promise<void> {
  const supabase = getSupabaseAdmin()
  const where: Record<string, string> = {}
  if (transactionId) where.transaction_id = transactionId
  if (subscriptionId) where.subscription_id = subscriptionId
  await supabase
    .from('paddle_sales')
    .update({ refunded: true })
    .or(`transaction_id.eq.${transactionId},subscription_id.eq.${subscriptionId}`)
}

async function updatePaddleSubscriptionStatus(subscriptionId: string, status: string): Promise<void> {
  const supabase = getSupabaseAdmin()
  await supabase
    .from('paddle_sales')
    .update({ subscription_status: status })
    .eq('subscription_id', subscriptionId)
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.clone().text()
    const paddleSignature = request.headers.get('Paddle-Signature')

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

    // transaction.completed
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

      const planId = detectPlanFromItems(items)

      console.log(`[Paddle] Payment captured:`, { transactionId, email, planId, total, currency, status, subscriptionId })

      if (status === 'refunded' || status === 'chargeback') {
        await markPaddleRefunded(transactionId, subscriptionId || undefined)
        console.log(`[Paddle] Transaction ${transactionId} refunded, token marked as refunded`)
        return NextResponse.json({ success: true })
      }

      if (await isDuplicatePaddle(transactionId, subscriptionId || undefined)) {
        console.log(`[Paddle] Transaction ${transactionId} already processed, skipping`)
        return NextResponse.json({ success: true })
      }

      const tokenEntry = await createToken(planId, email || 'Paddle User')

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

      await recordPaddleSale(sale)
      console.log(`[Paddle] Token created for ${email}: ${tokenEntry.token} (plan: ${planId})`)
      return NextResponse.json({ success: true })
    }

    // subscription.created
    if (eventType === 'subscription.created') {
      const subscriptionId = data.id || ''
      const email = attrs.customer_email || ''
      const status = attrs.status || ''
      const items = attrs.items || []
      const planId = detectPlanFromItems(items)

      console.log(`[Paddle] Subscription created:`, { subscriptionId, email, planId, status })

      if (await isDuplicatePaddle('', subscriptionId)) {
        console.log(`[Paddle] Subscription ${subscriptionId} already processed, skipping`)
        return NextResponse.json({ success: true })
      }

      const tokenEntry = await createToken(planId, email || 'Paddle User')

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

      await recordPaddleSale(sale)
      console.log(`[Paddle] Token created from subscription for ${email}: ${tokenEntry.token}`)
      return NextResponse.json({ success: true })
    }

    // subscription.updated
    if (eventType === 'subscription.updated') {
      const subscriptionId = data.id || ''
      const status = attrs.status || ''
      const email = attrs.customer_email || ''

      console.log(`[Paddle] Subscription updated: ${subscriptionId}, status: ${status}`)

      await updatePaddleSubscriptionStatus(subscriptionId, status)

      if (['cancelled', 'expired', 'paused'].includes(status)) {
        const supabase = getSupabaseAdmin()
        await supabase
          .from('paddle_sales')
          .update({ refunded: true })
          .eq('subscription_id', subscriptionId)
        console.log(`[Paddle] Subscription ${subscriptionId} updated, token revoked`)
      } else {
        console.log(`[Paddle] Subscription ${subscriptionId} updated, token updated`)
      }

      return NextResponse.json({ success: true })
    }

    // subscription.canceled
    if (eventType === 'subscription.canceled') {
      const subscriptionId = data.id || ''
      console.log(`[Paddle] Subscription cancelled: ${subscriptionId}`)

      const supabase = getSupabaseAdmin()
      await supabase
        .from('paddle_sales')
        .update({ refunded: true, subscription_status: 'cancelled' })
        .eq('subscription_id', subscriptionId)

      console.log(`[Paddle] Subscription ${subscriptionId} cancelled, token revoked`)
      return NextResponse.json({ success: true })
    }

    console.log(`[Paddle] Unhandled event: ${eventType}`)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[Paddle Webhook Error]', err)
    return NextResponse.json({ success: true })
  }
}

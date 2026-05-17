import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createToken, findToken } from '@/lib/tokens'
import { getSupabaseAdmin } from '@/lib/supabase'

interface LemonSqueezySale {
  orderId: string
  orderNumber: number
  email: string
  variantName: string
  variantId: number
  plan: string
  token: string
  total: number
  currency: string
  paidAt: string
  expiresAt: string
  refunded: boolean
  subscriptionId?: string
  subscriptionStatus?: string
}

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

function detectPlan(variantName: string): 'pro-monthly' | 'pro-yearly' | null {
  const lower = (variantName || '').toLowerCase()
  if (lower.includes('yearly') || lower.includes('annual') || lower.includes('year')) {
    return 'pro-yearly'
  }
  if (lower.includes('monthly') || lower.includes('month')) {
    return 'pro-monthly'
  }
  return 'pro-monthly'
}

async function isDuplicateLS(orderId: string, subscriptionId?: string): Promise<boolean> {
  const supabase = getSupabaseAdmin()
  const { data } = await supabase
    .from('lemon_squeezy_sales')
    .select('id')
    .or(`order_id.eq.${orderId},subscription_id.eq.${subscriptionId}`)
    .maybeSingle()
  return !!data
}

async function recordLSSale(sale: LemonSqueezySale): Promise<void> {
  const supabase = getSupabaseAdmin()
  await supabase.from('lemon_squeezy_sales').insert({
    order_id: sale.orderId,
    order_number: sale.orderNumber,
    email: sale.email,
    variant_name: sale.variantName,
    variant_id: sale.variantId,
    plan: sale.plan,
    token: sale.token,
    total: sale.total,
    currency: sale.currency,
    paid_at: sale.paidAt,
    expires_at: sale.expiresAt,
    refunded: sale.refunded,
    subscription_id: sale.subscriptionId || null,
    subscription_status: sale.subscriptionStatus || null,
  })
}

async function markLSRefunded(orderId: string): Promise<void> {
  const supabase = getSupabaseAdmin()
  await supabase
    .from('lemon_squeezy_sales')
    .update({ refunded: true })
    .eq('order_id', orderId)
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.clone().text()
    const signature = request.headers.get('X-Signature')

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

    if (eventName === 'order_created') {
      const orderId = data.id
      const orderNumber = attrs.order_number
      const email = attrs.customer_email
      const total = attrs.total || 0
      const currency = attrs.currency || 'USD'
      const status = attrs.status || 'paid'

      const firstItem = attrs.first_order_item || {}
      const variantName = firstItem.variant_name || ''
      const variantId = firstItem.variant_id
      const subscriptionId = firstItem.subscription_id || null

      console.log(`[LemonSqueezy] Order ${orderNumber}:`, {
        email, variantName, variantId, total, currency, status, subscriptionId,
      })

      if (status === 'refunded') {
        await markLSRefunded(orderId)
        console.log(`[LemonSqueezy] Order ${orderNumber} refunded, token marked as refunded`)
        return NextResponse.json({ success: true })
      }

      if (await isDuplicateLS(orderId, subscriptionId || undefined)) {
        console.log(`[LemonSqueezy] Order ${orderId} already processed, skipping`)
        return NextResponse.json({ success: true })
      }

      const planId = detectPlan(variantName)
      if (!planId) {
        console.warn(`[LemonSqueezy] Unknown variant: ${variantName}, defaulting to pro-monthly`)
      }

      const tokenEntry = await createToken(planId || 'pro-monthly', email || 'LemonSqueezy User')

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

      await recordLSSale(sale)
      console.log(`[LemonSqueezy] Token created for ${email}: ${tokenEntry.token} (plan: ${planId})`)
      return NextResponse.json({ success: true })
    }

    if (eventName === 'subscription_created') {
      const subscriptionId = data.id
      const email = attrs.customer_email
      const variantName = attrs.variant_name || ''
      const variantId = attrs.variant_id
      const status = attrs.status || ''

      console.log(`[LemonSqueezy] Subscription created:`, {
        subscriptionId, email, variantName, variantId, status,
      })

      if (await isDuplicateLS('', subscriptionId)) {
        console.log(`[LemonSqueezy] Subscription ${subscriptionId} already processed, skipping`)
        return NextResponse.json({ success: true })
      }

      const planId = detectPlan(variantName)
      const tokenEntry = await createToken(planId || 'pro-monthly', email || 'LemonSqueezy User')

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

      await recordLSSale(sale)
      console.log(`[LemonSqueezy] Token created from subscription for ${email}: ${tokenEntry.token}`)
      return NextResponse.json({ success: true })
    }

    if (eventName === 'subscription_updated') {
      const subscriptionId = data.id
      const status = attrs.status || ''
      const email = attrs.customer_email
      const renewsAt = attrs.renews_at
      const endsAt = attrs.ends_at

      console.log(`[LemonSqueezy] Subscription updated: ${subscriptionId}, status: ${status}`)

      const supabase = getSupabaseAdmin()
      const { data: existing } = await supabase
        .from('lemon_squeezy_sales')
        .select('*')
        .eq('subscription_id', subscriptionId)
        .maybeSingle()

      if (existing) {
        await supabase
          .from('lemon_squeezy_sales')
          .update({ subscription_status: status })
          .eq('subscription_id', subscriptionId)

        if (status === 'cancelled' || status === 'expired' || status === 'paused') {
          await supabase
            .from('lemon_squeezy_sales')
            .update({ refunded: true })
            .eq('subscription_id', subscriptionId)
          console.log(`[LemonSqueezy] Subscription ${subscriptionId} updated, token revoked`)
        } else {
          console.log(`[LemonSqueezy] Subscription ${subscriptionId} updated, token updated`)
        }

        if (endsAt && (status === 'active' || status === 'cancelled')) {
          await supabase
            .from('lemon_squeezy_sales')
            .update({ expires_at: endsAt })
            .eq('subscription_id', subscriptionId)
        }
      }

      return NextResponse.json({ success: true })
    }

    if (eventName === 'subscription_cancelled') {
      const subscriptionId = data.id
      const endsAt = attrs.ends_at

      console.log(`[LemonSqueezy] Subscription cancelled: ${subscriptionId}`)

      const supabase = getSupabaseAdmin()
      const update: Record<string, unknown> = { refunded: true, subscription_status: 'cancelled' }
      if (endsAt) update.expires_at = endsAt
      await supabase
        .from('lemon_squeezy_sales')
        .update(update)
        .eq('subscription_id', subscriptionId)

      console.log(`[LemonSqueezy] Subscription ${subscriptionId} cancelled, token revoked`)
      return NextResponse.json({ success: true })
    }

    console.log(`[LemonSqueezy] Unhandled event: ${eventName}`)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[LemonSqueezy Webhook Error]', err)
    return NextResponse.json({ success: true })
  }
}

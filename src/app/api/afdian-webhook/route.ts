import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { addToken } from '@/lib/tokens'
import { getSupabaseAdmin } from '@/lib/supabase'

const AFDIAN_USER_ID = '6d58eee44d3011f1961952540025c377'

interface OrderMapping {
  orderId: string
  token: string
  name: string
  paidAt: string
  expiresAt: string
  claimed: boolean
}

async function isDuplicateAfdian(orderId: string): Promise<boolean> {
  const supabase = getSupabaseAdmin()
  const { data } = await supabase
    .from('afdian_orders')
    .select('id')
    .eq('order_id', orderId)
    .maybeSingle()
  return !!data
}

async function recordAfdianOrder(order: OrderMapping): Promise<void> {
  const supabase = getSupabaseAdmin()
  await supabase.from('afdian_orders').insert({
    order_id: order.orderId,
    token: order.token,
    name: order.name,
    paid_at: order.paidAt,
    expires_at: order.expiresAt,
    claimed: order.claimed,
  })
}

async function getAfdianOrder(orderId: string): Promise<OrderMapping | null> {
  const supabase = getSupabaseAdmin()
  const { data } = await supabase
    .from('afdian_orders')
    .select('*')
    .eq('order_id', orderId)
    .maybeSingle()
  if (!data) return null
  return data as unknown as OrderMapping
}

function generateProToken(name: string): string {
  const random = Math.random().toString(36).slice(2, 10)
  const hash = Buffer.from(`${name}-${Date.now()}-${Math.random()}`).toString('base64url').slice(0, 20)
  return `ps-${hash}-${random}`
}

function verifySignature(payload: any): boolean {
  const sign = payload.sign
  if (!sign) {
    console.warn('[Afdian] No signature in webhook payload')
    return false
  }

  const token = process.env.AFDIAN_TOKEN
  if (!token) {
    console.warn('[Afdian] AFDIAN_TOKEN not set. Set it in environment variables to enable signature verification.')
    return false
  }

  const payloadData = payload.data || {}
  const order = payloadData.order || {}
  const orderId = order.order_id || order.out_trade_no

  if (!orderId) {
    console.warn('[Afdian] Cannot verify signature: no order_id found in payload')
    return false
  }

  const expected = crypto.createHash('md5').update(orderId + token).digest('hex')
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sign))
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!verifySignature(body)) {
      console.warn('[Afdian] Invalid signature — possible spoofed request. Rejecting.')
      return NextResponse.json({ ec: 400, em: 'Invalid signature' }, { status: 401 })
    }

    const { type, data } = body
    const payloadData = data || body.data
    const payloadType = payloadData?.type || type

    if (payloadType !== 'order' && payloadType !== 'commerce_order') {
      return NextResponse.json({ ec: 200 })
    }

    const order = payloadData?.order || data?.order
    if (!order) {
      return NextResponse.json({ ec: 200 })
    }

    const outTradeNo = order.out_trade_no
    const orderId = order.order_id || outTradeNo
    const status = order.status
    const totalAmount = order.total_amount
    const planName = order.plan_title || 'Paper Summarizer Pro'
    const buyerName = order.buyer_name || 'Pro User'

    // Idempotency check
    if (await isDuplicateAfdian(orderId || outTradeNo)) {
      console.log(`[Afdian] Order ${outTradeNo} already processed, skipping (idempotency)`)
      return NextResponse.json({ ec: 200 })
    }

    if (status === 2 && totalAmount && parseInt(totalAmount, 10) > 0) {
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      const token = generateProToken(buyerName)

      await addToken({
        token,
        name: buyerName,
        plan: 'pro',
        maxRequests: 100,
        windowMs: 60 * 60 * 1000,
        expiresAt,
      })

      const orderMapping: OrderMapping = {
        orderId: orderId || outTradeNo,
        token,
        name: buyerName,
        paidAt: new Date().toISOString(),
        expiresAt,
        claimed: false,
      }

      await recordAfdianOrder(orderMapping)
      console.log(`[Afdian] Pro token created for order ${outTradeNo}: ${token}`)
    }

    return NextResponse.json({ ec: 200 })
  } catch (err) {
    console.error('[Afdian Webhook Error]', err)
    return NextResponse.json({ ec: 200 }, { status: 500 })
  }
}

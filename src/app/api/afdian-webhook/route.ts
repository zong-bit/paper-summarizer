import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { addToken } from '@/lib/tokens'
import fs from 'fs'
import path from 'path'

const AFDIAN_USER_ID = '6d58eee44d3011f1961952540025c377'

// Store order_id → token mappings
// Use /tmp on Vercel (serverless read-only filesystem)
const DATA_DIR = process.env.VERCEL ? path.join('/tmp', 'data') : path.join(process.cwd(), 'data')
const ORDER_FILE = path.join(DATA_DIR, 'afdian_orders.json')

interface OrderMapping {
  orderId: string
  token: string
  name: string
  paidAt: string
  expiresAt: string
  claimed: boolean
}

function loadOrders(): OrderMapping[] {
  try {
    const dir = path.dirname(ORDER_FILE)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    if (!fs.existsSync(ORDER_FILE)) return []
    return JSON.parse(fs.readFileSync(ORDER_FILE, 'utf-8'))
  } catch {
    return []
  }
}

function saveOrders(orders: OrderMapping[]) {
  fs.writeFileSync(ORDER_FILE, JSON.stringify(orders, null, 2))
}

function generateProToken(name: string): string {
  const random = Math.random().toString(36).slice(2, 10)
  const hash = Buffer.from(`${name}-${Date.now()}-${Math.random()}`).toString('base64url').slice(0, 20)
  return `ps-${hash}-${random}`
}

/**
 * Verify Afdian webhook signature.
 * Afdian sends a `sign` field in the JSON payload.
 * sign = MD5(order_id + AFDIAN_TOKEN)
 * Where AFDIAN_TOKEN is the user_token from Afdian developer settings.
 */
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

  // Try to find the order_id from the payload
  const payloadData = payload.data || {}
  const order = payloadData.order || {}
  const orderId = order.order_id || order.out_trade_no

  if (!orderId) {
    console.warn('[Afdian] Cannot verify signature: no order_id found in payload')
    return false
  }

  // Afdian signature: MD5(order_id + user_token)
  const expected = crypto.createHash('md5').update(orderId + token).digest('hex')
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sign))
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // ── Signature verification ──
    if (!verifySignature(body)) {
      console.warn('[Afdian] Invalid signature — possible spoofed request. Rejecting.')
      return NextResponse.json({ ec: 400, em: 'Invalid signature' }, { status: 401 })
    }

    const { type, data } = body

    // Afdian sends: { ec: 200, data: { type: "order", order: {...} } }
    const payloadData = data || body.data
    const payloadType = payloadData?.type || type

    // Only handle order events
    if (payloadType !== 'order' && payloadType !== 'commerce_order') {
      return NextResponse.json({ ec: 200 })
    }

    const order = payloadData?.order || data?.order
    if (!order) {
      return NextResponse.json({ ec: 200 })
    }

    const outTradeNo = order.out_trade_no
    const orderId = order.order_id || outTradeNo
    const status = order.status // 2 = paid
    const totalAmount = order.total_amount // in cents, 990 = ¥9.9
    const planName = order.plan_title || 'Paper Summarizer Pro'
    const buyerName = order.buyer_name || 'Pro User'

    // ── Idempotency check: skip if we already created a token for this order ──
    const existingOrders = loadOrders()
    if (existingOrders.find(o => o.orderId === (orderId || outTradeNo))) {
      console.log(`[Afdian] Order ${outTradeNo} already processed, skipping (idempotency)`)
      return NextResponse.json({ ec: 200 })
    }

    // Only process paid orders
    // Accept all positive amounts (flexible: support ¥9.9, ¥19.9, ¥29.9, etc.)
    const amountNum = parseInt(totalAmount, 10)
    if (status === 2 && amountNum > 0) {
      // Generate Pro token valid for 30 days
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      const token = generateProToken(buyerName)

      // Save token
      addToken({
        token,
        name: buyerName,
        plan: 'pro',
        maxRequests: 100,
        windowMs: 60 * 60 * 1000, // 1 hour window
        expiresAt,
      })

      // Save order mapping
      const orders = loadOrders()
      orders.push({
        orderId: orderId || outTradeNo,
        token,
        name: buyerName,
        paidAt: new Date().toISOString(),
        expiresAt,
        claimed: false,
      })
      saveOrders(orders)

      console.log(`[Afdian] Pro token created for order ${outTradeNo}: ${token}`)
    }

    // Afdian expects { ec: 200 } response
    return NextResponse.json({ ec: 200 })
  } catch (err) {
    console.error('[Afdian Webhook Error]', err)
    // Always return ec:200 even on error, afdian only checks this
    return NextResponse.json({ ec: 200 }, { status: 500 })
  }
}

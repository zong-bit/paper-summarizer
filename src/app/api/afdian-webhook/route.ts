import { NextResponse } from 'next/server'
import { addToken } from '@/lib/tokens'
import fs from 'fs'
import path from 'path'

const AFDIAN_USER_ID = '6d58eee44d3011f1961952540025c377'

// Store order_id → token mappings
const ORDER_FILE = path.join(process.cwd(), 'data', 'afdian_orders.json')

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

export async function POST(request: Request) {
  try {
    const body = await request.json()
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

    // Only process paid orders of ¥9.9
    if (status === 2 && totalAmount === '990') {
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

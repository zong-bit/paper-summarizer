import { NextResponse } from 'next/server'
import { findToken } from '@/lib/tokens'
import fs from 'fs'
import path from 'path'

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
    if (!fs.existsSync(ORDER_FILE)) return []
    return JSON.parse(fs.readFileSync(ORDER_FILE, 'utf-8'))
  } catch {
    return []
  }
}

function saveOrders(orders: OrderMapping[]) {
  fs.writeFileSync(ORDER_FILE, JSON.stringify(orders, null, 2))
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const orderId = searchParams.get('order_id')

  if (!orderId || orderId.length < 6) {
    return NextResponse.json(
      { valid: false, error: 'Please enter a valid order ID' },
      { status: 400 }
    )
  }

  // Look for this order in our webhook records
  const orders = loadOrders()
  const order = orders.find(o => o.orderId === orderId)

  if (!order) {
    return NextResponse.json(
      { valid: false, error: 'Order not found. It may take a few minutes for the payment to sync. If the issue persists, contact us at selina_zxw@qq.com' },
      { status: 404 }
    )
  }

  // Token should exist
  const tokenEntry = findToken(order.token)
  if (!tokenEntry) {
    return NextResponse.json(
      { valid: false, error: 'Token not found. Please contact support.' },
      { status: 404 }
    )
  }

  // Check expiry
  if (tokenEntry.expiresAt && new Date(tokenEntry.expiresAt) < new Date()) {
    return NextResponse.json(
      { valid: false, error: 'This token has expired.' },
      { status: 403 }
    )
  }

  // Mark claimed
  if (!order.claimed) {
    order.claimed = true
    saveOrders(orders)
  }

  return NextResponse.json({
    valid: true,
    token: order.token,
    plan: 'pro',
    expiresAt: tokenEntry.expiresAt,
    maxRequests: tokenEntry.maxRequests,
    windowMs: tokenEntry.windowMs,
    name: tokenEntry.name,
  })
}

import { NextResponse } from 'next/server'
import { findToken } from '@/lib/tokens'
import fs from 'fs'
import path from 'path'

const DATA_DIR = process.env.VERCEL ? path.join('/tmp', 'data') : path.join(process.cwd(), 'data')
const SALE_FILE = path.join(DATA_DIR, 'lemon_squeezy_sales.json')

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

function loadSales(): LemonSqueezySale[] {
  try {
    if (!fs.existsSync(SALE_FILE)) return []
    return JSON.parse(fs.readFileSync(SALE_FILE, 'utf-8'))
  } catch {
    return []
  }
}

/**
 * GET /api/lemon-squeezy-claim?order_id=<orderId>&email=<email>
 * Lemon Squeezy users can claim their token using their order ID or order number.
 * Optionally passing email for extra verification.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const orderId = searchParams.get('order_id')
  const email = searchParams.get('email')

  if (!orderId || orderId.length < 2) {
    return NextResponse.json(
      { valid: false, error: 'Please enter a valid order ID or order number' },
      { status: 400 }
    )
  }

  const sales = loadSales()

  // Try to match by orderId (the UUID-style Lemon Squeezy order ID)
  let sale = sales.find(s => s.orderId === orderId)

  // If not found by orderId, try matching by orderNumber (human-readable number)
  if (!sale) {
    const orderNumber = parseInt(orderId, 10)
    if (!isNaN(orderNumber)) {
      sale = sales.find(s => s.orderNumber === orderNumber)
    }
  }

  // If still not found, try matching by subscriptionId
  if (!sale) {
    sale = sales.find(s => s.subscriptionId === orderId)
  }

  if (!sale) {
    return NextResponse.json(
      {
        valid: false,
        error: 'Order not found. It may take a few minutes for the webhook to sync. If the issue persists, contact us at selina_zxw@qq.com',
      },
      { status: 404 }
    )
  }

  // Optional email verification
  if (email && sale.email !== email && sale.email !== 'unknown@email.com') {
    return NextResponse.json(
      { valid: false, error: 'Email does not match the order. Please use the email you paid with.' },
      { status: 403 }
    )
  }

  // Check refunded
  if (sale.refunded) {
    return NextResponse.json(
      { valid: false, error: 'This order has been refunded or cancelled. The token has been revoked.' },
      { status: 403 }
    )
  }

  // Token should exist
  const tokenEntry = findToken(sale.token)
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

  return NextResponse.json({
    valid: true,
    token: sale.token,
    plan: sale.plan || 'pro',
    expiresAt: tokenEntry.expiresAt,
    maxRequests: tokenEntry.maxRequests,
    windowMs: tokenEntry.windowMs,
    name: tokenEntry.name,
    variantName: sale.variantName,
    orderNumber: sale.orderNumber,
  })
}

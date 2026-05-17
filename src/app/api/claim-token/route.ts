import { NextResponse } from 'next/server'
import { findToken } from '@/lib/tokens'
import { getSupabaseAdmin } from '@/lib/supabase'

interface AfdianOrder {
  order_id: string
  token: string
  name: string
  paid_at: string
  expires_at: string | null
  claimed: boolean
}

interface GumroadSale {
  sale_id: string
  email: string
  product_name: string
  plan: string
  token: string
  price: number
  paid_at: string
  expires_at: string | null
  refunded: boolean
}

async function getAfdianOrder(orderId: string): Promise<AfdianOrder | null> {
  const supabase = getSupabaseAdmin()
  const { data } = await supabase
    .from('afdian_orders')
    .select('*')
    .eq('order_id', orderId)
    .maybeSingle()
  if (!data) return null
  return data as unknown as AfdianOrder
}

async function markAfdianClaimed(orderId: string): Promise<void> {
  const supabase = getSupabaseAdmin()
  await supabase
    .from('afdian_orders')
    .update({ claimed: true })
    .eq('order_id', orderId)
}

async function getGumroadSale(saleId: string): Promise<GumroadSale | null> {
  const supabase = getSupabaseAdmin()
  const { data } = await supabase
    .from('gumroad_sales')
    .select('*')
    .eq('sale_id', saleId)
    .maybeSingle()
  if (!data) return null
  return data as unknown as GumroadSale
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

  // First, look for this order in Afdian webhook records
  const order = await getAfdianOrder(orderId)

  if (order) {
    const tokenEntry = await findToken(order.token)
    if (!tokenEntry) {
      return NextResponse.json(
        { valid: false, error: 'Token not found. Please contact support.' },
        { status: 404 }
      )
    }

    if (order.expires_at && new Date(order.expires_at) < new Date()) {
      return NextResponse.json(
        { valid: false, error: 'This token has expired.' },
        { status: 403 }
      )
    }

    if (!order.claimed) {
      await markAfdianClaimed(order.order_id)
    }

    return NextResponse.json({
      valid: true,
      token: order.token,
      plan: 'pro',
      expiresAt: order.expires_at || tokenEntry.expiresAt,
      maxRequests: tokenEntry.maxRequests,
      windowMs: tokenEntry.windowMs,
      name: order.name,
    })
  }

  // If not found in Afdian, check Gumroad sales
  const sale = await getGumroadSale(orderId)

  if (!sale) {
    return NextResponse.json(
      { valid: false, error: 'Order not found. It may take a few minutes for the payment to sync. If the issue persists, contact us at selina_zxw@qq.com' },
      { status: 404 }
    )
  }

  if (sale.refunded) {
    return NextResponse.json(
      { valid: false, error: 'This order has been refunded. The token has been revoked.' },
      { status: 403 }
    )
  }

  const tokenEntry = await findToken(sale.token)
  if (!tokenEntry) {
    return NextResponse.json(
      { valid: false, error: 'Token not found. Please contact support.' },
      { status: 404 }
    )
  }

  if (sale.expires_at && new Date(sale.expires_at) < new Date()) {
    return NextResponse.json(
      { valid: false, error: 'This token has expired.' },
      { status: 403 }
    )
  }

  return NextResponse.json({
    valid: true,
    token: sale.token,
    plan: sale.plan || 'pro',
    expiresAt: sale.expires_at || tokenEntry.expiresAt,
    maxRequests: tokenEntry.maxRequests,
    windowMs: tokenEntry.windowMs,
    name: sale.product_name || tokenEntry.name,
  })
}

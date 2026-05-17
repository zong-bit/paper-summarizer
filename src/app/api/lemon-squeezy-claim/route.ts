import { NextResponse } from 'next/server'
import { findToken } from '@/lib/tokens'
import { getSupabaseAdmin } from '@/lib/supabase'

interface LemonSqueezySale {
  order_id: string
  order_number: number
  email: string
  variant_name: string
  variant_id: number
  plan: string
  token: string
  total: number
  currency: string
  paid_at: string
  expires_at: string | null
  refunded: boolean
  subscription_id?: string
  subscription_status?: string
}

async function getLSSale(orderId: string): Promise<LemonSqueezySale | null> {
  const supabase = getSupabaseAdmin()

  // Try by order_id first
  let { data } = await supabase
    .from('lemon_squeezy_sales')
    .select('*')
    .eq('order_id', orderId)
    .maybeSingle()
  if (data) return data as unknown as LemonSqueezySale

  // Try by order_number
  const orderNumber = parseInt(orderId, 10)
  if (!isNaN(orderNumber)) {
    ;({ data } = await supabase
      .from('lemon_squeezy_sales')
      .select('*')
      .eq('order_number', orderNumber)
      .maybeSingle())
    if (data) return data as unknown as LemonSqueezySale
  }

  // Try by subscription_id
  ;({ data } = await supabase
    .from('lemon_squeezy_sales')
    .select('*')
    .eq('subscription_id', orderId)
    .maybeSingle())
  if (data) return data as unknown as LemonSqueezySale

  return null
}

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

  const sale = await getLSSale(orderId)

  if (!sale) {
    return NextResponse.json(
      { valid: false, error: 'Order not found. It may take a few minutes for the webhook to sync. If the issue persists, contact us at selina_zxw@qq.com' },
      { status: 404 }
    )
  }

  if (email && sale.email !== email && sale.email !== 'unknown@email.com') {
    return NextResponse.json(
      { valid: false, error: 'Email does not match the order. Please use the email you paid with.' },
      { status: 403 }
    )
  }

  if (sale.refunded) {
    return NextResponse.json(
      { valid: false, error: 'This order has been refunded or cancelled. The token has been revoked.' },
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
    name: tokenEntry.name,
    variantName: sale.variant_name,
    orderNumber: sale.order_number,
  })
}

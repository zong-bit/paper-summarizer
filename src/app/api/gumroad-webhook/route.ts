import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createToken, findToken } from '@/lib/tokens'
import { getSupabaseAdmin } from '@/lib/supabase'

interface GumroadSale {
  saleId: string
  email: string
  productName: string
  plan: string
  token: string
  price: number
  paidAt: string
  expiresAt: string
  refunded: boolean
}

/**
 * Verify Gumroad Ping signature.
 * Gumroad sends X-Gumroad-Signature header = HMAC-SHA256(secret, raw body) as hex.
 */
function verifySignature(rawBody: string, signature: string | null): boolean {
  if (!signature) return false
  const secret = process.env.GUMROAD_SECRET
  if (!secret) {
    console.warn('[Gumroad] GUMROAD_SECRET not set, skipping signature verification')
    return true // skip verification if not configured
  }
  const expected = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex')
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
}

/**
 * Determine the plan ID from the Gumroad product name/permalink.
 * Returns 'pro-monthly' or 'pro-yearly', or null if unrecognised.
 */
function detectPlan(productName: string, permalink?: string): 'pro-monthly' | 'pro-yearly' | null {
  const lower = (productName || '').toLowerCase()
  const link = (permalink || '').toLowerCase()

  if (lower.includes('yearly') || lower.includes('annual') || link.includes('yearly') || link.includes('annual')) {
    return 'pro-yearly'
  }
  if (lower.includes('monthly') || lower.includes('month') || link.includes('monthly') || link.includes('month')) {
    return 'pro-monthly'
  }
  // Default: pro-monthly
  return 'pro-monthly'
}

/**
 * Check if a sale has already been processed (idempotency).
 * Stores sale records in Supabase `gumroad_sales` table.
 */
async function isDuplicate(saleId: string): Promise<boolean> {
  const supabase = getSupabaseAdmin()
  const { data } = await supabase
    .from('gumroad_sales')
    .select('id')
    .eq('sale_id', saleId)
    .single()
  return !!data
}

async function recordSale(sale: GumroadSale): Promise<void> {
  const supabase = getSupabaseAdmin()
  await supabase.from('gumroad_sales').insert({
    sale_id: sale.saleId,
    email: sale.email,
    product_name: sale.productName,
    plan: sale.plan,
    token: sale.token,
    price: sale.price,
    paid_at: sale.paidAt,
    expires_at: sale.expiresAt,
    refunded: sale.refunded,
  })
}

async function markRefunded(saleId: string): Promise<void> {
  const supabase = getSupabaseAdmin()
  await supabase
    .from('gumroad_sales')
    .update({ refunded: true })
    .eq('sale_id', saleId)
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.clone().text()
    const signature = request.headers.get('X-Gumroad-Signature')

    if (!verifySignature(rawBody, signature)) {
      console.warn('[Gumroad] Invalid signature — possible spoofed request. Rejecting.')
      return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 401 })
    }

    let payload: any
    try {
      payload = JSON.parse(rawBody)
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 })
    }

    const saleId = payload.sale_id || payload.id
    const email = payload.email || payload.payer_email
    const productName = payload.product_name || payload.product?.name || 'Paper Summarizer Pro'
    const permalink = payload.permalink || payload.product?.permalink
    const price = parseFloat(payload.price || payload.sale_price || '9.99')
    const refunded = payload.refunded === true || payload.chargebacked === true

    console.log(`[Gumroad] Sale received:`, { saleId, email, productName, price, refunded })

    // Handle refunds
    if (refunded) {
      await markRefunded(saleId)
      console.log(`[Gumroad] Sale ${saleId} refunded, token marked as refunded`)
      return NextResponse.json({ success: true })
    }

    // Idempotency check
    if (await isDuplicate(saleId)) {
      console.log(`[Gumroad] Sale ${saleId} already processed, skipping`)
      return NextResponse.json({ success: true })
    }

    const planId = detectPlan(productName, permalink)
    if (!planId) {
      console.warn(`[Gumroad] Unknown product: ${productName}, defaulting to pro-monthly`)
    }

    const tokenEntry = await createToken(planId || 'pro-monthly', email || 'Gumroad User')

    const sale: GumroadSale = {
      saleId: saleId || `gr-${Date.now()}`,
      email: email || 'unknown@email.com',
      productName,
      plan: planId || 'pro-monthly',
      token: tokenEntry.token,
      price,
      paidAt: new Date().toISOString(),
      expiresAt: tokenEntry.expiresAt!,
      refunded: false,
    }

    await recordSale(sale)

    console.log(`[Gumroad] Token created for ${email}: ${tokenEntry.token} (plan: ${planId})`)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[Gumroad Webhook Error]', err)
    return NextResponse.json({ success: true })
  }
}

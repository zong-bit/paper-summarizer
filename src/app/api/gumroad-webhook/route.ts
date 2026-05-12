import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createToken, findToken } from '@/lib/tokens'
import fs from 'fs'
import path from 'path'

// Use /tmp on Vercel (serverless read-only filesystem)
const DATA_DIR = process.env.VERCEL ? path.join('/tmp', 'data') : path.join(process.cwd(), 'data')
const SALE_FILE = path.join(DATA_DIR, 'gumroad_sales.json')

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

function loadSales(): GumroadSale[] {
  try {
    const dir = path.dirname(SALE_FILE)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    if (!fs.existsSync(SALE_FILE)) return []
    return JSON.parse(fs.readFileSync(SALE_FILE, 'utf-8'))
  } catch {
    return []
  }
}

function saveSales(sales: GumroadSale[]) {
  const dir = path.dirname(SALE_FILE)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(SALE_FILE, JSON.stringify(sales, null, 2))
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

export async function POST(request: Request) {
  try {
    // Gumroad sends a POST with JSON body
    // We need the raw body for signature verification
    const rawBody = await request.clone().text()
    const signature = request.headers.get('X-Gumroad-Signature')

    // Verify signature
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

    // Handle refunds — delete the token
    if (refunded) {
      const sales = loadSales()
      const existing = sales.find(s => s.saleId === saleId)
      if (existing) {
        existing.refunded = true
        saveSales(sales)
        console.log(`[Gumroad] Sale ${saleId} refunded, token marked as refunded`)
      }
      return NextResponse.json({ success: true })
    }

    // Skip if we already processed this sale
    const existingSales = loadSales()
    if (existingSales.find(s => s.saleId === saleId)) {
      console.log(`[Gumroad] Sale ${saleId} already processed, skipping`)
      return NextResponse.json({ success: true })
    }

    // Detect which plan was purchased
    const planId = detectPlan(productName, permalink)
    if (!planId) {
      console.warn(`[Gumroad] Unknown product: ${productName}, defaulting to pro-monthly`)
    }

    // Create the token
    const tokenEntry = createToken(planId || 'pro-monthly', email || 'Gumroad User')

    // Persist the sale record
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
    existingSales.push(sale)
    saveSales(existingSales)

    console.log(`[Gumroad] Token created for ${email}: ${tokenEntry.token} (plan: ${planId})`)

    // Return 200 — Gumroad expects success
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[Gumroad Webhook Error]', err)
    // Always return 200 so Gumroad doesn't keep retrying
    return NextResponse.json({ success: true })
  }
}

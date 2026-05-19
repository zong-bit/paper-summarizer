import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

/**
 * Auto-activate Pro subscription for a logged-in user.
 *
 * Flow:
 * 1. Look up gumroad_sales by the user's email
 * 2. If found and not refunded, create a subscription record linked to the user
 * 3. Link the existing token to the user's account
 * 4. Return success/failure
 *
 * Called from: account page (client) or login redirect
 */

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

async function findGumroadSaleByEmail(email: string): Promise<GumroadSale | null> {
  const supabase = getSupabaseAdmin()
  const { data } = await supabase
    .from('gumroad_sales')
    .select('*')
    .eq('email', email)
    .eq('refunded', false)
    .order('paid_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!data) return null
  return data as unknown as GumroadSale
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const userId = body?.userId as string
    const userEmail = body?.userEmail as string

    if (!userId || !userEmail) {
      return NextResponse.json(
        { success: false, error: 'userId and userEmail are required' },
        { status: 400 }
      )
    }

    // Check if user already has an active Pro subscription
    const supabase = getSupabaseAdmin()

    const { data: existingSub } = await supabase
      .from('subscriptions')
      .select('id, plan, status')
      .eq('user_id', userId)
      .eq('status', 'active')
      .limit(1)
      .maybeSingle()

    if (existingSub?.plan === 'pro') {
      return NextResponse.json({
        success: true,
        alreadyPro: true,
        message: 'Already a Pro user',
      })
    }

    // Look up Gumroad sale by email
    const sale = await findGumroadSaleByEmail(userEmail)

    if (!sale) {
      return NextResponse.json({
        success: true,
        activated: false,
        message: 'No purchase record found. If you recently purchased, please try again in a few minutes.',
      })
    }

    // Check if the token is already linked to this user
    const { data: existingToken } = await supabase
      .from('tokens')
      .select('id')
      .eq('token', sale.token)
      .eq('user_id', userId)
      .maybeSingle()

    if (existingToken) {
      // Token already linked — just update subscription
      await updateSubscriptionToPro(supabase, userId, sale)
      return NextResponse.json({
        success: true,
        activated: false,
        message: 'Your Pro subscription is already active.',
      })
    }

    // Create/activate Pro subscription
    await activateProSubscription(supabase, userId, sale)

    // Link the token to the user's account
    await linkTokenToUser(supabase, sale.token, userId)

    console.log(`[Auto-activate] Pro activated for user ${userId} (email: ${userEmail}), sale: ${sale.sale_id}`)

    return NextResponse.json({
      success: true,
      activated: true,
      plan: sale.plan,
      expiresAt: sale.expires_at,
      maxRequests: 500,
      token: sale.token,
      message: '🎉 Pro Activated! Unlimited summaries are now available.',
    })
  } catch (err) {
    console.error('[Auto-activate Error]', err)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function activateProSubscription(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  userId: string,
  sale: GumroadSale,
): Promise<void> {
  // Check if user already has a subscription record
  const { data: existingSub } = await supabase
    .from('subscriptions')
    .select('id')
    .eq('user_id', userId)
    .limit(1)
    .maybeSingle()

  if (existingSub) {
    // Update existing subscription
    await supabase
      .from('subscriptions')
      .update({
        plan: 'pro',
        status: 'active',
        source: 'paper-summarizer',
        gumroad_order_id: sale.sale_id,
        expires_at: sale.expires_at,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
  } else {
    // Create new subscription
    await supabase.from('subscriptions').insert({
      user_id: userId,
      plan: 'pro',
      status: 'active',
      source: 'paper-summarizer',
      gumroad_order_id: sale.sale_id,
      expires_at: sale.expires_at,
    })
  }

  // Note: users table plan column may not exist — subscription is the source of truth
}

async function updateSubscriptionToPro(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  userId: string,
  sale: GumroadSale,
): Promise<void> {
  await supabase
    .from('subscriptions')
    .update({
      plan: 'pro',
      status: 'active',
      source: 'paper-summarizer',
      gumroad_order_id: sale.sale_id,
      expires_at: sale.expires_at,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .eq('status', 'active')
}

async function linkTokenToUser(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  tokenStr: string,
  userId: string,
): Promise<void> {
  await supabase
    .from('tokens')
    .update({
      user_id: userId,
      updated_at: new Date().toISOString(),
    })
    .eq('token', tokenStr)
}

import { NextResponse } from 'next/server'

// Price IDs for Paper Summarizer Pro
// Note: Only monthly price ID available - yearly needs to be created in Paddle dashboard
const PRICES = {
  monthly: 'pri_01krwnhrp61mddw9hb4rj7k40b',
  yearly: 'pri_01krwnhrp61mddw9hb4rj7k40b', // TODO: Add yearly price ID when created
}

// Paddle checkout URLs (direct link to Paddle checkout page)
const PADDLE_CHECKOUT_BASE = 'https://buy.paddle.com'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const plan = searchParams.get('plan') // 'monthly' or 'yearly'
  const priceId = PRICES[plan as keyof typeof PRICES]

  if (!priceId) {
    return NextResponse.json({ error: 'Invalid plan. Use "monthly" or "yearly".' }, { status: 400 })
  }

  // Build Paddle checkout URL directly (no API key needed)
  const checkoutUrl = `${PADDLE_CHECKOUT_BASE}?aid=${priceId}`

  return NextResponse.json({
    checkoutUrl,
    plan,
    priceId,
  })
}

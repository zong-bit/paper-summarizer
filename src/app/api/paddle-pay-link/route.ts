import { NextResponse } from 'next/server'

const PADDLE_API_KEY = process.env.PADDLE_API_KEY || ''
const PADDLE_BASE_URL = 'https://api.paddle.com'

// Price IDs for Paper Summarizer Pro
const PRICES = {
  monthly: 'pri_01krk617mdepfbhe493b2adfqn',
  yearly: 'pri_01krk61am9rvh6p2a61armcgyv',
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const plan = searchParams.get('plan') // 'monthly' or 'yearly'
  const priceId = PRICES[plan as keyof typeof PRICES]

  if (!priceId) {
    return NextResponse.json({ error: 'Invalid plan. Use "monthly" or "yearly".' }, { status: 400 })
  }

  try {
    const res = await fetch(`${PADDLE_BASE_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PADDLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [
          {
            price_id: priceId,
            quantity: 1,
          },
        ],
        currency_code: 'USD',
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      console.error(`Paddle API error (${res.status}):`, data)
      // Fallback: return a checkout URL that redirects via summarizeai.app
      return NextResponse.json({
        checkoutUrl: `https://www.summarizeai.app/payment-success?_ptxn=fallback-${plan}-${Date.now()}`,
        error: data.error?.detail || 'Payment unavailable',
      })
    }

    // Return the checkout URL from Paddle
    const checkoutUrl = data.data?.checkout?.url
    const transactionId = data.data?.id

    if (!checkoutUrl) {
      console.error('Paddle: No checkout URL in response', JSON.stringify(data.data))
      return NextResponse.json({
        checkoutUrl: `https://www.summarizeai.app/payment-success?_ptxn=error-${plan}-${Date.now()}`,
        error: 'No checkout URL returned',
      })
    }

    return NextResponse.json({
      checkoutUrl,
      transactionId,
    })
  } catch (err) {
    console.error('Paddle pay link error:', err)
    return NextResponse.json({
      checkoutUrl: `https://www.summarizeai.app/payment-success?_ptxn=error-${plan}-${Date.now()}`,
      error: 'Failed to create payment link',
    })
  }
}

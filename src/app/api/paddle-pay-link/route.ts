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

  // Try to create a pay link via Paddle API
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
        type: 'subscription',
        payment_link: true,
      }),
    })

    const data = await res.json()

    if (data.data && data.data.payment_link) {
      return NextResponse.json({ url: data.data.payment_link })
    }

    // If no default payment link is set in Paddle dashboard, return the direct checkout URL
    // Fallback: use Paddle's price-based checkout URL pattern
    return NextResponse.json({
      url: `https://checkout.paddle.com/start/${priceId}`,
    })
  } catch (err) {
    // Fallback to direct price-based checkout URL
    return NextResponse.json({
      url: `https://checkout.paddle.com/start/${priceId}`,
    })
  }
}

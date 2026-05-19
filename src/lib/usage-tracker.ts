import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function trackUsage(params: {
  source: 'paper-summarizer' | 'fatewise'
  endpoint: string
  ip?: string
  userId?: string
  isPro?: boolean
}) {
  try {
    await supabase.from('api_usage').insert({
      source: params.source,
      endpoint: params.endpoint,
      ip: params.ip,
      user_id: params.userId,
      is_pro: params.isPro || false,
    })
  } catch (e) {
    // Silent fail — don't block API
  }
}

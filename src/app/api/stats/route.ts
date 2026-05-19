import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const today = new Date().toISOString().split('T')[0]

    const [todayRes, totalRes, ipsRes] = await Promise.all([
      supabase
        .from('api_usage')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', today),
      supabase
        .from('api_usage')
        .select('id', { count: 'exact', head: true }),
      supabase
        .from('api_usage')
        .select('ip'),
    ])

    const uniqueIps = new Set((ipsRes.data || []).map(r => r.ip).filter(Boolean))

    return NextResponse.json({
      today: todayRes.count || 0,
      total: totalRes.count || 0,
      uniqueIps: uniqueIps.size,
    })
  } catch {
    return NextResponse.json({ today: 0, total: 0, uniqueIps: 0 })
  }
}

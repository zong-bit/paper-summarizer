import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')
  
  const info: any = {
    supabase_url_configured: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabase_anon_configured: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    has_auth_header: !!authHeader,
    has_token: !!token,
    node_env: process.env.NODE_ENV,
  }
  
  // If token provided, try to verify it
  if (token) {
    try {
      const supabase = getSupabaseAdmin()
      const { data, error } = await supabase.auth.getUser(token)
      info.user_verification = {
        success: !error,
        user: data?.user ? { id: data.user.id, email: data.user.email } : null,
        error: error?.message,
      }
    } catch (err: any) {
      info.user_verification = { success: false, error: err.message }
    }
  }
  
  // Also check if we can query the users table
  try {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true })
    info.users_table_status = {
      accessible: !error,
      error: error?.message,
      count: data,
    }
  } catch (err: any) {
    info.users_table_status = { accessible: false, error: err.message }
  }
  
  return NextResponse.json(info)
}

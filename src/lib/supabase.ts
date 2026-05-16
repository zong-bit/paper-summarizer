import { createClient, SupabaseClient, AuthUser } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Global singleton key to survive Next.js chunk bundary
const GLOBAL_KEY = '__paper_summarizer_supabase_client'

// Client-side (browser) — uses anon key, for auth flows
export function getSupabaseClient(): SupabaseClient {
  // Use globalThis to share instance across Next.js chunk boundaries
  // (module-level singletons get duplicated per chunk during code-splitting)
  if (typeof globalThis !== 'undefined' && (globalThis as any)[GLOBAL_KEY]) {
    return (globalThis as any)[GLOBAL_KEY]
  }
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Supabase config missing: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.production'
    )
  }
  const client = createClient(supabaseUrl, supabaseAnonKey)
  if (typeof globalThis !== 'undefined') {
    (globalThis as any)[GLOBAL_KEY] = client
  }
  return client
}

// Server-side (API routes) — uses service role key, bypasses RLS
export function getSupabaseAdmin(): SupabaseClient {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error(
      'Supabase config missing: set SUPABASE_SERVICE_ROLE_KEY in .env.local'
    )
  }
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false },
  })
}

// Auth helpers for server-side
// Note: auth.admin APIs (getUser, getUserByToken) are not available in @supabase/supabase-js v2
// For server-side user lookup, use the service role key with direct REST API calls
// or use the `auth.getUser()` method which works with the service role key

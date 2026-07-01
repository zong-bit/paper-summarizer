import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

// ── Auth helper: extract user_id from service-role key ──
async function getUserIdFromRequest(request: Request): Promise<string | null> {
  const authHeader = request.headers.get('authorization') || ''
  const tokenMatch = authHeader.match(/^Bearer\s+(\S+)$/)
  const token = tokenMatch ? tokenMatch[1] : null

  if (!token) return null

  // Use service role key to verify user via Supabase REST API
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl || !process.env.SUPABASE_SERVICE_ROLE_KEY) return null

  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/user`, {
      method: 'GET',
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
    })
    if (!res.ok) return null
    const data = await res.json()
    return data?.id ?? null
  } catch {
    return null
  }
}

export async function GET(request: Request) {
  const userId = await getUserIdFromRequest(request)
  if (!userId) {
    // Return empty array for unauthenticated visitors so the library page
    // shows the CTA "No saved papers yet" instead of a blank page.
    return NextResponse.json([])
  }

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from('library')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Library GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch library' }, { status: 500 })
  }

  return NextResponse.json(data ?? [])
}

export async function POST(request: Request) {
  const userId = await getUserIdFromRequest(request)
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: any
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { title, content, source, source_url, domain } = body

  if (!title || !content) {
    return NextResponse.json({ error: 'Title and content are required' }, { status: 400 })
  }

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from('library')
    .insert({
      user_id: userId,
      title,
      content,
      source: source || 'paste',
      source_url: source_url || null,
      domain: domain || 'general',
    })
    .select()
    .single()

  if (error) {
    console.error('Library POST error:', error)
    return NextResponse.json({ error: 'Failed to save library item' }, { status: 500 })
  }

  return NextResponse.json({ item: data }, { status: 201 })
}

export async function DELETE(request: Request) {
  const userId = await getUserIdFromRequest(request)
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 })
  }

  const supabase = getSupabaseAdmin()
  const { error } = await supabase
    .from('library')
    .delete()
    .match({ id, user_id: userId })

  if (error) {
    console.error('Library DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete library item' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

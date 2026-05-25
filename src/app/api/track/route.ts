/**
 * Page View Tracker API for Paper Summarizer
 * 记录页面访问到 Supabase page_views 表。
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xgaxejeaxfhlupguqteu.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { path, referrer, userAgent } = body as {
      path?: string;
      referrer?: string;
      userAgent?: string;
    };

    if (!path) {
      return NextResponse.json({ error: 'path is required' }, { status: 400 });
    }

    if (!SUPABASE_SERVICE_KEY) {
      console.warn('[page-view-tracker] SUPABASE_SERVICE_ROLE_KEY not configured');
      return NextResponse.json({ ok: true, note: 'service key not configured, tracking skipped' });
    }

    const client = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    const forwarded = req.headers.get('x-forwarded-for') || '';
    const ip = forwarded.split(',')[0].trim() || '';

    const { error } = await client
      .from('page_views')
      .insert({
        path,
        referrer: referrer || '',
        user_agent: userAgent || '',
        ip,
      });

    if (error) {
      console.error('[page-view-tracker] Supabase insert error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[page-view-tracker] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Page View Tracker API — POST to /api/track' });
}

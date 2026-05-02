import { NextResponse } from 'next/server'
import type { ApiLog } from '@/lib/api-types'
import { getLogBuffer } from '@/lib/api-logger'

export async function GET(request: Request) {
  // Simple auth: require LOGS_API_TOKEN env var as Bearer token or ?token= param
  const authHeader = request.headers.get('authorization')?.replace('Bearer ', '')
  const authQuery = new URL(request.url).searchParams.get('token')
  const authToken = process.env.LOGS_API_TOKEN

  if (authToken && authHeader !== authToken && authQuery !== authToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Try KV first for persistence across cold starts
  let logs: ApiLog[] = []
  let source = 'memory'

  try {
    const { kv } = await import('@vercel/kv')
    const raw = await kv.lrange('api:logs', 0, 99)
    if (raw && raw.length > 0) {
      logs = raw.map((r: string) => JSON.parse(r))
      source = 'kv'
    }
  } catch {
    // KV not available — fall back to in-memory buffer
    logs = getLogBuffer()
  }

  // If KV returned empty, fallback to memory
  if (logs.length === 0) {
    logs = getLogBuffer()
  }

  // Apply filters
  const url = new URL(request.url)
  const statusFilter = url.searchParams.get('status')
  const since = url.searchParams.get('since')
  const limit = Math.min(Number(url.searchParams.get('limit')) || 50, 100)

  if (statusFilter) {
    logs = logs.filter(l => l.status === statusFilter)
  }
  if (since) {
    logs = logs.filter(l => l.timestamp >= since)
  }
  logs = logs.slice(0, limit)

  return NextResponse.json({ logs, source, count: logs.length })
}

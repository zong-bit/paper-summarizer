import { NextResponse } from 'next/server'
import type { ApiLog } from '../summarize/route'

type LogsResponse = {
  logs: ApiLog[]
  source: string
  count: number
}

export async function GET(request: Request) {
  // Basic auth check: require a secret token in query param or Authorization header
  const authHeader = request.headers.get('authorization')?.replace('Bearer ', '')
  const authQuery = new URL(request.url).searchParams.get('token')
  const authToken = process.env.LOGS_API_TOKEN

  if (authToken && authHeader !== authToken && authQuery !== authToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let logs: ApiLog[] = []
  let source = 'none'

  try {
    const { kv } = await import('@vercel/kv')
    const raw = await kv.lrange('api:logs', 0, 99)
    source = 'kv'
    logs = raw.map((r: string) => JSON.parse(r))
  } catch (e) {
    // KV not available — return empty
    console.error('KV read error:', e)
  }

  // Apply optional filters
  const url = new URL(request.url)
  const statusFilter = url.searchParams.get('status')
  const since = url.searchParams.get('since') // ISO timestamp
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

import type { ApiLog } from './api-types'

const MAX_LOGS = 200
const logBuffer: ApiLog[] = []
let kvInitialized = false
let kvAvailable = false

async function tryGetKv(): Promise<boolean> {
  if (kvInitialized) return kvAvailable
  kvInitialized = true
  try {
    const mod = await import('@vercel/kv')
    const store = mod.kv
    await store.ping()
    kvAvailable = true
    return true
  } catch {
    kvAvailable = false
    return false
  }
}

export async function logApiCall(log: Omit<ApiLog, 'id'>): Promise<void> {
  const entry: ApiLog = {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    ...log,
  }

  // Always store in the in-memory ring buffer
  logBuffer.unshift(entry)
  if (logBuffer.length > MAX_LOGS) logBuffer.length = MAX_LOGS

  // Fire & forget to KV if available
  if (await tryGetKv()) {
    try {
      const { kv } = await import('@vercel/kv')
      await kv.lpush('api:logs', JSON.stringify(entry))
      await kv.ltrim('api:logs', 0, MAX_LOGS - 1)
    } catch {
      // KV write failed — memory buffer is fine
    }
  }
}

export function getLogBuffer(): ApiLog[] {
  return logBuffer
}

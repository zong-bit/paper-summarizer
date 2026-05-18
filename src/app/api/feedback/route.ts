import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const LOG_FILE = path.join('/tmp', 'feedback.log')

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { description, email, url } = body as {
      description?: string
      email?: string
      url?: string
    }

    if (!description || !description.trim()) {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      )
    }

    const timestamp = new Date().toISOString()
    const logEntry = `[${timestamp}] url: ${url || 'N/A'} | email: ${email || 'N/A'} | ${description}\n`

    fs.appendFileSync(LOG_FILE, logEntry)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Feedback API error:', err)
    return NextResponse.json(
      { error: 'Failed to submit feedback' },
      { status: 500 }
    )
  }
}

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Supabase stores auth cookies with pattern: sb-{projectRef}-auth-token
// We also check the legacy 'token' cookie name for compatibility.
const SUPABASE_COOKIE_PREFIX = 'sb-'
const LEGACY_TOKEN_COOKIE = 'token'

function hasAuthCookie(request: NextRequest): boolean {
  // Check for common Supabase auth cookie names
  // Supabase stores auth cookies with pattern: sb-{projectRef}-auth-token
  // We check common variants to be compatible with different Supabase versions
  const cookieNames = [
    'sb-auth-token',
    'sb-auth-token0',
    'sb-auth-token1',
    'auth-token',
    LEGACY_TOKEN_COOKIE,
  ]
  for (const name of cookieNames) {
    if (request.cookies.get(name)?.value) {
      return true
    }
  }
  return false
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protected routes
  if (pathname.startsWith('/dashboard')) {
    if (!hasAuthCookie(request)) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Redirect logged-in users away from login/signup
  if (pathname === '/login' || pathname === '/signup') {
    if (hasAuthCookie(request)) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup'],
}

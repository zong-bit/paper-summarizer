import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protected routes
  if (pathname.startsWith('/dashboard')) {
    const token = request.cookies.get('sb-auth-token')?.value ||
                  request.cookies.get('token')?.value

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Redirect logged-in users away from login/signup
  if (pathname === '/login' || pathname === '/signup') {
    const token = request.cookies.get('sb-auth-token')?.value ||
                  request.cookies.get('token')?.value
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup'],
}

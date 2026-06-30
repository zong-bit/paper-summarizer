import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Create Supabase client for middleware (server-side cookie handling)
function createMiddlewareClient(request: NextRequest) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
          })
        },
      },
    },
  )
}

// Open routes that do NOT require authentication
const OPEN_PATHS = [
  '/',
  '/login',
  '/signup',
  '/api/',
  '/privacy',
  '/terms',
  '/refund',
  '/premium',
  '/buy',
  '/about',
  '/blog',
  '/tools',
  '/library',
  '/og',
  '/sitemap',
  '/robots.txt',
  '/images/',
  '/fonts/',
  '/icons/',
]

// Open static file patterns
const OPEN_STATIC_PATTERNS = [
  '/_next/',
  '/favicon',
  '/og-image',
  '/manifest',
  '/.well-known/',
]

// Open file extension patterns (static assets)
const OPEN_FILE_EXTENSIONS = [
  '.svg',
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.gif',
  '.ico',
  '.css',
  '.js',
  '.json',
  '.xml',
  '.woff',
  '.woff2',
  '.ttf',
  '.eot',
]

function isPublicPath(pathname: string): boolean {
  for (const p of OPEN_PATHS) {
    if (p === '/' ? pathname === '/' : pathname.startsWith(p)) {
      return true
    }
  }
  for (const p of OPEN_STATIC_PATTERNS) {
    if (pathname.startsWith(p)) {
      return true
    }
  }
  for (const ext of OPEN_FILE_EXTENSIONS) {
    if (pathname.endsWith(ext)) {
      return true
    }
  }
  return false
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow all public paths
  if (isPublicPath(pathname)) {
    return NextResponse.next()
  }

  // Create Supabase client and check auth via cookies
  const supabase = createMiddlewareClient(request)
  const { data: { session } } = await supabase.auth.getSession()

  // All other routes require authentication
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect logged-in users away from login/signup
  if (pathname === '/login' || pathname === '/signup') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!.*\\..*|_next|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.css$|.*\\.js$).*)'],
}

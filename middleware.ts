import { NextRequest, NextResponse } from 'next/server'
import { verifyJWT } from '@/lib/auth/jwt'

// Define routes that require authentication
const protectedRoutes = ['/dashboard', '/profile', '/protected']
const authRoutes = ['/auth/login', '/auth/register', '/auth/verify']

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const token = request.cookies.get('auth-token')?.value

  // Check if it's an auth route
  if (authRoutes.some(route => pathname.startsWith(route))) {
    // If user is already authenticated, redirect to dashboard
    if (token) {
      try {
        await verifyJWT(token)
        return NextResponse.redirect(new URL('/dashboard', request.url))
      } catch {
        // Token is invalid, let them proceed to auth pages
        return NextResponse.next()
      }
    }
    return NextResponse.next()
  }

  // Check if it's a protected route
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    try {
      const payload = await verifyJWT(token)
      
      // Check if user is verified
      if (!payload.isVerified) {
        return NextResponse.redirect(new URL('/auth/verify', request.url))
      }

      // Add user info to headers for use in components
      const response = NextResponse.next()
      response.headers.set('x-user-id', payload.userId)
      response.headers.set('x-user-email', payload.email)
      return response
    } catch {
      // Token is invalid, clear cookie and redirect to login
      const response = NextResponse.redirect(new URL('/auth/login', request.url))
      response.cookies.delete('auth-token')
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
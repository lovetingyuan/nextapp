import { betterFetch } from '@better-fetch/fetch'
import type { auth } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

type Session = typeof auth.$Infer.Session

export async function middleware(request: NextRequest) {
  console.log('Middleware executing for path:', request.nextUrl.pathname)

  try {
    const cookie = request.headers.get('cookie') || ''

    const { data: session } = await betterFetch<Session>('/api/auth/get-session', {
      baseURL: request.nextUrl.origin,
      headers: {
        cookie,
      },
    })

    console.log('Session status:', session ? 'Authenticated' : 'Not authenticated')

    if (!session) {
      const redirectUrl = new URL('/music/sign-in', request.url)
      redirectUrl.searchParams.set('redirect', request.url)
      console.log('Redirecting to:', redirectUrl.toString())
      return NextResponse.redirect(redirectUrl)
    }
    if (!session.user.emailVerified) {
      const redirectUrl = new URL('/music/verify-email', request.url)
      return NextResponse.redirect(redirectUrl)
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.error()
  }
}

export const config = {
  matcher: [],
  // matcher: ['/music/app/:path*'], // Apply middleware to specific routes
}

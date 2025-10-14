import { NextResponse, NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request , secret: process.env.NEXTAUTH_SECRET})
  const url = request.nextUrl
  const isAuthPath = url.pathname.startsWith('/auth')
  const isDashboardPath = url.pathname.startsWith('/user-dashboard')
  const isDashboardRoot = url.pathname === '/user-dashboard'
  if (token) {
    if (isAuthPath) {
      return NextResponse.redirect(new URL('/user-dashboard/messages', request.url))
    }
    if (isDashboardRoot) {
      return NextResponse.redirect(new URL('/user-dashboard/messages', request.url))
    }
    return NextResponse.next() //Let the request continue to the page or API route it was originally going to.
  } else {
    if (isDashboardPath) {
      return NextResponse.redirect(new URL('/auth/signin-signup', request.url))
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/auth/:path*',
    '/user-dashboard/:path*',
  ],
}

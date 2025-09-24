import { NextResponse, NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request , secret: process.env.NEXTAUTH_SECRET})
  const url = request.nextUrl
  console.log('Token: ', token);
  const isAuthPath = url.pathname.startsWith('/auth')
  const isDashboardPath = url.pathname.startsWith('/dashboard')
  if (token) {
    if (isAuthPath) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
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
    '/dashboard/:path*',
  ],
}

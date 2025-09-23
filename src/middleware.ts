import { NextResponse, NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request , secret: process.env.NEXTAUTH_SECRET})
  const url = request.nextUrl
  console.log('Token: ', token);
  if (token) {
    if (url.pathname === '/auth') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next() //Let the request continue to the page or API route it was originally going to.
  } else {
    if (url.pathname === '/auth') {
      return NextResponse.next() // allow unauthenticated users
    }
    return NextResponse.redirect(new URL('/auth', request.url)) // protect dashboard
  }
}

export const config = {
  matcher: [
    '/auth',
    '/dashboard/:path*',
  ],
}

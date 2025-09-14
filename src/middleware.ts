import { NextResponse, NextRequest } from 'next/server'
// export { default } from "next-auth/middleware"
import { getToken } from 'next-auth/jwt'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request});
  const url = request.nextUrl

  if(token){
    if(url.pathname === '/signin' || url.pathname === '/signup' || url.pathname === '/verify'){
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next();
  }
  else{
    if (url.pathname === '/signin' || url.pathname === '/signup' || url.pathname === '/verify') {
      return NextResponse.next(); // Allow public routes without authentication
      }
  }
  return NextResponse.redirect(new URL('/home', request.url))
}
export const config = {
  matcher: [
    '/signin',
    '/signup',
    '/verify/:path*',
    '/dashboard/:path*',
  ],
}
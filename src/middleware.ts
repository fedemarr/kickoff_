import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const { pathname } = req.nextUrl

  if (pathname === '/admin/login') return NextResponse.next()

  if (pathname.startsWith('/admin') && !token) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }

  // Pass auth state to layout via header
  const res = NextResponse.next()
  if (token) res.headers.set('x-admin-auth', '1')
  return res
}

export const config = {
  matcher: ['/admin/:path*'],
}

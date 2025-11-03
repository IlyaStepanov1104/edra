import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicRoutes = ['/login', '/register', '/_next', '/favicon.ico']

export function middleware(request: NextRequest) {
  const currentUser = request.cookies.get('jwtToken')?.value
  const { pathname } = request.nextUrl

  if (
      publicRoutes.some(route =>
          pathname.startsWith(route) ||
          pathname.startsWith('/_next/') ||
          pathname.endsWith('.ico') ||
          pathname.endsWith('.png') ||
          pathname.endsWith('.jpg') ||
          pathname.endsWith('.svg')
      )
  ) {
    return NextResponse.next()
  }

  if (!currentUser) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(png|jpg|svg|ico)).*)"
  ],
  runtime: "nodejs",
}

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const publicRoutes = ["/login", "/register"]

export function middleware(request: NextRequest) {
  const token = request.cookies.get("jwtToken")?.value
  const { pathname } = request.nextUrl

  // Разрешаем публичные страницы
  if (
      publicRoutes.some(route => pathname.startsWith(route)) ||
      pathname.startsWith("/_next/") ||
      pathname.match(/\.(png|jpg|jpeg|svg|ico)$/)
  ) {
    return NextResponse.next()
  }

  // Редирект неавторизованных пользователей
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

// ✅ Рабочий matcher без capturing groups
export const config = {
  matcher: ["/((?!api|_next/|favicon.ico).*)"],
}

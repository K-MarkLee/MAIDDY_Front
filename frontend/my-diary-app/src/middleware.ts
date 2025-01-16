import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtDecode } from 'jwt-decode'

// 인증이 필요하지 않은 public 경로들
const PUBLIC_PATHS = ['/login', '/signup', '/api']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // public 경로들은 인증 체크하지 않고 통과
  if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // 토큰 체크
  const accessToken = request.cookies.get('accessToken')?.value

  // 토큰이 없으면 로그인 페이지로
  if (!accessToken) {
    const url = new URL('/login', request.url)
    return NextResponse.redirect(url)
  }

  try {
    const decoded = jwtDecode(accessToken)
    return NextResponse.next()
  } catch (error) {
    // 토큰이 유효하지 않으면 로그인 페이지로
    const url = new URL('/login', request.url)
    return NextResponse.redirect(url)
  }
}

// 미들웨어를 적용할 경로 설정
export const config = {
  matcher: [
    // 제외할 경로들
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtDecode } from 'jwt-decode'

const PUBLIC_PATHS = ['/login', '/signup']
const EXCLUDED_PATHS = ['/api', '_next/static', '_next/image', 'favicon.ico']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 제외될 경로 체크
  if (EXCLUDED_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // 공개 경로 체크
  if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // 토큰 체크
  const accessToken = request.cookies.get('accessToken')?.value

  // 토큰이 없으면 로그인 페이지로
  if (!accessToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    // JWT 토큰 검증
    const decoded = jwtDecode(accessToken)
    
    // 토큰 만료 체크 추가
    const currentTime = Date.now() / 1000
    if (decoded.exp && decoded.exp < currentTime) {
      throw new Error('Token expired')
    }

    return NextResponse.next()
  } catch (error) {
    // 쿠키 삭제
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('accessToken')
    return response
  }
}

export const config = {
  matcher: [
    // 정적 파일과 API 경로를 제외한 모든 경로 매칭
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
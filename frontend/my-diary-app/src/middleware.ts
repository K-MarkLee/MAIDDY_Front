import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtDecode } from 'jwt-decode'

const PUBLIC_PATHS = ['/login', '/signup']
const EXCLUDED_PATHS = ['/api', '_next/static', '_next/image', 'favicon.ico']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get('accessToken')?.value

  // 제외될 경로 체크
  if (EXCLUDED_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // // 로그인/회원가입 페이지 접근 시도하는 경우
  // if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
  //   // 이미 로그인된 상태라면 캘린더 페이지로 리디렉션
  //   if (accessToken) {
  //     try {
  //       const decoded = jwtDecode(accessToken)
  //       const currentTime = Date.now() / 1000
        
  //       // 토큰이 유효한 경우에만 리디렉션
  //       if (decoded.exp && decoded.exp > currentTime) {
  //         return NextResponse.redirect(new URL('/calendar', request.url))
  //       }
  //     } catch (error) {
  //       // 토큰이 유효하지 않으면 쿠키 삭제
  //       const response = NextResponse.next()
  //       response.cookies.delete('accessToken')
  //       return response
  //     }
  //   }
  //   return NextResponse.next()
  // }

  // 나머지 보호된 경로에 대한 접근 체크
  if (!accessToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    const decoded = jwtDecode(accessToken)
    
    // 토큰 만료 체크
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
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
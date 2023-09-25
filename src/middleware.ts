import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
//import { refreshCookieName } from '~/shared/auth'

//turbopack does not support local imports yet
const refreshCookieName = 'movie-app-refresh-token';

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/signup')) {
    const refreshCookie = request.cookies.get(refreshCookieName);
    if (refreshCookie) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
}

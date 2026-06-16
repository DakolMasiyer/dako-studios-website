import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const host = request.headers.get('host') || ''
  const pathname = url.pathname

  // Subdomain routing for labs.dako.studio and labs.localhost
  if (host.startsWith('labs.dako.studio') || host.startsWith('labs.localhost')) {
    // Rewrite path to /labs internally if it doesn't already start with it
    if (!pathname.startsWith('/labs')) {
      url.pathname = `/labs${pathname}`
      return NextResponse.rewrite(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all request paths except for:
    // - api (API routes)
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

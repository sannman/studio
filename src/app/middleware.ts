import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value;

  // Allow requests to the login page and static assets
  if (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/_next')) {
    return NextResponse.next();
  }

  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// Define the paths that the middleware will run for
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

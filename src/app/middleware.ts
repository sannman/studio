import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  return NextResponse.next();
}

// Define the paths that the middleware will run for
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

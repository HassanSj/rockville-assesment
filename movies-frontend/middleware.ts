import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const url = request.nextUrl.clone();

  const publicPaths = ['/login', '/signup'];
  const isPublic = publicPaths.includes(url.pathname);

  if (!token && !isPublic) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (token && isPublic) {
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

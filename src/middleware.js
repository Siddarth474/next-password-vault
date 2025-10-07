import { decryptSession } from './lib/auth';
import { NextResponse } from 'next/server';

export async function middleware(request) {
  const session = await decryptSession();
  const url = request.nextUrl;

  if (!session && (url.pathname.startsWith('/vault') || url.pathname === '/')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (session && (url.pathname === '/login' || url.pathname === '/signup')) {
    return NextResponse.redirect(new URL('/vault', request.url));
  }
}

export const config = {
  matcher: [
    '/',
    '/vault',
    '/login',
    '/signup'
  ]
};
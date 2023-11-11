import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, raw: true });
    const isAuthenticated = !!token;

    if(isAuthenticated && (req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/signup") 
      || req.nextUrl.pathname.startsWith("/forgotpassword") || req.nextUrl.pathname.startsWith("/reset-password"))) {
        return NextResponse.redirect(new URL('/home', req.url));
    }

    if(!isAuthenticated && (req.nextUrl.pathname.startsWith("/profile") || req.nextUrl.pathname.startsWith("/instructor") || req.nextUrl.pathname.startsWith("/course-access"))){
      return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/signup', '/forgotpassword', '/reset-password', '/profile', '/instructor/:path*', '/course-access/:path*'],
}
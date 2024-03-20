import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXT_AUTH_SECRET });
    const isAuthenticated = token?.backendTokens?.accessToken ? true : false;

    if (
        isAuthenticated &&
        (req.nextUrl.pathname.startsWith('/login') ||
            req.nextUrl.pathname.startsWith('/signup') ||
            req.nextUrl.pathname.startsWith('/forgotpassword') ||
            req.nextUrl.pathname.startsWith('/reset-password'))
    ) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    if (
        !isAuthenticated &&
        (req.nextUrl.pathname.startsWith('/profile') ||
            req.nextUrl.pathname.startsWith('/lesson') ||
            req.nextUrl.pathname.startsWith('/change-password') ||
            req.nextUrl.pathname.startsWith('/thread') || 
            req.nextUrl.pathname.startsWith("/instructor"))
    ) {
        return NextResponse.redirect(new URL('/login', req.url));
        // const url = new URL(`/signin`, request.url);
        // url.searchParams.set("callbackUrl", encodeURI(request.url));
    }

    if (req.nextUrl.pathname.startsWith("/instructor") && token?.user.role !== "INSTRUCTOR"){
        return new NextResponse("You Are Not Authorized!",{status: 403});
    }

    return NextResponse.next();
};

export const config = {
    matcher: ['/((?!api|static|.*\\..*|_next).*)'],
};

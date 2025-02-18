import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";


export default async function middleware(req: NextRequest) {
    const token = await getToken({ req });
    const url = req.nextUrl;

    if (token &&
        (url.pathname.startsWith('/signin') ||
            url.pathname.startsWith('/signup') ||
            url.pathname === '/')
    ) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    if (!token && url.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/signin', req.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
    * Match all request paths except for the ones starting with:
    * - api (API routes)
    * - _next/static (static files)
    * - _next/image (image optimization files)
    * - favicon.ico, sitemap.xml, robots.txt (metadata files)
    */
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
};
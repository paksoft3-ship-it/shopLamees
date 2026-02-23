import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const nextIntlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
    const url = request.nextUrl;
    const pathname = url.pathname;

    // 1) Redirect /ar and /ar/* to /*
    if (pathname === '/ar' || pathname.startsWith('/ar/')) {
        const newPathname = pathname.replace(/^\/ar/, '') || '/';
        url.pathname = newPathname;
        return NextResponse.redirect(url, 301);
    }

    // 2) Prevent duplicated segments (e.g. /en/en, /en/ar, /ar/en)
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length >= 2) {
        const first = segments[0];
        const second = segments[1];

        // If first is 'en', and second is 'en' or 'ar', it's a duplication
        if (first === 'en' && (second === 'en' || second === 'ar')) {
            segments.splice(1, 1); // remove the duplicate second segment
            url.pathname = '/' + segments.join('/');
            return NextResponse.redirect(url, 301);
        }
    }

    // Pass through to next-intl
    return nextIntlMiddleware(request);
}

export const config = {
    // Only run middleware on / and underneath, excluding api, _next, static files, and admin
    matcher: ['/((?!api|_next|_fallback|admin|.*\\..*).*)']
};

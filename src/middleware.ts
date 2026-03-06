import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
    if (request.nextUrl.pathname === '/') {
        const url = request.nextUrl.clone();
        // Force root traffic into locale tree to avoid occasional / route 404s.
        url.pathname = '/ar';
        return NextResponse.rewrite(url);
    }
    return intlMiddleware(request);
}

export const config = {
    // Run on app routes only; skip API, Next internals, admin and static assets.
    matcher: ['/((?!api|_next|_fallback|admin|.*\\..*).*)']
};

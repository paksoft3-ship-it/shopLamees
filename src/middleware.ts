import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
    // Run on app routes only; skip API, Next internals, admin and static assets.
    matcher: ['/((?!api|_next|_fallback|admin|.*\\..*).*)']
};

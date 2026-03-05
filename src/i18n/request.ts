import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
    let currentLocale = await requestLocale;

    if (!currentLocale || !routing.locales.includes(currentLocale as 'ar' | 'en')) {
        currentLocale = routing.defaultLocale;
    }

    let messages;
    switch (currentLocale) {
        case 'en':
            messages = (await import('../messages/en.json')).default;
            break;
        case 'ar':
        default:
            messages = (await import('../messages/ar.json')).default;
            break;
    }

    return {
        locale: currentLocale,
        messages
    };
});

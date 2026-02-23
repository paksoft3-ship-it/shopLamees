import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
    let currentLocale = await requestLocale;
    console.log("NextIntl getRequestConfig received requestLocale:", currentLocale);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!currentLocale || !routing.locales.includes(currentLocale as any)) {
        currentLocale = routing.defaultLocale;
    }
    console.log("NextIntl getRequestConfig loading messages for:", currentLocale);

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

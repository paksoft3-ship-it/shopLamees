'use client';

import { usePrefsStore } from './stores/prefs';
import { formatPrice } from './utils/price';
import { useLocale } from 'next-intl';

/**
 * Non-hook formatter — reads currency from store snapshot.
 * Safe in event handlers and non-React code.
 */
export function formatMoney(amount: number, locale: 'ar' | 'en' = 'ar', currencyOverride?: 'QAR' | 'SAR' | null): string {
    const defaultCurrency = usePrefsStore.getState().currency;
    const activeCurrency = currencyOverride || defaultCurrency;
    return formatPrice(amount, activeCurrency, locale);
}

/**
 * React hook — subscribes to currency changes and returns a formatter.
 */
export function useFormattedMoney() {
    const currency = usePrefsStore((state) => state.currency);
    const locale = useLocale() as 'ar' | 'en';
    return {
        format: (amount: number) => formatPrice(amount, currency, locale),
        currency,
        locale
    };
}

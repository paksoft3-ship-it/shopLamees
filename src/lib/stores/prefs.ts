import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type PrefsStore = {
    country: string;
    currency: 'QAR' | 'SAR';
    locale: 'ar' | 'en';
    hasHydrated: boolean;
    setCountry: (c: string) => void;
    setCurrency: (c: 'QAR' | 'SAR') => void;
    setLocale: (l: 'ar' | 'en') => void;
};

export const usePrefsStore = create<PrefsStore>()(
    persist(
        (set) => ({
            country: 'Qatar',
            currency: 'QAR',
            locale: 'ar',
            hasHydrated: false,
            setCountry: (c) => set({ country: c }),
            setCurrency: (c) => set({ currency: c }),
            setLocale: (l) => set({ locale: l }),
        }),
        {
            name: 'lamees-prefs',
            version: 2,
            migrate: (persistedState: unknown) => {
                const state = (persistedState || {}) as Partial<PrefsStore>;
                const currency = state.currency === 'SAR' ? 'SAR' : 'QAR';
                const locale = state.locale === 'en' ? 'en' : 'ar';
                const country = typeof state.country === 'string' && state.country.trim().length > 0
                    ? state.country
                    : 'Qatar';
                return { country, currency, locale };
            },
            onRehydrateStorage: () => () => {
                usePrefsStore.setState({ hasHydrated: true });
            },
        }
    )
);

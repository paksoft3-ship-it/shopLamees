import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type PrefsStore = {
    country: string;
    currency: 'QAR' | 'SAR';
    locale: 'ar' | 'en';
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
            setCountry: (c) => set({ country: c }),
            setCurrency: (c) => set({ currency: c }),
            setLocale: (l) => set({ locale: l }),
        }),
        { name: 'lamees-prefs' }
    )
);

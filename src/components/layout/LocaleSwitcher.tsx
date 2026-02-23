'use client';
import { useLocale } from 'next-intl';
import { Globe } from 'lucide-react';
import { useTransition } from 'react';

import { usePathname, useRouter } from '@/i18n/navigation';

export function LocaleSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    const switchLocale = () => {
        const nextLocale = locale === 'ar' ? 'en' : 'ar';
        startTransition(() => {
            router.replace(pathname, { locale: nextLocale });
        });
    };

    return (
        <button
            onClick={switchLocale}
            disabled={isPending}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 hover:bg-black/5 transition-colors ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-label="Toggle Language"
        >
            <Globe className="w-4 h-4 text-slate-600" />
            <span className="text-xs font-bold text-slate-800 uppercase">
                {locale === 'ar' ? 'EN' : 'عربي'}
            </span>
        </button>
    );
}

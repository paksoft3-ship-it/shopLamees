'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export function EmptyCart() {
    const t = useTranslations('Cart');

    return (
        <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
            {/* Soft decorative background element */}
            <div className="w-32 h-32 bg-[#FBF7F2] rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[64px] text-[#C5A059] opacity-80">
                    shopping_bag
                </span>
            </div>

            <h2 className="text-3xl font-display font-bold text-[#0e1b12] mb-3">
                {t('empty_title')}
            </h2>

            <p className="text-[#6b7280] font-kufi text-lg max-w-sm mb-10 leading-relaxed">
                {t('empty_desc')}
            </p>

            <Link
                href="/category/all"
                className="bg-[#0e1b12] text-white hover:bg-black hover:scale-105 active:scale-95 transition-all w-full sm:w-auto px-10 py-4 h-14 rounded-xl font-bold font-kufi flex items-center justify-center shadow-lg hover:shadow-xl"
            >
                {t('continue_shopping')}
            </Link>
        </div>
    );
}

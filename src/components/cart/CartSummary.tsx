'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useCartStore } from '@/lib/stores/cart';
import { useFormattedMoney } from '@/lib/money';

export function CartSummary() {
    const t = useTranslations('Cart');
    const locale = useLocale();
    const { items } = useCartStore();
    const { format } = useFormattedMoney();

    const subtotal = items.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
    const vat = Math.round(subtotal * 0.15);
    const total = subtotal + vat;

    return (
        <div className="lg:sticky lg:top-24">
            <div className="rounded-2xl border border-[#e8e8eb] bg-white p-6 md:p-7">
                <h2 className="text-2xl font-bold text-on-surface mb-7 font-kufi text-end">
                    {t('summary_title')}
                </h2>

                <div className="space-y-5 mb-8">
                    <div className="flex justify-between text-subtle text-xl font-kufi">
                        <span>{t('subtotal')}</span>
                        <span className="font-bold text-on-surface font-display text-2xl">{format(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-subtle text-base font-kufi">
                        <span>{locale === 'ar' ? 'ضريبة القيمة المضافة (15%)' : 'VAT (15%)'}</span>
                        <span className="font-bold text-on-surface font-display">{format(vat)}</span>
                    </div>
                    <div className="flex justify-between text-subtle text-base font-kufi">
                        <span>{t('shipping')}</span>
                        <span className="text-green-600 font-bold font-kufi">
                            {locale === 'ar' ? 'مجاني' : 'Free'}
                        </span>
                    </div>
                </div>

                <div className="border-t border-[#e8e8eb] my-6" />

                <div className="flex justify-between items-center mb-8">
                    <span className="text-[2rem] leading-none font-bold text-on-surface font-kufi">
                        {locale === 'ar' ? 'الإجمالي' : 'Total'}
                    </span>
                    <div className="text-end leading-none">
                        <span className="block text-[2rem] font-extrabold text-on-surface font-display">
                            {format(total)}
                        </span>
                        <span className="text-xs text-subtle font-kufi mt-2 block">
                            {locale === 'ar' ? 'شاملاً الضريبة' : 'Including tax'}
                        </span>
                    </div>
                </div>

                <Link href="/checkout" className="w-full bg-[#646466] hover:bg-[#555558] text-white font-bold py-4 rounded-2xl transition-colors flex items-center justify-center font-kufi text-[1.55rem] leading-none">
                    {t('proceed_checkout')}
                </Link>
            </div>
        </div>
    );
}

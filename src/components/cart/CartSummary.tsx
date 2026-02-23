'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useCartStore } from '@/lib/stores/cart';
import { usePrefsStore } from '@/lib/stores/prefs';

export function CartSummary() {
    const t = useTranslations('Cart');
    const locale = useLocale();
    const { items } = useCartStore();
    const { currency } = usePrefsStore();
    const currencySymbol = currency === 'QAR' ? 'ر.ق' : 'ر.س';
    const [coupon, setCoupon] = useState('');

    const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
    const vat = Math.round(subtotal * 0.15);
    const total = subtotal + vat;

    return (
        <div className="lg:sticky lg:top-24 space-y-6">
            {/* Main Summary Card */}
            <div className="bg-[#FBF7F2] rounded-2xl p-6 md:p-8 shadow-lg border border-[#eaddcf]">
                <h2 className="text-xl font-bold text-slate-900 mb-6 font-kufi">
                    {t('summary_title')}
                </h2>

                <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-slate-600 text-sm font-kufi">
                        <span>{t('subtotal')}</span>
                        <span className="font-bold text-slate-900 font-display">{subtotal.toLocaleString()} {currencySymbol}</span>
                    </div>
                    <div className="flex justify-between text-slate-600 text-sm font-kufi">
                        <span>{locale === 'ar' ? 'ضريبة القيمة المضافة (15%)' : 'VAT (15%)'}</span>
                        <span className="font-bold text-slate-900 font-display">{vat.toLocaleString()} {currencySymbol}</span>
                    </div>
                    <div className="flex justify-between text-slate-600 text-sm font-kufi">
                        <span>{t('shipping')}</span>
                        <span className="text-green-600 font-bold font-kufi">
                            {locale === 'ar' ? 'مجاني' : 'Free'}
                        </span>
                    </div>
                </div>

                {/* Coupon Code */}
                <div className="mb-6">
                    <label className="block text-sm font-bold text-slate-700 mb-2 font-kufi">
                        {locale === 'ar' ? 'كود الخصم' : 'Discount Code'}
                    </label>
                    <div className="flex gap-2">
                        <input
                            className="block w-full rounded-xl border-slate-300 bg-white text-sm focus:border-primary focus:ring-primary placeholder:text-slate-400 font-kufi"
                            placeholder={locale === 'ar' ? 'أدخلي الكود' : 'Enter code'}
                            type="text"
                            value={coupon}
                            onChange={(e) => setCoupon(e.target.value)}
                        />
                        <button className="bg-white hover:bg-slate-50 border border-primary text-primary font-bold py-2 px-4 rounded-xl transition-colors text-sm font-kufi whitespace-nowrap">
                            {locale === 'ar' ? 'تطبيق' : 'Apply'}
                        </button>
                    </div>
                </div>

                <div className="border-t border-slate-200 my-6" />

                {/* Grand Total */}
                <div className="flex justify-between items-center mb-8">
                    <span className="text-lg font-bold text-slate-900 font-kufi">
                        {locale === 'ar' ? 'الإجمالي' : 'Total'}
                    </span>
                    <div className="text-end">
                        <span className="block text-2xl font-extrabold text-slate-900 font-display">
                            {total.toLocaleString()} {currencySymbol}
                        </span>
                        <span className="text-xs text-slate-500 font-kufi">
                            {locale === 'ar' ? 'شاملاً الضريبة' : 'Including tax'}
                        </span>
                    </div>
                </div>

                {/* Checkout Button */}
                <Link href="/checkout" className="w-full bg-black hover:bg-slate-800 text-white font-bold py-4 rounded-xl shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 font-kufi">
                    <span className="material-symbols-outlined text-[20px]">lock</span>
                    {t('proceed_checkout')}
                </Link>

                {/* Payment Icons */}
                <div className="mt-6 flex justify-center gap-3">
                    <div className="h-8 flex items-center justify-center bg-white rounded px-3 shadow-sm border border-slate-200 text-xs font-bold font-display tracking-widest text-slate-500">VISA</div>
                    <div className="h-8 flex items-center justify-center bg-white rounded px-3 shadow-sm border border-slate-200 text-xs font-bold font-display tracking-widest text-slate-500">MASTERCARD</div>
                    <div className="h-8 flex items-center justify-center bg-white rounded px-3 shadow-sm border border-slate-200 text-xs font-bold font-display tracking-widest text-slate-500">MADA</div>
                    <div className="h-8 flex items-center justify-center bg-white rounded px-3 shadow-sm border border-slate-200 text-xs font-bold font-display tracking-widest text-slate-500"> PAY</div>
                </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-slate-100 text-center">
                    <span className="material-symbols-outlined text-primary mb-2 text-2xl">local_shipping</span>
                    <span className="text-xs font-bold text-slate-700 font-kufi">
                        {locale === 'ar' ? 'شحن سريع' : 'Fast Shipping'}
                    </span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-slate-100 text-center">
                    <span className="material-symbols-outlined text-primary mb-2 text-2xl">verified_user</span>
                    <span className="text-xs font-bold text-slate-700 font-kufi">
                        {locale === 'ar' ? 'دفع آمن' : 'Secure Payment'}
                    </span>
                </div>
            </div>
        </div>
    );
}

'use client';

import { useTranslations } from 'next-intl';
import { useCartStore } from '@/lib/stores/cart';
import { usePrefsStore } from '@/lib/stores/prefs';

export function CartSummary() {
    const t = useTranslations('Cart');
    const { items } = useCartStore();
    const { currency } = usePrefsStore();
    const currencySymbol = currency === 'QAR' ? 'ر.ق' : 'ر.س';

    const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:sticky lg:top-24">
            <h2 className="text-xl font-display font-bold text-[#0e1b12] mb-6">
                {t('summary_title')}
            </h2>

            <div className="space-y-4 mb-6 text-sm text-slate-600 font-kufi">
                <div className="flex justify-between items-center">
                    <span>{t('subtotal')}</span>
                    <span className="font-bold text-slate-900">{subtotal} {currencySymbol}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span>{t('shipping')}</span>
                    <span className="text-sm text-slate-500">{t('shipping_calc')}</span>
                </div>

                <hr className="border-gray-100 my-4" />

                <div className="flex justify-between items-center text-lg text-[#0e1b12]">
                    <span className="font-bold">{t('headers_total')}</span>
                    <span className="font-bold">{subtotal} {currencySymbol}</span>
                </div>
            </div>

            <button
                className="w-full bg-[#0e1b12] text-white hover:bg-black hover:scale-[1.02] active:scale-95 transition-all py-4 h-14 rounded-xl font-bold font-kufi flex items-center justify-center gap-2 shadow-lg mb-4"
                onClick={() => alert("Checkout flow coming soon!")}
            >
                <span className="material-symbols-outlined text-[20px] rtl:-scale-x-100">lock</span>
                {t('proceed_checkout')}
            </button>

            <div className="flex items-center justify-center gap-4 filter grayscale opacity-60">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/2560px-PayPal.svg.png" alt="PayPal" className="h-4 object-contain" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1000px-Mastercard-logo.svg.png" alt="Mastercard" className="h-5 object-contain" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2000px-Visa_Inc._logo.svg.png" alt="Visa" className="h-4 object-contain" />
                <img src="https://upload.wikimedia.org/wikipedia/ar/thumb/a/ab/Apple_Pay_logo.svg/2560px-Apple_Pay_logo.svg.png" alt="Apple Pay" className="h-6 object-contain" />
            </div>
        </div>
    );
}

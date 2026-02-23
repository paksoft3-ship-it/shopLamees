'use client';

import { useTranslations } from 'next-intl';
import { useCartStore } from '@/lib/stores/cart';
import { CartList } from '@/components/cart/CartList';
import { CartSummary } from '@/components/cart/CartSummary';
import { EmptyCart } from '@/components/cart/EmptyCart';
import { Link } from '@/i18n/navigation';

export default function CartPage() {
    const t = useTranslations('Cart');
    const { items } = useCartStore();

    if (items.length === 0) {
        return (
            <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24 flex-1">
                <EmptyCart />
            </main>
        );
    }

    return (
        <main className="max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex-grow">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex mb-8">
                <ol className="inline-flex items-center gap-2 text-sm text-slate-500 font-display rtl:space-x-reverse">
                    <li>
                        <Link href="/" className="hover:text-primary transition-colors">{t('continue_shopping')}</Link>
                    </li>
                    <li>
                        <span className="material-symbols-outlined text-xs mx-1 rtl:rotate-180">chevron_right</span>
                    </li>
                    <li aria-current="page" className="font-bold text-slate-900">
                        {t('title')}
                    </li>
                </ol>
            </nav>

            <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-8 md:mb-12">
                {t('title')} <span className="text-slate-500 font-normal text-2xl">({items.length})</span>
            </h1>

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                {/* Left Column - Line Items */}
                <div className="w-full lg:w-2/3">
                    <CartList />
                </div>

                {/* Right Column - Summary */}
                <div className="w-full lg:w-1/3">
                    <CartSummary />
                </div>
            </div>
        </main>
    );
}
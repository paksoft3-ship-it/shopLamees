'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useCartStore } from '@/lib/stores/cart';
import { usePrefsStore } from '@/lib/stores/prefs';
import { formatPrice } from '@/lib/utils/price';

export default function OrderConfirmationPage() {
    const t = useTranslations('OrderConfirmation');
    const locale = useLocale() as 'ar' | 'en';
    const { items } = useCartStore();
    const { currency } = usePrefsStore();

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const vat = Math.round(subtotal * 0.05);
    const total = subtotal + vat;

    // Generate a pseudo order number
    const orderNumber = `SL-${Math.floor(10000 + Math.random() * 90000)}`;

    return (
        <section className="bg-[#FBF7F2] min-h-screen flex flex-col">
            {/* Minimal Header */}
            <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-center">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-3xl">shopping_bag</span>
                        <h1 className="text-xl font-bold tracking-tight font-display uppercase">
                            {locale === 'ar' ? 'شوب لاميس' : 'Shop Lamees'}
                        </h1>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                {/* Decorative Background Blurs */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px]" />
                </div>

                <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-12 relative z-10 flex flex-col items-center text-center">

                    {/* Success Icon */}
                    <div className="mb-8 relative">
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-green-500 text-[40px] font-bold">check</span>
                        </div>
                        <span className="material-symbols-outlined absolute -top-2 -right-2 text-primary/40 text-xl">star</span>
                        <span className="material-symbols-outlined absolute bottom-0 -left-4 text-primary/40 text-lg">star</span>
                    </div>

                    {/* Main Message */}
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 font-kufi mb-3">
                        {t('thank_you')}
                    </h1>
                    <p className="text-primary text-lg font-bold font-display mb-8" dir="ltr">
                        {orderNumber} <span dir="rtl" className="text-slate-500 font-normal text-base">{t('order_number')}</span>
                    </p>

                    {/* Order Summary Card */}
                    <div className="w-full bg-[#FBF7F2] rounded-xl p-6 mb-8 border border-slate-100">
                        {/* Product Previews */}
                        {items.length > 0 && (
                            <div className="space-y-4 mb-6 pb-6 border-b border-slate-200">
                                {items.slice(0, 3).map((item) => (
                                    <div key={item.variantId} className="flex items-center gap-4">
                                        <div className="w-16 h-20 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                                            {item.image && (
                                                <img alt={item.name} className="w-full h-full object-cover" src={item.image} />
                                            )}
                                        </div>
                                        <div className="text-start flex-1">
                                            <h3 className="font-bold text-sm text-slate-900 mb-1">{item.name}</h3>
                                            <p className="text-xs text-slate-500">
                                                {item.size && `${locale === 'ar' ? 'المقاس' : 'Size'}: ${item.size} | `}
                                                {locale === 'ar' ? 'الكمية' : 'Qty'}: {item.quantity}
                                            </p>
                                        </div>
                                        <div className="text-end">
                                            <span className="font-bold text-sm text-slate-900 font-display">
                                                {formatPrice(item.price * item.quantity, currency, locale)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {items.length > 3 && (
                                    <p className="text-xs text-slate-500 font-kufi">
                                        +{items.length - 3} {locale === 'ar' ? 'منتجات أخرى' : 'more items'}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Totals */}
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-500">{t('payment_method')}</span>
                                <span className="font-medium text-slate-900">Apple Pay</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-500">{t('delivery_estimate')}</span>
                                <span className="font-medium text-primary">{t('delivery_days')}</span>
                            </div>
                            <div className="flex justify-between items-center pt-3 mt-3 border-t border-dashed border-slate-300">
                                <span className="font-bold text-base text-slate-900">{t('total')}</span>
                                <span className="font-bold text-xl text-slate-900 font-display">
                                    {formatPrice(total, currency, locale)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-col w-full gap-3 sm:w-2/3">
                        <Link href="/" className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-base transition-colors flex items-center justify-center gap-2 font-kufi">
                            {t('continue_shopping')}
                        </Link>
                        <a
                            href="https://wa.me/97477808007"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full h-12 bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 rounded-xl font-bold text-base transition-colors flex items-center justify-center gap-2 group font-kufi"
                        >
                            <span className="material-symbols-outlined text-[#25D366] group-hover:scale-110 transition-transform">chat</span>
                            <span>{t('whatsapp')}</span>
                        </a>
                    </div>

                    <div className="mt-8 text-sm text-slate-400 font-kufi">
                        {t('email_sent')}
                    </div>
                </div>
            </main>
        </section>
    );
}

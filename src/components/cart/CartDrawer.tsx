'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useCartStore, CartItem } from '@/lib/stores/cart';
import { usePrefsStore } from '@/lib/stores/prefs';
import { products } from '@/mock/products';
import { Link } from '@/i18n/navigation';
import { useEffect } from 'react';

export function CartDrawer() {
    const locale = useLocale();
    const { items, isDrawerOpen, closeDrawer, removeItem, updateQuantity } = useCartStore();
    const { currency } = usePrefsStore();
    const currencySymbol = currency === 'QAR' ? 'ر.ق' : 'ر.س';

    const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
    const cartCount = items.reduce((total, item) => total + item.quantity, 0);

    // Free shipping threshold
    const freeShippingThreshold = 500;
    const remaining = Math.max(0, freeShippingThreshold - subtotal);
    const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

    // Close on Escape
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeDrawer();
        };
        if (isDrawerOpen) {
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = '';
        };
    }, [isDrawerOpen, closeDrawer]);

    if (!isDrawerOpen) return null;

    // Cross-sell products (not already in cart)
    const cartIds = items.map(i => i.id);
    const crossSell = products.filter(p => !cartIds.includes(p.id) && p.availability !== false).slice(0, 3);

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-[60] bg-black/50 transition-opacity"
                onClick={closeDrawer}
            />

            {/* Drawer */}
            <div
                role="dialog"
                aria-modal="true"
                className="fixed inset-y-0 ltr:right-0 rtl:left-0 z-[70] w-full max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-300"
            >
                {/* Header */}
                <div className="flex flex-col border-b border-slate-100">
                    <div className="flex items-center justify-between px-6 py-5">
                        <h2 className="text-xl font-bold text-slate-900 font-kufi">
                            {locale === 'ar' ? 'حقيبة التسوق' : 'Shopping Bag'}
                            <span className="mr-2 text-sm font-medium text-slate-500 font-display">({cartCount})</span>
                        </h2>
                        <button
                            onClick={closeDrawer}
                            className="p-2 text-slate-400 hover:text-slate-500 transition-colors"
                        >
                            <span className="material-symbols-outlined text-[24px]">close</span>
                        </button>
                    </div>

                    {/* Free Shipping Progress */}
                    {remaining > 0 && (
                        <div className="px-6 pb-4 bg-slate-50">
                            <div className="mb-2 flex items-center justify-between text-sm font-medium font-kufi">
                                <span className="text-slate-700">
                                    {locale === 'ar' ? 'تبقي' : 'Add'}{' '}
                                    <span className="font-bold text-slate-900 font-display">{remaining} {currencySymbol}</span>{' '}
                                    {locale === 'ar' ? 'للشحن المجاني' : 'for free shipping'}
                                </span>
                                <span className="text-[#C5A059]">
                                    <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                                </span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-[#C5A059] transition-all duration-500 ease-out"
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto py-6 px-6">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <span className="material-symbols-outlined text-[64px] text-slate-200 mb-4">shopping_bag</span>
                            <p className="text-slate-500 font-kufi">{locale === 'ar' ? 'السلة فارغة' : 'Cart is empty'}</p>
                        </div>
                    ) : (
                        <ul className="-my-6 divide-y divide-slate-100">
                            {items.map((item) => {
                                const originalProduct = products.find(p => p.id === item.id);
                                const productImage = item.image || originalProduct?.image || '';

                                return (
                                    <li key={item.variantId} className="flex py-6">
                                        <div className="h-28 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
                                            <img src={productImage} alt={item.name} className="h-full w-full object-cover object-center" />
                                        </div>
                                        <div className="mr-4 rtl:ml-4 rtl:mr-0 flex flex-1 flex-col font-kufi">
                                            <div>
                                                <div className="flex justify-between text-base font-bold text-slate-900">
                                                    <h3 className="leading-tight">{item.name}</h3>
                                                    <p className="mr-4 font-display">{item.price} {currencySymbol}</p>
                                                </div>
                                                {item.size && (
                                                    <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                                                        <span className="material-symbols-outlined text-[14px] text-[#C5A059]">timelapse</span>
                                                        <span>{locale === 'ar' ? 'تفصيل حسب الطلب (7-10 أيام)' : 'Custom tailoring (7-10 days)'}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="mt-2 flex items-center gap-2 text-xs text-slate-600">
                                                {item.size && (
                                                    <span className="inline-flex items-center rounded-md bg-slate-50 px-2 py-1 font-medium ring-1 ring-inset ring-slate-500/10">
                                                        {locale === 'ar' ? 'المقاس' : 'Size'}: {item.size}
                                                    </span>
                                                )}
                                                {item.cut && (
                                                    <span className="inline-flex items-center rounded-md bg-slate-50 px-2 py-1 font-medium ring-1 ring-inset ring-slate-500/10">
                                                        {locale === 'ar' ? 'القصة' : 'Cut'}: {item.cut}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex flex-1 items-end justify-between text-sm mt-3">
                                                {/* Quantity */}
                                                <div className="flex items-center border border-slate-200 rounded-lg">
                                                    <button onClick={() => updateQuantity(item.variantId, item.quantity - 1)} className="p-1 px-2 text-slate-600 hover:text-primary transition-colors">
                                                        <span className="material-symbols-outlined text-[16px]">remove</span>
                                                    </button>
                                                    <span className="w-8 text-center text-xs font-display font-bold text-slate-900">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.variantId, item.quantity + 1)} className="p-1 px-2 text-slate-600 hover:text-primary transition-colors">
                                                        <span className="material-symbols-outlined text-[16px]">add</span>
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => removeItem(item.variantId)}
                                                    className="font-medium text-red-500 hover:text-red-600 text-xs flex items-center gap-1 transition-colors group"
                                                >
                                                    <span className="material-symbols-outlined text-[16px] group-hover:scale-110 transition-transform">delete</span>
                                                    {locale === 'ar' ? 'حذف' : 'Remove'}
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="border-t border-slate-100 bg-slate-50/50">
                        {/* Cross-sell */}
                        {crossSell.length > 0 && (
                            <div className="px-6 pt-4 pb-2 border-b border-slate-100 bg-white">
                                <h3 className="text-sm font-bold text-slate-900 mb-3 font-kufi">
                                    {locale === 'ar' ? 'أكملي أناقتك' : 'Complete Your Look'}
                                </h3>
                                <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
                                    {crossSell.map((p) => (
                                        <div key={p.id} className="flex-shrink-0 w-24 group">
                                            <div className="aspect-[3/4] rounded-lg bg-slate-100 overflow-hidden mb-2">
                                                <img src={p.image} alt={p.name[locale as 'ar' | 'en']} className="h-full w-full object-cover" />
                                            </div>
                                            <p className="text-xs text-slate-900 font-medium truncate font-kufi">{p.name[locale as 'ar' | 'en']}</p>
                                            <p className="text-xs font-bold font-display mt-0.5">{p.price} {currencySymbol}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="px-6 py-6">
                            <div className="flex justify-between text-base font-bold text-slate-900 font-kufi mb-1">
                                <p>{locale === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}</p>
                                <p className="font-display text-lg">{subtotal.toLocaleString()} {currencySymbol}</p>
                            </div>
                            <p className="mt-1 text-xs text-slate-500 flex items-center gap-1 mb-6 font-kufi">
                                <span className="material-symbols-outlined text-[14px]">info</span>
                                {locale === 'ar' ? 'قد تختلف مدة التوصيل حسب الدولة' : 'Delivery time may vary by country'}
                            </p>

                            <div className="flex flex-col gap-3">
                                <Link
                                    href="/cart"
                                    onClick={closeDrawer}
                                    className="flex items-center justify-center rounded-xl border border-transparent bg-slate-900 px-6 py-3 text-base font-bold text-white shadow-sm hover:bg-slate-800 transition-all hover:shadow-md font-kufi"
                                >
                                    {locale === 'ar' ? 'إتمام الشراء' : 'Checkout'}
                                </Link>
                                <Link
                                    href="/cart"
                                    onClick={closeDrawer}
                                    className="flex items-center justify-center rounded-xl border border-slate-300 bg-transparent px-6 py-3 text-base font-bold text-slate-900 shadow-sm hover:bg-slate-50 transition-colors font-kufi"
                                >
                                    {locale === 'ar' ? 'عرض السلة' : 'View Cart'}
                                </Link>
                            </div>

                            <div className="mt-4 flex justify-center text-center text-xs text-slate-500 font-kufi">
                                <p>
                                    {locale === 'ar' ? 'أو' : 'or'}{' '}
                                    <button
                                        onClick={closeDrawer}
                                        className="font-medium text-primary hover:text-primary/80 mr-1 transition-colors underline decoration-dashed underline-offset-4"
                                    >
                                        {locale === 'ar' ? 'أكمل التسوق' : 'Continue Shopping'}
                                    </button>
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

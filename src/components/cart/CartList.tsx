'use client';

import { useTranslations } from 'next-intl';
import { useCartStore } from '@/lib/stores/cart';
import { usePrefsStore } from '@/lib/stores/prefs';
import { products } from '@/mock/products';
import { Link } from '@/i18n/navigation';

export function CartList() {
    const t = useTranslations('Cart');
    const { items, removeItem, addItem } = useCartStore();
    const { currency } = usePrefsStore();
    const currencySymbol = currency === 'QAR' ? 'ر.ق' : 'ر.س';

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Desktop Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 p-6 border-b border-gray-100 bg-[#FBF7F2]/50 text-sm font-bold text-slate-500 font-display">
                <div className="col-span-6">{t('headers_product')}</div>
                <div className="col-span-3 text-center">{t('headers_quantity')}</div>
                <div className="col-span-3 text-end">{t('headers_total')}</div>
            </div>

            {/* Items */}
            <ul className="divide-y divide-gray-100">
                {items.map((item) => {
                    const originalProduct = products.find(p => p.id === item.id);
                    // Parse the variantId which we format as "id-size-cut" during Add To Cart
                    const parts = item.variantId.split('-');
                    const size = parts[1] || 'M';
                    const cut = parts[2] === 'half' ? 'نص كلوش' : 'ربع كلوش'; // Rough localized fallback for visual

                    return (
                        <li key={item.variantId} className="p-4 md:p-6 flex flex-col md:grid md:grid-cols-12 md:items-center gap-4 md:gap-6 relative group">
                            {/* Product Info (Image + Title) */}
                            <div className="col-span-6 flex gap-4">
                                <Link href={`/product/${originalProduct?.slug || 'black-crepe-abaya'}`} className="relative shrink-0 w-24 h-32 md:w-28 md:h-36 bg-gray-100 rounded-lg overflow-hidden group-hover:opacity-90 transition-opacity">
                                    <img
                                        src={originalProduct?.image || "https://lh3.googleusercontent.com/aida-public/AB6AXuCIua5GPVtOscy2BRxYrqJ3kbXVOfugINLqWr0o0YeZnMpCt8r1hn5S5cyH12ZCfDQQdDQB7R6S6iGSkBxwMj1OpMLH4RCOzpJfbLU_zt_CMokLiKgjZaVSmVLzdEwJH-C4uFvHDAuWWXvkhjX00ZYa7o4g-xfNQ9MwLkyuVCkRhY3arwc6UfLi5LOjzfYfxuq_8E6m6yYAO321WvNBdIPb58cBAsSavZrlF1VgQOAMYPY6kvBDqI8aEBO4npy9UwpGDjBssgJiBak"}
                                        alt={item.name}
                                        className="object-cover w-full h-full"
                                    />
                                </Link>
                                <div className="flex flex-col py-1">
                                    <Link href={`/product/${originalProduct?.slug || 'black-crepe-abaya'}`} className="text-base font-bold text-slate-900 font-kufi hover:text-primary transition-colors leading-tight mb-2">
                                        {item.name}
                                    </Link>
                                    <div className="text-sm text-slate-500 font-kufi flex items-center gap-1.5 mb-1">
                                        <span className="w-4 h-4 rounded bg-[#f3f4f6] flex items-center justify-center text-[10px] font-bold text-slate-700">{size}</span>
                                        <span>•</span>
                                        <span>{cut}</span>
                                    </div>
                                    <div className="text-lg font-bold text-[#0e1b12] mt-auto md:hidden">
                                        {item.price} {currencySymbol}
                                    </div>
                                </div>
                            </div>

                            {/* Quantity Controls */}
                            <div className="col-span-3 flex md:justify-center items-center gap-4 mt-2 md:mt-0">
                                <div className="h-10 w-28 flex items-center rounded border border-gray-200 bg-white">
                                    <button
                                        onClick={() => {
                                            if (item.quantity > 1) {
                                                removeItem(item.variantId);
                                                addItem({ ...item, quantity: item.quantity - 1 });
                                            }
                                        }}
                                        className="w-10 h-full flex items-center justify-center text-slate-500 hover:bg-gray-50 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[16px]">remove</span>
                                    </button>
                                    <input
                                        type="text"
                                        className="w-full text-center border-none font-bold text-sm focus:ring-0 text-slate-900 bg-transparent p-0"
                                        value={item.quantity}
                                        readOnly
                                    />
                                    <button
                                        onClick={() => {
                                            removeItem(item.variantId);
                                            addItem({ ...item, quantity: item.quantity + 1 });
                                        }}
                                        className="w-10 h-full flex items-center justify-center text-slate-500 hover:bg-gray-50 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[16px]">add</span>
                                    </button>
                                </div>
                                <button
                                    onClick={() => removeItem(item.variantId)}
                                    className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-colors flex items-center justify-center md:hidden"
                                >
                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                </button>
                            </div>

                            {/* Total Price & Desktop Remove */}
                            <div className="col-span-3 hidden md:flex flex-col items-end gap-2">
                                <span className="text-lg font-bold text-slate-900 leading-none">
                                    {item.price * item.quantity} {currencySymbol}
                                </span>
                                <button
                                    onClick={() => removeItem(item.variantId)}
                                    className="text-xs font-semibold text-red-500 hover:text-red-700 transition-colors underline decoration-red-200 hover:decoration-red-500 underline-offset-4 mt-2"
                                >
                                    {t('remove')}
                                </button>
                            </div>
                        </li>
                    );
                })}
            </ul>

            <div className="bg-[#f8fafc] p-4 text-center border-t border-gray-100 text-sm text-slate-600 font-kufi">
                {t('add_note')}
            </div>
        </div>
    );
}

"use client";

import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useCartStore } from '@/lib/stores/cart';
import { usePrefsStore } from '@/lib/stores/prefs';
import { trackEvent } from '@/lib/tracking/track';
import type { Product } from '@/mock/products';
import { toast } from 'react-hot-toast';

export function ProductInfo({ product }: { product: Product }) {
    const locale = useLocale();
    const t = useTranslations('Product.Info');
    const { addItem } = useCartStore();
    const { currency } = usePrefsStore();

    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('M');
    const [selectedCut, setSelectedCut] = useState('quarter');

    const productName = typeof product.name === 'string'
        ? product.name
        : (product.name as Record<string, string>)[locale] || (product.name as Record<string, string>)['ar'];

    const productBadge = product.badge
        ? (typeof product.badge === 'string' ? product.badge : (product.badge as Record<string, string>)[locale])
        : null;

    const currencySymbol = currency === 'QAR' ? 'ر.ق' : 'ر.س';

    useEffect(() => {
        trackEvent('view_item', {
            product_id: product.id,
            product_name: productName,
            value: product.price,
            currency,
        });
    }, [product.id, productName, product.price, currency]);

    const handleAddToCart = () => {
        addItem({
            id: product.id,
            variantId: `${product.id}-${selectedSize}-${selectedCut}`,
            name: productName,
            price: product.price,
            quantity,
        });
        trackEvent('add_to_cart', {
            product_id: product.id,
            product_name: productName,
            quantity,
            value: product.price * quantity,
            currency,
        });
        toast.success(locale === 'en' ? `${productName} added to cart!` : `تمت إضافة ${productName} للسلة بنجاح!`, {
            icon: '🛍️',
        });
    };

    return (
        <div className="lg:col-span-5 flex flex-col gap-6 md:gap-8 px-5 md:px-0 -mt-6 md:-mt-0 relative z-10 bg-[#FBF7F2] md:bg-transparent rounded-t-[32px] md:rounded-none pt-8 md:pt-0">
            <div>
                {/* Title + Wishlist */}
                <div className="flex items-start justify-between mb-2">
                    <h1 className="text-3xl md:text-4xl font-bold font-kufi text-[#0e1b12] leading-tight">
                        {productName}
                    </h1>
                    <button className="hidden md:block p-2 rounded-full hover:bg-[#f3f4f6] transition-colors text-[#9ca3af] hover:text-red-500">
                        <span className="material-symbols-outlined">favorite</span>
                    </button>
                    {/* Mobile top stock indicator */}
                    <span className="md:hidden shrink-0 bg-[#f4f2e6] px-3 py-1 rounded-lg flex items-center gap-1.5 ml-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-xs font-bold text-slate-700 font-kufi">{t('in_stock')}</span>
                    </span>
                </div>

                {/* Pricing Row */}
                <div className="flex flex-col md:flex-row md:items-end gap-2 md:gap-3 mb-4">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl md:text-3xl font-bold text-[#0e1b12]">
                            {product.price} {currencySymbol}
                        </span>
                        {product.compareAtPrice && (
                            <span className="text-lg text-[#9ca3af] line-through mb-1">
                                {product.compareAtPrice} {currencySymbol}
                            </span>
                        )}
                        {productBadge && (
                            <span className="text-xs font-bold text-[#C5A059] border border-[#C5A059]/30 bg-[#C5A059]/10 px-2 py-1 rounded-md mb-1 font-display">
                                {productBadge}
                            </span>
                        )}
                    </div>
                    {/* Currency Selector (Desktop) */}
                    <div className="hidden md:block mr-auto relative group">
                        <button className="flex items-center gap-1 text-xs font-medium text-[#6b7280] hover:text-[#1f2937] transition-colors bg-[#f9fafb] px-2 py-1 rounded border border-[#e5e7eb]">
                            <span>{currency}</span>
                            <span className="material-symbols-outlined text-[14px]">arrow_drop_down</span>
                        </button>
                    </div>
                </div>

                {/* Desktop In Stock Indicator */}
                <div className="hidden md:flex items-center gap-2 mb-6">
                    <span className="flex h-2 w-2 rounded-full bg-primary"></span>
                    <span className="text-sm font-medium text-primary font-kufi">{t('in_stock')}</span>
                </div>

                <hr className="hidden md:block border-[#f3f4f6] mb-6" />

                {/* Selectors */}
                <div className="space-y-6">
                    {/* Size Selector */}
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <label className="text-sm font-bold text-[#0e1b12] font-kufi">{t('size')}</label>
                            <button className="text-xs text-[#6b7280] underline decoration-[#d1d5db] hover:text-[#0e1b12]">
                                {t('size_guide')}
                            </button>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                            {['S', 'M', 'L', 'XL'].map((size) => (
                                <label key={size} className="cursor-pointer">
                                    <input
                                        type="radio"
                                        name="size"
                                        className="peer sr-only"
                                        checked={selectedSize === size}
                                        onChange={() => setSelectedSize(size)}
                                    />
                                    <div className="w-full h-10 flex items-center justify-center bg-white md:bg-transparent rounded-full md:rounded-lg border border-gray-200 md:border-[#e5e7eb] text-sm font-medium text-[#0e1b12] peer-checked:bg-[#0e1b12] peer-checked:text-white peer-checked:border-[#0e1b12] hover:border-[#9ca3af] transition-all focus:ring-2 ring-primary">
                                        {size}
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Cut Selector */}
                    <div>
                        <label className="block text-sm font-bold text-[#0e1b12] font-kufi mb-3">{t('cut')}</label>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { id: 'quarter', label: t('quarter_cloche') },
                                { id: 'half', label: t('half_cloche') },
                            ].map((cut) => (
                                <label key={cut.id} className="cursor-pointer">
                                    <input
                                        type="radio"
                                        name="cut"
                                        className="peer sr-only"
                                        checked={selectedCut === cut.id}
                                        onChange={() => setSelectedCut(cut.id)}
                                    />
                                    <div className="w-full h-10 flex items-center justify-center bg-white md:bg-transparent rounded-full md:rounded-lg border border-gray-200 md:border-[#e5e7eb] text-sm font-medium text-[#0e1b12] peer-checked:bg-[#0e1b12] peer-checked:text-white peer-checked:border-[#0e1b12] hover:border-[#9ca3af] transition-all font-kufi focus:ring-2 ring-primary">
                                        {cut.label}
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Mobile Notes Area */}
                <div className="mt-6 md:hidden">
                    <label className="block text-sm font-bold text-[#0e1b12] font-kufi mb-3">{t('notes_label')}</label>
                    <textarea
                        className="w-full bg-white border border-gray-200 focus:border-primary/50 text-[#0e1b12] text-sm p-4 rounded-2xl focus:outline-none focus:ring-0 transition-colors resize-none placeholder:text-slate-400 font-kufi"
                        placeholder={t('notes_placeholder')}
                        rows={3}
                    ></textarea>
                </div>

                {/* Mobile Trust Signals Grid */}
                <div className="grid grid-cols-2 gap-3 py-4 mt-6 md:hidden border-t border-slate-200">
                    <div className="flex items-center gap-3 p-3 bg-white/50 rounded-xl border border-gray-200">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#C5A059] shadow-sm shrink-0">
                            <span className="material-symbols-outlined text-[20px]">local_shipping</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-900 font-kufi">{t('fast_delivery')}</span>
                            <span className="text-[10px] text-slate-500 font-kufi mt-1 leading-tight">{t('delivery_time')}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/50 rounded-xl border border-gray-200">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#C5A059] shadow-sm shrink-0">
                            <span className="material-symbols-outlined text-[20px]">payments</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-900 font-kufi">{t('secure_payment')}</span>
                            <span className="text-[10px] text-slate-500 font-kufi mt-1 leading-tight">{t('cod_available')}</span>
                        </div>
                    </div>
                </div>

                {/* Desktop Lead Time Box */}
                <div className="hidden md:block bg-[#FBF7F2] rounded-lg p-5 mt-6 border border-[#e8dfcf]">
                    <div className="flex items-start gap-4">
                        <div className="bg-white p-2 rounded-full shadow-sm text-[#C5A059]">
                            <span className="material-symbols-outlined text-[20px]">local_shipping</span>
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-[#5c4a35] font-kufi mb-1">{t('lead_title')}</h4>
                            <p className="text-xs text-[#8c7860] leading-relaxed font-kufi">
                                {t('lead_desc')}
                            </p>
                            <div className="flex gap-2 mt-2 opacity-60">
                                <span className="material-symbols-outlined text-[16px]">flight_takeoff</span>
                                <span className="material-symbols-outlined text-[16px]">package_2</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Desktop Actions */}
                <div className="hidden md:flex gap-4 pt-2 mt-4">
                    {/* Quantity */}
                    <div className="w-32 h-14 relative flex items-center rounded-lg border border-[#d1d5db]">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-10 h-full flex items-center justify-center text-[#6b7280] hover:bg-[#f9fafb] rounded-r-lg"
                        >
                            <span className="material-symbols-outlined text-[18px]">add</span>
                        </button>
                        <input
                            type="text"
                            className="w-full text-center border-none font-medium focus:ring-0 text-[#0e1b12] bg-transparent pb-1"
                            value={quantity}
                            readOnly
                        />
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-10 h-full flex items-center justify-center text-[#6b7280] hover:bg-[#f9fafb] rounded-l-lg"
                        >
                            <span className="material-symbols-outlined text-[18px]">remove</span>
                        </button>
                    </div>

                    {/* Add to Cart */}
                    <button
                        onClick={handleAddToCart}
                        className="flex-1 h-14 bg-[#0e1b12] hover:bg-black text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 font-kufi text-lg pb-1"
                    >
                        <span>{t('add_to_cart')}</span>
                        <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                    </button>
                </div>

                <p className="hidden md:block text-center text-xs text-[#9ca3af] font-kufi mt-2">{t('return_policy')}</p>

                {/* Mobile Add to Cart Area (Inline, NOT sticky) */}
                <div className="md:hidden mt-6 pt-4 border-t border-slate-200">
                    <div className="flex items-center gap-4">
                        {/* Add to Cart Button */}
                        <button
                            onClick={handleAddToCart}
                            className="flex-1 bg-black text-white h-14 rounded-full flex items-center justify-center gap-2 font-bold font-kufi text-base hover:bg-slate-800 transition-colors shadow-lg pb-1"
                        >
                            <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
                            {t('add_to_cart')}
                        </button>
                        {/* Price Summary */}
                        <div className="flex flex-col items-end shrink-0 min-w-[80px]">
                            <span className="text-[10px] text-slate-500 font-kufi uppercase">الإجمالي</span>
                            <span className="text-xl font-bold text-slate-900 leading-tight">
                                {(product.price * quantity).toLocaleString()} {currencySymbol}
                            </span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

"use client";

import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useCartStore } from '@/lib/stores/cart';
import { usePrefsStore } from '@/lib/stores/prefs';
import { useFormattedMoney } from '@/lib/money';
import { trackEvent } from '@/lib/tracking/track';
import { ProductDTO } from '@/lib/data/types';
import { toast } from 'react-hot-toast';

interface ProductInfoProps {
    product: ProductDTO;
}

export function ProductInfo({ product }: ProductInfoProps) {
    const locale = useLocale() as 'ar' | 'en';
    const t = useTranslations('Product.Info');
    const { addItem } = useCartStore();
    const { currency } = usePrefsStore();
    const { format } = useFormattedMoney();
    const router = useRouter();

    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '40');
    const [selectedCut, setSelectedCut] = useState('');

    const productName = product.name[locale];
    const productPrice = product.variants[0]?.priceSar || product.basePriceSar;
    const productBadge = product.badge;

    useEffect(() => {
        trackEvent('view_item', {
            product_id: product.id,
            product_name: productName,
            value: productPrice,
            currency,
        });
    }, [product.id, productName, productPrice, currency]);

    const handleAddToCart = () => {
        addItem({
            id: product.id,
            productId: product.id,
            variantId: `${product.id}-${selectedSize}-${selectedCut}`,
            slug: product.slug,
            name: productName,
            unitPrice: productPrice,
            currency: currency,
            quantity,
            image: product.image,
            size: selectedSize,
            cut: selectedCut === 'quarter'
                ? (locale === 'ar' ? 'ربع كلوش' : 'Quarter Cloche')
                : selectedCut === 'half'
                ? (locale === 'ar' ? 'نص كلوش ( نفس المودل )' : 'Half Cloche (Same as Model)')
                : (locale === 'ar' ? 'قصة عاديه' : 'Straight Cut'),
            color: product.color || undefined,
        });
        trackEvent('add_to_cart', {
            product_id: product.id,
            product_name: productName,
            quantity,
            value: productPrice * quantity,
            currency,
        });
        toast.success(locale === 'en' ? `${productName} added to cart!` : `تمت إضافة ${productName} للسلة بنجاح!`, {
            icon: '🛍️',
        });
    };

    const handleBuyNow = () => {
        handleAddToCart();
        router.push('/checkout');
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
                        <span className="text-xs font-bold text-subtle font-kufi">{t('in_stock')}</span>
                    </span>
                </div>

                {/* Pricing Row */}
                <div className="flex flex-col md:flex-row md:items-end gap-2 md:gap-3 mb-4">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl md:text-3xl font-bold text-[#0e1b12]">
                            {format(productPrice)}
                        </span>
                        {product.variants[0]?.priceSar < product.basePriceSar && (
                            <span className="text-lg text-[#9ca3af] line-through mb-1">
                                {format(product.basePriceSar)}
                            </span>
                        )}
                        {productBadge && (
                            <span className="text-xs font-bold text-[#C5A059] border border-[#C5A059]/30 bg-[#C5A059]/10 px-2 py-1 rounded-md mb-1 font-display">
                                {productBadge[locale]}
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
                            <label className="text-sm font-bold text-[#0e1b12] font-kufi">
                                {t('size')} <span className="text-xs font-normal text-[#6b7280]">(cm)</span>
                            </label>
                            <button className="text-xs text-[#6b7280] underline decoration-[#d1d5db] hover:text-[#0e1b12]">
                                {t('size_guide')}
                            </button>
                        </div>
                        <div className="relative">
                            <select
                                value={selectedSize}
                                onChange={(e) => setSelectedSize(e.target.value)}
                                className="w-full h-11 appearance-none bg-white border border-[#e5e7eb] rounded-lg px-4 pr-10 text-sm font-medium text-[#0e1b12] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-kufi cursor-pointer"
                            >
                                {Array.from({ length: 11 }, (_, i) => String(40 + i * 2)).map((size) => (
                                    <option key={size} value={size}>{size} cm</option>
                                ))}
                            </select>
                            <span className="pointer-events-none absolute inset-y-0 ltr:right-3 rtl:left-3 flex items-center text-[#6b7280]">
                                <span className="material-symbols-outlined text-[18px]">expand_more</span>
                            </span>
                        </div>
                    </div>

                    {/* Cut Selector */}
                    <div>
                        <label className="block text-sm font-bold text-[#0e1b12] font-kufi mb-3">
                            {t('cut')} <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <select
                                value={selectedCut}
                                onChange={(e) => setSelectedCut(e.target.value)}
                                className="w-full h-11 appearance-none bg-white border border-[#e5e7eb] rounded-lg px-4 pr-10 text-sm font-medium text-[#0e1b12] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-kufi cursor-pointer"
                            >
                                <option value="">{t('cut_placeholder')}</option>
                                <option value="quarter">{t('quarter_cloche')}</option>
                                <option value="half">{t('half_cloche')}</option>
                                <option value="straight">{t('straight_cut')}</option>
                            </select>
                            <span className="pointer-events-none absolute inset-y-0 ltr:right-3 rtl:left-3 flex items-center text-[#6b7280]">
                                <span className="material-symbols-outlined text-[18px]">expand_more</span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Mobile Notes Area */}
                <div className="mt-6 md:hidden">
                    <label className="block text-sm font-bold text-[#0e1b12] font-kufi mb-3">{t('notes_label')}</label>
                    <textarea
                        className="w-full bg-white border border-gray-200 focus:border-primary/50 text-[#0e1b12] text-sm p-4 rounded-2xl focus:outline-none focus:ring-0 transition-colors resize-none placeholder:text-subtle font-kufi"
                        placeholder={t('notes_placeholder')}
                        rows={3}
                    ></textarea>
                </div>

                {/* Mobile Trust Signals Grid */}
                <div className="grid grid-cols-2 gap-3 py-4 mt-6 md:hidden border-t border-border">
                    <div className="flex items-center gap-3 p-3 bg-white/50 rounded-xl border border-gray-200">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#C5A059] shadow-sm shrink-0">
                            <span className="material-symbols-outlined text-[20px]">local_shipping</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-on-surface font-kufi">{t('fast_delivery')}</span>
                            <span className="text-[10px] text-subtle font-kufi mt-1 leading-tight">{t('delivery_time')}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/50 rounded-xl border border-gray-200">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#C5A059] shadow-sm shrink-0">
                            <span className="material-symbols-outlined text-[20px]">payments</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-on-surface font-kufi">{t('secure_payment')}</span>
                            <span className="text-[10px] text-subtle font-kufi mt-1 leading-tight">{t('cod_available')}</span>
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
                <div className="hidden md:flex flex-col gap-3 pt-2 mt-4">
                    <div className="flex gap-3">
                        {/* Quantity */}
                        <div className="w-32 h-14 relative flex items-center rounded-lg border border-[#d1d5db]">
                            <button
                                onClick={() => setQuantity(quantity + 1)}
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
                            className="flex-1 h-14 bg-[#0e1b12] hover:bg-black text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 font-kufi text-base pb-1"
                        >
                            <span>{t('add_to_cart')}</span>
                            <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                        </button>
                    </div>

                    {/* Buy Now */}
                    <button
                        onClick={handleBuyNow}
                        className="w-full h-14 bg-primary hover:bg-primary/90 text-[#0e1b12] font-bold rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 font-kufi text-base"
                    >
                        <span>{t('buy_now')}</span>
                        <span className="material-symbols-outlined text-[20px]">bolt</span>
                    </button>
                </div>

                <p className="hidden md:block text-center text-xs text-[#9ca3af] font-kufi mt-2">{t('return_policy')}</p>

                {/* Mobile Add to Cart Area (Inline, NOT sticky) */}
                <div className="md:hidden mt-6 pt-4 border-t border-border">
                    <div className="flex gap-3">
                        <button
                            onClick={handleAddToCart}
                            className="flex-1 bg-[#0e1b12] text-white h-13 rounded-xl flex items-center justify-center gap-2 font-bold font-kufi text-sm transition-colors shadow-lg"
                        >
                            <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
                            {t('add_to_cart')}
                        </button>
                        <button
                            onClick={handleBuyNow}
                            className="flex-1 bg-primary text-[#0e1b12] h-13 rounded-xl flex items-center justify-center gap-2 font-bold font-kufi text-sm transition-colors shadow-lg"
                        >
                            <span className="material-symbols-outlined text-[18px]">bolt</span>
                            {t('buy_now')}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}

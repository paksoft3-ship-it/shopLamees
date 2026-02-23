'use client';

import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { products } from '@/mock/products';
import { usePrefsStore } from '@/lib/stores/prefs';

interface RelatedProductsProps {
    currentProductId: string;
}

export function RelatedProducts({ currentProductId }: RelatedProductsProps) {
    const locale = useLocale();
    const t = useTranslations('Product.Related');
    const { currency } = usePrefsStore();
    const currencySymbol = currency === 'QAR' ? 'ر.ق' : 'ر.س';

    const related = products.filter(p => p.id !== currentProductId).slice(0, 3);
    if (related.length === 0) return null;

    return (
        <div className="lg:col-span-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold font-kufi text-[#0e1b12]">{t('title')}</h3>
                <div className="flex gap-2">
                    <button className="size-10 rounded-full border border-[#e5e7eb] flex items-center justify-center hover:bg-[#f9fafb] text-[#0e1b12]">
                        <span className="material-symbols-outlined rotate-180">arrow_forward</span>
                    </button>
                    <button className="size-10 rounded-full bg-[#0e1b12] text-white flex items-center justify-center hover:bg-black shadow-md">
                        <span className="material-symbols-outlined rotate-180">arrow_back</span>
                    </button>
                </div>
            </div>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((prod) => {
                    const name = typeof prod.name === 'string'
                        ? prod.name
                        : (prod.name as Record<string, string>)[locale] || (prod.name as Record<string, string>)['ar'];
                    const badge = prod.badge
                        ? (typeof prod.badge === 'string' ? prod.badge : (prod.badge as Record<string, string>)[locale])
                        : null;

                    return (
                        <Link key={prod.id} href={`/product/${prod.slug}`} className="group flex flex-col gap-3 cursor-pointer">
                            <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-[#f3f4f6]">
                                <Image
                                    src={prod.image}
                                    alt={name}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                />
                                {badge && (
                                    <div className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded">
                                        {badge}
                                    </div>
                                )}
                                <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="bg-white p-2 rounded-full shadow-lg text-[#0e1b12] hover:text-primary">
                                        <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                                    </button>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-[#0e1b12] font-kufi mb-1">{name}</h4>
                                <p className="text-sm text-[#6b7280]">{prod.price} {currencySymbol}</p>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

'use client';

import { useState, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { products } from '@/mock/products';
import { ProductCard } from '@/components/product/ProductCard';

type SortOption = 'newest' | 'price_low' | 'price_high' | 'rating';

export default function LatestPage() {
    const t = useTranslations('Latest');
    const locale = useLocale() as 'ar' | 'en';
    const [sortOption, setSortOption] = useState<SortOption>('newest');
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [visibleCount, setVisibleCount] = useState(8);

    const sortLabels: Record<SortOption, string> = {
        newest: locale === 'ar' ? 'الأحدث' : 'Newest',
        price_low: locale === 'ar' ? 'السعر: من الأقل' : 'Price: Low to High',
        price_high: locale === 'ar' ? 'السعر: من الأعلى' : 'Price: High to Low',
        rating: locale === 'ar' ? 'الأعلى تقييماً' : 'Highest Rated',
    };

    const sorted = useMemo(() => {
        const list = [...products];
        switch (sortOption) {
            case 'price_low': return list.sort((a, b) => a.price - b.price);
            case 'price_high': return list.sort((a, b) => b.price - a.price);
            case 'rating': return list.sort((a, b) => b.rating - a.rating);
            default: return list; // newest = original order
        }
    }, [sortOption]);

    const visible = sorted.slice(0, visibleCount);
    const hasMore = visibleCount < sorted.length;

    return (
        <section className="bg-[#FBF7F2] min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-6 font-kufi">
                    <Link href="/" className="hover:text-primary transition-colors">{t('home')}</Link>
                    <span className="material-symbols-outlined text-base">chevron_left</span>
                    <span className="font-bold text-slate-900">{t('title')}</span>
                </div>

                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 font-kufi mb-2">
                        {t('title')}
                    </h1>
                    <p className="text-lg text-slate-500 font-kufi">{t('subtitle')}</p>
                </div>

                {/* Filter / Sort Toolbar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    {/* Product Count */}
                    <span className="text-sm font-bold text-slate-700 font-kufi">
                        {locale === 'ar' ? `${sorted.length} منتج` : `${sorted.length} products`}
                    </span>

                    {/* Sort Controls */}
                    <div className="flex gap-3 w-full sm:w-auto">
                        {/* Mobile Filter Button */}
                        <button className="sm:hidden flex-1 flex items-center justify-center gap-2 h-10 bg-white border border-slate-200 rounded-lg active:scale-[0.98] transition-transform">
                            <span className="material-symbols-outlined text-[20px] text-slate-700">filter_list</span>
                            <span className="text-sm font-bold text-slate-700 font-kufi">{locale === 'ar' ? 'تصفية' : 'Filter'}</span>
                        </button>

                        {/* Sort Dropdown */}
                        <div className="relative flex-1 sm:flex-none sm:min-w-[220px]">
                            <button
                                onClick={() => setIsSortOpen(!isSortOpen)}
                                className="flex items-center justify-between w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-900 hover:border-primary focus:outline-none transition-all font-kufi"
                            >
                                <span>{locale === 'ar' ? 'ترتيب: ' : 'Sort: '}{sortLabels[sortOption]}</span>
                                <span className="material-symbols-outlined text-slate-500">expand_more</span>
                            </button>

                            {isSortOpen && (
                                <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                                    {(Object.keys(sortLabels) as SortOption[]).map((opt) => (
                                        <button
                                            key={opt}
                                            onClick={() => { setSortOption(opt); setIsSortOpen(false); }}
                                            className={`w-full text-start px-4 py-2.5 text-sm hover:bg-slate-50 hover:text-primary transition-colors font-kufi ${sortOption === opt ? 'text-primary bg-slate-50 font-bold' : 'text-slate-700'}`}
                                        >
                                            {sortLabels[opt]}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {visible.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {/* Load More */}
                {hasMore && (
                    <div className="flex justify-center mt-12 mb-8">
                        <button
                            onClick={() => setVisibleCount((prev) => prev + 8)}
                            className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-12 rounded-xl shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 flex items-center gap-2 font-kufi"
                        >
                            <span>{t('load_more')}</span>
                            <span className="material-symbols-outlined">expand_more</span>
                        </button>
                    </div>
                )}

                {/* Empty state if somehow no products */}
                {sorted.length === 0 && (
                    <div className="text-center py-20">
                        <span className="material-symbols-outlined text-[64px] text-slate-200 mb-4">inventory_2</span>
                        <p className="text-slate-500 font-kufi">{locale === 'ar' ? 'لا توجد منتجات حالياً' : 'No products available'}</p>
                    </div>
                )}
            </div>
        </section>
    );
}
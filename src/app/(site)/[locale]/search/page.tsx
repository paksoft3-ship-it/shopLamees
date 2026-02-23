'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { ProductCard } from '@/components/product/ProductCard';
import { searchProducts } from '@/lib/data/catalog';
import { ProductDTO } from '@/lib/data/types';

type SortOption = 'relevance' | 'price_low' | 'price_high' | 'rating';

export default function SearchPage() {
    const t = useTranslations('Search');
    const locale = useLocale() as 'ar' | 'en';
    const searchParams = useSearchParams(); // This line was already present and correctly placed.
    const initialQuery = searchParams.get('q') || '';

    const [query, setQuery] = useState(initialQuery);
    const [results, setResults] = useState<ProductDTO[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [sortOption, setSortOption] = useState<SortOption>('relevance');
    const [isSortOpen, setIsSortOpen] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);
    const sortRef = useRef<HTMLDivElement>(null);

    const suggestions = locale === 'ar'
        ? ['عباية', 'نقاب', 'طرحة', 'كريب', 'حرير']
        : ['Abaya', 'Niqab', 'Scarf', 'Crepe', 'Silk'];

    const sortLabels: Record<SortOption, string> = {
        relevance: locale === 'ar' ? 'الأكثر تطابقاً' : 'Most Relevant',
        price_low: locale === 'ar' ? 'السعر: من الأقل' : 'Price: Low to High',
        price_high: locale === 'ar' ? 'السعر: من الأعلى' : 'Price: High to Low',
        rating: locale === 'ar' ? 'الأعلى تقييماً' : 'Highest Rated',
    };

    // Close sort on outside click
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (sortRef.current && !sortRef.current.contains(e.target as Node)) setIsSortOpen(false);
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    // Perform Search
    useEffect(() => {
        const performSearch = async () => {
            if (!query.trim()) {
                setResults([]);
                return;
            }
            setIsLoading(true);
            try {
                const searchResults = await searchProducts(query);
                setResults(searchResults);
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        const timer = setTimeout(performSearch, 500); // Debounce
        return () => clearTimeout(timer);
    }, [query]);

    // Sort results
    const sortedResults = useMemo(() => {
        const list = [...results];
        switch (sortOption) {
            case 'price_low': return list.sort((a, b) => (a.variants[0]?.priceSar || a.basePriceSar) - (b.variants[0]?.priceSar || b.basePriceSar));
            case 'price_high': return list.sort((a, b) => (b.variants[0]?.priceSar || b.basePriceSar) - (a.variants[0]?.priceSar || a.basePriceSar));
            case 'rating': return list.sort((a, b) => b.rating - a.rating);
            default: return list;
        }
    }, [results, sortOption]);

    const hasResults = sortedResults.length > 0;
    const hasQuery = query.trim().length > 0;

    return (
        <section className="bg-[#FBF7F2] min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Search Input */}
                <div className="w-full max-w-3xl mx-auto mb-10">
                    <div className="relative flex items-center bg-white h-14 w-full border border-slate-200 rounded-xl shadow-sm focus-within:shadow-md focus-within:border-primary/30 transition-all px-4">
                        <span className="material-symbols-outlined text-primary text-2xl ltr:mr-3 rtl:ml-3">search</span>
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={t('placeholder')}
                            className="w-full bg-transparent border-none focus:ring-0 text-lg font-medium text-slate-900 placeholder:text-slate-400 font-kufi"
                        />
                        {(query || isLoading) && (
                            <div className="flex items-center gap-2">
                                {isLoading && <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />}
                                {query && (
                                    <button
                                        onClick={() => { setQuery(''); inputRef.current?.focus(); }}
                                        className="text-slate-400 hover:text-primary transition-colors p-2"
                                    >
                                        <span className="material-symbols-outlined">close</span>
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Results State */}
                {hasQuery && (hasResults || isLoading) && (
                    <>
                        {/* Results Header */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 font-kufi mb-1">
                                    {t('results_for')} <span className="text-primary">{query}</span>
                                </h1>
                                <p className="text-slate-500 font-kufi">{results.length} {locale === 'ar' ? 'منتج' : 'products'}</p>
                            </div>

                            {/* Sort */}
                            {hasResults && (
                                <div ref={sortRef} className="relative min-w-[200px]">
                                    <button
                                        onClick={() => setIsSortOpen(!isSortOpen)}
                                        className="flex items-center justify-between w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-900 hover:border-primary transition-all font-kufi"
                                    >
                                        <span>{locale === 'ar' ? 'ترتيب: ' : 'Sort: '}{sortLabels[sortOption]}</span>
                                        <span className={`material-symbols-outlined text-slate-500 transition-transform ${isSortOpen ? 'rotate-180' : ''}`}>expand_more</span>
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
                            )}
                        </div>

                        {/* Product Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                            {sortedResults.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </>
                )}

                {/* Empty State */}
                {hasQuery && !hasResults && !isLoading && (
                    <div className="flex flex-col items-center justify-center text-center py-16 max-w-md mx-auto">
                        {/* Illustration */}
                        <div className="relative mb-8">
                            <div className="absolute -inset-4 bg-primary/5 rounded-full blur-2xl" />
                            <div className="relative bg-white p-8 rounded-full shadow-sm border border-slate-100">
                                <span className="material-symbols-outlined text-6xl text-slate-200">styler</span>
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-sm border border-slate-100">
                                <span className="material-symbols-outlined text-2xl text-primary">search_off</span>
                            </div>
                        </div>

                        <h2 className="text-xl font-bold text-slate-900 font-kufi mb-2">{t('no_results')}</h2>
                        <p className="text-sm text-slate-500 font-kufi leading-relaxed mb-8 max-w-xs">{t('no_results_hint')}</p>

                        {/* Suggestion Chips */}
                        <div className="w-full mb-8">
                            <p className="text-xs font-bold text-slate-500 mb-3 font-kufi">{t('popular')}</p>
                            <div className="flex flex-wrap justify-center gap-2">
                                {suggestions.map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setQuery(s)}
                                        className="px-5 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-full hover:border-primary hover:text-primary transition-colors font-kufi"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Link
                            href="/"
                            className="bg-slate-900 text-white font-bold py-3 px-10 rounded-full hover:bg-slate-800 transition-all flex items-center gap-2 font-kufi"
                        >
                            <span>{t('back_home')}</span>
                            <span className="material-symbols-outlined text-sm rtl:rotate-180">arrow_back</span>
                        </Link>
                    </div>
                )}

                {/* Initial State — no query yet */}
                {!hasQuery && (
                    <div className="flex flex-col items-center justify-center text-center py-16 max-w-md mx-auto">
                        <span className="material-symbols-outlined text-6xl text-slate-200 mb-4">search</span>
                        <h2 className="text-xl font-bold text-slate-900 font-kufi mb-2">{t('start_searching')}</h2>
                        <p className="text-sm text-slate-500 font-kufi mb-8">{t('start_hint')}</p>

                        {/* Suggestions */}
                        <div className="w-full">
                            <p className="text-xs font-bold text-slate-500 mb-3 font-kufi">{t('popular')}</p>
                            <div className="flex flex-wrap justify-center gap-2">
                                {suggestions.map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setQuery(s)}
                                        className="px-5 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-full hover:border-primary hover:text-primary transition-colors font-kufi"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
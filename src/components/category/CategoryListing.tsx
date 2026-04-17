'use client';
import { useState, useEffect, useMemo, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { CategoryDTO, ProductDTO } from '@/lib/data/types';
import { trackEvent } from '@/lib/tracking/track';
import { ProductCard } from '../product/ProductCard';
import { Link } from '@/i18n/navigation';

const PAGE_SIZE = 12;

export function CategoryListing({ category, initialProducts }: { category: CategoryDTO, initialProducts: ProductDTO[] }) {
    const t = useTranslations('Category');
    const locale = useLocale() as 'ar' | 'en';
    const tSort = useTranslations('Category.Sort');
    const tFilters = useTranslations('Category.Filters');

    // Derive filter options from real product data
    const maxProductPrice = useMemo(() => {
        const prices = initialProducts.map(p => p.variants[0]?.priceSar || p.basePriceSar);
        return Math.ceil(Math.max(...prices, 500) / 100) * 100;
    }, [initialProducts]);

    const availableColors = useMemo(() => {
        const seen = new Set<string>();
        initialProducts.forEach(p => { if (p.color) seen.add(p.color); });
        return Array.from(seen);
    }, [initialProducts]);

    const availableFabrics = useMemo(() => {
        const seen = new Set<string>();
        initialProducts.forEach(p => { if (p.fabric) seen.add(p.fabric); });
        return Array.from(seen);
    }, [initialProducts]);

    const availableSizes = useMemo(() => {
        const seen = new Set<string>();
        initialProducts.forEach(p => p.sizes.forEach(s => seen.add(s)));
        return Array.from(seen);
    }, [initialProducts]);

    // Filter & sort state
    const [sortOption, setSortOption] = useState('suggestions');
    const [priceMin, setPriceMin] = useState(0);
    const [priceMax, setPriceMax] = useState(maxProductPrice);
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    const [selectedFabrics, setSelectedFabrics] = useState<string[]>([]);
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [page, setPage] = useState(1);

    const sortRef = useRef<HTMLDivElement>(null);

    // Close sort dropdown on outside click
    useEffect(() => {
        if (!isMenuOpen) return;
        const handler = (e: MouseEvent) => {
            if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [isMenuOpen]);

    // Tracking page view
    useEffect(() => {
        trackEvent('page_view', { page_type: 'category', category_id: category.id });
        trackEvent('view_item_list', {
            list_id: `${category.slug}_${locale}`,
            items: initialProducts.map(p => ({ item_id: p.id, item_name: p.name[locale] }))
        });
    }, [category, initialProducts, locale]);

    // Reset to page 1 when any filter changes
    useEffect(() => { setPage(1); }, [sortOption, priceMin, priceMax, selectedColors, selectedFabrics, selectedSizes]);

    // Apply filtering + sorting
    const filtered = useMemo(() => {
        let result = [...initialProducts];

        result = result.filter(p => {
            const price = p.variants[0]?.priceSar || p.basePriceSar;
            return price >= priceMin && price <= priceMax;
        });

        if (selectedColors.length > 0) {
            result = result.filter(p => p.color && selectedColors.includes(p.color));
        }

        if (selectedFabrics.length > 0) {
            result = result.filter(p => p.fabric && selectedFabrics.includes(p.fabric));
        }

        if (selectedSizes.length > 0) {
            result = result.filter(p => p.sizes.some(s => selectedSizes.includes(s)));
        }

        if (sortOption === 'price_low_high') {
            result.sort((a, b) => (a.variants[0]?.priceSar || a.basePriceSar) - (b.variants[0]?.priceSar || b.basePriceSar));
        } else if (sortOption === 'price_high_low') {
            result.sort((a, b) => (b.variants[0]?.priceSar || b.basePriceSar) - (a.variants[0]?.priceSar || a.basePriceSar));
        } else if (sortOption === 'highest_rated') {
            result.sort((a, b) => b.rating - a.rating);
        } else if (sortOption === 'bestseller') {
            result.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
        }

        return result;
    }, [sortOption, priceMin, priceMax, selectedColors, selectedFabrics, selectedSizes, initialProducts]);

    const products = filtered.slice(0, page * PAGE_SIZE);
    const hasMore = products.length < filtered.length;

    const activeFilterCount =
        selectedColors.length +
        selectedFabrics.length +
        selectedSizes.length +
        (priceMin > 0 || priceMax < maxProductPrice ? 1 : 0);

    const clearAll = () => {
        setPriceMin(0);
        setPriceMax(maxProductPrice);
        setSelectedColors([]);
        setSelectedFabrics([]);
        setSelectedSizes([]);
        setSortOption('suggestions');
    };

    const toggleColor = (color: string) => {
        setSelectedColors(prev => prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]);
        trackEvent('filter_apply', { type: 'color', value: color });
    };

    const toggleFabric = (fabric: string) => {
        setSelectedFabrics(prev => prev.includes(fabric) ? prev.filter(f => f !== fabric) : [...prev, fabric]);
        trackEvent('filter_apply', { type: 'fabric', value: fabric });
    };

    const toggleSize = (size: string) => {
        setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);
        trackEvent('filter_apply', { type: 'size', value: size });
    };

    const handleSort = (option: string) => {
        setSortOption(option);
        setIsMenuOpen(false);
        trackEvent('sort_apply', { sort_by: option, category_slug: category.slug });
    };

    return (
        <main className="flex-grow max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex mb-6">
                <ol className="inline-flex items-center gap-2 text-sm text-text-sub rtl:space-x-reverse">
                    <li className="inline-flex items-center">
                        <Link href="/" className="hover:text-primary transition-colors">{t('Breadcrumbs.home')}</Link>
                    </li>
                    <li>
                        <span className="material-symbols-outlined text-xs mx-1 rtl:rotate-180">chevron_right</span>
                    </li>
                    <li>
                        <Link href="/category/all" className="hover:text-primary transition-colors">{t('Breadcrumbs.categories')}</Link>
                    </li>
                    <li>
                        <span className="material-symbols-outlined text-xs mx-1 rtl:rotate-180">chevron_right</span>
                    </li>
                    <li aria-current="page">
                        <span className="font-bold text-text-main">{category.name[locale]}</span>
                    </li>
                </ol>
            </nav>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-border">
                <div>
                    <h1 className="text-4xl font-bold font-display text-text-main mb-2">{category.name[locale]}</h1>
                    <p className="text-text-sub text-lg">{t('products_available', { count: filtered.length })}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0 items-start sm:items-center">
                    {activeFilterCount > 0 && (
                        <button
                            onClick={clearAll}
                            className="text-sm text-red-500 underline hover:text-red-700 transition-colors"
                        >
                            {t('clear_all')} ({activeFilterCount})
                        </button>
                    )}

                    <div ref={sortRef} className="relative min-w-[180px]">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="w-full flex items-center justify-between gap-2 bg-white px-4 py-2.5 rounded-lg border border-border text-sm text-text-main hover:border-primary transition-colors"
                        >
                            <span className="font-body">{t('sort_by', { option: tSort(sortOption as string) })}</span>
                            <span className="material-symbols-outlined text-lg">expand_more</span>
                        </button>

                        {isMenuOpen && (
                            <div className="absolute end-0 mt-1 w-full bg-white border border-border rounded-lg shadow-lg z-10 overflow-hidden">
                                {['suggestions', 'bestseller', 'highest_rated', 'price_high_low', 'price_low_high'].map(opt => (
                                    <button
                                        key={opt}
                                        onClick={() => handleSort(opt)}
                                        className={`w-full text-start px-4 py-2 text-sm hover:bg-background-light hover:text-primary transition-colors ${sortOption === opt ? 'text-primary bg-background-light font-bold' : 'text-text-main'}`}
                                    >
                                        {tSort(opt as string)}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Sidebar Filters */}
                <aside className="lg:col-span-3 space-y-6">
                    {/* Price Range */}
                    <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-lg font-display">{tFilters('price')}</h3>
                            <span className="material-symbols-outlined text-text-sub">expand_less</span>
                        </div>
                        <div className="relative h-2 mt-8 mb-6">
                            {/* Track */}
                            <div className="absolute inset-0 bg-gray-200 rounded-full"></div>
                            {/* Active range fill */}
                            <div
                                className="absolute h-full bg-primary rounded-full"
                                style={{
                                    left: `${(priceMin / maxProductPrice) * 100}%`,
                                    right: `${100 - (priceMax / maxProductPrice) * 100}%`,
                                }}
                            />
                            {/* Min thumb (transparent range input) */}
                            <input
                                type="range"
                                min={0}
                                max={maxProductPrice}
                                step={50}
                                value={priceMin}
                                onChange={e => setPriceMin(Math.min(Number(e.target.value), priceMax - 50))}
                                className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
                                style={{ zIndex: priceMin > maxProductPrice / 2 ? 5 : 3 }}
                            />
                            {/* Max thumb */}
                            <input
                                type="range"
                                min={0}
                                max={maxProductPrice}
                                step={50}
                                value={priceMax}
                                onChange={e => setPriceMax(Math.max(Number(e.target.value), priceMin + 50))}
                                className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
                                style={{ zIndex: 4 }}
                            />
                            {/* Visual thumb min */}
                            <div
                                className="absolute top-1/2 -mt-2.5 w-5 h-5 bg-primary rounded-full border-2 border-white shadow pointer-events-none"
                                style={{ left: `${(priceMin / maxProductPrice) * 100}%`, transform: 'translateX(-50%)' }}
                            />
                            {/* Visual thumb max */}
                            <div
                                className="absolute top-1/2 -mt-2.5 w-5 h-5 bg-primary rounded-full border-2 border-white shadow pointer-events-none"
                                style={{ left: `${(priceMax / maxProductPrice) * 100}%`, transform: 'translateX(-50%)' }}
                            />
                        </div>
                        <div className="flex items-center justify-between text-sm font-medium text-text-sub font-display">
                            <span>{priceMin} {locale === 'ar' ? 'ر.س' : 'SAR'}</span>
                            <span>{priceMax} {locale === 'ar' ? 'ر.س' : 'SAR'}</span>
                        </div>
                    </div>

                    {/* Color filter — only if products have color data */}
                    {availableColors.length > 0 && (
                        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-lg font-display">{tFilters('color') || (locale === 'ar' ? 'اللون' : 'Color')}</h3>
                                <span className="material-symbols-outlined text-text-sub">expand_less</span>
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                {availableColors.map(color => (
                                    <button
                                        key={color}
                                        onClick={() => toggleColor(color)}
                                        className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${selectedColors.includes(color) ? 'bg-primary border-primary text-white' : 'border-gray-200 bg-white text-gray-600 hover:border-primary'}`}
                                    >
                                        {color}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Fabric filter — only if products have fabric data */}
                    {availableFabrics.length > 0 && (
                        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-lg font-display">{tFilters('fabric') || (locale === 'ar' ? 'الخامة' : 'Fabric')}</h3>
                                <span className="material-symbols-outlined text-text-sub">expand_less</span>
                            </div>
                            <div className="space-y-4">
                                {availableFabrics.map(fabric => (
                                    <label key={fabric} className="flex items-center justify-between cursor-pointer group px-1">
                                        <span className="text-slate-700 font-medium group-hover:text-primary transition-colors">{fabric}</span>
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                                            checked={selectedFabrics.includes(fabric)}
                                            onChange={() => toggleFabric(fabric)}
                                        />
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Size filter — only if products have size variants */}
                    {availableSizes.length > 0 && (
                        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-lg font-display">{tFilters('size')}</h3>
                                <span className="material-symbols-outlined text-text-sub">expand_less</span>
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                {availableSizes.map(size => (
                                    <button
                                        key={size}
                                        onClick={() => toggleSize(size)}
                                        className={`flex items-center justify-center min-w-[2.5rem] h-10 px-3 rounded-lg border text-sm font-medium transition-all font-display ${selectedSizes.includes(size) ? 'bg-primary border-primary text-white' : 'border-gray-200 bg-white text-gray-600 hover:border-primary'}`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </aside>

                {/* Product Grid */}
                <section className="lg:col-span-9">
                    {products.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 text-text-sub">
                            <span className="material-symbols-outlined text-6xl mb-4 opacity-30">search_off</span>
                            <p className="text-lg font-medium">
                                {locale === 'ar' ? 'لا توجد منتجات تطابق الفلاتر المختارة' : 'No products match the selected filters'}
                            </p>
                            <button onClick={clearAll} className="mt-4 text-primary underline text-sm">
                                {t('clear_all')}
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                            {products.map((prod) => (
                                <ProductCard key={prod.id} product={prod} />
                            ))}
                        </div>
                    )}

                    {hasMore && (
                        <div className="mt-12 flex justify-center">
                            <button
                                onClick={() => setPage(p => p + 1)}
                                className="px-8 py-3 bg-white hover:bg-background-light text-text-main border border-border hover:border-primary rounded-xl font-bold transition-all duration-200 flex items-center gap-2 group shadow-sm"
                            >
                                <span className="material-symbols-outlined group-hover:animate-spin">sync</span>
                                {t('load_more')}
                            </button>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}

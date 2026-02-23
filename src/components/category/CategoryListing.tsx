'use client';
import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { CategoryDTO, ProductDTO } from '@/lib/data/types';
import { trackEvent } from '@/lib/tracking/track';
import { ProductCard } from '../product/ProductCard';
import { Link } from '@/i18n/navigation';

export function CategoryListing({ category, initialProducts }: { category: CategoryDTO, initialProducts: ProductDTO[] }) {
    const t = useTranslations('Category');
    const locale = useLocale() as 'ar' | 'en';
    const tSort = useTranslations('Category.Sort');
    const tFilters = useTranslations('Category.Filters');

    // Filtering State
    const [products, setProducts] = useState(initialProducts);
    const [sortOption, setSortOption] = useState('suggestions');
    const [priceRange] = useState({ min: 0, max: 1000 });
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Tracking Page View
    useEffect(() => {
        trackEvent('page_view', { page_type: 'category', category_id: category.id });
        trackEvent('view_item_list', {
            list_id: `${category.slug}_${locale}`,
            items: initialProducts.map(p => ({ item_id: p.id, item_name: p.name[locale] }))
        });
    }, [category, initialProducts, locale]);

    // Apply Sorting/Filtering Math (Mocked)
    useEffect(() => {
        let result = [...initialProducts];

        // Mock filter logic
        result = result.filter(p => {
            const price = p.variants[0]?.priceSar || p.basePriceSar;
            return price >= priceRange.min && price <= priceRange.max;
        });

        // Sort
        if (sortOption === 'price_low_high') {
            result.sort((a, b) => (a.variants[0]?.priceSar || a.basePriceSar) - (b.variants[0]?.priceSar || b.basePriceSar));
        } else if (sortOption === 'price_high_low') {
            result.sort((a, b) => (b.variants[0]?.priceSar || b.basePriceSar) - (a.variants[0]?.priceSar || a.basePriceSar));
        } else if (sortOption === 'highest_rated') {
            result.sort((a, b) => b.rating - a.rating);
        }

        setProducts(result);
    }, [sortOption, priceRange, initialProducts]);

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

            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-border">
                <div>
                    <h1 className="text-4xl font-bold font-display text-text-main mb-2">{category.name[locale]}</h1>
                    <p className="text-text-sub text-lg">{t('products_available', { count: products.length })}</p>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0 items-start sm:items-center">
                    <div className="flex flex-wrap gap-2">
                        <button className="text-sm text-text-sub underline hover:text-primary transition-colors mr-2">
                            {t('clear_all')}
                        </button>
                    </div>

                    <div className="relative group min-w-[180px]">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="w-full flex items-center justify-between gap-2 bg-white px-4 py-2.5 rounded-lg border border-border text-sm text-text-main hover:border-primary transition-colors"
                        >
                            <span className="font-body">{t('sort_by', { option: tSort(sortOption as string) })}</span>
                            <span className="material-symbols-outlined text-lg">expand_more</span>
                        </button>

                        {(isMenuOpen || true) && ( // Keeping it true but handling opacity for CSS hover support like reference html
                            <div className="absolute left-0 mt-1 w-full bg-white border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 overflow-hidden">
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
                            <span className="material-symbols-outlined cursor-pointer text-text-sub">expand_less</span>
                        </div>
                        <div className="relative h-2 bg-gray-200 rounded-full mt-6 mb-6">
                            <div className="absolute left-1/4 right-1/4 h-full bg-primary rounded-full"></div>
                            <div className="absolute top-1/2 -mt-2.5 left-1/4 w-5 h-5 bg-primary rounded-full border-2 border-white shadow cursor-pointer transform -translate-x-1/2"></div>
                            <div className="absolute top-1/2 -mt-2.5 right-1/4 w-5 h-5 bg-primary rounded-full border-2 border-white shadow cursor-pointer transform translate-x-1/2"></div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-text-sub font-display">
                            <span>0</span>
                            <span>1000+</span>
                        </div>
                    </div>

                    {/* Color filter */}
                    <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-lg font-display">{tFilters('color') || 'اللون'}</h3>
                            <span className="material-symbols-outlined cursor-pointer text-text-sub">expand_less</span>
                        </div>
                        <div className="flex gap-3 justify-end">
                            <button className="w-8 h-8 rounded-full bg-[#f8fafc] border border-gray-200 hover:ring-2 ring-offset-2 ring-primary focus:outline-none transition-all"></button>
                            <button className="w-8 h-8 rounded-full bg-[#78350f] hover:ring-2 ring-offset-2 ring-primary focus:outline-none transition-all"></button>
                            <button className="w-8 h-8 rounded-full bg-[#1e293b] hover:ring-2 ring-offset-2 ring-primary focus:outline-none transition-all"></button>
                            <button className="w-8 h-8 rounded-full bg-black ring-2 ring-offset-2 ring-primary focus:outline-none transition-all"></button>
                        </div>
                    </div>

                    {/* Fabric Filter */}
                    <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-lg font-display">{tFilters('fabric') || 'الخامة'}</h3>
                            <span className="material-symbols-outlined cursor-pointer text-text-sub">expand_less</span>
                        </div>
                        <div className="space-y-4">
                            {['حرير', 'كريب', 'كتان', 'شيفون'].map((fabric, idx) => (
                                <label key={fabric} className="flex items-center justify-between cursor-pointer group px-1">
                                    <span className="text-slate-700 font-medium group-hover:text-primary transition-colors">{fabric}</span>
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer transition-colors"
                                        defaultChecked={idx === 2}
                                        onChange={() => trackEvent('filter_apply', { type: 'fabric', value: fabric })}
                                    />
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Size Filter */}
                    <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-lg font-display">{tFilters('size')}</h3>
                            <span className="material-symbols-outlined cursor-pointer text-text-sub">expand_less</span>
                        </div>
                        <div className="flex gap-2">
                            {['S', 'M', 'L', 'XL'].map((size) => (
                                <label key={size} className="cursor-pointer flex-1">
                                    <input className="peer sr-only" type="checkbox" onChange={() => trackEvent('filter_apply', { type: 'size', value: size })} />
                                    <span className="flex items-center justify-center w-full h-10 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-600 peer-checked:bg-primary peer-checked:border-primary peer-checked:text-white hover:border-primary transition-all font-display">
                                        {size}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Product Grid */}
                <section className="lg:col-span-9">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {products.map((prod) => (
                            <ProductCard key={prod.id} product={prod} />
                        ))}
                    </div>

                    {/* Load More */}
                    <div className="mt-12 flex justify-center">
                        <button className="px-8 py-3 bg-white hover:bg-background-light text-text-main border border-border hover:border-primary rounded-xl font-bold transition-all duration-200 flex items-center gap-2 group shadow-sm">
                            <span className="material-symbols-outlined group-hover:animate-spin">sync</span>
                            {t('load_more')}
                        </button>
                    </div>
                </section>
            </div>
        </main>
    );
}

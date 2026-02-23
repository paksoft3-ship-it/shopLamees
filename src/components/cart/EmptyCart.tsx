'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { products } from '@/mock/products';
import { ProductCard } from '@/components/product/ProductCard';

export function EmptyCart() {
    const t = useTranslations('Cart');
    const locale = useLocale() as 'ar' | 'en';

    const recommended = products.filter(p => p.availability !== false).slice(0, 4);

    return (
        <div className="flex flex-col items-center">
            {/* Empty State */}
            <div className="w-full max-w-lg mx-auto flex flex-col items-center text-center py-12 md:py-20">
                {/* Decorative glow */}
                <div className="relative w-48 h-48 mb-8">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#f0eadd] to-transparent rounded-full opacity-50 blur-3xl transform scale-75" />
                    <div className="relative z-10 w-full h-full bg-[#FBF7F2] rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-[80px] text-[#C5A059] opacity-70">
                            shopping_bag
                        </span>
                    </div>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4 font-kufi">
                    {t('empty_title')}
                </h2>
                <p className="text-slate-500 text-base md:text-lg leading-relaxed max-w-md mb-10 font-kufi">
                    {t('empty_desc')}
                </p>

                {/* Primary CTA */}
                <Link
                    href="/category/all"
                    className="group relative inline-flex items-center justify-center px-8 py-4 bg-[#0e1b12] text-white text-base font-bold rounded-full overflow-hidden transition-all hover:shadow-lg hover:scale-105 mb-12 font-kufi"
                >
                    <span className="relative flex items-center gap-2">
                        {t('continue_shopping')}
                        <span className="material-symbols-outlined text-lg rtl:rotate-180">arrow_right_alt</span>
                    </span>
                </Link>

                {/* Quick Category Links */}
                <div className="w-full border-t border-[#e5e0d8] pt-10">
                    <span className="block text-sm font-bold text-slate-500 tracking-wider uppercase mb-6 font-kufi">
                        {locale === 'ar' ? 'قد يعجبك' : 'You might like'}
                    </span>
                    <div className="flex flex-wrap justify-center gap-3">
                        {[
                            { icon: 'checkroom', label: locale === 'ar' ? 'عبايات' : 'Abayas', href: '/category/abayas' },
                            { icon: 'visibility', label: locale === 'ar' ? 'نقاب' : 'Niqab', href: '/category/niqab' },
                            { icon: 'filter_hdr', label: locale === 'ar' ? 'طرح' : 'Scarves', href: '/category/scarves' },
                            { icon: 'diamond', label: locale === 'ar' ? 'إكسسوارات' : 'Accessories', href: '/category/accessories' },
                        ].map((cat) => (
                            <Link
                                key={cat.icon}
                                href={cat.href}
                                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#e5e0d8] rounded-full hover:border-slate-900 hover:shadow-md transition-all duration-300 group"
                            >
                                <span className="material-symbols-outlined text-[#C5A059] group-hover:text-slate-900 transition-colors text-[20px]">
                                    {cat.icon}
                                </span>
                                <span className="text-sm font-medium font-kufi">{cat.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recommended Products */}
            {recommended.length > 0 && (
                <div className="w-full mt-12">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold font-kufi">
                            {locale === 'ar' ? 'وصلنا حديثاً' : 'New Arrivals'}
                        </h3>
                        <Link
                            href="/category/all"
                            className="text-sm font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1 font-kufi"
                        >
                            {locale === 'ar' ? 'عرض الكل' : 'View All'}
                            <span className="material-symbols-outlined text-lg rtl:rotate-180">arrow_right_alt</span>
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {recommended.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

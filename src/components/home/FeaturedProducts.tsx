'use client';
import { useTranslations } from 'next-intl';
import { products } from '@/mock/products';
import { Link } from '@/i18n/navigation';
import { ProductCard } from '@/components/product/ProductCard';
import { ArrowRight } from 'lucide-react';

export function FeaturedProducts() {
    const t = useTranslations('Home.FeaturedProducts');
    const featured = products.slice(0, 4);

    return (
        <section className="py-16 lg:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <h2 className="text-3xl font-bold font-display text-on-surface mb-2">{t('title')}</h2>
                        <p className="text-subtle">{t('subtitle')}</p>
                    </div>
                    <Link href="/latest" className="hidden sm:flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
                        {t('view_all')}
                        <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                    </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {featured.map((prod) => (
                        <ProductCard key={prod.id} product={prod} />
                    ))}
                </div>
                <div className="mt-10 text-center sm:hidden">
                    <Link href="/latest" className="bg-surface border border-border text-on-surface px-6 py-3 rounded-full font-bold shadow-sm w-full block hover:bg-background-light transition-colors">
                        {t('view_all')}
                    </Link>
                </div>
            </div>
        </section>
    );
}

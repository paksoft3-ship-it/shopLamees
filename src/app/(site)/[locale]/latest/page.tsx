import { setRequestLocale } from 'next-intl/server';
import { getAllProducts } from '@/lib/data/catalog';
import { LatestListing } from './LatestListing';
import { Metadata } from 'next';
import { getLocalizedUrl } from '@/lib/site';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
    const title = locale === 'ar' ? 'أحدث المنتجات | Lamees Abaya' : 'Latest Products | Lamees Abaya';
    const description = locale === 'ar'
        ? 'اكتشفي أحدث منتجات لاميس عباية.'
        : 'Discover the latest products at Lamees Abaya.';

    return {
        title,
        description,
        alternates: {
            canonical: getLocalizedUrl(locale as 'ar' | 'en', 'latest'),
            languages: {
                ar: getLocalizedUrl('ar', 'latest'),
                en: getLocalizedUrl('en', 'latest'),
            },
        },
    };
}

export default async function LatestPage({ params: { locale } }: { params: { locale: string } }) {
    setRequestLocale(locale);
    const products = await getAllProducts();

    return <LatestListing initialProducts={products} />;
}

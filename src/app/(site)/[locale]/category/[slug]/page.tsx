import { setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { CategoryListing } from '@/components/category/CategoryListing';
import { Metadata } from 'next';
import { getCategoryBySlug, getProductsByCategory, getAllProducts } from '@/lib/data/catalog';
import { getLocalizedUrl } from '@/lib/site';

type Props = {
    params: { locale: string; slug: string };
};

export async function generateMetadata({ params: { locale, slug } }: Props): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: 'Category.Breadcrumbs' });
    const path = slug === 'all' ? 'category/all' : `category/${slug}`;

    if (slug === 'all') {
        const title = locale === 'ar' ? 'جميع المنتجات' : 'All Products';
        const description = locale === 'ar' ? 'تصفح جميع منتجات لاميس عباية.' : 'Browse all products at Lamees Abaya.';
        return {
            title: `${title} | ${t('home')} - Shop Lamees`,
            description,
            alternates: {
                canonical: getLocalizedUrl(locale as 'ar' | 'en', path),
                languages: {
                    ar: getLocalizedUrl('ar', path),
                    en: getLocalizedUrl('en', path),
                },
            },
        };
    }

    const category = await getCategoryBySlug(slug);
    if (!category) return {};

    const title = locale === 'ar' ? category.nameAr : category.nameEn;
    const description = locale === 'ar'
        ? `تسوق منتجات ${category.nameAr} من لاميس عباية.`
        : `Shop ${category.nameEn} products from Lamees Abaya.`;

    return {
        title: `${title} | ${t('home')} - Shop Lamees`,
        description,
        alternates: {
            canonical: getLocalizedUrl(locale as 'ar' | 'en', path),
            languages: {
                ar: getLocalizedUrl('ar', path),
                en: getLocalizedUrl('en', path),
            },
        },
    };
}

import { CategoryDTO } from '@/lib/data/types';

export default async function CategoryPage({ params: { locale, slug } }: Props) {
    setRequestLocale(locale);

    let category: CategoryDTO;
    let initialProducts;

    if (slug === 'all') {
        category = {
            id: 'all',
            slug: 'all',
            nameAr: 'الكل',
            nameEn: 'All',
            image: null,
            sortOrder: 0,
            createdAt: new Date(),
            name: { ar: 'الكل', en: 'All' }
        };
        initialProducts = await getAllProducts();
    } else {
        const dbCategory = await getCategoryBySlug(slug);
        if (!dbCategory) notFound();

        category = dbCategory;
        initialProducts = await getProductsByCategory(slug);
    }

    return (
        <CategoryListing
            category={category}
            initialProducts={initialProducts}
        />
    );
}

import { setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { CategoryListing } from '@/components/category/CategoryListing';
import { Metadata } from 'next';
import { getCategoryBySlug, getProductsByCategory, getAllProducts } from '@/lib/data/catalog';

type Props = {
    params: { locale: string; slug: string };
};

export async function generateMetadata({ params: { locale, slug } }: Props): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: 'Category.Breadcrumbs' });

    if (slug === 'all') {
        const title = locale === 'ar' ? 'جميع المنتجات' : 'All Products';
        return { title: `${title} | ${t('home')} - Shop Lamees` };
    }

    const category = await getCategoryBySlug(slug);
    if (!category) return {};

    const title = locale === 'ar' ? category.nameAr : category.nameEn;

    return {
        title: `${title} | ${t('home')} - Shop Lamees`,
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
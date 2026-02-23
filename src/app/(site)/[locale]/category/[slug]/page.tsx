import { setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { categories } from '@/mock/categories';
import { products } from '@/mock/products';
import { CategoryListing } from '@/components/category/CategoryListing';
import { Metadata } from 'next';

type Props = {
    params: { locale: string; slug: string };
};

export async function generateMetadata({ params: { locale, slug } }: Props): Promise<Metadata> {
    const category = categories.find((c) => c.slug === slug);
    if (!category && slug !== 'all') return {};

    const t = await getTranslations({ locale, namespace: 'Category.Breadcrumbs' });
    const title = slug === 'all' ? (locale === 'ar' ? 'الكل' : 'All') : category?.name[locale as 'ar' | 'en'];

    return {
        title: `${title} | ${t('home')} - Shop Lamees`,
    };
}

export default function CategoryPage({ params: { locale, slug } }: Props) {
    setRequestLocale(locale);

    const category = categories.find((c) => c.slug === slug);

    if (!category && slug !== 'all') {
        notFound();
    }

    // Default category for 'all' mapping since reference doesn't have an 'All' slug but we might need it
    const activeCategory = category || {
        id: 'all',
        slug: 'all',
        name: { ar: 'الكل', en: 'All' }
    };

    // Very simple mock filtering: filter by category label or return all
    const initialProducts = slug === 'all'
        ? products
        : products.filter(p => p.categoryIds?.includes(activeCategory.id) || p.categoryIds?.includes(activeCategory.slug));

    return (
        <CategoryListing
            category={activeCategory}
            initialProducts={initialProducts}
        />
    );
}
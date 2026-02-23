import { Hero } from "@/components/home/Hero";
import { CategoriesRow } from "@/components/home/CategoriesRow";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { ValueProps } from "@/components/home/ValueProps";
import { Newsletter } from "@/components/home/Newsletter";
import { getCategories, getFeaturedProducts } from "@/lib/data/catalog";

import { setRequestLocale } from 'next-intl/server';

export default async function Home({ params: { locale } }: { params: { locale: string } }) {
    setRequestLocale(locale);

    const [categories, featuredProducts] = await Promise.all([
        getCategories(),
        getFeaturedProducts()
    ]);

    return (
        <>
            <Hero />
            <CategoriesRow categories={categories} />
            <FeaturedProducts products={featuredProducts} />
            <ValueProps />
            <Newsletter />
        </>
    );
}

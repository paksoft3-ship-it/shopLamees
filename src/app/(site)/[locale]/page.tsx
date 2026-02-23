import { Hero } from "@/components/home/Hero";
import { CategoriesRow } from "@/components/home/CategoriesRow";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { ValueProps } from "@/components/home/ValueProps";
import { Newsletter } from "@/components/home/Newsletter";

import { setRequestLocale } from 'next-intl/server';

export default function Home({ params: { locale } }: { params: { locale: string } }) {
    setRequestLocale(locale);

    return (
        <>
            <Hero />
            <CategoriesRow />
            <FeaturedProducts />
            <ValueProps />
            <Newsletter />
        </>
    );
}

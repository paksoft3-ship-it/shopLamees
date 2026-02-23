import { setRequestLocale } from 'next-intl/server';
import { getAllProducts } from '@/lib/data/catalog';
import { LatestListing } from './LatestListing';

export default async function LatestPage({ params: { locale } }: { params: { locale: string } }) {
    setRequestLocale(locale);
    const products = await getAllProducts();

    return <LatestListing initialProducts={products} />;
}
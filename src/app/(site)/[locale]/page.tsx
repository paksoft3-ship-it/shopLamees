import { Metadata } from 'next';
import { Hero } from "@/components/home/Hero";
import { CategoriesRow } from "@/components/home/CategoriesRow";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { Lookbook } from "@/components/home/Lookbook";
import { VideoShowcase } from "@/components/home/VideoShowcase";
import { ValueProps } from "@/components/home/ValueProps";
import { Newsletter } from "@/components/home/Newsletter";
import { CustomizationSection } from "@/components/home/CustomizationSection";
import { getCategories, getFeaturedProducts, getAllProducts } from "@/lib/data/catalog";
import { getHomeVideosFromSettings, getStoreStats } from "@/lib/data/storeSettings";
import { getLocalizedUrl, getSiteUrl } from "@/lib/site";

import { setRequestLocale } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
    const isAr = locale === 'ar';
    const title = isAr ? 'شوب لاميس | عبايات فاخرة' : 'Shop Lamees | Luxury Abayas';
    const description = isAr
        ? 'اكتشفي مجموعة شوب لاميس من العبايات الفاخرة بتصاميم عصرية وتفصيل أنيق.'
        : 'Discover Shop Lamees luxury abayas with elegant tailoring and modern designs.';
    const canonical = getLocalizedUrl(isAr ? 'ar' : 'en', '');

    return {
        metadataBase: new URL(getSiteUrl()),
        title,
        description,
        alternates: {
            canonical,
            languages: {
                ar: getLocalizedUrl('ar', ''),
                en: getLocalizedUrl('en', ''),
            },
        },
        openGraph: {
            type: 'website',
            locale: isAr ? 'ar_QA' : 'en_US',
            url: canonical,
            siteName: 'Shop Lamees',
            title,
            description,
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
        },
    };
}

export default async function Home({ params: { locale } }: { params: { locale: string } }) {
    setRequestLocale(locale);
    const isAr = locale === 'ar';

    const [categories, featuredProducts, allProducts, homeVideos, storeStats] = await Promise.all([
        getCategories(),
        getFeaturedProducts(),
        getAllProducts(),
        getHomeVideosFromSettings(),
        getStoreStats(),
    ]);

    const baseUrl = getSiteUrl();
    const siteUrl = getLocalizedUrl(isAr ? 'ar' : 'en', '');
    const organizationJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Shop Lamees',
        url: baseUrl,
        logo: `${baseUrl}/images/logo.png`,
        sameAs: [],
    };
    const websiteJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Shop Lamees',
        url: siteUrl,
        inLanguage: isAr ? 'ar' : 'en',
        potentialAction: {
            '@type': 'SearchAction',
            target: `${baseUrl}${isAr ? '/search' : '/en/search'}?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
            />
            <Hero stats={storeStats} />
            <FeaturedProducts products={featuredProducts} />
            <CategoriesRow categories={categories} />
            <Lookbook products={allProducts} />
            <VideoShowcase videos={homeVideos} />
            <CustomizationSection />
            <ValueProps />
            <Newsletter />
        </>
    );
}

import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductInfo } from '@/components/product/ProductInfo';
import { ProductSpecs } from '@/components/product/ProductSpecs';
import { RelatedProducts } from '@/components/product/RelatedProducts';
import { getProductBySlug, getRelatedProducts } from '@/lib/data/catalog';

export default async function ProductPage({
    params: { locale, slug }
}: {
    params: { locale: string; slug: string };
}) {
    setRequestLocale(locale);

    const product = await getProductBySlug(slug);

    if (!product) {
        notFound();
    }

    const relatedProducts = await getRelatedProducts(product.id, 3);

    const t = await getTranslations('Product.Breadcrumbs');
    const localizedName = product.name[locale as 'ar' | 'en'];
    const activeCategory = product.categoryPaths?.[0];

    return (
        <main className="flex-grow w-full max-w-[1440px] mx-auto pb-28 md:pb-8">
            {/* Breadcrumb */}
            <nav className="flex flex-wrap items-center gap-2 mb-8 text-sm text-subtle font-kufi px-4 sm:px-8 lg:px-12 pt-8">
                <Link href="/" className="hover:text-primary transition-colors">{t('home')}</Link>
                <span className="material-symbols-outlined text-[16px] text-subtle rtl:rotate-180">chevron_right</span>
                {activeCategory ? (
                    <>
                        <Link href={`/category/${activeCategory.slug}`} className="hover:text-primary transition-colors">
                            {locale === 'ar' ? activeCategory.nameAr : activeCategory.nameEn}
                        </Link>
                        <span className="material-symbols-outlined text-[16px] text-subtle rtl:rotate-180">chevron_right</span>
                    </>
                ) : (
                    <>
                        <Link href="/category/all" className="hover:text-primary transition-colors">{t('abayas')}</Link>
                        <span className="material-symbols-outlined text-[16px] text-subtle rtl:rotate-180">chevron_right</span>
                    </>
                )}
                <span className="text-on-surface font-medium">{localizedName}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-16 lg:px-12">
                <ProductGallery images={product.images?.map(img => img.url) || []} productName={localizedName} />
                <ProductInfo product={product} />
            </div>

            <div className="mt-20 grid grid-cols-1 lg:grid-cols-12 gap-12 border-t border-border pt-16 px-4 sm:px-8 lg:px-12">
                <ProductSpecs product={product} />
                <RelatedProducts products={relatedProducts} />
            </div>
        </main>
    );
}
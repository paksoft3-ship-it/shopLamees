import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { products } from '@/mock/products';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductInfo } from '@/components/product/ProductInfo';
import { ProductSpecs } from '@/components/product/ProductSpecs';
import { RelatedProducts } from '@/components/product/RelatedProducts';

export default async function ProductPage({
    params: { locale, slug }
}: {
    params: { locale: string; slug: string };
}) {
    setRequestLocale(locale);

    const product = products.find(p => p.slug === slug);

    if (!product) {
        notFound();
    }

    const t = await getTranslations('Product.Breadcrumbs');
    const localizedName = typeof product.name === 'string' ? product.name : (product.name as Record<string, string>)[locale] || product.name.ar;

    // Use placeholder images array for the gallery to demonstrate the UI
    const mockGallery = [
        product.image,
        'https://lh3.googleusercontent.com/aida-public/AB6AXuB4fBVThWRVVb5nDFOgM55ddd-UD-aGnkB2w1qB39BZlNVPNLWwzsivqIBLwYshvJeNuqbBQUiqTuJiWvPDvf48pJ_NtTd-6I1ytlgUPHpZG68YBXHmC_b6vGFb4tL0N3Sdt6s0s68kIHcx-GRKYsEk0XFshs7G1mt-Uqk27zkyT1-ojhABbnv2kTRcLFYuzvrK3bo-_nfragFs003HWr6YFYPDA3LoPJBICLmUxJlrjJW4wrPoWBBVOvhWjezK-Aq0RDfrNt33A1A',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBvoPKhe985PMeaPKdwvHIz6kQA5Bct568bnsyqPKpirpdZPJ47BbhzWri498Lvhcrl7m7bwAfuKrxJxZ3BKxFLCvH4OlF_ov1f2c3hrNbhcbJ-kOYgApkmDAKaBgnmMKDSY4LJXYSEO-djrAlqM5GKgBuNvo5jdg6L9qgcJnTLJNekBOO-PogBALoiVC8UW_cfp0EV1Ii__Aw43K1D988jZGZzeHxLqMIZdnkEDPtBpBaE-QyRmLQiglnjQqXKC_66kn5CIaDzUI0',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBO_expbgjm2ruRnQWO-jNExN6l0KZLlluEUn9HOSfCPXIcG_VXZgluqQQreQdhaE8frNJ3y9WB_wXW45n4GW9QiiSrFkfJ2gVfOKLBzRhSYLvaN5CRtvJZHYMKBoT2RakPGeyfcUXqhV9yWForm0Rz2fgKftc9JQXP0R4KlzmET_n8KBOSLTxtdCBSnDQg3r2cvjM5LzZysbtwm4nx08WwwQRNEvFq7hxSa8P4TsfIVE7kWF9LHF_X7wX-waCjgt3gJQRKVpK7WfQ'
    ];

    return (
        <main className="flex-grow w-full max-w-[1440px] mx-auto pb-28 md:pb-8">
            {/* Breadcrumb - Add mobile padding back since main has it removed */}
            <nav className="flex flex-wrap items-center gap-2 mb-8 text-sm text-subtle font-kufi px-4 sm:px-8 lg:px-12 pt-8">
                <Link href="/" className="hover:text-primary transition-colors">{t('home')}</Link>
                <span className="material-symbols-outlined text-[16px] text-subtle rtl:rotate-180">chevron_right</span>
                <Link href="/category/all" className="hover:text-primary transition-colors">{t('abayas')}</Link>
                <span className="material-symbols-outlined text-[16px] text-subtle rtl:rotate-180">chevron_right</span>
                <span className="text-on-surface font-medium">{localizedName}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-16 lg:px-12">
                <ProductGallery images={mockGallery} productName={localizedName} />

                {/* Clone the product object with its localized name string so ProductInfo doesn't crash accessing nested objects */}
                <ProductInfo product={product} />
            </div>

            <div className="mt-20 grid grid-cols-1 lg:grid-cols-12 gap-12 border-t border-border pt-16 px-4 sm:px-8 lg:px-12">
                <ProductSpecs />
                <RelatedProducts currentProductId={product.id} />
            </div>
        </main>
    );
}
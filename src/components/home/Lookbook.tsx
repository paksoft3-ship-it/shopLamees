import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { ProductDTO } from '@/lib/data/types';

interface LookbookProps {
    products: ProductDTO[];
}

export function Lookbook({ products }: LookbookProps) {
    const t = useTranslations('Home.Lookbook');

    const images = products
        .filter(p => p.image && p.image !== '/placeholder.png')
        .slice(0, 6)
        .map(p => ({ src: p.image, alt: p.titleEn || p.titleAr }));

    if (images.length === 0) return null;

    return (
        <section className="py-16 lg:py-24 bg-background-light">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <h2 className="text-3xl font-bold font-display text-on-surface mb-2">{t('title')}</h2>
                        <p className="text-subtle">{t('subtitle')}</p>
                    </div>
                    <Link href="/category/all" className="hidden sm:flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
                        {t('shop_collection')}
                        <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 lg:gap-4">
                    {images.map((img, i) => (
                        <div key={i} className="relative rounded-2xl overflow-hidden aspect-[3/4] group">
                            <Image
                                src={img.src}
                                alt={img.alt}
                                fill
                                sizes="(max-width: 768px) 50vw, 33vw"
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    ))}
                </div>

                <div className="mt-8 text-center sm:hidden">
                    <Link href="/category/all" className="bg-surface border border-border text-on-surface px-6 py-3 rounded-full font-bold shadow-sm w-full block hover:bg-background-light transition-colors">
                        {t('shop_collection')}
                    </Link>
                </div>
            </div>
        </section>
    );
}

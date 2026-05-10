'use client';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRouter } from '@/i18n/navigation';
import { useFormattedMoney } from '@/lib/money';
import { ProductDTO } from '@/lib/data/types';
import { useCartStore } from '@/lib/stores/cart';
import { toast } from 'react-hot-toast';

interface RelatedProductsProps {
    products: ProductDTO[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
    const locale = useLocale() as 'ar' | 'en';
    const t = useTranslations('Product.Related');
    const { format } = useFormattedMoney();
    const { addItem } = useCartStore();
    const router = useRouter();

    if (products.length === 0) return null;

    return (
        <div className="lg:col-span-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold font-kufi text-[#0e1b12]">{t('title')}</h3>
                <div className="flex gap-2">
                    <button className="size-10 rounded-full border border-[#e5e7eb] flex items-center justify-center hover:bg-[#f9fafb] text-[#0e1b12]">
                        <span className="material-symbols-outlined rotate-180">arrow_forward</span>
                    </button>
                    <button className="size-10 rounded-full bg-[#0e1b12] text-white flex items-center justify-center hover:bg-black shadow-md">
                        <span className="material-symbols-outlined rotate-180">arrow_back</span>
                    </button>
                </div>
            </div>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((prod) => {
                    const name = prod.name[locale];
                    const badge = prod.badge;
                    const price = prod.variants[0]?.priceSar || prod.basePriceSar;

                    return (
                        <div 
                            key={prod.id} 
                            onClick={() => router.push(`/product/${prod.slug}`)}
                            className="group flex flex-col gap-3 cursor-pointer"
                        >
                            <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-[#f3f4f6]">
                                <Image
                                    src={prod.image}
                                    alt={name}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                />
                                {badge && (
                                    <div className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded">
                                        {badge[locale]}
                                    </div>
                                )}
                                <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            addItem({
                                                id: prod.id,
                                                productId: prod.id,
                                                variantId: `${prod.id}-default`,
                                                slug: prod.slug,
                                                name: name,
                                                unitPrice: price,
                                                currency: 'SAR',
                                                quantity: 1,
                                                image: prod.image,
                                            });
                                            toast.success(locale === 'en' ? `${name} added to cart!` : `تمت إضافة ${name} للسلة بنجاح!`, { icon: '🛍️' });
                                        }}
                                        className="bg-white p-2 rounded-full shadow-lg text-[#0e1b12] hover:text-primary"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                                    </button>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-[#0e1b12] font-kufi mb-1">{name}</h4>
                                <p className="text-sm text-[#6b7280]">{format(price)}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

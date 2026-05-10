'use client';
import { useTranslations, useLocale } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { useCartStore } from '@/lib/stores/cart';
import { usePrefsStore } from '@/lib/stores/prefs';
import { formatPrice } from '@/lib/utils/price';
import { ShoppingCart, Star, Zap } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { ProductDTO } from '@/lib/data/types';
import Image from 'next/image';

export function ProductCard({ product }: { product: ProductDTO }) {
    const t = useTranslations('Home.FeaturedProducts');
    const locale = useLocale() as 'ar' | 'en';
    const addItem = useCartStore((state) => state.addItem);
    const currency = usePrefsStore((state) => state.currency);
    const router = useRouter();

    const buildItem = () => ({
        id: product.id,
        productId: product.id,
        variantId: `${product.id}-default`,
        slug: product.slug,
        name: product.name[locale],
        unitPrice: product.variants[0]?.priceSar || product.basePriceSar,
        currency: currency,
        quantity: 1,
        image: product.image,
    });

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(buildItem());
        toast.success(locale === 'en' ? `${product.name[locale]} added to cart!` : `تمت إضافة ${product.name[locale]} للسلة بنجاح!`, {
            icon: '🛍️',
        });
    };

    const handleBuyNow = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(buildItem());
        router.push('/checkout');
    };

    return (
        <div className="group relative bg-surface rounded-2xl overflow-hidden shadow-card hover:shadow-soft transition-shadow flex flex-col border border-border">
            <Link href={`/product/${product.slug}`} className="relative aspect-[3/4] overflow-hidden bg-background-light block">
                {product.badge && (
                    <span className="absolute top-3 rtl:right-3 ltr:left-3 z-10 bg-primary text-on-surface text-xs font-bold px-2 py-1 rounded-full">
                        {product.badge[locale]}
                    </span>
                )}
                <Image
                    src={product.image}
                    alt={product.name[locale]}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
            </Link>
            <div className="p-3 sm:p-4 flex-1 flex flex-col">
                <h3 className="font-display font-bold text-on-surface text-sm sm:text-base mb-1 truncate">{product.name[locale]}</h3>
                <div className="flex text-primary text-xs gap-0.5 mb-2">
                    {Array.from({ length: Math.floor(product.rating) }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                </div>
                <div className="flex items-center justify-between mt-1 mb-3">
                    <span className="font-bold text-sm sm:text-base text-on-surface">{formatPrice(product.variants[0]?.priceSar || product.basePriceSar, currency, locale)}</span>
                    {product.variants[0]?.priceSar < product.basePriceSar && (
                        <span className="text-xs text-subtle/70 line-through">{formatPrice(product.basePriceSar, currency, locale)}</span>
                    )}
                </div>
                <div className="flex gap-2 mt-auto">
                    <button
                        onClick={handleAddToCart}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-on-surface text-white text-xs font-bold py-2 rounded-lg hover:bg-primary transition-colors"
                    >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{t('add_to_cart')}</span>
                        <span className="sm:hidden">{locale === 'ar' ? 'سلة' : 'Cart'}</span>
                    </button>
                    <button
                        onClick={handleBuyNow}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-primary text-on-surface text-xs font-bold py-2 rounded-lg hover:bg-primary/80 transition-colors"
                    >
                        <Zap className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{t('buy_now')}</span>
                        <span className="sm:hidden">{locale === 'ar' ? 'شراء' : 'Buy'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

'use client';
import { useTranslations, useLocale } from 'next-intl';
import { Product } from '@/mock/products';
import { Link } from '@/i18n/navigation';
import { useCartStore } from '@/lib/stores/cart';
import { usePrefsStore } from '@/lib/stores/prefs';
import { formatPrice } from '@/lib/utils/price';
import { ShoppingCart, Star } from 'lucide-react';
import { toast } from 'react-hot-toast';

export function ProductCard({ product }: { product: Product }) {
    const t = useTranslations('Home.FeaturedProducts');
    const locale = useLocale() as 'ar' | 'en';
    const addItem = useCartStore((state) => state.addItem);
    const currency = usePrefsStore((state) => state.currency);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        addItem({ id: product.id, variantId: `${product.id}-default`, name: product.name[locale], price: product.price, quantity: 1 });
        toast.success(locale === 'en' ? `${product.name[locale]} added to cart!` : `تمت إضافة ${product.name[locale]} للسلة بنجاح!`, {
            icon: '🛍️',
        });
    };

    return (
        <div className="group relative bg-surface rounded-2xl overflow-hidden shadow-card hover:shadow-soft transition-shadow flex flex-col border border-border">
            <Link href={`/product/${product.slug}`} className="relative aspect-[3/4] overflow-hidden bg-background-light block">
                {product.badge && (
                    <span className="absolute top-3 rtl:right-3 ltr:left-3 z-10 bg-primary text-on-surface text-xs font-bold px-2 py-1 rounded-full">
                        {product.badge[locale]}
                    </span>
                )}
                <img src={product.image} alt={product.name[locale]} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <button
                        onClick={handleAddToCart}
                        className="w-full bg-surface text-on-surface py-3 rounded-xl font-bold hover:bg-primary transition-colors flex flex-row items-center justify-center gap-2 shadow-card"
                    >
                        <ShoppingCart className="w-4 h-4" />
                        {t('add_to_cart')}
                    </button>
                </div>
            </Link>
            <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-display font-bold text-on-surface text-lg mb-1 truncate">{product.name[locale]}</h3>
                <p className="text-sm text-subtle mb-3">{product.description[locale]}</p>
                <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-lg text-on-surface">{formatPrice(product.price, currency, locale)}</span>
                        {product.compareAtPrice && (
                            <span className="text-sm text-subtle/70 line-through">{formatPrice(product.compareAtPrice, currency, locale)}</span>
                        )}
                    </div>
                    <div className="flex text-primary text-sm gap-0.5">
                        {Array.from({ length: Math.floor(product.rating) }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

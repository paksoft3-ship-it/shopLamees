'use client';
import { Link } from '@/i18n/navigation';
import { Menu, Search, ShoppingBag, Diamond } from 'lucide-react';
import { useCartStore } from '@/lib/stores/cart';
import { useTranslations } from 'next-intl';
import { LocaleSwitcher } from './LocaleSwitcher';

export function Header() {
    const t = useTranslations('Home.Header');
    const items = useCartStore((state) => state.items);
    const cartCount = items.reduce((total, item) => total + item.quantity, 0);

    return (
        <header className="sticky top-0 z-50 bg-background-light/95 backdrop-blur-md border-b border-[#e5e0d8]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 lg:h-20 flex items-center justify-between">

                {/* Desktop Navigation (Hidden on Mobile) */}
                <nav className="hidden lg:flex items-center gap-8">
                    <Link className="text-sm font-bold text-slate-900 hover:text-primary transition-colors" href="/">{t('home')}</Link>
                    <Link className="text-sm font-medium text-slate-600 hover:text-primary transition-colors" href="/latest">{t('latest_products')}</Link>
                    <Link className="text-sm font-medium text-slate-600 hover:text-primary transition-colors" href="/category/all">{t('categories')}</Link>
                    <Link className="text-sm font-medium text-slate-600 hover:text-primary transition-colors" href="/about">{t('about')}</Link>
                </nav>

                {/* Mobile Left: Cart */}
                <div className="lg:hidden relative">
                    <Link href="/cart" className="p-2 rounded-full hover:bg-black/5 transition-colors inline-block text-slate-900">
                        <ShoppingBag className="w-6 h-6" />
                    </Link>
                    {cartCount > 0 && (
                        <span className="absolute top-1 left-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                            {cartCount}
                        </span>
                    )}
                </div>

                {/* Center Logo */}
                <div className="flex-1 lg:flex-none flex justify-center lg:absolute lg:left-1/2 lg:-translate-x-1/2">
                    <Link className="flex items-center gap-2" href="/">
                        <Diamond className="text-primary w-6 h-6 lg:w-8 lg:h-8" />
                        <h1 className="font-display text-lg lg:text-2xl font-bold tracking-tighter text-slate-900">{t('brand_name')}</h1>
                    </Link>
                </div>

                {/* Mobile Right: Hamburger & Lang (Visible only on mobile) */}
                <div className="lg:hidden flex items-center gap-2">
                    <LocaleSwitcher />
                    <button className="p-2 rounded-full hover:bg-black/5 transition-colors text-slate-900">
                        <Menu className="w-6 h-6" />
                    </button>
                </div>

                {/* Desktop Right Icons */}
                <div className="hidden lg:flex items-center gap-4">
                    <LocaleSwitcher />
                    <button className="p-2 text-slate-900 hover:text-primary transition-colors">
                        <Search className="w-6 h-6" />
                    </button>
                    <div className="relative">
                        <Link href="/cart" className="p-2 text-slate-900 hover:text-primary transition-colors inline-block">
                            <ShoppingBag className="w-6 h-6" />
                        </Link>
                        {cartCount > 0 && (
                            <span className="absolute top-1 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-slate-900">
                                {cartCount}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

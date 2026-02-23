'use client';
import { useState, useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import { Menu, X, Search, ShoppingBag, Diamond } from 'lucide-react';
import { useCartStore } from '@/lib/stores/cart';
import { useTranslations } from 'next-intl';
import { LocaleSwitcher } from './LocaleSwitcher';

export function Header() {
    const t = useTranslations('Home.Header');
    const items = useCartStore((state) => state.items);
    const cartCount = items.reduce((total, item) => total + item.quantity, 0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Lock body scroll when menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [mobileMenuOpen]);

    return (
        <>
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
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-full hover:bg-black/5 transition-colors text-slate-900"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
                        onClick={() => setMobileMenuOpen(false)}
                    />

                    {/* Slide-in Panel */}
                    <nav className="fixed inset-y-0 ltr:right-0 rtl:left-0 z-50 w-72 bg-white shadow-2xl lg:hidden flex flex-col">
                        {/* Panel Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                            <Link className="flex items-center gap-2" href="/" onClick={() => setMobileMenuOpen(false)}>
                                <Diamond className="text-primary w-6 h-6" />
                                <span className="font-display text-lg font-bold text-slate-900">{t('brand_name')}</span>
                            </Link>
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Nav Links */}
                        <div className="flex-1 overflow-y-auto py-4">
                            {[
                                { href: '/', label: t('home'), icon: 'home' },
                                { href: '/latest', label: t('latest_products'), icon: 'new_releases' },
                                { href: '/category/all', label: t('categories'), icon: 'category' },
                                { href: '/about', label: t('about'), icon: 'info' },
                                { href: '/cart', label: t('cart') || 'Cart', icon: 'shopping_bag' },
                            ].map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-3 px-6 py-3.5 text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors font-kufi"
                                >
                                    <span className="material-symbols-outlined text-[20px] text-slate-400">{link.icon}</span>
                                    <span className="text-sm font-medium">{link.label}</span>
                                </Link>
                            ))}
                        </div>

                        {/* Panel Footer */}
                        <div className="border-t border-slate-100 p-6">
                            <LocaleSwitcher />
                        </div>
                    </nav>
                </>
            )}
        </>
    );
}

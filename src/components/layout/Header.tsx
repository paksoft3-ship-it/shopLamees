'use client';
import { useState, useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import { Menu, X, Search, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import { useCartStore } from '@/lib/stores/cart';
import { useTranslations } from 'next-intl';
import { LocaleSwitcher } from './LocaleSwitcher';

export function Header() {
    const t = useTranslations('Home.Header');
    const items = useCartStore((state) => state.items);
    const hasHydrated = useCartStore((state) => state.hasHydrated);
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
                {/* ── MOBILE HEADER (3-column grid so logo is always truly centered) ── */}
                <div className="lg:hidden w-full px-4 sm:px-6 h-16 grid grid-cols-3 items-center">

                    {/* Col 1 — Cart (left) */}
                    <div className="flex items-center justify-start">
                        <div className="relative">
                            <Link href="/cart" className="p-2 rounded-full hover:bg-black/5 transition-colors inline-block text-slate-900">
                                <ShoppingBag className="w-6 h-6" />
                            </Link>
                            {hasHydrated && cartCount > 0 && (
                                <span className="absolute top-1 left-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                                    {cartCount}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Col 2 — Logo (center) */}
                    <div className="flex items-center justify-center">
                        <Link href="/">
                            <Image src="/images/logo.png" alt={t('brand_name')} width={240} height={80} className="h-11 w-auto object-contain" priority />
                        </Link>
                    </div>

                    {/* Col 3 — Lang + Hamburger (right) */}
                    <div className="flex items-center justify-end gap-1">
                        <LocaleSwitcher />
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-full hover:bg-black/5 transition-colors text-slate-900"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* ── DESKTOP HEADER ── */}
                <div className="hidden lg:flex container mx-auto px-4 sm:px-6 lg:px-8 h-24 items-center justify-between relative">

                    {/* Desktop Nav */}
                    <nav className="flex items-center gap-4 shrink-0">
                        <Link className="text-sm font-bold text-slate-900 hover:text-primary transition-colors whitespace-nowrap" href="/">{t('home')}</Link>
                        <Link className="text-sm font-medium text-slate-600 hover:text-primary transition-colors whitespace-nowrap" href="/category/all-abayas">{t('nav_all_abayas')}</Link>
                        <Link className="text-sm font-medium text-slate-600 hover:text-primary transition-colors whitespace-nowrap" href="/category/kraz-abaya">{t('nav_kraz_abaya')}</Link>
                        <Link className="text-sm font-medium text-slate-600 hover:text-primary transition-colors whitespace-nowrap" href="/category/dantel">{t('nav_dantel')}</Link>
                        <Link className="text-sm font-medium text-slate-600 hover:text-primary transition-colors whitespace-nowrap" href="/category/eid-collection">{t('nav_eid')}</Link>
                        <Link className="text-sm font-medium text-slate-600 hover:text-primary transition-colors whitespace-nowrap" href="/category/winter">{t('nav_winter')}</Link>
                        <Link className="text-sm font-medium text-slate-600 hover:text-primary transition-colors whitespace-nowrap" href="/category/niqab">{t('nav_niqab')}</Link>
                    </nav>

                    {/* Desktop Center Logo */}
                    <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 top-1/2 pointer-events-none">
                        <Link className="flex items-center pointer-events-auto" href="/">
                            <Image src="/images/logo.png" alt={t('brand_name')} width={320} height={100} className="h-20 w-auto object-contain" priority />
                        </Link>
                    </div>

                    {/* Desktop Right Icons */}
                    <div className="flex items-center gap-4">
                        <LocaleSwitcher />
                        <Link href="/search" className="p-2 text-slate-900 hover:text-primary transition-colors">
                            <Search className="w-6 h-6" />
                        </Link>
                        <div className="relative">
                            <Link href="/cart" className="p-2 text-slate-900 hover:text-primary transition-colors inline-block">
                                <ShoppingBag className="w-6 h-6" />
                            </Link>
                            {hasHydrated && cartCount > 0 && (
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
                                <Image src="/images/logo.png" alt={t('brand_name')} width={160} height={48} className="h-10 w-auto object-contain" />
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
                                { href: '/category/all-abayas', label: t('nav_all_abayas'), icon: 'checkroom' },
                                { href: '/category/kraz-abaya', label: t('nav_kraz_abaya'), icon: 'star' },
                                { href: '/category/dantel', label: t('nav_dantel'), icon: 'texture' },
                                { href: '/category/eid-collection', label: t('nav_eid'), icon: 'celebration' },
                                { href: '/category/winter', label: t('nav_winter'), icon: 'ac_unit' },
                                { href: '/category/niqab', label: t('nav_niqab'), icon: 'face' },
                                { href: '/cart', label: t('cart'), icon: 'shopping_bag' },
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

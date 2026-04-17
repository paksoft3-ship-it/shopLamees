'use client';
import { useState, useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import { Menu, X, Search, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import { useCartStore } from '@/lib/stores/cart';
import { useTranslations, useLocale } from 'next-intl';
import { LocaleSwitcher } from './LocaleSwitcher';

interface NavCategory {
    id: string;
    slug: string;
    nameAr: string;
    nameEn: string;
}

interface HeaderProps {
    categories: NavCategory[];
}

export function Header({ categories }: HeaderProps) {
    const t = useTranslations('Home.Header');
    const locale = useLocale() as 'ar' | 'en';
    const items = useCartStore((state) => state.items);
    const hasHydrated = useCartStore((state) => state.hasHydrated);
    const cartCount = items.reduce((total, item) => total + item.quantity, 0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [mobileMenuOpen]);

    const catName = (cat: NavCategory) => locale === 'ar' ? cat.nameAr : cat.nameEn;

    return (
        <>
            <header className="sticky top-0 z-50 bg-background-light/95 backdrop-blur-md border-b border-[#e5e0d8]">
                {/* ── MOBILE HEADER ── */}
                <div className="lg:hidden w-full px-4 sm:px-6 h-16 grid grid-cols-3 items-center">
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
                    <div className="flex items-center justify-center">
                        <Link href="/">
                            <Image src="/images/logo.png" alt={t('brand_name')} width={240} height={80} className="h-11 w-auto object-contain" priority />
                        </Link>
                    </div>
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
                <div className="hidden lg:grid lg:grid-cols-[1fr_auto_1fr] container mx-auto px-4 sm:px-6 lg:px-8 h-24 items-center">
                    <nav className="flex items-center gap-3 xl:gap-4">
                        <Link className="text-sm font-bold text-slate-900 hover:text-primary transition-colors whitespace-nowrap" href="/">
                            {t('home')}
                        </Link>
                        {categories.slice(0, 6).map(cat => (
                            <Link
                                key={cat.id}
                                className="text-sm font-medium text-slate-600 hover:text-primary transition-colors whitespace-nowrap"
                                href={`/category/${cat.slug}`}
                            >
                                {catName(cat)}
                            </Link>
                        ))}
                    </nav>

                    <Link className="flex items-center justify-center" href="/">
                        <Image src="/images/logo.png" alt={t('brand_name')} width={320} height={100} className="h-20 w-auto object-contain" priority />
                    </Link>

                    <div className="flex items-center gap-4 justify-end">
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
                    <div
                        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                    <nav className="fixed inset-y-0 ltr:right-0 rtl:left-0 z-50 w-72 bg-white shadow-2xl lg:hidden flex flex-col">
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

                        <div className="flex-1 overflow-y-auto py-4">
                            <Link
                                href="/"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-3 px-6 py-3.5 text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors font-kufi"
                            >
                                <span className="material-symbols-outlined text-[20px] text-slate-400">home</span>
                                <span className="text-sm font-medium">{t('home')}</span>
                            </Link>
                            {categories.map(cat => (
                                <Link
                                    key={cat.id}
                                    href={`/category/${cat.slug}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-3 px-6 py-3.5 text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors font-kufi"
                                >
                                    <span className="material-symbols-outlined text-[20px] text-slate-400">checkroom</span>
                                    <span className="text-sm font-medium">{catName(cat)}</span>
                                </Link>
                            ))}
                            <Link
                                href="/cart"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-3 px-6 py-3.5 text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors font-kufi"
                            >
                                <span className="material-symbols-outlined text-[20px] text-slate-400">shopping_bag</span>
                                <span className="text-sm font-medium">{t('cart')}</span>
                            </Link>
                        </div>

                        <div className="border-t border-slate-100 p-6">
                            <LocaleSwitcher />
                        </div>
                    </nav>
                </>
            )}
        </>
    );
}

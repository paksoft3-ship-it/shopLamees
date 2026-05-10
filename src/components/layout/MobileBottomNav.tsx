"use client";
import { Link } from '@/i18n/navigation';
import { Home, Grid, ShoppingCart, User } from 'lucide-react';
import { usePathname } from '@/i18n/navigation';

import { useTranslations } from 'next-intl';
import { useCartStore } from '@/lib/stores/cart';

export function MobileBottomNav() {
    const pathname = usePathname();
    const t = useTranslations('Home.Layout.MobileBottomNav');
    const openDrawer = useCartStore((state) => state.openDrawer);

    return (
        <nav className="lg:hidden fixed bottom-0 w-full bg-surface border-t border-border px-6 py-3 flex justify-between items-center z-40 rounded-t-[32px] shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-safe-8">
            <Link href="/" className={`flex flex-col items-center gap-1 ${pathname === '/' || pathname === '/en' || pathname === '/ar' ? 'text-primary' : 'text-gray-400 hover:text-primary transition-colors'}`}>
                <Home className="w-6 h-6" fill={pathname === '/' || pathname === '/en' || pathname === '/ar' ? 'currentColor' : 'none'} />
                <span className="text-[10px] font-medium">{t('home')}</span>
            </Link>
            <Link href="/category/all" className={`flex flex-col items-center gap-1 ${pathname?.includes('/category') ? 'text-primary' : 'text-gray-400 hover:text-primary transition-colors'}`}>
                <Grid className="w-6 h-6" />
                <span className="text-[10px] font-medium">{t('categories')}</span>
            </Link>
            <button
                onClick={openDrawer}
                className={`flex flex-col items-center gap-1 ${pathname?.includes('/cart') ? 'text-primary' : 'text-gray-400 hover:text-primary transition-colors'}`}
            >
                <ShoppingCart className="w-6 h-6" />
                <span className="text-[10px] font-medium">{t('cart')}</span>
            </button>
            <Link href="/account" className={`flex flex-col items-center gap-1 ${pathname?.includes('/account') ? 'text-primary' : 'text-gray-400 hover:text-primary transition-colors'}`}>
                <User className="w-6 h-6" />
                <span className="text-[10px] font-medium">{t('account')}</span>
            </Link>
        </nav>
    );
}

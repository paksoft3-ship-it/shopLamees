'use client';

import { useAdminAuth } from '@/lib/stores/adminAuth';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { NextIntlClientProvider, useTranslations } from 'next-intl';

// ─── Inner component uses translations after provider is set up ───────
function AdminShell({ children, locale, onToggleLocale }: {
    children: React.ReactNode;
    locale: 'ar' | 'en';
    onToggleLocale: () => void;
}) {
    const { user, logout } = useAdminAuth();
    const pathname = usePathname();
    const t = useTranslations('AdminNav');
    const isRTL = locale === 'ar';

    const [isMounted, setIsMounted] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
    const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        if (typeof window !== 'undefined' && window.innerWidth < 1280 && window.innerWidth >= 768) {
            setIsSidebarExpanded(false);
        }
    }, []);

    // Update <html> lang + dir whenever locale changes
    useEffect(() => {
        if (typeof document !== 'undefined') {
            document.documentElement.lang = locale;
            document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
        }
    }, [locale, isRTL]);

    // Redirect to login if unauthenticated
    useEffect(() => {
        if (isMounted && !user && !pathname.includes('/login')) {
            window.location.href = '/admin/login';
        }
    }, [user, pathname, isMounted]);

    // Close mobile drawer on route change
    useEffect(() => { setIsMobileDrawerOpen(false); }, [pathname]);

    if (!isMounted) return <div className="min-h-screen bg-[#f8f7f6]" />;

    if (pathname.includes('/login')) {
        return (
            <div className="min-h-screen bg-[#f8f7f6] flex items-center justify-center font-body" dir={isRTL ? 'rtl' : 'ltr'}>
                {children}
            </div>
        );
    }

    if (!user) return null;

    const mainNavItems = [
        { href: '/admin', label: t('dashboard'), icon: 'dashboard' },
        { href: '/admin/orders', label: t('orders'), icon: 'shopping_bag', badge: '12' },
        { href: '/admin/products', label: t('products'), icon: 'sell' },
        { href: '/admin/categories', label: t('categories'), icon: 'category' },
        { href: '/admin/customers', label: t('customers'), icon: 'group' },
        { href: '/admin/coupons', label: t('coupons'), icon: 'loyalty' },
        { href: '/admin/marketing', label: t('marketing'), icon: 'campaign' },
        { href: '/admin/seo', label: t('seo'), icon: 'travel_explore' },
        { href: '/admin/reports', label: t('reports'), icon: 'bar_chart' },
        { href: '/admin/pages', label: t('content'), icon: 'article' },
        { href: '/admin/media', label: t('media'), icon: 'image' },
        { href: '/admin/shipping', label: t('shipping'), icon: 'local_shipping' },
        { href: '/admin/payments', label: t('payments'), icon: 'credit_card' },
    ];

    const bottomNavItems = [
        { href: '/admin/settings', label: t('settings'), icon: 'settings' },
        { href: '/admin/users', label: t('users'), icon: 'manage_accounts' },
        { href: '/admin/audit', label: t('activity'), icon: 'history' },
    ];

    // Language toggle button (compact pill)
    const LangToggle = () => (
        <button
            onClick={onToggleLocale}
            title={isRTL ? 'Switch to English' : 'التبديل إلى العربية'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#edab1d]/10 hover:bg-[#edab1d]/20 text-[#d49511] text-xs font-bold transition-colors border border-[#edab1d]/30"
        >
            <span className="material-symbols-outlined text-[14px]">translate</span>
            {isRTL ? 'EN' : 'ع'}
        </button>
    );

    return (
        <div
            className="flex h-screen w-full flex-row overflow-hidden bg-[#f8f7f6] font-body text-[#1b170d] selection:bg-[#edab1d] selection:text-white"
            dir={isRTL ? 'rtl' : 'ltr'}
        >
            {/* ── Desktop Sidebar ── */}
            <aside className={`hidden md:flex flex-col h-screen sticky top-0 shrink-0 transition-all duration-300 z-20 bg-[#FBF7F2] border-[#e7e0cf]
                ${isRTL ? 'border-l' : 'border-r'}
                ${isSidebarExpanded ? 'w-72' : 'w-20 items-center py-6'}`}
            >
                {/* Collapse toggle */}
                <button
                    onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
                    className={`absolute top-6 bg-white border border-[#e7e0cf] rounded-full p-1 text-slate-400 hover:text-[#edab1d] z-50 shadow-sm
                    ${isRTL ? '-left-3' : '-right-3'}`}
                >
                    <span className="material-symbols-outlined text-[14px]">
                        {isSidebarExpanded
                            ? (isRTL ? 'chevron_right' : 'chevron_left')
                            : (isRTL ? 'chevron_left' : 'chevron_right')}
                    </span>
                </button>

                {/* Logo */}
                {isSidebarExpanded ? (
                    <div className="h-20 flex items-center gap-4 px-6 border-b border-[#e7e0cf]/50 shrink-0 w-full">
                        <div className="w-10 h-10 rounded-full bg-[#edab1d] text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-[#edab1d]/30 shrink-0">S</div>
                        <div className="flex flex-col overflow-hidden">
                            <h1 className="text-[#1b170d] text-base font-bold leading-tight truncate">Shop Lamees</h1>
                            <p className="text-[#1b170d]/60 text-xs font-normal truncate">{t('admin_panel')}</p>
                        </div>
                    </div>
                ) : (
                    <div className="mb-8 w-10 h-10 bg-[#edab1d] text-white rounded-lg flex items-center justify-center font-bold text-xl shadow-lg shadow-[#edab1d]/30 shrink-0">S</div>
                )}

                {/* Nav */}
                <nav className={`flex-1 overflow-y-auto w-full flex flex-col ${isSidebarExpanded ? 'py-5 px-3 gap-1' : 'gap-3 px-3'}`}>
                    {isSidebarExpanded && (
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#1b170d]/30 px-3 pb-1">{isRTL ? 'القائمة الرئيسية' : 'Main'}</p>
                    )}
                    {mainNavItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                        return isSidebarExpanded ? (
                            <Link key={item.href} href={item.href}
                                className={`group flex items-center gap-3.5 px-3.5 py-3.5 rounded-xl relative overflow-hidden transition-all duration-200
                                    ${isActive
                                        ? 'bg-[#edab1d]/12 text-[#c9940a]'
                                        : 'text-[#1b170d]/65 hover:bg-white hover:text-[#1b170d] hover:shadow-sm'}`}
                            >
                                {isActive && <div className={`absolute top-2 bottom-2 w-[3px] bg-[#edab1d] rounded-full ${isRTL ? 'right-0' : 'left-0'}`} />}
                                <span className={`material-symbols-outlined text-[21px] shrink-0 ${isActive ? 'fill-1' : ''}`}>{item.icon}</span>
                                <span className={`text-[13.5px] leading-tight ${isActive ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
                                {item.badge && (
                                    <span className={`${isRTL ? 'mr-auto' : 'ml-auto'} bg-[#edab1d] text-white text-[10px] font-bold min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center`}>
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        ) : (
                            <div key={item.href} className="group relative flex items-center justify-center w-full">
                                <Link href={item.href}
                                    className={`p-3 rounded-xl transition-all duration-200
                                        ${isActive ? 'bg-[#edab1d] text-white shadow-md shadow-[#edab1d]/25' : 'text-[#1b170d]/50 hover:bg-[#edab1d]/10 hover:text-[#edab1d]'}`}
                                >
                                    <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
                                </Link>
                                {item.badge && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                        {item.badge}
                                    </span>
                                )}
                                <span className={`invisible group-hover:visible opacity-0 group-hover:opacity-100 absolute px-2.5 py-1.5 bg-[#1b170d] text-white text-xs rounded-lg transition-all whitespace-nowrap z-50 pointer-events-none shadow-lg
                                    ${isRTL ? 'right-full mr-3' : 'left-full ml-3'}`}>
                                    {item.label}
                                </span>
                            </div>
                        );
                    })}

                    {isSidebarExpanded ? (
                        <div className="pt-4 pb-1 px-3">
                            <div className="h-px bg-[#e7e0cf]" />
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#1b170d]/30 pt-3">{isRTL ? 'النظام' : 'System'}</p>
                        </div>
                    ) : (
                        <div className="pt-1 pb-1 flex justify-center"><div className="w-6 h-px bg-[#e7e0cf]" /></div>
                    )}

                    {bottomNavItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                        return isSidebarExpanded ? (
                            <Link key={item.href} href={item.href}
                                className={`group flex items-center gap-3.5 px-3.5 py-3.5 rounded-xl relative overflow-hidden transition-all duration-200
                                    ${isActive
                                        ? 'bg-[#edab1d]/12 text-[#c9940a]'
                                        : 'text-[#1b170d]/65 hover:bg-white hover:text-[#1b170d] hover:shadow-sm'}`}
                            >
                                {isActive && <div className={`absolute top-2 bottom-2 w-[3px] bg-[#edab1d] rounded-full ${isRTL ? 'right-0' : 'left-0'}`} />}
                                <span className="material-symbols-outlined text-[21px] shrink-0">{item.icon}</span>
                                <span className={`text-[13.5px] leading-tight ${isActive ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
                            </Link>
                        ) : (
                            <div key={item.href} className="group relative flex items-center justify-center w-full">
                                <Link href={item.href}
                                    className={`p-3 rounded-xl transition-all duration-200
                                        ${isActive ? 'bg-[#edab1d] text-white shadow-md shadow-[#edab1d]/25' : 'text-[#1b170d]/50 hover:bg-[#edab1d]/10 hover:text-[#edab1d]'}`}
                                >
                                    <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
                                </Link>
                                <span className={`invisible group-hover:visible opacity-0 group-hover:opacity-100 absolute px-2.5 py-1.5 bg-[#1b170d] text-white text-xs rounded-lg transition-all whitespace-nowrap z-50 pointer-events-none shadow-lg
                                    ${isRTL ? 'right-full mr-3' : 'left-full ml-3'}`}>
                                    {item.label}
                                </span>
                            </div>
                        );
                    })}
                </nav>

                {/* User footer */}
                {isSidebarExpanded ? (
                    <div className="p-4 border-t border-[#e7e0cf] bg-[#FBF7F2]/50 w-full shrink-0 space-y-2">
                        {/* Language toggle */}
                        <div className={`flex ${isRTL ? 'justify-start' : 'justify-end'}`}>
                            <LangToggle />
                        </div>
                        <button onClick={logout} className={`flex items-center gap-3 w-full p-2 rounded-lg hover:bg-white transition-colors ${isRTL ? 'text-right' : 'text-left'}`}>
                            <div className="w-9 h-9 rounded-full bg-[#1b170d] text-white flex items-center justify-center shrink-0 text-sm font-bold">
                                {user.role === 'admin_owner' ? 'O' : 'S'}
                            </div>
                            <div className="flex flex-col overflow-hidden">
                                <p className="text-sm font-bold truncate text-[#1b170d]">{user.email.split('@')[0]}</p>
                                <p className="text-xs text-[#1b170d]/60 truncate">{t('logout')}</p>
                            </div>
                            <span className={`material-symbols-outlined text-[#1b170d]/40 text-lg ${isRTL ? 'mr-auto' : 'ml-auto'}`}>expand_more</span>
                        </button>
                    </div>
                ) : (
                    <div className="w-full flex flex-col items-center gap-3 py-4 border-t border-[#e7e0cf] shrink-0">
                        <button
                            onClick={onToggleLocale}
                            title={isRTL ? 'EN' : 'ع'}
                            className="w-8 h-8 rounded-full bg-[#edab1d]/10 hover:bg-[#edab1d]/20 text-[#d49511] text-xs font-bold transition-colors flex items-center justify-center"
                        >
                            {isRTL ? 'EN' : 'ع'}
                        </button>
                        <button onClick={logout} title={t('logout')}>
                            <div className="h-10 w-10 rounded-full bg-[#1b170d] text-white flex items-center justify-center font-bold ring-2 ring-white cursor-pointer hover:ring-[#edab1d] transition-all">
                                {user.role === 'admin_owner' ? 'O' : 'S'}
                            </div>
                        </button>
                    </div>
                )}
            </aside>

            {/* ── Mobile Drawer ── */}
            <div className={`md:hidden fixed inset-0 z-40 ${isMobileDrawerOpen ? 'visible' : 'invisible'}`}>
                <div
                    className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isMobileDrawerOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={() => setIsMobileDrawerOpen(false)}
                />
                <aside className={`absolute top-0 bottom-0 w-[85%] max-w-[320px] bg-white shadow-[-4px_0_24px_rgba(0,0,0,0.15)] flex flex-col transition-transform duration-300
                    ${isRTL ? 'right-0 rounded-l-[24px]' : 'left-0 rounded-r-[24px]'}
                    ${isMobileDrawerOpen ? 'translate-x-0' : (isRTL ? 'translate-x-full' : '-translate-x-full')}`}
                >
                    <div className="px-6 py-8 border-b border-[#f3efe7] flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-slate-100 text-[#1b170d] border-2 border-[#edab1d] flex items-center justify-center font-bold text-xl">
                                    {user.role === 'admin_owner' ? 'O' : 'S'}
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-[#1b170d] text-lg">{user.email.split('@')[0]}</span>
                                    <span className="text-xs text-[#9a814c] capitalize">{(user.role || '').replace('admin_', '')}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <LangToggle />
                                <button onClick={() => setIsMobileDrawerOpen(false)} className="text-[#9a814c] hover:text-[#1b170d]">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <nav className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
                        {mainNavItems.map((item) => {
                            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                            return (
                                <Link key={item.href} href={item.href}
                                    className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-colors group
                                        ${isActive ? 'bg-[#edab1d]/10 text-[#d49511]' : 'text-[#1b170d] hover:bg-[#fcfbf8]'}`}
                                >
                                    <span className={`material-symbols-outlined ${isActive ? 'fill-1' : 'text-[#9a814c] group-hover:text-[#edab1d] transition-colors'}`}>{item.icon}</span>
                                    <span className={`text-base ${isActive ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
                                    {item.badge && (
                                        <span className={`${isRTL ? 'mr-auto' : 'ml-auto'} bg-[#edab1d] text-white text-xs font-bold px-2 py-0.5 rounded-full`}>
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}

                        <div className="my-2 border-t border-[#f3efe7] mx-4" />

                        {bottomNavItems.map((item) => (
                            <Link key={item.href} href={item.href}
                                className="flex items-center gap-4 px-4 py-3 text-[#1b170d] hover:bg-[#fcfbf8] rounded-xl transition-colors group"
                            >
                                <span className="material-symbols-outlined text-[#9a814c] group-hover:text-[#edab1d] transition-colors">{item.icon}</span>
                                <span className="font-medium text-base">{item.label}</span>
                            </Link>
                        ))}

                        <button onClick={logout} className="flex items-center gap-4 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors mt-auto w-full text-start">
                            <span className="material-symbols-outlined">logout</span>
                            <span className="font-medium text-base">{t('logout')}</span>
                        </button>
                    </nav>

                    <div className="p-6 text-center">
                        <p className="text-[10px] text-[#9a814c] uppercase tracking-widest opacity-50">Shop Lamees System</p>
                    </div>
                </aside>
            </div>

            {/* ── Main Area ── */}
            <main className={`flex h-full flex-1 flex-col overflow-y-auto overflow-x-hidden relative transition-all duration-300 ${isMobileDrawerOpen ? 'scale-[0.98] blur-[1px]' : ''}`}>

                {/* Mobile Header */}
                <header className="md:hidden flex items-center justify-between px-5 py-4 bg-[#fcfbf8] border-b border-[#f3efe7] z-10 shrink-0">
                    <button onClick={() => setIsMobileDrawerOpen(true)} className={`p-2 hover:bg-[#f3efe7] rounded-full transition-colors ${isRTL ? '-mr-2' : '-ml-2'} text-[#1b170d]`}>
                        <span className="material-symbols-outlined text-[28px]">menu</span>
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-[#edab1d] text-white flex items-center justify-center font-bold text-xs shadow-sm">S</div>
                        <h1 className="text-lg font-bold tracking-tight text-[#1b170d]">Shop Lamees</h1>
                    </div>
                    <Link href="/admin/orders" className="p-2 text-[#1b170d] hover:bg-[#f3efe7] rounded-full transition-colors relative">
                        <span className="material-symbols-outlined text-[24px]">notifications</span>
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white" />
                    </Link>
                </header>

                {/* Desktop Topbar */}
                <header className="hidden md:flex sticky top-0 z-10 w-full items-center justify-between border-b border-[#e7ebf3] bg-white/80 px-8 py-4 backdrop-blur-md shrink-0">
                    <nav className="flex items-center gap-2 text-sm text-[#4c669a]">
                        <span className="hover:text-[#135bec] transition-colors cursor-pointer">{t('dashboard')}</span>
                    </nav>
                    <div className="flex items-center gap-3">
                        {/* Search */}
                        <div className="relative hidden w-80 lg:block">
                            <span className={`material-symbols-outlined absolute top-1/2 -translate-y-1/2 text-neutral-400 ${isRTL ? 'right-3' : 'left-3'}`} style={{ fontSize: '20px' }}>search</span>
                            <input
                                className={`h-11 w-full rounded-lg border-none bg-neutral-100 py-2.5 text-sm font-medium text-[#0d121b] placeholder-neutral-400 focus:ring-2 focus:ring-[#135bec]/20 transition-all shadow-sm
                                ${isRTL ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'}`}
                                placeholder={t('search')}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        {/* Language toggle — in topbar too */}
                        <LangToggle />
                        <button className="relative p-2 text-[#4c669a] hover:text-[#135bec] transition-colors rounded-lg hover:bg-neutral-100">
                            <span className="material-symbols-outlined text-[24px]">notifications</span>
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
                        </button>
                    </div>
                </header>

                {/* Page content */}
                <div className="flex-1 p-4 md:p-8 relative scroll-smooth bg-[#f8f7f6]">
                    <div className="max-w-[1600px] mx-auto space-y-6">
                        {children}
                    </div>
                </div>

                {/* Mobile FAB */}
                <Link href="/admin/products/new"
                    className="md:hidden fixed bottom-6 left-5 w-14 h-14 bg-[#edab1d] text-white rounded-full shadow-lg shadow-[#edab1d]/40 flex items-center justify-center transform hover:scale-105 transition-transform z-30"
                >
                    <span className="material-symbols-outlined text-3xl">add</span>
                </Link>
            </main>
        </div>
    );
}

// ─── Outer wrapper manages locale state + provides NextIntl ──────────
export function AdminLayoutClient({
    children,
    arMessages,
    enMessages,
}: {
    children: React.ReactNode;
    arMessages: Record<string, unknown>;
    enMessages: Record<string, unknown>;
}) {
    const [locale, setLocale] = useState<'ar' | 'en'>('ar');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Restore saved preference
        const saved = localStorage.getItem('admin_locale') as 'ar' | 'en' | null;
        if (saved === 'ar' || saved === 'en') setLocale(saved);
        setMounted(true);
    }, []);

    const toggleLocale = () => {
        const next: 'ar' | 'en' = locale === 'ar' ? 'en' : 'ar';
        setLocale(next);
        localStorage.setItem('admin_locale', next);
    };

    if (!mounted) return <div className="min-h-screen bg-[#f8f7f6]" />;

    const messages = locale === 'ar' ? arMessages : enMessages;

    return (
        <NextIntlClientProvider locale={locale} messages={messages}>
            <AdminShell locale={locale} onToggleLocale={toggleLocale}>
                {children}
            </AdminShell>
        </NextIntlClientProvider>
    );
}

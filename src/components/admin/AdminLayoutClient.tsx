'use client';

import { useAdminAuth } from '@/lib/stores/adminAuth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LayoutDashboard, ShoppingBag, Package, LogOut } from 'lucide-react';

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
    const { user, logout } = useAdminAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted && !user && !pathname.includes('/login')) {
            router.push('/admin/login');
        }
    }, [user, router, pathname, isMounted]);

    if (!isMounted) return <div className="min-h-screen bg-background-light" />;

    if (pathname.includes('/login')) {
        return <div className="min-h-screen bg-background-light flex items-center justify-center font-body" dir="ltr">{children}</div>;
    }

    if (!user) return null;

    const navItems = [
        { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
        { href: '/admin/products', label: 'Products', icon: Package },
    ];

    return (
        <div className="min-h-screen bg-background-light flex font-body" dir="ltr">
            {/* Sidebar */}
            <aside className="w-64 bg-surface border-r border-border flex-shrink-0 sticky top-0 h-screen p-6 flex flex-col">
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold font-display leading-none">SL</span>
                    </div>
                    <h2 className="font-display font-bold text-lg text-on-surface">Admin</h2>
                </div>

                <nav className="flex-1 space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive
                                    ? 'bg-primary/10 text-primary font-bold'
                                    : 'text-subtle hover:bg-background-light hover:text-on-surface'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="pt-6 border-t border-border mt-auto">
                    <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-background-light">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
                            {user.role === 'admin_owner' ? 'O' : 'S'}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-on-surface flex items-center gap-2">
                                {user.email.split('@')[0]}
                                {user.role === 'admin_owner' && (
                                    <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full">Owner</span>
                                )}
                            </span>
                            <span className="text-xs text-subtle truncate max-w-[120px]">{user.email}</span>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            logout();
                            router.push('/admin/login');
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors text-sm font-bold"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0">
                <header className="h-20 bg-surface border-b border-border px-8 items-center flex justify-between sticky top-0 z-10">
                    <h1 className="font-display font-bold text-xl text-on-surface capitalize">
                        {pathname.split('/').pop() || 'Dashboard'}
                    </h1>
                </header>
                <div className="p-8 flex-1 overflow-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}

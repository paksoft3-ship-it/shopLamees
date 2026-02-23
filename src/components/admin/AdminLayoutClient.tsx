'use client';

import { useAdminAuth } from '@/lib/stores/adminAuth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    LogOut,
    Search,
    Diamond,
    Bell,
    LayoutDashboard,
    ShoppingBag,
    Tag,
    Layers,
    Users,
    Ticket,
    FileText,
    Image as ImageIcon,
    Truck,
    CreditCard,
    BarChart2,
    Settings,
    UserCog,
    History,
    Plus,
    HelpCircle,
    Menu,
    Package
} from 'lucide-react';

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
    const { user, logout } = useAdminAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isMounted, setIsMounted] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');

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

    // Desktop Nav Items matching new sidebar reference
    const mainNavItems = [
        { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/orders', label: 'Orders', icon: ShoppingBag, badge: '12' },
        { href: '/admin/products', label: 'Products', icon: Tag },
        { href: '/admin/categories', label: 'Categories', icon: Layers },
        { href: '/admin/customers', label: 'Customers', icon: Users },
        { href: '/admin/coupons', label: 'Coupons', icon: Ticket },
        { href: '/admin/content', label: 'Content', icon: FileText },
        { href: '/admin/media', label: 'Media', icon: ImageIcon },
        { href: '/admin/shipping', label: 'Shipping', icon: Truck },
        { href: '/admin/payments', label: 'Payments', icon: CreditCard },
        { href: '/admin/reports', label: 'Reports', icon: BarChart2 },
    ];

    const bottomNavItems = [
        { href: '/admin/settings', label: 'Settings', icon: Settings },
        { href: '/admin/users', label: 'Users', icon: UserCog },
        { href: '/admin/activity', label: 'Activity Log', icon: History },
    ];

    // Mobile specific simplified nav
    const mobileNavItems = [
        { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
        { href: '/admin/products', label: 'Products', icon: Package },
        { href: '/admin/customers', label: 'Customers', icon: Users },
        { href: '/admin/settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-background-light flex font-display text-on-surface overflow-x-hidden relative" dir="ltr">

            {/* Desktop Sidebar (Hidden on Mobile) */}
            <aside className="hidden md:flex flex-col w-[280px] bg-surface h-screen sticky top-0 shrink-0 border-r border-border z-20">
                {/* Logo Area */}
                <div className="h-20 flex items-center gap-4 px-6 border-b border-border/50 shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shrink-0 border border-border">
                        <Diamond className="w-5 h-5 text-on-surface" />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-on-surface text-base font-bold leading-tight">Shop Lamees</h1>
                        <p className="text-subtle text-xs font-medium">Store Dashboard</p>
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                    {mainNavItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative overflow-hidden ${isActive
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-subtle hover:bg-background-light hover:text-on-surface'
                                    }`}
                            >
                                {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full"></div>}
                                <Icon className="w-[20px] h-[20px]" />
                                <span className={`text-sm ${isActive ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
                                {item.badge && (
                                    <span className="ml-auto bg-primary text-on-surface text-[10px] font-bold px-2 py-0.5 rounded-full">
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        );
                    })}

                    <div className="pt-4 pb-2">
                        <div className="h-px bg-border/50 mx-4"></div>
                    </div>

                    {bottomNavItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative overflow-hidden ${isActive
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-subtle hover:bg-background-light hover:text-on-surface'
                                    }`}
                            >
                                {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full"></div>}
                                <Icon className="w-[20px] h-[20px]" />
                                <span className={`text-sm ${isActive ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* User Profile Footer */}
                <div className="p-4 border-t border-border bg-surface">
                    <button onClick={logout} className="flex items-center gap-3 w-full p-2 rounded-xl hover:bg-red-50 hover:text-red-700 transition-colors group text-left">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0 text-sm font-bold border-2 border-surface shadow-sm group-hover:bg-red-100 group-hover:text-red-700 group-hover:border-red-200">
                            {user.role === 'admin_owner' ? 'O' : 'S'}
                        </div>
                        <div className="flex flex-col overflow-hidden text-left flex-1">
                            <p className="text-sm font-bold truncate text-on-surface group-hover:text-red-700 capitalize">
                                {(user?.role || '').replace('admin_', '')}
                            </p>
                            <p className="text-xs text-subtle truncate group-hover:text-red-600">Logout: {user.email}</p>
                        </div>
                        <LogOut className="w-4 h-4 text-subtle opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                </div>
            </aside>

            {/* Main Layout Area (Right Side) */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden relative">

                {/* Mobile Header (Hidden on Desktop) */}
                <header className="md:hidden flex items-center justify-between px-5 py-6 bg-surface sticky top-0 z-20 shadow-sm border-b border-border">
                    <div className="flex flex-col">
                        <span className="text-xs text-subtle font-medium mb-1 capitalize">Welcome back, {(user?.email || '').split('@')[0]}</span>
                        <h1 className="text-xl font-bold text-on-surface leading-none font-display">Dashboard</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="relative p-2 rounded-full hover:bg-background-light transition-colors text-subtle">
                            <Bell className="w-6 h-6" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-surface"></span>
                        </button>
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-surface font-bold text-sm shadow-sm border-2 border-primary/20">
                            {user.role === 'admin_owner' ? 'O' : 'S'}
                        </div>
                    </div>
                </header>

                {/* Desktop Topbar (Hidden on Mobile) */}
                <header className="hidden md:flex h-20 bg-surface border-b border-border items-center justify-between px-6 md:px-8 shrink-0 z-10 sticky top-0">
                    {/* Global Search */}
                    <div className="flex-1 max-w-lg">
                        <div className="relative group flex items-center h-10 w-full bg-background-light rounded-lg border border-transparent focus-within:border-primary/50 transition-colors pl-3 pr-2">
                            <Search className="w-5 h-5 text-subtle focus-within:text-primary transition-colors shrink-0" />
                            <input
                                className="w-full flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-sm font-medium text-on-surface placeholder:text-subtle/50 px-3 h-full"
                                placeholder="Search for order, product, or customer..."
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Topbar Actions */}
                    <div className="flex items-center gap-4">
                        <Link href="/admin/products/new" className="bg-primary hover:bg-primary/90 text-on-surface font-bold text-sm h-10 px-6 rounded-xl flex items-center gap-2 transition-colors shadow-sm active:scale-95 transform duration-100">
                            <Plus className="w-5 h-5" />
                            <span>Product</span>
                        </Link>
                        <button className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-background-light text-subtle hover:text-primary transition-colors border border-transparent hover:border-primary/20">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-surface"></span>
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-background-light text-subtle hover:text-primary transition-colors border border-transparent hover:border-primary/20">
                            <HelpCircle className="w-5 h-5" />
                        </button>
                    </div>
                </header>

                {/* Mobile Header (Hidden on Desktop) */}
                <header className="md:hidden flex items-center justify-between px-5 py-6 bg-surface sticky top-0 z-20 shadow-sm border-b border-border">
                    <div className="flex flex-col">
                        <span className="text-xs text-subtle font-medium mb-1 capitalize">Welcome back, {(user?.email || '').split('@')[0]}</span>
                        <h1 className="text-xl font-bold text-on-surface leading-none font-display">Dashboard</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="relative p-2 rounded-full hover:bg-background-light transition-colors text-subtle">
                            <Bell className="w-6 h-6" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-surface"></span>
                        </button>
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-surface font-bold text-sm shadow-sm border-2 border-primary/20">
                            {user.role === 'admin_owner' ? 'O' : 'S'}
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 w-full max-w-[1600px] mx-auto md:px-10 pb-24 md:pb-8">
                    {children}
                </main>

                {/* Mobile Floating Action Button */}
                <Link
                    href="/admin/products/new"
                    className="md:hidden fixed bottom-24 right-5 w-14 h-14 bg-primary text-on-surface bg-primary/90 rounded-full shadow-lg shadow-primary/30 flex items-center justify-center transform hover:scale-105 transition-transform z-30"
                >
                    <Plus className="w-6 h-6" />
                </Link>

                {/* Mobile Bottom Navigation (Hidden on Desktop) */}
                <nav className="md:hidden bg-surface border-t border-border px-6 py-3 flex justify-between items-center z-40 fixed bottom-0 w-full left-0 right-0">
                    {mobileNavItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                        const Icon = item.icon || LayoutDashboard;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-primary' : 'text-subtle hover:text-primary'
                                    }`}
                            >
                                <Icon className={`w-6 h-6 ${isActive ? 'fill-primary/20' : ''}`} />
                                <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

            </div>
        </div>
    );
}

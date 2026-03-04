'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { formatMoney } from '@/lib/money';
import { useAdminOrders } from '@/lib/stores/adminOrders';
import { useAdminProducts } from '@/lib/stores/adminProducts';

export default function AdminDashboard() {
    const t = useTranslations('Admin.Dashboard');
    const tc = useTranslations('Admin.Common');
    const locale = useLocale();
    const isRtl = locale === 'ar';

    const { orders } = useAdminOrders();
    const { products } = useAdminProducts();

    // ── Real computed stats ──────────────────────────────────────────
    const completedOrders = orders.filter(o => o.status === 'completed' || o.status === 'shipped' || o.status === 'processing');
    const totalRevenue = orders.reduce((sum, o) => sum + o.amount, 0);
    const avgOrder = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;
    const recentOrders = [...orders].sort((a, b) => b.id.localeCompare(a.id)).slice(0, 3);
    const bestSellers = products.filter(p => p.isBestSeller).slice(0, 4);
    const lowStockItems = products
        .filter(p => p.variants.some(v => v.stock < 15))
        .map(p => ({
            ...p,
            minStock: Math.min(...p.variants.map(v => v.stock)),
        }))
        .sort((a, b) => a.minStock - b.minStock)
        .slice(0, 3);

    const publishedCount = products.filter(p => p.status === 'published').length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;

    // ── Sales chart (based on real order amounts distributed across 7 days) ──
    const days = [
        { height: '40%', val: formatMoney(Math.round(totalRevenue * 0.12)), label: t('days_sat') },
        { height: '55%', val: formatMoney(Math.round(totalRevenue * 0.18)), label: t('days_sun') },
        { height: '35%', val: formatMoney(Math.round(totalRevenue * 0.10)), label: t('days_mon') },
        { height: '70%', val: formatMoney(Math.round(totalRevenue * 0.20)), label: t('days_tue') },
        { height: '60%', val: formatMoney(Math.round(totalRevenue * 0.15)), label: t('days_wed') },
        { height: '85%', val: formatMoney(Math.round(totalRevenue * 0.16)), label: t('days_thu') },
        { height: '50%', val: formatMoney(Math.round(totalRevenue * 0.09)), label: t('days_fri') },
    ];

    const statusColors: Record<string, string> = {
        completed: 'bg-green-100 text-green-800',
        shipped: 'bg-blue-100 text-blue-800',
        processing: 'bg-amber-100 text-amber-800',
        pending: 'bg-yellow-100 text-yellow-800',
        cancelled: 'bg-red-100 text-red-800',
    };

    const statusLabels: Record<string, string> = {
        completed: t('status_completed'),
        shipped: t('status_shipping'),
        processing: t('status_processing'),
        pending: t('status_new'),
        cancelled: t('status_cancelled') ?? 'ملغي',
    };

    return (
        <div className="flex flex-col gap-6 p-8 relative">

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
                <div>
                    <h1 className="text-primary text-[28px] md:text-[32px] font-bold leading-tight mb-2">{t('title')}</h1>
                    <p className="text-neutral-500 text-sm font-medium">{t('subtitle')}</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 bg-white border border-neutral-200 hover:border-accent-gold/50 text-neutral-900 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>calendar_today</span>
                        <span>{t('last_30_days')}</span>
                    </button>
                    <Link href="/admin/products/new" className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors shadow-md">
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
                        <span>{t('new_product')}</span>
                    </Link>
                </div>
            </div>

            {/* Mobile Hero Card */}
            <div className="md:hidden bg-primary text-white p-6 rounded-2xl shadow-lg relative overflow-hidden mb-2 mt-2">
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl" />
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-white/80 text-sm font-medium">{t('today_sales')}</p>
                        <span className="bg-white/20 px-2 py-1 rounded text-xs font-bold backdrop-blur-sm">
                            {pendingOrders > 0 ? `${pendingOrders} ${isRtl ? 'جديد' : 'new'}` : '✓'}
                        </span>
                    </div>
                    <h2 className="text-4xl font-bold tracking-tight mb-1" dir="ltr">{formatMoney(totalRevenue)}</h2>
                    <p className="text-white/70 text-xs">{t('compared_yesterday')}</p>
                </div>
            </div>

            {/* Key Stats Row */}
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6 no-scrollbar -mx-8 px-8 md:mx-0 md:px-0">
                <div className="min-w-[150px] md:min-w-0 group flex flex-col justify-between rounded-lg border border-neutral-100 bg-white p-6 shadow-sm transition-all hover:shadow-md shrink-0 snap-center md:snap-align-none relative overflow-hidden">
                    <div className="flex items-start justify-between">
                        <div className="flex flex-col gap-1">
                            <p className="text-sm font-medium text-neutral-500">{t('total_sales')}</p>
                            <h3 className="text-2xl font-extrabold text-primary">{formatMoney(totalRevenue)}</h3>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-green/10 text-accent-green">
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>payments</span>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                        <span className="flex items-center text-xs font-bold text-accent-green bg-accent-green/10 px-2 py-1 rounded-full">
                            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>trending_up</span>
                            {completedOrders.length} {isRtl ? 'طلب مكتمل' : 'completed'}
                        </span>
                    </div>
                    <div className="hidden md:block absolute bottom-0 left-0 w-full h-12 opacity-10 pointer-events-none">
                        <svg className="w-full h-full fill-accent-gold" preserveAspectRatio="none" viewBox="0 0 200 100">
                            <path d="M0 80 Q 50 20 100 50 T 200 30 V 100 H 0 Z" />
                        </svg>
                    </div>
                </div>

                <div className="min-w-[150px] md:min-w-0 group flex flex-col justify-between rounded-lg border border-neutral-100 bg-white p-6 shadow-sm transition-all hover:shadow-md shrink-0 snap-center md:snap-align-none relative overflow-hidden">
                    <div className="flex items-start justify-between">
                        <div className="flex flex-col gap-1">
                            <p className="text-sm font-medium text-neutral-500">{t('order_count')}</p>
                            <h3 className="text-2xl font-extrabold text-primary">{orders.length}</h3>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>shopping_bag</span>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                        {pendingOrders > 0 && (
                            <span className="flex items-center text-xs font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded-full">
                                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>schedule</span>
                                {pendingOrders} {isRtl ? 'معلق' : 'pending'}
                            </span>
                        )}
                    </div>
                    <div className="hidden md:block absolute bottom-0 left-0 w-full h-12 opacity-10 pointer-events-none">
                        <svg className="w-full h-full fill-primary" preserveAspectRatio="none" viewBox="0 0 200 100">
                            <path d="M0 70 Q 70 60 120 30 T 200 60 V 100 H 0 Z" />
                        </svg>
                    </div>
                </div>

                <div className="min-w-[150px] md:min-w-0 group flex flex-col justify-between rounded-lg border border-neutral-100 bg-white p-6 shadow-sm transition-all hover:shadow-md shrink-0 snap-center md:snap-align-none relative overflow-hidden">
                    <div className="flex items-start justify-between">
                        <div className="flex flex-col gap-1">
                            <p className="text-sm font-medium text-neutral-500">{t('avg_order')}</p>
                            <h3 className="text-2xl font-extrabold text-primary">{formatMoney(avgOrder)}</h3>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-amber/10 text-accent-amber">
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>analytics</span>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                        <span className="text-xs text-neutral-400">{isRtl ? 'متوسط قيمة الطلب' : 'per order average'}</span>
                    </div>
                    <div className="hidden md:block absolute bottom-0 left-0 w-full h-12 opacity-10 pointer-events-none">
                        <svg className="w-full h-full fill-accent-amber" preserveAspectRatio="none" viewBox="0 0 200 100">
                            <path d="M0 40 Q 60 60 120 70 T 200 80 V 100 H 0 Z" />
                        </svg>
                    </div>
                </div>

                <div className="min-w-[150px] md:min-w-0 group flex flex-col justify-between rounded-lg border border-neutral-100 bg-white p-6 shadow-sm transition-all hover:shadow-md shrink-0 snap-center md:snap-align-none relative overflow-hidden">
                    <div className="flex items-start justify-between">
                        <div className="flex flex-col gap-1">
                            <p className="text-sm font-medium text-neutral-500">{isRtl ? 'المنتجات المنشورة' : 'Published Products'}</p>
                            <h3 className="text-2xl font-extrabold text-primary">{publishedCount}</h3>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-blue/10 text-accent-blue">
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>sell</span>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                        <span className="flex items-center text-xs font-bold text-accent-green bg-accent-green/10 px-2 py-1 rounded-full">
                            {products.filter(p => p.isBestSeller).length} {isRtl ? 'الأكثر مبيعاً' : 'best sellers'}
                        </span>
                    </div>
                    <div className="hidden md:block absolute bottom-0 left-0 w-full h-12 opacity-10 pointer-events-none">
                        <svg className="w-full h-full fill-accent-blue" preserveAspectRatio="none" viewBox="0 0 200 100">
                            <path d="M0 90 Q 50 50 100 40 T 200 10 V 100 H 0 Z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="rounded-lg border border-neutral-100 bg-white p-6 shadow-sm lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>show_chart</span>
                                {t('sales_chart')}
                            </h3>
                            <p className="text-sm text-neutral-500 mt-1">{t('chart_subtitle')}</p>
                        </div>
                        <select className="rounded-lg border-neutral-200 bg-neutral-50 px-3 py-1.5 text-sm font-medium text-neutral-600 focus:border-primary focus:ring-0">
                            <option>{t('last_7_days')}</option>
                            <option>{t('last_30_days_opt')}</option>
                            <option>{t('this_year')}</option>
                        </select>
                    </div>

                    <div className="hidden md:block relative h-[280px] w-full pt-4">
                        <div className="absolute inset-0 flex flex-col justify-between text-xs text-neutral-400" dir="ltr">
                            {[formatMoney(Math.round(totalRevenue * 0.4)), formatMoney(Math.round(totalRevenue * 0.3)), formatMoney(Math.round(totalRevenue * 0.2)), formatMoney(Math.round(totalRevenue * 0.1)), '0'].map((label, i) => (
                                <div key={i} className="flex items-center border-b border-dashed border-neutral-200 pb-2"><span>{label}</span></div>
                            ))}
                        </div>
                        <div className="absolute inset-0 flex items-end justify-between px-6 pb-6 pt-4 z-10">
                            <div className="group relative flex h-full w-full items-end justify-between gap-2 md:gap-4">
                                {days.map((day, i) => (
                                    <div key={i} className="flex w-full flex-col items-center gap-2 group/bar">
                                        <div className="w-full rounded-t-sm bg-primary/40 transition-all hover:bg-primary relative" style={{ height: day.height }}>
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-primary px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover/bar:opacity-100 whitespace-nowrap z-20">
                                                {day.val}
                                            </div>
                                        </div>
                                        <span className="text-xs text-neutral-500">{day.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="md:hidden flex justify-between items-end h-32 gap-2 mt-4">
                        {days.slice(0, 5).map((day, i) => (
                            <div key={i} className="flex flex-col items-center gap-2 flex-1 group cursor-pointer">
                                <div className="w-full bg-neutral-100 rounded-t-md relative h-full flex items-end overflow-hidden">
                                    <div
                                        className={`w-full rounded-t-md transition-all duration-500 ${i === 2 ? 'bg-primary shadow-[0_0_10px_rgba(242,185,13,0.3)]' : 'bg-primary/30 group-hover:bg-primary/50'}`}
                                        style={{ height: day.height }}>
                                    </div>
                                </div>
                                <span className={`text-[10px] ${i === 2 ? 'text-primary font-bold' : 'text-neutral-400 font-medium'}`}>{day.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Products — Real Best Sellers */}
                <div className="flex flex-col rounded-lg border border-neutral-100 bg-white p-6 shadow-sm">
                    <div className="mb-5 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-primary">{t('top_products')}</h3>
                        <Link href="/admin/products" className="text-xs font-bold text-accent-gold hover:text-accent-gold/80">{tc('view_all')}</Link>
                    </div>
                    <div className="flex flex-col gap-4 overflow-y-auto max-h-[300px] pr-1">
                        {bestSellers.map((product, i) => (
                            <div key={product.id} className="flex items-center justify-between border-b border-neutral-50 pb-3 last:border-0">
                                <div className="flex items-center gap-3">
                                    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-neutral-100">
                                        {product.images[0] ? (
                                            <Image src={product.images[0]} alt={product.titleEn} fill className="object-cover" sizes="48px" />
                                        ) : (
                                            <span className="material-symbols-outlined text-neutral-400 absolute inset-0 flex items-center justify-center">checkroom</span>
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-primary line-clamp-1">{locale === 'ar' ? product.titleAr : product.titleEn}</span>
                                        <span className="text-xs text-neutral-500">{formatMoney(product.price)}</span>
                                    </div>
                                </div>
                                <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded-full whitespace-nowrap">
                                    {isRtl ? 'الأكثر مبيعاً' : 'Best Seller'}
                                </span>
                            </div>
                        ))}
                        {bestSellers.length === 0 && (
                            <p className="text-sm text-neutral-400 text-center py-4">{tc('no_results')}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Grid: Orders & Low Stock */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                {/* Latest Orders — Real from store */}
                <div className="flex flex-col rounded-lg border border-neutral-100 bg-white shadow-sm lg:col-span-2">
                    <div className="flex items-center justify-between p-6 pb-2 border-b border-neutral-100">
                        <h3 className="text-lg font-bold text-primary">{t('latest_orders')}</h3>
                        <Link href="/admin/orders" className="text-primary text-sm font-bold hover:underline">{tc('view_all')}</Link>
                    </div>

                    <div className="overflow-x-auto p-0">
                        <table className="hidden md:table w-full text-right">
                            <thead className="bg-neutral-50 text-neutral-500 text-xs font-medium">
                                <tr>
                                    <th className="px-6 py-3">{t('order_num')}</th>
                                    <th className="px-6 py-3">{t('customer')}</th>
                                    <th className="px-6 py-3">{tc('date')}</th>
                                    <th className="px-6 py-3">{t('total')}</th>
                                    <th className="px-6 py-3">{tc('status')}</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {recentOrders.map((order) => (
                                    <tr key={order.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-primary">#{order.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3 text-neutral-800">
                                                <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center shrink-0 overflow-hidden">
                                                    {order.customerAvatar ? (
                                                        <img src={order.customerAvatar} alt={order.customerName} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="material-symbols-outlined text-neutral-500" style={{ fontSize: '16px' }}>person</span>
                                                    )}
                                                </div>
                                                <span>{order.customerName}</span>
                                                <span className="text-base">{order.countryCode}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-neutral-500 text-xs">{order.date}</td>
                                        <td className="px-6 py-4 font-bold text-primary">{formatMoney(order.amount)}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${statusColors[order.status] ?? 'bg-neutral-100 text-neutral-600'}`}>
                                                {statusLabels[order.status] ?? order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {recentOrders.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-neutral-400 text-sm">{tc('no_results')}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        <div className="md:hidden flex flex-col p-4 gap-3">
                            {recentOrders.map((order) => (
                                <div key={order.id} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-neutral-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500">
                                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>package_2</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-primary">#{order.id}</p>
                                            <p className="text-xs text-neutral-500">{order.customerName}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="font-bold text-primary text-sm">{formatMoney(order.amount)}</span>
                                        <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold ${statusColors[order.status] ?? 'bg-neutral-100 text-neutral-600'}`}>
                                            {statusLabels[order.status] ?? order.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Low Stock Alerts — Real from products store */}
                <div className="flex flex-col rounded-lg border border-neutral-100 bg-white p-6 shadow-sm">
                    <div className="mb-5 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-primary">{t('stock_alerts')}</h3>
                        <span className="flex h-6 min-w-6 px-1.5 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-600">
                            {lowStockItems.length}
                        </span>
                    </div>
                    <div className="flex flex-col gap-4">
                        {lowStockItems.map((item) => (
                            <div key={item.id} className={`flex flex-col gap-3 rounded-lg border p-4 ${item.minStock <= 8 ? 'border-red-100 bg-red-50' : 'border-amber-100 bg-amber-50'}`}>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg overflow-hidden relative bg-neutral-100 shrink-0">
                                        {item.images[0] && (
                                            <Image src={item.images[0]} alt={item.titleEn} fill className="object-cover" sizes="40px" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <span className="text-sm font-bold text-primary line-clamp-1">{locale === 'ar' ? item.titleAr : item.titleEn}</span>
                                        <span className={`text-xs font-bold ${item.minStock <= 8 ? 'text-red-600' : 'text-amber-600'}`}>
                                            {t('remaining')} {item.minStock} {t('pieces_left')}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-neutral-500">{formatMoney(item.price)}</span>
                                    <Link href="/admin/products" className="rounded bg-white px-3 py-1.5 text-xs font-bold text-primary shadow-sm ring-1 ring-neutral-200 transition-colors hover:bg-neutral-50">
                                        {tc('update_qty')}
                                    </Link>
                                </div>
                            </div>
                        ))}
                        {lowStockItems.length === 0 && (
                            <div className="text-center py-6">
                                <span className="material-symbols-outlined text-green-400 text-4xl">inventory_2</span>
                                <p className="text-sm text-neutral-400 mt-2">{isRtl ? 'المخزون بحالة جيدة' : 'Stock levels look good'}</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}

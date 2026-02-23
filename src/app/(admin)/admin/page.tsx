'use client';

// import { useAdminAuth } from '@/lib/stores/adminAuth';
import Link from 'next/link';
import { formatMoney } from '@/lib/money';

export default function AdminDashboard() {
    // const { user } = useAdminAuth();

    return (
        <div className="flex flex-col gap-6 p-8 relative">

            {/* Page Header (Optional since Topbar has Title, but keeping Hero for mobile/desktop parity) */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
                <div>
                    <h1 className="text-primary text-[28px] md:text-[32px] font-bold leading-tight mb-2">نظرة عامة على المتجر</h1>
                    <p className="text-neutral-500 text-sm font-medium">أهلاً بك، إليك ملخص لأداء متجرك اليوم</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 bg-white border border-neutral-200 hover:border-accent-gold/50 text-neutral-900 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>calendar_today</span>
                        <span>آخر 30 يوم</span>
                    </button>
                    <Link href="/admin/products/new" className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors shadow-md">
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
                        <span>منتج جديد</span>
                    </Link>
                </div>
            </div>

            {/* Mobile Hero Card: Today's Sales (Hidden on Desktop) */}
            <div className="md:hidden bg-primary text-white p-6 rounded-2xl shadow-lg relative overflow-hidden group mb-2 mt-2">
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-white/80 text-sm font-medium">مبيعات اليوم</p>
                        <span className="bg-white/20 px-2 py-1 rounded text-xs font-bold backdrop-blur-sm">+١٥٪</span>
                    </div>
                    <h2 className="text-4xl font-bold tracking-tight mb-1" dir="ltr">SAR 12,450</h2>
                    <p className="text-white/70 text-xs">مقارنة بـ ١٠,٨٠٠ أمس</p>
                </div>
            </div>

            {/* 1. Key Stats Row */}
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6 no-scrollbar -mx-8 px-8 md:mx-0 md:px-0">
                {/* Stat 1: Total Sales */}
                <div className="min-w-[150px] md:min-w-0 group flex flex-col justify-between rounded-lg border border-neutral-100 bg-white p-6 shadow-sm transition-all hover:shadow-md shrink-0 snap-center md:snap-align-none relative overflow-hidden">
                    <div className="flex items-start justify-between">
                        <div className="flex flex-col gap-1">
                            <p className="text-sm font-medium text-neutral-500">إجمالي المبيعات</p>
                            <h3 className="text-2xl font-extrabold text-primary">{formatMoney(45200)}</h3>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-green/10 text-accent-green">
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>payments</span>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                        <span className="flex items-center text-xs font-bold text-accent-green bg-accent-green/10 px-2 py-1 rounded-full">
                            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>trending_up</span>
                            12%
                        </span>
                        <span className="text-xs text-neutral-400">مقارنة بالشهر الماضي</span>
                    </div>
                    <div className="hidden md:block absolute bottom-0 left-0 w-full h-12 opacity-10 pointer-events-none">
                        <svg className="w-full h-full fill-accent-gold" preserveAspectRatio="none" viewBox="0 0 200 100">
                            <path d="M0 80 Q 50 20 100 50 T 200 30 V 100 H 0 Z"></path>
                        </svg>
                    </div>
                </div>

                {/* Stat 2: Orders */}
                <div className="min-w-[150px] md:min-w-0 group flex flex-col justify-between rounded-lg border border-neutral-100 bg-white p-6 shadow-sm transition-all hover:shadow-md shrink-0 snap-center md:snap-align-none relative overflow-hidden">
                    <div className="flex items-start justify-between">
                        <div className="flex flex-col gap-1">
                            <p className="text-sm font-medium text-neutral-500">عدد الطلبات</p>
                            <h3 className="text-2xl font-extrabold text-primary">450</h3>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>shopping_bag</span>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                        <span className="flex items-center text-xs font-bold text-accent-green bg-accent-green/10 px-2 py-1 rounded-full">
                            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>trending_up</span>
                            5%
                        </span>
                    </div>
                    <div className="hidden md:block absolute bottom-0 left-0 w-full h-12 opacity-10 pointer-events-none">
                        <svg className="w-full h-full fill-primary" preserveAspectRatio="none" viewBox="0 0 200 100">
                            <path d="M0 70 Q 70 60 120 30 T 200 60 V 100 H 0 Z"></path>
                        </svg>
                    </div>
                </div>

                {/* Stat 3: AOV */}
                <div className="min-w-[150px] md:min-w-0 group flex flex-col justify-between rounded-lg border border-neutral-100 bg-white p-6 shadow-sm transition-all hover:shadow-md shrink-0 snap-center md:snap-align-none relative overflow-hidden">
                    <div className="flex items-start justify-between">
                        <div className="flex flex-col gap-1">
                            <p className="text-sm font-medium text-neutral-500">متوسط قيمة الطلب</p>
                            <h3 className="text-2xl font-extrabold text-primary">{formatMoney(850)}</h3>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-amber/10 text-accent-amber">
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>analytics</span>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                        <span className="flex items-center text-xs font-bold text-accent-red bg-accent-red/10 px-2 py-1 rounded-full">
                            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>trending_down</span>
                            2%
                        </span>
                    </div>
                    <div className="hidden md:block absolute bottom-0 left-0 w-full h-12 opacity-10 pointer-events-none">
                        <svg className="w-full h-full fill-accent-red" preserveAspectRatio="none" viewBox="0 0 200 100">
                            <path d="M0 40 Q 60 60 120 70 T 200 80 V 100 H 0 Z"></path>
                        </svg>
                    </div>
                </div>

                {/* Stat 4: New Customers */}
                <div className="min-w-[150px] md:min-w-0 group flex flex-col justify-between rounded-lg border border-neutral-100 bg-white p-6 shadow-sm transition-all hover:shadow-md shrink-0 snap-center md:snap-align-none relative overflow-hidden">
                    <div className="flex items-start justify-between">
                        <div className="flex flex-col gap-1">
                            <p className="text-sm font-medium text-neutral-500">العملاء الجدد</p>
                            <h3 className="text-2xl font-extrabold text-primary">120</h3>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-blue/10 text-accent-blue">
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>group_add</span>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                        <span className="flex items-center text-xs font-bold text-accent-green bg-accent-green/10 px-2 py-1 rounded-full">
                            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>trending_up</span>
                            8%
                        </span>
                    </div>
                    <div className="hidden md:block absolute bottom-0 left-0 w-full h-12 opacity-10 pointer-events-none">
                        <svg className="w-full h-full fill-accent-blue" preserveAspectRatio="none" viewBox="0 0 200 100">
                            <path d="M0 90 Q 50 50 100 40 T 200 10 V 100 H 0 Z"></path>
                        </svg>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Main Chart Area */}
                <div className="rounded-lg border border-neutral-100 bg-white p-6 shadow-sm lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>show_chart</span>
                                تحليل المبيعات
                            </h3>
                            <p className="text-sm text-neutral-500 mt-1">نظرة عامة على الأداء خلال 7 أيام</p>
                        </div>
                        <select className="rounded-lg border-neutral-200 bg-neutral-50 px-3 py-1.5 text-sm font-medium text-neutral-600 focus:border-primary focus:ring-0">
                            <option>آخر 7 أيام</option>
                            <option>آخر 30 يوم</option>
                            <option>هذا العام</option>
                        </select>
                    </div>

                    {/* Desktop SVG Curve Chart */}
                    <div className="hidden md:block relative h-[280px] w-full pt-4">
                        {/* Grid lines */}
                        <div className="absolute inset-0 flex flex-col justify-between text-xs text-neutral-400" dir="ltr">
                            <div className="flex items-center border-b border-dashed border-neutral-200 pb-2"><span>50k</span></div>
                            <div className="flex items-center border-b border-dashed border-neutral-200 pb-2"><span>40k</span></div>
                            <div className="flex items-center border-b border-dashed border-neutral-200 pb-2"><span>30k</span></div>
                            <div className="flex items-center border-b border-dashed border-neutral-200 pb-2"><span>20k</span></div>
                            <div className="flex items-center border-b border-dashed border-neutral-200 pb-2"><span>10k</span></div>
                            <div className="flex items-center border-b border-dashed border-neutral-200 pb-2"><span>0</span></div>
                        </div>

                        {/* Bars / Area */}
                        <div className="absolute inset-0 flex items-end justify-between px-6 pb-6 pt-4 z-10">
                            <div className="group relative flex h-full w-full items-end justify-between gap-2 md:gap-4">
                                {/* Simulated bars for 7 days */}
                                {[
                                    { height: '40%', val: '18k', label: 'السبت' },
                                    { height: '55%', val: '24k', label: 'الأحد' },
                                    { height: '35%', val: '15k', label: 'الإثنين' },
                                    { height: '70%', val: '32k', label: 'الثلاثاء' },
                                    { height: '60%', val: '28k', label: 'الأربعاء' },
                                    { height: '85%', val: '42k', label: 'الخميس' },
                                    { height: '50%', val: '22k', label: 'الجمعة' }
                                ].map((day, i) => (
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

                    {/* Mobile Mini Bar Chart (Hidden on Desktop) */}
                    <div className="md:hidden flex justify-between items-end h-32 gap-2 mt-4">
                        {[
                            { height: '40%', val: '18k', label: 'السبت' },
                            { height: '65%', val: '24k', label: 'الأحد' },
                            { height: '85%', val: '42k', label: 'الإثنين', active: true },
                            { height: '50%', val: '22k', label: 'الثلاثاء' },
                            { height: '30%', val: '15k', label: 'الأربعاء' }
                        ].map((day, i) => (
                            <div key={i} className="flex flex-col items-center gap-2 flex-1 group cursor-pointer">
                                <div className="w-full bg-neutral-100 rounded-t-md relative h-full flex items-end overflow-hidden">
                                    <div
                                        className={`w-full rounded-t-md transition-all duration-500 ${day.active ? 'bg-primary shadow-[0_0_10px_rgba(242,185,13,0.3)]' : 'bg-primary/30 group-hover:bg-primary/50'}`}
                                        style={{ height: day.height }}>
                                    </div>
                                </div>
                                <span className={`text-[10px] ${day.active ? 'text-primary font-bold' : 'text-neutral-400 font-medium'}`}>{day.label}</span>
                            </div>
                        ))}
                    </div>

                </div>

                {/* Top Products Widget */}
                <div className="flex flex-col rounded-lg border border-neutral-100 bg-white p-6 shadow-sm">
                    <div className="mb-5 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-primary">المنتجات الأكثر مبيعاً</h3>
                        <button className="text-xs font-bold text-accent-gold hover:text-accent-gold/80">عرض الكل</button>
                    </div>
                    <div className="flex flex-col gap-4 overflow-y-auto max-h-[300px] pr-1">
                        {/* Product 1 */}
                        <div className="flex items-center justify-between border-b border-neutral-50 pb-3 last:border-0">
                            <div className="flex items-center gap-3">
                                <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-neutral-100 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-neutral-400">checkroom</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-primary">عباية ملكية سوداء</span>
                                    <span className="text-xs text-neutral-500">المخزون: 45</span>
                                </div>
                            </div>
                            <span className="text-sm font-bold text-accent-green">124 مبيعة</span>
                        </div>
                        {/* Product 2 */}
                        <div className="flex items-center justify-between border-b border-neutral-50 pb-3 last:border-0">
                            <div className="flex items-center gap-3">
                                <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-neutral-100 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-neutral-400">checkroom</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-primary">عباية حرير بيج</span>
                                    <span className="text-xs text-neutral-500">المخزون: 22</span>
                                </div>
                            </div>
                            <span className="text-sm font-bold text-accent-green">98 مبيعة</span>
                        </div>
                        {/* Product 3 */}
                        <div className="flex items-center justify-between border-b border-neutral-50 pb-3 last:border-0">
                            <div className="flex items-center gap-3">
                                <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-neutral-100 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-neutral-400">checkroom</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-primary">عباية مطرزة فاخرة</span>
                                    <span className="text-xs text-neutral-500">المخزون: 12</span>
                                </div>
                            </div>
                            <span className="text-sm font-bold text-accent-green">85 مبيعة</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Grid: Orders & Low Stock */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                {/* Latest Orders Table */}
                <div className="flex flex-col rounded-lg border border-neutral-100 bg-white shadow-sm lg:col-span-2">
                    <div className="flex items-center justify-between p-6 pb-2 border-b border-neutral-100">
                        <h3 className="text-lg font-bold text-primary">أحدث الطلبات</h3>
                        <div className="flex items-center gap-2">
                            <button className="text-primary text-sm font-bold hover:underline">عرض الكل</button>
                        </div>
                    </div>

                    <div className="overflow-x-auto p-0">
                        {/* Desktop Table View */}
                        <table className="hidden md:table w-full text-right">
                            <thead className="bg-neutral-50 text-neutral-500 text-xs font-medium">
                                <tr>
                                    <th className="px-6 py-3">رقم الطلب</th>
                                    <th className="px-6 py-3">العميل</th>
                                    <th className="px-6 py-3">التاريخ</th>
                                    <th className="px-6 py-3">المجموع</th>
                                    <th className="px-6 py-3">الحالة</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                <tr className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-primary">#ORD-001</td>
                                    <td className="px-6 py-4 flex items-center gap-3 text-neutral-800">
                                        <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined text-neutral-500" style={{ fontSize: '16px' }}>person</span>
                                        </div>
                                        منى عبدالله
                                    </td>
                                    <td className="px-6 py-4 text-neutral-500">12 أكتوبر، 2023</td>
                                    <td className="px-6 py-4 font-bold text-primary">{formatMoney(850)}</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                                            مكتمل
                                        </span>
                                    </td>
                                </tr>
                                <tr className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-primary">#ORD-002</td>
                                    <td className="px-6 py-4 flex items-center gap-3 text-neutral-800">
                                        <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined text-neutral-500" style={{ fontSize: '16px' }}>person</span>
                                        </div>
                                        نورة السبيعي
                                    </td>
                                    <td className="px-6 py-4 text-neutral-500">12 أكتوبر، 2023</td>
                                    <td className="px-6 py-4 font-bold text-primary">{formatMoney(1200)}</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                                            قيد التنفيذ
                                        </span>
                                    </td>
                                </tr>
                                <tr className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-primary">#ORD-003</td>
                                    <td className="px-6 py-4 flex items-center gap-3 text-neutral-800">
                                        <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined text-neutral-500" style={{ fontSize: '16px' }}>person</span>
                                        </div>
                                        ريم القحطاني
                                    </td>
                                    <td className="px-6 py-4 text-neutral-500">11 أكتوبر، 2023</td>
                                    <td className="px-6 py-4 font-bold text-primary">{formatMoney(450)}</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                                            جاري الشحن
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        {/* Mobile Stacked Orders View (Hidden on Desktop) */}
                        <div className="md:hidden flex flex-col p-4 gap-3">
                            <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-neutral-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500">
                                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>package_2</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-primary">#10234</p>
                                        <p className="text-xs text-neutral-500">نورة الصالح</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className="font-bold text-primary text-sm font-display">{formatMoney(450)}</span>
                                    <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] rounded-full font-bold">جديد</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-neutral-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500">
                                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>package_2</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-primary">#10233</p>
                                        <p className="text-xs text-neutral-500">سارة محمد</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className="font-bold text-primary text-sm font-display">{formatMoney(890)}</span>
                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] rounded-full font-bold">جاري التوصيل</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Low Stock Alerts */}
                <div className="flex flex-col rounded-lg border border-neutral-100 bg-white p-6 shadow-sm">
                    <div className="mb-5 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-primary">تنبيهات المخزون</h3>
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-600">3</span>
                    </div>
                    <div className="flex flex-col gap-4">
                        {/* Item 1 */}
                        <div className="flex flex-col gap-3 rounded-lg border border-red-100 bg-red-50 p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-primary">طرحة شيفون أسود</span>
                                <span className="text-xs font-bold text-red-600">متبقي 3 قطع</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-neutral-500">آخر بيع: منذ 2 ساعة</span>
                                <button className="rounded bg-white px-3 py-1.5 text-xs font-bold text-primary shadow-sm ring-1 ring-neutral-200 transition-colors hover:bg-neutral-50">تحديث الكمية</button>
                            </div>
                        </div>
                        {/* Item 2 */}
                        <div className="flex flex-col gap-3 rounded-lg border border-amber-100 bg-amber-50 p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-primary">حزام عباية ذهبي</span>
                                <span className="text-xs font-bold text-amber-600">متبقي 8 قطع</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-neutral-500">آخر بيع: منذ يوم</span>
                                <button className="rounded bg-white px-3 py-1.5 text-xs font-bold text-primary shadow-sm ring-1 ring-neutral-200 transition-colors hover:bg-neutral-50">تحديث الكمية</button>
                            </div>
                        </div>
                        {/* Item 3 */}
                        <div className="flex flex-col gap-3 rounded-lg border border-amber-100 bg-amber-50 p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-primary">عباية كتان كحلي</span>
                                <span className="text-xs font-bold text-amber-600">متبقي 5 قطع</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-neutral-500">آخر بيع: منذ 5 ساعات</span>
                                <button className="rounded bg-white px-3 py-1.5 text-xs font-bold text-primary shadow-sm ring-1 ring-neutral-200 transition-colors hover:bg-neutral-50">تحديث الكمية</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

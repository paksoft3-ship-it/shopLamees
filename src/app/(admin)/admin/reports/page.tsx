'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';

const monthlyData = [
    { monthAr: 'أغسطس', monthEn: 'Aug', revenue: 28000, orders: 185 },
    { monthAr: 'سبتمبر', monthEn: 'Sep', revenue: 34500, orders: 220 },
    { monthAr: 'أكتوبر', monthEn: 'Oct', revenue: 41200, orders: 268 },
    { monthAr: 'نوفمبر', monthEn: 'Nov', revenue: 52800, orders: 341 },
    { monthAr: 'ديسمبر', monthEn: 'Dec', revenue: 68000, orders: 440 },
    { monthAr: 'يناير', monthEn: 'Jan', revenue: 45200, orders: 312 },
];

const topProducts = [
    { nameAr: 'عباية ملكية سوداء', nameEn: 'Royal Black Abaya', sku: 'AB-001', sold: 124, revenue: 49600, stock: 45 },
    { nameAr: 'عباية حرير بيج', nameEn: 'Beige Silk Abaya', sku: 'AB-002', sold: 98, revenue: 44100, stock: 22 },
    { nameAr: 'عباية مطرزة فاخرة', nameEn: 'Luxury Embroidered Abaya', sku: 'AB-003', sold: 85, revenue: 51000, stock: 12 },
    { nameAr: 'طرحة شيفون أسود', nameEn: 'Black Chiffon Scarf', sku: 'TR-001', sold: 210, revenue: 12600, stock: 3 },
    { nameAr: 'عباية كتان كحلي', nameEn: 'Navy Linen Abaya', sku: 'AB-004', sold: 76, revenue: 38000, stock: 5 },
];

const maxRevenue = Math.max(...monthlyData.map(d => d.revenue));

export default function ReportsPage() {
    const t = useTranslations('Admin.Reports');
    const locale = useLocale();
    const [period, setPeriod] = useState('6m');

    return (
        <div className="flex flex-col gap-6 p-4 md:p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-[28px] font-bold text-[#1b170d]">{t('title')}</h1>
                    <p className="text-neutral-500 text-sm mt-1">{t('subtitle')}</p>
                </div>
                <div className="flex gap-2">
                    {['7d', '30d', '6m', '1y'].map(p => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${period === p ? 'bg-[#edab1d] text-white shadow-sm' : 'bg-white border border-neutral-200 text-neutral-600 hover:border-[#edab1d]/50'}`}
                        >
                            {p === '7d' ? '7 أيام' : p === '30d' ? '30 يوم' : p === '6m' ? '6 أشهر' : 'سنة'}
                        </button>
                    ))}
                    <button className="flex items-center gap-2 bg-white border border-neutral-200 hover:border-[#edab1d]/50 text-neutral-700 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors">
                        <span className="material-symbols-outlined text-[18px]">download</span>
                        تصدير
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'إجمالي الإيرادات', value: 'QAR 269,700', sub: '+18% مقارنة بالفترة السابقة', icon: 'payments', color: 'text-green-600', bg: 'bg-green-50', up: true },
                    { label: 'إجمالي الطلبات', value: '1,766', sub: '+22% مقارنة بالفترة السابقة', icon: 'shopping_bag', color: 'text-blue-600', bg: 'bg-blue-50', up: true },
                    { label: 'متوسط قيمة الطلب', value: 'QAR 152', sub: '-3% مقارنة بالفترة السابقة', icon: 'analytics', color: 'text-amber-500', bg: 'bg-amber-50', up: false },
                    { label: 'معدل التحويل', value: '3.4%', sub: '+0.8% مقارنة بالفترة السابقة', icon: 'conversion_path', color: 'text-purple-600', bg: 'bg-purple-50', up: true },
                ].map((kpi, i) => (
                    <div key={i} className="bg-white rounded-xl border border-neutral-100 shadow-sm p-5">
                        <div className="flex items-start justify-between mb-3">
                            <div className={`w-10 h-10 rounded-full ${kpi.bg} flex items-center justify-center`}>
                                <span className={`material-symbols-outlined ${kpi.color}`} style={{ fontSize: '20px' }}>{kpi.icon}</span>
                            </div>
                            <span className={`text-xs font-bold flex items-center gap-0.5 ${kpi.up ? 'text-green-600' : 'text-red-500'}`}>
                                <span className="material-symbols-outlined text-[14px]">{kpi.up ? 'trending_up' : 'trending_down'}</span>
                                {kpi.sub.split(' ')[0]}
                            </span>
                        </div>
                        <p className="text-xs text-neutral-500 mb-1">{kpi.label}</p>
                        <p className="text-xl font-bold text-[#1b170d]">{kpi.value}</p>
                    </div>
                ))}
            </div>

            {/* Revenue Chart */}
            <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-[#1b170d]">تحليل الإيرادات الشهرية</h3>
                        <p className="text-sm text-neutral-400 mt-0.5">مجموع المبيعات خلال آخر 6 أشهر</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-neutral-500">
                        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-[#edab1d] inline-block"></span> الإيرادات</span>
                        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-blue-300 inline-block"></span> الطلبات</span>
                    </div>
                </div>
                <div className="relative h-52">
                    <div className="absolute inset-0 flex items-end justify-between px-2 gap-3">
                        {monthlyData.map((d, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                <div className="w-full flex items-end gap-1 h-40">
                                    <div
                                        className="flex-1 bg-[#edab1d] hover:bg-[#d49511] rounded-t-md transition-all cursor-pointer group relative"
                                        style={{ height: `${(d.revenue / maxRevenue) * 100}%` }}
                                    >
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#1b170d] text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                            QAR {d.revenue.toLocaleString('ar')}
                                        </div>
                                    </div>
                                    <div
                                        className="flex-1 bg-blue-200 hover:bg-blue-300 rounded-t-md transition-all cursor-pointer"
                                        style={{ height: `${(d.orders / 440) * 80}%` }}
                                    />
                                </div>
                                <span className="text-xs text-neutral-500 font-medium">{locale === 'ar' ? d.monthAr : d.monthEn}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Two col: categories + customer */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sales by Category */}
                <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-6">
                    <h3 className="font-bold text-[#1b170d] mb-5">المبيعات حسب التصنيف</h3>
                    <div className="space-y-4">
                        {[
                            { name: 'عبايات سوداء', pct: 45, revenue: 'QAR 121,000', color: 'bg-[#edab1d]' },
                            { name: 'عبايات ملونة', pct: 28, revenue: 'QAR 75,500', color: 'bg-blue-400' },
                            { name: 'عبايات فاخرة', pct: 18, revenue: 'QAR 48,500', color: 'bg-purple-400' },
                            { name: 'طرحات ونقابات', pct: 9, revenue: 'QAR 24,200', color: 'bg-green-400' },
                        ].map((cat, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-sm mb-1.5">
                                    <span className="font-medium text-[#1b170d]">{cat.name}</span>
                                    <span className="text-neutral-500">{cat.revenue} <span className="font-bold text-[#1b170d]">({cat.pct}%)</span></span>
                                </div>
                                <div className="h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                                    <div className={`h-full ${cat.color} rounded-full`} style={{ width: `${cat.pct}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Customer Analytics */}
                <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-6">
                    <h3 className="font-bold text-[#1b170d] mb-5">تحليل العملاء</h3>
                    <div className="grid grid-cols-2 gap-4 mb-5">
                        {[
                            { label: 'إجمالي العملاء', value: '892', icon: 'group' },
                            { label: 'عملاء جدد', value: '120', icon: 'person_add' },
                            { label: 'عملاء متكررون', value: '68%', icon: 'repeat' },
                            { label: 'متوسط الإنفاق', value: 'QAR 302', icon: 'wallet' },
                        ].map((m, i) => (
                            <div key={i} className="bg-neutral-50 rounded-xl p-3 flex items-center gap-3">
                                <span className="material-symbols-outlined text-[#edab1d] text-[20px]">{m.icon}</span>
                                <div>
                                    <p className="text-xs text-neutral-500">{m.label}</p>
                                    <p className="font-bold text-[#1b170d] text-sm">{m.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <h4 className="font-medium text-[#1b170d] text-sm mb-3">المبيعات حسب البلد</h4>
                    <div className="space-y-3">
                        {[
                            { country: 'قطر 🇶🇦', pct: 72, revenue: 'QAR 194,200' },
                            { country: 'السعودية 🇸🇦', pct: 28, revenue: 'SAR 81,440' },
                        ].map((c, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>{c.country}</span>
                                    <span className="font-bold text-[#1b170d]">{c.pct}% — {c.revenue}</span>
                                </div>
                                <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#edab1d] rounded-full" style={{ width: `${c.pct}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Top Products Table */}
            <div className="bg-white rounded-xl border border-neutral-100 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between p-5 border-b border-neutral-100">
                    <h3 className="font-bold text-[#1b170d]">المنتجات الأكثر مبيعاً</h3>
                    <button className="text-sm text-[#edab1d] font-bold hover:underline">تصدير CSV</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-neutral-50 text-xs text-neutral-500 font-medium">
                            <tr>
                                <th className="px-5 py-3">#</th>
                                <th className="px-5 py-3">المنتج</th>
                                <th className="px-5 py-3">SKU</th>
                                <th className="px-5 py-3">المباع</th>
                                <th className="px-5 py-3">الإيرادات</th>
                                <th className="px-5 py-3">المخزون</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-50">
                            {topProducts.map((p, i) => (
                                <tr key={i} className="hover:bg-neutral-50 transition-colors">
                                    <td className="px-5 py-4 text-neutral-400 font-bold">{i + 1}</td>
                                    <td className="px-5 py-4 font-medium text-[#1b170d]">{locale === 'ar' ? p.nameAr : p.nameEn}</td>
                                    <td className="px-5 py-4 text-neutral-400 font-mono text-xs">{p.sku}</td>
                                    <td className="px-5 py-4 font-bold text-[#1b170d]">{p.sold}</td>
                                    <td className="px-5 py-4 font-bold text-green-600">QAR {p.revenue.toLocaleString('ar')}</td>
                                    <td className="px-5 py-4">
                                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${p.stock <= 5 ? 'bg-red-100 text-red-600' : p.stock <= 20 ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
                                            {p.stock} قطعة
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order Status Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-6">
                    <h3 className="font-bold text-[#1b170d] mb-5">توزيع حالات الطلبات</h3>
                    <div className="space-y-3">
                        {[
                            { label: 'مكتمل', count: 1180, pct: 67, color: 'bg-green-400' },
                            { label: 'جاري الشحن', count: 265, pct: 15, color: 'bg-blue-400' },
                            { label: 'قيد التنفيذ', count: 195, pct: 11, color: 'bg-amber-400' },
                            { label: 'ملغي', count: 88, pct: 5, color: 'bg-red-400' },
                            { label: 'جديد', count: 38, pct: 2, color: 'bg-neutral-300' },
                        ].map((s, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${s.color} shrink-0`} />
                                <div className="flex-1">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-neutral-700">{s.label}</span>
                                        <span className="font-bold text-[#1b170d]">{s.count} ({s.pct}%)</span>
                                    </div>
                                    <div className="h-1.5 bg-neutral-100 rounded-full">
                                        <div className={`h-full ${s.color} rounded-full`} style={{ width: `${s.pct}%` }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-6">
                    <h3 className="font-bold text-[#1b170d] mb-5">طرق الدفع</h3>
                    <div className="space-y-3">
                        {[
                            { label: 'الدفع عند الاستلام', count: 892, pct: 51, color: 'bg-[#edab1d]' },
                            { label: 'بطاقة ائتمانية', count: 530, pct: 30, color: 'bg-blue-400' },
                            { label: 'Apple Pay', count: 265, pct: 15, color: 'bg-neutral-700' },
                            { label: 'مدى', count: 79, pct: 4, color: 'bg-green-400' },
                        ].map((pm, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${pm.color} shrink-0`} />
                                <div className="flex-1">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-neutral-700">{pm.label}</span>
                                        <span className="font-bold text-[#1b170d]">{pm.count} ({pm.pct}%)</span>
                                    </div>
                                    <div className="h-1.5 bg-neutral-100 rounded-full">
                                        <div className={`h-full ${pm.color} rounded-full`} style={{ width: `${pm.pct}%` }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

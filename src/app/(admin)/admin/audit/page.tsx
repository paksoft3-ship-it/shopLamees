'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';

const logs = [
    { id: '1', user: 'owner', actionAr: 'تسجيل دخول', actionEn: 'Login', detailAr: 'تسجيل دخول ناجح من متصفح Chrome', detailEn: 'Successful login from Chrome browser', type: 'auth', timeAr: 'منذ 5 دقائق', timeEn: '5 min ago', ip: '192.168.1.1' },
    { id: '2', user: 'owner', actionAr: 'تحديث منتج', actionEn: 'Update Product', detailAr: 'تم تعديل "عباية ملكية سوداء" — تحديث السعر إلى QAR 450', detailEn: 'Updated "Royal Black Abaya" — price changed to QAR 450', type: 'product', timeAr: 'منذ 12 دقيقة', timeEn: '12 min ago', ip: '192.168.1.1' },
    { id: '3', user: 'staff1', actionAr: 'تحديث طلب', actionEn: 'Update Order', detailAr: 'تغيير حالة الطلب #ORD-1234 من "قيد التنفيذ" إلى "تم الشحن"', detailEn: 'Changed order #ORD-1234 status from "Processing" to "Shipped"', type: 'order', timeAr: 'منذ 25 دقيقة', timeEn: '25 min ago', ip: '10.0.0.5' },
    { id: '4', user: 'owner', actionAr: 'إضافة كوبون', actionEn: 'Add Coupon', detailAr: 'تم إنشاء كوبون SUMMER15 بخصم 15%', detailEn: 'Created coupon SUMMER15 with 15% discount', type: 'marketing', timeAr: 'منذ ساعة', timeEn: '1 hour ago', ip: '192.168.1.1' },
    { id: '5', user: 'staff1', actionAr: 'إلغاء طلب', actionEn: 'Cancel Order', detailAr: 'تم إلغاء الطلب #ORD-1230 بطلب العميلة سارة أحمد', detailEn: 'Cancelled order #ORD-1230 at customer Sara Ahmed\'s request', type: 'order', timeAr: 'منذ 2 ساعة', timeEn: '2 hours ago', ip: '10.0.0.5' },
    { id: '6', user: 'owner', actionAr: 'تغيير الإعدادات', actionEn: 'Change Settings', detailAr: 'تم تعديل رسوم الشحن لقطر إلى 0 QAR', detailEn: 'Updated Qatar shipping fee to 0 QAR', type: 'settings', timeAr: 'منذ 3 ساعات', timeEn: '3 hours ago', ip: '192.168.1.1' },
    { id: '7', user: 'owner', actionAr: 'رفع صورة', actionEn: 'Upload Image', detailAr: 'تم رفع 3 صور جديدة إلى مكتبة الوسائط', detailEn: 'Uploaded 3 new images to media library', type: 'media', timeAr: 'منذ 4 ساعات', timeEn: '4 hours ago', ip: '192.168.1.1' },
    { id: '8', user: 'staff1', actionAr: 'تسجيل دخول', actionEn: 'Login', detailAr: 'تسجيل دخول ناجح من تطبيق الجوال', detailEn: 'Successful login from mobile app', type: 'auth', timeAr: 'منذ 5 ساعات', timeEn: '5 hours ago', ip: '10.0.0.5' },
    { id: '9', user: 'owner', actionAr: 'إضافة منتج', actionEn: 'Add Product', detailAr: 'تم إضافة منتج جديد "عباية حرير بيج" بـ 3 مقاسات', detailEn: 'Added new product "Beige Silk Abaya" with 3 sizes', type: 'product', timeAr: 'أمس 10:30', timeEn: 'Yesterday 10:30', ip: '192.168.1.1' },
    { id: '10', user: 'owner', actionAr: 'تصدير تقرير', actionEn: 'Export Report', detailAr: 'تم تصدير تقرير المبيعات الشهري بصيغة CSV', detailEn: 'Exported monthly sales report as CSV', type: 'reports', timeAr: 'أمس 09:15', timeEn: 'Yesterday 09:15', ip: '192.168.1.1' },
    { id: '11', user: 'staff1', actionAr: 'تعديل عميلة', actionEn: 'Edit Customer', detailAr: 'تم تحديث بيانات العميلة "نورة السبيعي"', detailEn: 'Updated customer "Noura Al-Subaie" data', type: 'customer', timeAr: 'أمس 08:45', timeEn: 'Yesterday 08:45', ip: '10.0.0.5' },
    { id: '12', user: 'owner', actionAr: 'نشر صفحة', actionEn: 'Publish Page', detailAr: 'تم نشر صفحة "سياسة الإرجاع" المحدثة', detailEn: 'Published updated "Return Policy" page', type: 'content', timeAr: 'منذ يومين', timeEn: '2 days ago', ip: '192.168.1.1' },
];

export default function AuditPage() {
    const t = useTranslations('Admin.Audit');
    const locale = useLocale();
    const [filter, setFilter] = useState('all');
    const [userFilter, setUserFilter] = useState('all');

    const typeConfig = {
        auth: { icon: 'lock', color: 'text-blue-600', bg: 'bg-blue-50', label: t('type_auth') },
        product: { icon: 'sell', color: 'text-purple-600', bg: 'bg-purple-50', label: t('type_product') },
        order: { icon: 'shopping_bag', color: 'text-amber-500', bg: 'bg-amber-50', label: t('type_order') },
        marketing: { icon: 'campaign', color: 'text-pink-500', bg: 'bg-pink-50', label: t('type_marketing') },
        settings: { icon: 'settings', color: 'text-neutral-600', bg: 'bg-neutral-100', label: t('type_settings') },
        media: { icon: 'image', color: 'text-green-600', bg: 'bg-green-50', label: t('type_media') },
        reports: { icon: 'bar_chart', color: 'text-indigo-600', bg: 'bg-indigo-50', label: t('type_reports') },
        customer: { icon: 'group', color: 'text-teal-600', bg: 'bg-teal-50', label: t('type_customer') },
        content: { icon: 'article', color: 'text-orange-500', bg: 'bg-orange-50', label: t('type_content') },
    } as Record<string, { icon: string; color: string; bg: string; label: string }>;

    const filtered = logs.filter(log => {
        const matchType = filter === 'all' || log.type === filter;
        const matchUser = userFilter === 'all' || log.user === userFilter;
        return matchType && matchUser;
    });

    const filterTabs = [
        { val: 'all', label: t('filter_all') },
        { val: 'auth', label: t('filter_auth') },
        { val: 'product', label: t('filter_product') },
        { val: 'order', label: t('filter_order') },
        { val: 'settings', label: t('filter_settings') },
        { val: 'marketing', label: t('filter_marketing') },
    ];

    return (
        <div className="flex flex-col gap-6 p-4 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-[28px] font-bold text-[#1b170d]">{t('title')}</h1>
                    <p className="text-neutral-500 text-sm mt-1">{t('subtitle')}</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 bg-white border border-neutral-200 hover:border-[#edab1d] text-neutral-700 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
                        <span className="material-symbols-outlined text-lg">download</span>
                        {t('export_log')}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: t('today_actions'), value: logs.filter(l => l.timeAr.includes('دقيقة') || l.timeAr.includes('ساعة')).length, icon: 'history', color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: t('product_edits'), value: logs.filter(l => l.type === 'product').length, icon: 'sell', color: 'text-purple-600', bg: 'bg-purple-50' },
                    { label: t('order_updates'), value: logs.filter(l => l.type === 'order').length, icon: 'shopping_bag', color: 'text-amber-500', bg: 'bg-amber-50' },
                    { label: t('logins'), value: logs.filter(l => l.type === 'auth').length, icon: 'lock', color: 'text-green-600', bg: 'bg-green-50' },
                ].map((m, i) => (
                    <div key={i} className="bg-white rounded-xl border border-neutral-100 shadow-sm p-4 flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full ${m.bg} flex items-center justify-center shrink-0`}>
                            <span className={`material-symbols-outlined ${m.color} text-[18px]`}>{m.icon}</span>
                        </div>
                        <div>
                            <p className="text-xs text-neutral-500">{m.label}</p>
                            <p className="text-lg font-bold text-[#1b170d]">{m.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex flex-wrap gap-3 items-center">
                <div className="flex gap-1 bg-neutral-100 p-1 rounded-xl overflow-x-auto">
                    {filterTabs.map(({ val, label }) => (
                        <button key={val} onClick={() => setFilter(val)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${filter === val ? 'bg-white text-[#1b170d] shadow-sm' : 'text-neutral-500 hover:text-[#1b170d]'}`}>{label}</button>
                    ))}
                </div>
                <select value={userFilter} onChange={e => setUserFilter(e.target.value)} className="border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
                    <option value="all">{t('all_users')}</option>
                    <option value="owner">{t('owner')}</option>
                    <option value="staff1">Staff 1</option>
                </select>
            </div>

            <div className="bg-white rounded-xl border border-neutral-100 shadow-sm">
                <div className="divide-y divide-neutral-50">
                    {filtered.map((log) => {
                        const cfg = typeConfig[log.type] ?? typeConfig.settings;
                        return (
                            <div key={log.id} className="flex items-start gap-4 px-5 py-4 hover:bg-neutral-50 transition-colors">
                                <div className={`w-9 h-9 rounded-full ${cfg.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                                    <span className={`material-symbols-outlined ${cfg.color} text-[18px]`}>{cfg.icon}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="font-bold text-[#1b170d] text-sm">{locale === 'ar' ? log.actionAr : log.actionEn}</span>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
                                                <span className="text-xs text-neutral-400">{t('by')}: {log.user === 'owner' ? t('owner') : t('staff')}</span>
                                            </div>
                                            <p className="text-xs text-neutral-500 mt-1">{locale === 'ar' ? log.detailAr : log.detailEn}</p>
                                        </div>
                                        <div className="text-left shrink-0">
                                            <p className="text-xs text-neutral-400 whitespace-nowrap">{locale === 'ar' ? log.timeAr : log.timeEn}</p>
                                            <p className="text-[10px] text-neutral-300 font-mono mt-0.5">{log.ip}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {filtered.length === 0 && (
                        <div className="text-center py-12 text-neutral-400">
                            <span className="material-symbols-outlined text-5xl mb-2 block">history</span>
                            {t('no_results')}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { AdminAuditEntry, getAdminAuditLog } from '@/lib/actions/adminInsights';

export default function AuditPage() {
    const t = useTranslations('Admin.Audit');
    const locale = useLocale();
    const [logs, setLogs] = useState<AdminAuditEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        getAdminAuditLog().then((data) => {
            setLogs(data);
            setLoading(false);
        });
    }, []);

    const typeConfig: Record<string, { icon: string; color: string; bg: string; label: string }> = {
        order: { icon: 'shopping_bag', color: 'text-amber-500', bg: 'bg-amber-50', label: t('type_order') },
        product: { icon: 'sell', color: 'text-purple-600', bg: 'bg-purple-50', label: t('type_product') },
        settings: { icon: 'settings', color: 'text-neutral-600', bg: 'bg-neutral-100', label: t('type_settings') },
    };

    const filtered = filter === 'all' ? logs : logs.filter((l) => l.type === filter);

    const filterTabs = [
        { val: 'all', label: t('filter_all') },
        { val: 'order', label: t('filter_order') },
        { val: 'product', label: t('filter_product') },
        { val: 'settings', label: t('filter_settings') },
    ];

    const todayActions = logs.filter((l) => {
        const diff = Date.now() - new Date(l.time).getTime();
        return diff < 24 * 60 * 60 * 1000;
    }).length;

    const relativeTime = (iso: string) => {
        const diff = Date.now() - new Date(iso).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return locale === 'ar' ? `منذ ${mins} دقيقة` : `${mins} min ago`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return locale === 'ar' ? `منذ ${hours} ساعة` : `${hours} hr ago`;
        const days = Math.floor(hours / 24);
        return locale === 'ar' ? `منذ ${days} يوم` : `${days} days ago`;
    };

    return (
        <div className="flex flex-col gap-6 p-4 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-[28px] font-bold text-[#1b170d]">{t('title')}</h1>
                    <p className="text-neutral-500 text-sm mt-1">{t('subtitle')}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: t('today_actions'), value: todayActions, icon: 'history', color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: t('product_edits'), value: logs.filter((l) => l.type === 'product').length, icon: 'sell', color: 'text-purple-600', bg: 'bg-purple-50' },
                    { label: t('order_updates'), value: logs.filter((l) => l.type === 'order').length, icon: 'shopping_bag', color: 'text-amber-500', bg: 'bg-amber-50' },
                    { label: t('logins'), value: 0, icon: 'lock', color: 'text-green-600', bg: 'bg-green-50' },
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
            </div>

            <div className="bg-white rounded-xl border border-neutral-100 shadow-sm">
                {loading ? (
                    <div className="text-center py-12 text-neutral-400">
                        <span className="material-symbols-outlined text-5xl mb-2 block animate-spin">progress_activity</span>
                    </div>
                ) : (
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
                                                </div>
                                                <p className="text-xs text-neutral-500 mt-1">{locale === 'ar' ? log.detailAr : log.detailEn}</p>
                                            </div>
                                            <div className="text-left shrink-0">
                                                <p className="text-xs text-neutral-400 whitespace-nowrap">{relativeTime(log.time)}</p>
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
                )}
            </div>
        </div>
    );
}

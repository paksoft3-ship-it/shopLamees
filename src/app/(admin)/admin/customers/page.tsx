'use client';

import { useState, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';

const customers = [
    { id: '1', nameAr: 'سارة أحمد', nameEn: 'Sara Ahmed', email: 'sara@email.com', phone: '+974 3311 1234', countryAr: 'قطر 🇶🇦', countryEn: 'Qatar 🇶🇦', orders: 8, spent: 'QAR 6,840', lastOrderAr: '12 مايو 2024', lastOrderEn: '12 May 2024', status: 'vip' },
    { id: '2', nameAr: 'نورة السبيعي', nameEn: 'Noura Al-Subaie', email: 'noura@email.com', phone: '+966 50 222 3333', countryAr: 'السعودية 🇸🇦', countryEn: 'Saudi Arabia 🇸🇦', orders: 5, spent: 'QAR 3,200', lastOrderAr: '8 مايو 2024', lastOrderEn: '8 May 2024', status: 'regular' },
    { id: '3', nameAr: 'فاطمة علي', nameEn: 'Fatima Ali', email: 'fatima@email.com', phone: '+974 5555 9876', countryAr: 'قطر 🇶🇦', countryEn: 'Qatar 🇶🇦', orders: 12, spent: 'QAR 10,100', lastOrderAr: '15 مايو 2024', lastOrderEn: '15 May 2024', status: 'vip' },
    { id: '4', nameAr: 'هند محمد', nameEn: 'Hind Mohammed', email: 'hind@email.com', phone: '+966 55 444 5555', countryAr: 'السعودية 🇸🇦', countryEn: 'Saudi Arabia 🇸🇦', orders: 2, spent: 'QAR 900', lastOrderAr: '3 مايو 2024', lastOrderEn: '3 May 2024', status: 'new' },
    { id: '5', nameAr: 'ريم القحطاني', nameEn: 'Reem Al-Qahtani', email: 'reem@email.com', phone: '+974 6666 7777', countryAr: 'قطر 🇶🇦', countryEn: 'Qatar 🇶🇦', orders: 6, spent: 'QAR 4,500', lastOrderAr: '10 مايو 2024', lastOrderEn: '10 May 2024', status: 'regular' },
    { id: '6', nameAr: 'منى عبدالله', nameEn: 'Mona Abdullah', email: 'mona@email.com', phone: '+974 7777 8888', countryAr: 'قطر 🇶🇦', countryEn: 'Qatar 🇶🇦', orders: 1, spent: 'QAR 450', lastOrderAr: '1 مايو 2024', lastOrderEn: '1 May 2024', status: 'new' },
    { id: '7', nameAr: 'لولو الهاجري', nameEn: 'Lulu Al-Hajri', email: 'lulu@email.com', phone: '+974 4444 5555', countryAr: 'قطر 🇶🇦', countryEn: 'Qatar 🇶🇦', orders: 9, spent: 'QAR 7,200', lastOrderAr: '14 مايو 2024', lastOrderEn: '14 May 2024', status: 'vip' },
];

const statusBadge: Record<string, string> = {
    vip: 'bg-amber-100 text-amber-700',
    regular: 'bg-blue-100 text-blue-700',
    new: 'bg-green-100 text-green-700',
};

export default function CustomersPage() {
    const t = useTranslations('Admin.Customers');
    const locale = useLocale();
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');

    const filtered = useMemo(() => {
        return customers.filter(c => {
            const name = locale === 'ar' ? c.nameAr : c.nameEn;
            const matchSearch = name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search) || c.email.includes(search);
            const matchFilter = filter === 'all' || c.status === filter;
            return matchSearch && matchFilter;
        });
    }, [search, filter, locale]);

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'vip': return t('status_vip');
            case 'regular': return t('status_regular');
            case 'new': return t('status_new');
            default: return status;
        }
    };

    const filters = [
        { val: 'all', label: t('filter_all') },
        { val: 'vip', label: t('filter_vip') },
        { val: 'regular', label: t('filter_regular') },
        { val: 'new', label: t('filter_new') },
    ];

    return (
        <div className="flex flex-col gap-6 p-4 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-[28px] font-bold text-[#1b170d]">{t('title')}</h1>
                    <p className="text-neutral-500 text-sm mt-1">{t('subtitle')}</p>
                </div>
                <button className="flex items-center gap-2 bg-white border border-neutral-200 hover:border-[#edab1d] text-neutral-700 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
                    <span className="material-symbols-outlined text-lg">download</span>
                    {t('export_csv')}
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: t('total_customers'), value: '892', icon: 'group', color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: t('vip_customers'), value: '142', icon: 'stars', color: 'text-amber-500', bg: 'bg-amber-50' },
                    { label: t('new_this_month'), value: '120', icon: 'person_add', color: 'text-green-600', bg: 'bg-green-50' },
                    { label: t('avg_spend'), value: 'QAR 302', icon: 'wallet', color: 'text-purple-600', bg: 'bg-purple-50' },
                ].map((m, i) => (
                    <div key={i} className="bg-white rounded-xl border border-neutral-100 shadow-sm p-4 flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full ${m.bg} flex items-center justify-center shrink-0`}>
                            <span className={`material-symbols-outlined ${m.color} text-[18px]`}>{m.icon}</span>
                        </div>
                        <div>
                            <p className="text-xs text-neutral-500">{m.label}</p>
                            <p className="text-base font-bold text-[#1b170d]">{m.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-xl border border-neutral-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-neutral-100 flex flex-col md:flex-row gap-3 items-start md:items-center">
                    <div className="relative flex-1">
                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 text-[18px]">search</span>
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder={t('search_placeholder')}
                            className="w-full border border-neutral-200 rounded-lg pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#edab1d]/30 focus:border-[#edab1d] text-right"
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {filters.map(({ val, label }) => (
                            <button key={val} onClick={() => setFilter(val)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === val ? 'bg-[#edab1d] text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}>{label}</button>
                        ))}
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-neutral-50 text-xs text-neutral-500 font-medium">
                            <tr>
                                <th className="px-5 py-3">{t('customer_col')}</th>
                                <th className="px-5 py-3">{t('phone_col')}</th>
                                <th className="px-5 py-3">{t('country_col')}</th>
                                <th className="px-5 py-3">{t('orders_col')}</th>
                                <th className="px-5 py-3">{t('total_spent_col')}</th>
                                <th className="px-5 py-3">{t('last_order_col')}</th>
                                <th className="px-5 py-3">{t('category_col')}</th>
                                <th className="px-5 py-3">{t('action_col')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-50">
                            {filtered.map((c) => (
                                <tr key={c.id} className="hover:bg-neutral-50 transition-colors">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-[#edab1d]/10 flex items-center justify-center shrink-0">
                                                <span className="text-[#edab1d] font-bold text-sm">{(locale === 'ar' ? c.nameAr : c.nameEn)[0]}</span>
                                            </div>
                                            <div>
                                                <p className="font-bold text-[#1b170d] text-sm">{locale === 'ar' ? c.nameAr : c.nameEn}</p>
                                                <p className="text-xs text-neutral-400">{c.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-sm text-neutral-600 font-mono">{c.phone}</td>
                                    <td className="px-5 py-4 text-sm">{locale === 'ar' ? c.countryAr : c.countryEn}</td>
                                    <td className="px-5 py-4 font-bold text-[#1b170d]">{c.orders}</td>
                                    <td className="px-5 py-4 font-bold text-green-600">{c.spent}</td>
                                    <td className="px-5 py-4 text-xs text-neutral-400">{locale === 'ar' ? c.lastOrderAr : c.lastOrderEn}</td>
                                    <td className="px-5 py-4">
                                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusBadge[c.status]}`}>{getStatusLabel(c.status)}</span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2">
                                            <a href={`https://wa.me/${c.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg transition-colors">
                                                <span className="material-symbols-outlined text-[18px]">chat</span>
                                            </a>
                                            <button className="p-1.5 text-blue-400 hover:bg-blue-50 rounded-lg transition-colors">
                                                <span className="material-symbols-outlined text-[18px]">visibility</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filtered.length === 0 && (
                        <div className="text-center py-12 text-neutral-400">
                            <span className="material-symbols-outlined text-5xl mb-2 block">search_off</span>
                            {t('no_results')}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

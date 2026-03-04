'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

const initialCoupons = [
    { id: '1', code: 'EID2024', type: 'percent', discount: 20, minOrder: 200, maxUses: 200, used: 145, expires: '2024-06-30', active: true },
    { id: '2', code: 'SUMMER15', type: 'percent', discount: 15, minOrder: 150, maxUses: 500, used: 89, expires: '2024-08-31', active: true },
    { id: '3', code: 'WELCOME10', type: 'percent', discount: 10, minOrder: 0, maxUses: null, used: 380, expires: null, active: true },
    { id: '4', code: 'FREESHIP', type: 'shipping', discount: 0, minOrder: 100, maxUses: 1000, used: 220, expires: '2024-12-31', active: true },
    { id: '5', code: 'RAMADAN30', type: 'percent', discount: 30, minOrder: 300, maxUses: 1200, used: 1200, expires: '2024-04-10', active: false },
    { id: '6', code: 'VIP50', type: 'fixed', discount: 50, minOrder: 500, maxUses: 50, used: 12, expires: '2024-12-31', active: true },
];

type Coupon = typeof initialCoupons[0];

export default function CouponsPage() {
    const t = useTranslations('Admin.Coupons');
    const [coupons, setCoupons] = useState(initialCoupons);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ code: '', type: 'percent', discount: '', minOrder: '', maxUses: '', expires: '' });

    const toggleActive = (id: string) => setCoupons(prev => prev.map(c => c.id === id ? { ...c, active: !c.active } : c));

    const discountLabel = (c: Coupon) => {
        if (c.type === 'percent') return `${c.discount}%`;
        if (c.type === 'fixed') return `QAR ${c.discount}`;
        return t('type_shipping');
    };

    const typeLabel = (type: string) => {
        switch (type) {
            case 'percent': return t('type_percent');
            case 'fixed': return t('type_fixed');
            case 'shipping': return t('type_shipping');
            default: return type;
        }
    };

    return (
        <div className="flex flex-col gap-6 p-4 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-[28px] font-bold text-[#1b170d]">{t('title')}</h1>
                    <p className="text-neutral-500 text-sm mt-1">{t('subtitle')}</p>
                </div>
                <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-[#edab1d] hover:bg-[#d49511] text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-md">
                    <span className="material-symbols-outlined text-lg">add</span>
                    {t('new_coupon')}
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: t('active_coupons'), value: coupons.filter(c => c.active).length, icon: 'loyalty', color: 'text-green-600', bg: 'bg-green-50' },
                    { label: t('total_uses'), value: coupons.reduce((s, c) => s + c.used, 0).toLocaleString(), icon: 'redeem', color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: t('expired'), value: coupons.filter(c => !c.active).length, icon: 'event_busy', color: 'text-neutral-500', bg: 'bg-neutral-100' },
                    { label: t('savings'), value: 'QAR 18,400', icon: 'savings', color: 'text-amber-500', bg: 'bg-amber-50' },
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
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-neutral-50 text-xs text-neutral-500 font-medium">
                            <tr>
                                <th className="px-5 py-3">{t('code_col')}</th>
                                <th className="px-5 py-3">{t('type_col')}</th>
                                <th className="px-5 py-3">{t('discount_col')}</th>
                                <th className="px-5 py-3">{t('min_order_col')}</th>
                                <th className="px-5 py-3">{t('usage_col')}</th>
                                <th className="px-5 py-3">{t('expires_col')}</th>
                                <th className="px-5 py-3">{t('status_col')}</th>
                                <th className="px-5 py-3">{t('action_col')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-50">
                            {coupons.map((c) => (
                                <tr key={c.id} className="hover:bg-neutral-50 transition-colors">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono font-bold text-[#1b170d] bg-neutral-100 px-3 py-1 rounded-md text-sm">{c.code}</span>
                                            <button onClick={() => navigator.clipboard?.writeText(c.code)} className="text-neutral-400 hover:text-[#edab1d] transition-colors">
                                                <span className="material-symbols-outlined text-[16px]">content_copy</span>
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-sm text-neutral-600">{typeLabel(c.type)}</td>
                                    <td className="px-5 py-4 font-bold text-[#edab1d] text-sm">{discountLabel(c)}</td>
                                    <td className="px-5 py-4 text-sm text-neutral-600">{c.minOrder > 0 ? `QAR ${c.minOrder}` : '—'}</td>
                                    <td className="px-5 py-4">
                                        <div className="text-sm">
                                            <span className="font-bold text-[#1b170d]">{c.used}</span>
                                            <span className="text-neutral-400"> / {c.maxUses ?? '∞'}</span>
                                        </div>
                                        {c.maxUses && (
                                            <div className="w-20 h-1 bg-neutral-100 rounded-full mt-1">
                                                <div className="h-full bg-[#edab1d] rounded-full" style={{ width: `${Math.min((c.used / c.maxUses) * 100, 100)}%` }} />
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-5 py-4 text-xs text-neutral-400">{c.expires ?? t('no_expiry')}</td>
                                    <td className="px-5 py-4">
                                        <button onClick={() => toggleActive(c.id)} className={`w-10 h-5 rounded-full relative transition-colors ${c.active ? 'bg-[#edab1d]' : 'bg-neutral-200'}`}>
                                            <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${c.active ? 'right-0.5' : 'left-0.5'}`} />
                                        </button>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2">
                                            <button className="p-1.5 text-[#edab1d] hover:bg-[#edab1d]/10 rounded-lg transition-colors">
                                                <span className="material-symbols-outlined text-[18px]">edit</span>
                                            </button>
                                            <button className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                                                <span className="material-symbols-outlined text-[18px]">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg font-bold text-[#1b170d]">{t('modal_title')}</h3>
                            <button onClick={() => setShowModal(false)} className="text-neutral-400 hover:text-neutral-600">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#1b170d] mb-1">{t('code_label')}</label>
                                <input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#edab1d]/30 focus:border-[#edab1d]" dir="ltr" placeholder="SUMMER20" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#1b170d] mb-1">{t('type_label')}</label>
                                <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#edab1d]/30 focus:border-[#edab1d]">
                                    <option value="percent">{t('type_percent')} (%)</option>
                                    <option value="fixed">{t('type_fixed')} (QAR)</option>
                                    <option value="shipping">{t('type_shipping')}</option>
                                </select>
                            </div>
                            {form.type !== 'shipping' && (
                                <div>
                                    <label className="block text-sm font-medium text-[#1b170d] mb-1">{t('discount_label')}</label>
                                    <input type="number" value={form.discount} onChange={e => setForm(f => ({ ...f, discount: e.target.value }))} className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#edab1d]/30 focus:border-[#edab1d]" placeholder={form.type === 'percent' ? '20' : '50'} />
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-[#1b170d] mb-1">{t('min_order_label')}</label>
                                    <input type="number" value={form.minOrder} onChange={e => setForm(f => ({ ...f, minOrder: e.target.value }))} className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#edab1d]/30 focus:border-[#edab1d]" placeholder="0" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#1b170d] mb-1">{t('max_uses_label')}</label>
                                    <input type="number" value={form.maxUses} onChange={e => setForm(f => ({ ...f, maxUses: e.target.value }))} className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#edab1d]/30 focus:border-[#edab1d]" placeholder="∞" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#1b170d] mb-1">{t('expiry_label')}</label>
                                <input type="date" value={form.expires} onChange={e => setForm(f => ({ ...f, expires: e.target.value }))} className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#edab1d]/30 focus:border-[#edab1d]" />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setShowModal(false)} className="flex-1 border border-neutral-200 text-neutral-700 py-2.5 rounded-xl text-sm font-medium hover:bg-neutral-50">{t('cancel')}</button>
                            <button onClick={() => setShowModal(false)} className="flex-1 bg-[#edab1d] hover:bg-[#d49511] text-white py-2.5 rounded-xl text-sm font-bold transition-colors">{t('add_coupon')}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

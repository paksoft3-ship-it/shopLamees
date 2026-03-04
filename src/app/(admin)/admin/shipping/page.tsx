'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';

export default function ShippingPage() {
    const t = useTranslations('Admin.Shipping');
    const tc = useTranslations('Admin.Common');
    const [activeTab, setActiveTab] = useState('zones');

    const tabs = [
        { id: 'zones', label: t('tab_zones'), icon: 'map' },
        { id: 'rates', label: t('tab_rates'), icon: 'price_change' },
        { id: 'carriers', label: t('tab_carriers'), icon: 'local_shipping' },
        { id: 'tracking', label: t('tab_tracking'), icon: 'track_changes' },
    ];

    return (
        <div className="flex flex-col gap-6 p-4 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-[28px] font-bold text-[#1b170d]">{t('title')}</h1>
                    <p className="text-neutral-500 text-sm mt-1">{t('subtitle')}</p>
                </div>
                <button className="flex items-center gap-2 bg-[#edab1d] hover:bg-[#d49511] text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-md">
                    <span className="material-symbols-outlined text-lg">save</span>
                    {tc('save_changes')}
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'طلبات قيد الشحن', value: '48', icon: 'local_shipping', color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'متوسط وقت التوصيل', value: '3.2 أيام', icon: 'schedule', color: 'text-amber-500', bg: 'bg-amber-50' },
                    { label: 'طلبات بشحن مجاني', value: '72%', icon: 'free_cancellation', color: 'text-green-600', bg: 'bg-green-50' },
                    { label: 'معدل التوصيل الناجح', value: '98.4%', icon: 'verified', color: 'text-purple-600', bg: 'bg-purple-50' },
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

            {/* Tabs */}
            <div className="flex gap-1 bg-neutral-100 p-1 rounded-xl w-fit">
                {tabs.map(t => (
                    <button key={t.id} onClick={() => setActiveTab(t.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === t.id ? 'bg-white text-[#1b170d] shadow-sm' : 'text-neutral-500 hover:text-[#1b170d]'}`}>
                        <span className="material-symbols-outlined text-[18px]">{t.icon}</span>
                        <span className="hidden sm:inline">{t.label}</span>
                    </button>
                ))}
            </div>

            {activeTab === 'zones' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        {
                            flag: '🇶🇦', country: 'قطر', currency: 'QAR', regions: ['الدوحة', 'الريان', 'الوكرة', 'أم صلال', 'الخور', 'الشمال', 'الشيلة'],
                            fee: 0, freeAbove: 300, active: true, color: 'border-green-200 bg-green-50/30'
                        },
                        {
                            flag: '🇸🇦', country: 'المملكة العربية السعودية', currency: 'SAR', regions: ['الرياض', 'جدة', 'الدمام', 'مكة المكرمة', 'المدينة المنورة'],
                            fee: 25, freeAbove: 500, active: true, color: 'border-blue-200 bg-blue-50/30'
                        },
                    ].map((zone, i) => (
                        <div key={i} className={`bg-white rounded-xl border shadow-sm p-6 ${zone.color}`}>
                            <div className="flex items-center justify-between mb-5">
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl">{zone.flag}</span>
                                    <div>
                                        <h3 className="font-bold text-[#1b170d]">{zone.country}</h3>
                                        <p className="text-xs text-neutral-500">العملة: {zone.currency}</p>
                                    </div>
                                </div>
                                <div className={`w-10 h-5 rounded-full relative cursor-pointer ${zone.active ? 'bg-[#edab1d]' : 'bg-neutral-200'}`}>
                                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow ${zone.active ? 'right-0.5' : 'left-0.5'}`} />
                                </div>
                            </div>

                            <div className="space-y-3 mb-5">
                                <div>
                                    <label className="block text-xs font-medium text-neutral-500 mb-1">رسوم الشحن ({zone.currency})</label>
                                    <input type="number" defaultValue={zone.fee} className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#edab1d]/30 focus:border-[#edab1d]" />
                                    {zone.fee === 0 && <p className="text-xs text-green-600 mt-1">✓ شحن مجاني لجميع الطلبات</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-neutral-500 mb-1">شحن مجاني عند تجاوز ({zone.currency})</label>
                                    <input type="number" defaultValue={zone.freeAbove} className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#edab1d]/30 focus:border-[#edab1d]" />
                                </div>
                            </div>

                            <div>
                                <p className="text-xs font-medium text-neutral-500 mb-2">المناطق ({zone.regions.length})</p>
                                <div className="flex flex-wrap gap-2">
                                    {zone.regions.map((r) => (
                                        <span key={r} className="text-xs bg-white border border-neutral-200 px-2.5 py-1 rounded-full text-neutral-600">{r}</span>
                                    ))}
                                    <button className="text-xs border-2 border-dashed border-neutral-300 text-neutral-400 px-2.5 py-1 rounded-full hover:border-[#edab1d] hover:text-[#edab1d] transition-colors">+ إضافة</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'rates' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-6">
                        <h3 className="font-bold text-[#1b170d] mb-4">قواعد الشحن</h3>
                        <div className="space-y-4">
                            {[
                                { label: 'توصيل عادي (3-5 أيام)', price: 'مجاني', desc: 'قطر - جميع الطلبات' },
                                { label: 'توصيل سريع (1-2 أيام)', price: 'QAR 30', desc: 'قطر - الدوحة والريان' },
                                { label: 'توصيل دولي (5-7 أيام)', price: 'SAR 25', desc: 'المملكة العربية السعودية' },
                                { label: 'توصيل دولي سريع', price: 'SAR 60', desc: 'السعودية - 3-4 أيام' },
                            ].map((rate, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                                    <div>
                                        <p className="text-sm font-bold text-[#1b170d]">{rate.label}</p>
                                        <p className="text-xs text-neutral-400">{rate.desc}</p>
                                    </div>
                                    <span className="font-bold text-[#edab1d] text-sm">{rate.price}</span>
                                </div>
                            ))}
                        </div>
                        <button className="mt-4 w-full border-2 border-dashed border-[#edab1d]/40 text-[#d49511] py-3 rounded-xl text-sm font-medium hover:bg-[#edab1d]/5 flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-lg">add</span>
                            إضافة قاعدة شحن
                        </button>
                    </div>
                    <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-6">
                        <h3 className="font-bold text-[#1b170d] mb-4">شحن حسب الوزن</h3>
                        <table className="w-full text-sm text-right">
                            <thead className="text-xs text-neutral-500">
                                <tr><th className="py-2">الوزن</th><th className="py-2">قطر</th><th className="py-2">السعودية</th></tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-50">
                                {[
                                    ['أقل من 500g', 'مجاني', 'SAR 15'],
                                    ['500g - 1kg', 'مجاني', 'SAR 20'],
                                    ['1kg - 3kg', 'مجاني', 'SAR 25'],
                                    ['3kg - 5kg', 'QAR 10', 'SAR 35'],
                                    ['أكثر من 5kg', 'QAR 20', 'SAR 50'],
                                ].map(([w, q, s], i) => (
                                    <tr key={i} className="hover:bg-neutral-50">
                                        <td className="py-2.5 text-neutral-600">{w}</td>
                                        <td className="py-2.5 font-medium text-green-600">{q}</td>
                                        <td className="py-2.5 font-medium text-blue-600">{s}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'carriers' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { name: 'Qatar Post', logo: '📮', active: true, avgDays: '3-5', coverage: 'قطر', rating: 4.2 },
                        { name: 'Aramex', logo: '🚚', active: true, avgDays: '2-4', coverage: 'قطر + السعودية', rating: 4.5 },
                        { name: 'DHL Express', logo: '✈️', active: false, avgDays: '1-2', coverage: 'دولي', rating: 4.8 },
                        { name: 'FedEx', logo: '📦', active: false, avgDays: '2-3', coverage: 'دولي', rating: 4.6 },
                        { name: 'SMSA Express', logo: '🏎️', active: true, avgDays: '2-3', coverage: 'السعودية', rating: 4.1 },
                        { name: 'Naqel Express', logo: '⚡', active: false, avgDays: '3-4', coverage: 'السعودية', rating: 3.9 },
                    ].map((carrier, i) => (
                        <div key={i} className={`bg-white rounded-xl border shadow-sm p-5 ${carrier.active ? 'border-[#edab1d]/30' : 'border-neutral-100'}`}>
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{carrier.logo}</span>
                                    <div>
                                        <p className="font-bold text-[#1b170d]">{carrier.name}</p>
                                        <p className="text-xs text-neutral-400">{carrier.coverage}</p>
                                    </div>
                                </div>
                                <div className={`w-10 h-5 rounded-full relative cursor-pointer ${carrier.active ? 'bg-[#edab1d]' : 'bg-neutral-200'}`}>
                                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow ${carrier.active ? 'right-0.5' : 'left-0.5'}`} />
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-xs text-neutral-500">
                                <span>⏱ {carrier.avgDays} أيام</span>
                                <span>⭐ {carrier.rating}/5</span>
                            </div>
                            {carrier.active && <div className="mt-3 h-1 bg-[#edab1d]/20 rounded-full"><div className="h-full bg-[#edab1d] rounded-full" style={{ width: `${(carrier.rating / 5) * 100}%` }} /></div>}
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'tracking' && (
                <div className="bg-white rounded-xl border border-neutral-100 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-neutral-100 flex flex-col md:flex-row gap-3">
                        <div className="relative flex-1">
                            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 text-[18px]">search</span>
                            <input placeholder="ابحث برقم الطلب أو رقم التتبع..." className="w-full border border-neutral-200 rounded-lg pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#edab1d]/30 text-right" />
                        </div>
                    </div>
                    <table className="w-full text-right">
                        <thead className="bg-neutral-50 text-xs text-neutral-500 font-medium">
                            <tr>
                                <th className="px-5 py-3">رقم الطلب</th>
                                <th className="px-5 py-3">العميلة</th>
                                <th className="px-5 py-3">رقم التتبع</th>
                                <th className="px-5 py-3">شركة الشحن</th>
                                <th className="px-5 py-3">الحالة</th>
                                <th className="px-5 py-3">تاريخ التوصيل المتوقع</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-50">
                            {[
                                { order: '#ORD-1234', customer: 'سارة أحمد', tracking: 'QP123456789', carrier: 'Qatar Post', status: 'في الطريق', statusColor: 'bg-blue-100 text-blue-700', date: '16 مايو 2024' },
                                { order: '#ORD-1233', customer: 'فاطمة علي', tracking: 'ARM987654', carrier: 'Aramex', status: 'تم التسليم', statusColor: 'bg-green-100 text-green-700', date: '14 مايو 2024' },
                                { order: '#ORD-1232', customer: 'نورة السبيعي', tracking: 'SM112233', carrier: 'SMSA', status: 'قيد الفرز', statusColor: 'bg-amber-100 text-amber-700', date: '18 مايو 2024' },
                            ].map((row, i) => (
                                <tr key={i} className="hover:bg-neutral-50">
                                    <td className="px-5 py-4 font-bold text-[#1b170d]">{row.order}</td>
                                    <td className="px-5 py-4 text-sm">{row.customer}</td>
                                    <td className="px-5 py-4 font-mono text-xs text-neutral-500">{row.tracking}</td>
                                    <td className="px-5 py-4 text-sm">{row.carrier}</td>
                                    <td className="px-5 py-4"><span className={`text-xs font-bold px-2.5 py-1 rounded-full ${row.statusColor}`}>{row.status}</span></td>
                                    <td className="px-5 py-4 text-xs text-neutral-400">{row.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

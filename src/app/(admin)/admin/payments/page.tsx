'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function PaymentsPage() {
    const t = useTranslations('Admin.Payments');
    const tc = useTranslations('Admin.Common');
    const [activeTab, setActiveTab] = useState('methods');

    const tabs = [
        { id: 'methods', label: t('tab_methods'), icon: 'credit_card' },
        { id: 'transactions', label: t('tab_transactions'), icon: 'receipt_long' },
        { id: 'refunds', label: t('tab_refunds'), icon: 'currency_exchange' },
    ];

    return (
        <div className="flex flex-col gap-6 p-4 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-[28px] font-bold text-[#1b170d]">{t('title')}</h1>
                    <p className="text-neutral-500 text-sm mt-1">{t('subtitle')}</p>
                </div>
                <button className="flex items-center gap-2 bg-[#edab1d] hover:bg-[#d49511] text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-md">
                    <span className="material-symbols-outlined text-lg">download</span>
                    {tc('export_csv')}
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'إجمالي الإيرادات (هذا الشهر)', value: 'QAR 45,200', icon: 'payments', color: 'text-green-600', bg: 'bg-green-50' },
                    { label: 'معاملات ناجحة', value: '312', icon: 'check_circle', color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'مستردات معلقة', value: '4', icon: 'pending', color: 'text-amber-500', bg: 'bg-amber-50' },
                    { label: 'قيمة المستردات', value: 'QAR 1,850', icon: 'currency_exchange', color: 'text-red-500', bg: 'bg-red-50' },
                ].map((m, i) => (
                    <div key={i} className="bg-white rounded-xl border border-neutral-100 shadow-sm p-4 flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full ${m.bg} flex items-center justify-center shrink-0`}>
                            <span className={`material-symbols-outlined ${m.color} text-[18px]`}>{m.icon}</span>
                        </div>
                        <div>
                            <p className="text-xs text-neutral-500 leading-tight">{m.label}</p>
                            <p className="text-base font-bold text-[#1b170d]">{m.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex gap-1 bg-neutral-100 p-1 rounded-xl w-fit">
                {tabs.map(t => (
                    <button key={t.id} onClick={() => setActiveTab(t.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === t.id ? 'bg-white text-[#1b170d] shadow-sm' : 'text-neutral-500 hover:text-[#1b170d]'}`}>
                        <span className="material-symbols-outlined text-[18px]">{t.icon}</span>
                        <span className="hidden sm:inline">{t.label}</span>
                    </button>
                ))}
            </div>

            {activeTab === 'methods' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-6">
                        <h3 className="font-bold text-[#1b170d] mb-5">طرق الدفع المتاحة</h3>
                        <div className="space-y-3">
                            {[
                                { name: 'الدفع عند الاستلام', icon: '💵', desc: 'Cash on Delivery', active: true, pct: 51 },
                                { name: 'بطاقة ائتمانية / مدى', icon: '💳', desc: 'Visa, Mastercard, Mada', active: true, pct: 30 },
                                { name: 'Apple Pay', icon: '📱', desc: 'Apple Pay via Stripe', active: true, pct: 15 },
                                { name: 'تمارا (تقسيط)', icon: '🛒', desc: 'اشتري الآن وادفعي لاحقاً', active: false, pct: 0 },
                                { name: 'تابي (تقسيط)', icon: '🛍️', desc: 'BNPL - 4 دفعات', active: false, pct: 0 },
                                { name: 'PayPal', icon: '🅿️', desc: 'PayPal International', active: false, pct: 0 },
                            ].map((method, i) => (
                                <div key={i} className="flex items-center justify-between p-3.5 border border-neutral-100 rounded-xl hover:border-neutral-200 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">{method.icon}</span>
                                        <div>
                                            <p className="text-sm font-bold text-[#1b170d]">{method.name}</p>
                                            <p className="text-xs text-neutral-400">{method.desc}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {method.active && method.pct > 0 && (
                                            <span className="text-xs font-bold text-neutral-500">{method.pct}%</span>
                                        )}
                                        <div className={`w-10 h-5 rounded-full relative cursor-pointer ${method.active ? 'bg-[#edab1d]' : 'bg-neutral-200'}`}>
                                            <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${method.active ? 'right-0.5' : 'left-0.5'}`} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-6">
                            <h3 className="font-bold text-[#1b170d] mb-4">توزيع طرق الدفع</h3>
                            <div className="space-y-3">
                                {[
                                    { label: 'الدفع عند الاستلام', pct: 51, color: 'bg-[#edab1d]' },
                                    { label: 'بطاقة ائتمانية', pct: 30, color: 'bg-blue-400' },
                                    { label: 'Apple Pay', pct: 15, color: 'bg-neutral-700' },
                                    { label: 'مدى', pct: 4, color: 'bg-green-400' },
                                ].map((pm, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between text-xs text-neutral-600 mb-1">
                                            <span>{pm.label}</span>
                                            <span className="font-bold">{pm.pct}%</span>
                                        </div>
                                        <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                                            <div className={`h-full ${pm.color} rounded-full`} style={{ width: `${pm.pct}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-6">
                            <h3 className="font-bold text-[#1b170d] mb-4">بوابة الدفع الإلكتروني</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-neutral-500 mb-1">مزود بوابة الدفع</label>
                                    <select className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm">
                                        <option>Stripe</option>
                                        <option>PayTabs</option>
                                        <option>HyperPay</option>
                                        <option>Moyasar</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-neutral-500 mb-1">Publishable Key</label>
                                    <input className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm font-mono" type="password" defaultValue="pk_live_xxxxxxxxxxxxxxxxxx" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-neutral-500 mb-1">Secret Key</label>
                                    <input className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm font-mono" type="password" defaultValue="sk_live_xxxxxxxxxxxxxxxxxx" />
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                                    <span className="material-symbols-outlined text-green-600 text-[18px]">verified</span>
                                    <span className="text-sm text-green-700 font-medium">متصل بنجاح — Stripe Live Mode</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'transactions' && (
                <div className="bg-white rounded-xl border border-neutral-100 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-neutral-100 flex gap-3">
                        <div className="relative flex-1">
                            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 text-[18px]">search</span>
                            <input placeholder="ابحث برقم المعاملة أو الطلب..." className="w-full border border-neutral-200 rounded-lg pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#edab1d]/30 text-right" />
                        </div>
                        <select className="border border-neutral-200 rounded-lg px-4 py-2.5 text-sm">
                            <option>جميع الطرق</option>
                            <option>COD</option>
                            <option>بطاقة</option>
                            <option>Apple Pay</option>
                        </select>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-right">
                            <thead className="bg-neutral-50 text-xs text-neutral-500 font-medium">
                                <tr>
                                    <th className="px-5 py-3">رقم المعاملة</th>
                                    <th className="px-5 py-3">رقم الطلب</th>
                                    <th className="px-5 py-3">العميلة</th>
                                    <th className="px-5 py-3">المبلغ</th>
                                    <th className="px-5 py-3">الطريقة</th>
                                    <th className="px-5 py-3">الحالة</th>
                                    <th className="px-5 py-3">التاريخ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-50">
                                {[
                                    { txn: 'TXN-001234', order: '#ORD-1234', customer: 'سارة أحمد', amount: 'QAR 850', method: 'Apple Pay', status: 'ناجح', statusColor: 'bg-green-100 text-green-700', date: '15 مايو 2024' },
                                    { txn: 'TXN-001233', order: '#ORD-1233', customer: 'فاطمة علي', amount: 'QAR 1,200', method: 'COD', status: 'ناجح', statusColor: 'bg-green-100 text-green-700', date: '14 مايو 2024' },
                                    { txn: 'TXN-001232', order: '#ORD-1232', customer: 'نورة السبيعي', amount: 'QAR 450', method: 'بطاقة', status: 'قيد المعالجة', statusColor: 'bg-amber-100 text-amber-700', date: '14 مايو 2024' },
                                    { txn: 'TXN-001231', order: '#ORD-1231', customer: 'هند محمد', amount: 'QAR 320', method: 'بطاقة', status: 'مرفوض', statusColor: 'bg-red-100 text-red-600', date: '13 مايو 2024' },
                                ].map((tx, i) => (
                                    <tr key={i} className="hover:bg-neutral-50 transition-colors">
                                        <td className="px-5 py-4 font-mono text-xs text-neutral-500">{tx.txn}</td>
                                        <td className="px-5 py-4 font-bold text-[#edab1d]">{tx.order}</td>
                                        <td className="px-5 py-4 text-sm">{tx.customer}</td>
                                        <td className="px-5 py-4 font-bold text-[#1b170d]">{tx.amount}</td>
                                        <td className="px-5 py-4 text-sm text-neutral-600">{tx.method}</td>
                                        <td className="px-5 py-4"><span className={`text-xs font-bold px-2.5 py-1 rounded-full ${tx.statusColor}`}>{tx.status}</span></td>
                                        <td className="px-5 py-4 text-xs text-neutral-400">{tx.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'refunds' && (
                <div className="bg-white rounded-xl border border-neutral-100 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-neutral-100">
                        <h3 className="font-bold text-[#1b170d]">طلبات الاسترداد</h3>
                    </div>
                    <table className="w-full text-right">
                        <thead className="bg-neutral-50 text-xs text-neutral-500 font-medium">
                            <tr>
                                <th className="px-5 py-3">رقم الطلب</th>
                                <th className="px-5 py-3">العميلة</th>
                                <th className="px-5 py-3">السبب</th>
                                <th className="px-5 py-3">المبلغ</th>
                                <th className="px-5 py-3">الحالة</th>
                                <th className="px-5 py-3">إجراء</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-50">
                            {[
                                { order: '#ORD-1220', customer: 'ريم القحطاني', reason: 'المنتج لا يطابق الوصف', amount: 'QAR 450', status: 'معلق', statusColor: 'bg-amber-100 text-amber-700' },
                                { order: '#ORD-1215', customer: 'منى عبدالله', reason: 'استلام خاطئ', amount: 'QAR 850', status: 'معلق', statusColor: 'bg-amber-100 text-amber-700' },
                                { order: '#ORD-1200', customer: 'سارة أحمد', reason: 'إلغاء الطلب', amount: 'QAR 320', status: 'تم الاسترداد', statusColor: 'bg-green-100 text-green-700' },
                                { order: '#ORD-1195', customer: 'فاطمة علي', reason: 'عيب في المنتج', amount: 'QAR 680', status: 'تم الاسترداد', statusColor: 'bg-green-100 text-green-700' },
                            ].map((r, i) => (
                                <tr key={i} className="hover:bg-neutral-50 transition-colors">
                                    <td className="px-5 py-4 font-bold text-[#edab1d]">{r.order}</td>
                                    <td className="px-5 py-4 text-sm">{r.customer}</td>
                                    <td className="px-5 py-4 text-sm text-neutral-600">{r.reason}</td>
                                    <td className="px-5 py-4 font-bold text-[#1b170d]">{r.amount}</td>
                                    <td className="px-5 py-4"><span className={`text-xs font-bold px-2.5 py-1 rounded-full ${r.statusColor}`}>{r.status}</span></td>
                                    <td className="px-5 py-4">
                                        {r.status === 'معلق' && (
                                            <div className="flex gap-2">
                                                <button className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-lg font-bold hover:bg-green-200 transition-colors">قبول</button>
                                                <button className="text-xs bg-red-100 text-red-600 px-3 py-1.5 rounded-lg font-bold hover:bg-red-200 transition-colors">رفض</button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

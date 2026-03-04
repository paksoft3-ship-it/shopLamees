'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';

const campaigns = [
    { name: 'حملة العيد الكبير', type: 'email', status: 'active', sent: 1240, opened: 612, clicked: 188, revenue: 'QAR 8,420', date: '2024-06-10' },
    { name: 'خصم نهاية الموسم', type: 'whatsapp', status: 'completed', sent: 892, opened: 780, clicked: 320, revenue: 'QAR 14,200', date: '2024-05-28' },
    { name: 'عروض رمضان', type: 'email', status: 'completed', sent: 2100, opened: 1050, clicked: 445, revenue: 'QAR 22,800', date: '2024-03-10' },
    { name: 'إطلاق تشكيلة صيف', type: 'sms', status: 'draft', sent: 0, opened: 0, clicked: 0, revenue: '—', date: '2024-07-01' },
];

const statusColors: Record<string, string> = {
    active: 'bg-green-100 text-green-700',
    completed: 'bg-blue-100 text-blue-700',
    draft: 'bg-neutral-100 text-neutral-600',
    paused: 'bg-amber-100 text-amber-700',
};

export default function MarketingPage() {
    const t = useTranslations('Admin.Marketing');
    const locale = useLocale();
    const [activeTab, setActiveTab] = useState('campaigns');

    const statusLabels: Record<string, string> = {
        active: t('active'),
        completed: locale === 'ar' ? 'مكتملة' : 'Completed',
        draft: locale === 'ar' ? 'مسودة' : 'Draft',
        paused: t('paused'),
    };

    const tabs = [
        { id: 'campaigns', label: t('tab_campaigns'), icon: 'campaign' },
        { id: 'discounts', label: t('tab_discounts'), icon: 'sell' },
        { id: 'whatsapp', label: t('tab_whatsapp'), icon: 'chat' },
        { id: 'banners', label: t('tab_banners'), icon: 'image' },
        { id: 'abandoned', label: t('tab_abandoned'), icon: 'remove_shopping_cart' },
    ];

    return (
        <div className="flex flex-col gap-6 p-4 md:p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-[28px] font-bold text-[#1b170d]">{t('title')}</h1>
                    <p className="text-neutral-500 text-sm mt-1">{t('subtitle')}</p>
                </div>
                <button className="flex items-center gap-2 bg-[#edab1d] hover:bg-[#d49511] text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-md">
                    <span className="material-symbols-outlined text-lg">add</span>
                    {t('new_campaign')}
                </button>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'إجمالي الإيرادات التسويقية', value: 'QAR 45,420', icon: 'payments', color: 'text-green-600', bg: 'bg-green-50' },
                    { label: 'حملات نشطة', value: '2', icon: 'campaign', color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'معدل الفتح', value: '49.3%', icon: 'drafts', color: 'text-amber-500', bg: 'bg-amber-50' },
                    { label: 'عائد الاستثمار (ROI)', value: '420%', icon: 'trending_up', color: 'text-purple-600', bg: 'bg-purple-50' },
                ].map((m, i) => (
                    <div key={i} className="bg-white rounded-xl border border-neutral-100 shadow-sm p-4 flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full ${m.bg} flex items-center justify-center shrink-0`}>
                            <span className={`material-symbols-outlined ${m.color}`} style={{ fontSize: '20px' }}>{m.icon}</span>
                        </div>
                        <div>
                            <p className="text-xs text-neutral-500 leading-tight">{m.label}</p>
                            <p className="text-base font-bold text-[#1b170d]">{m.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-neutral-100 p-1 rounded-xl w-fit overflow-x-auto">
                {tabs.map(t => (
                    <button
                        key={t.id}
                        onClick={() => setActiveTab(t.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === t.id ? 'bg-white text-[#1b170d] shadow-sm' : 'text-neutral-500 hover:text-[#1b170d]'}`}
                    >
                        <span className="material-symbols-outlined text-[18px]">{t.icon}</span>
                        <span className="hidden sm:inline">{t.label}</span>
                    </button>
                ))}
            </div>

            {/* Campaigns Tab */}
            {activeTab === 'campaigns' && (
                <div className="bg-white rounded-xl border border-neutral-100 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-neutral-100">
                        <h3 className="font-bold text-[#1b170d]">الحملات التسويقية</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-right">
                            <thead className="bg-neutral-50 text-xs text-neutral-500 font-medium">
                                <tr>
                                    <th className="px-5 py-3">الحملة</th>
                                    <th className="px-5 py-3">النوع</th>
                                    <th className="px-5 py-3">الحالة</th>
                                    <th className="px-5 py-3">المُرسل</th>
                                    <th className="px-5 py-3">الفتح</th>
                                    <th className="px-5 py-3">النقر</th>
                                    <th className="px-5 py-3">الإيرادات</th>
                                    <th className="px-5 py-3">إجراء</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-50">
                                {campaigns.map((c, i) => (
                                    <tr key={i} className="hover:bg-neutral-50 transition-colors">
                                        <td className="px-5 py-4">
                                            <p className="font-bold text-[#1b170d] text-sm">{c.name}</p>
                                            <p className="text-xs text-neutral-400">{c.date}</p>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="text-xs font-medium text-neutral-600 bg-neutral-100 px-2.5 py-1 rounded-full">
                                                {c.type === 'email' ? '📧 بريد' : c.type === 'whatsapp' ? '💬 واتساب' : '📱 SMS'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusColors[c.status]}`}>{statusLabels[c.status]}</span>
                                        </td>
                                        <td className="px-5 py-4 text-sm text-neutral-700">{c.sent.toLocaleString('ar')}</td>
                                        <td className="px-5 py-4 text-sm font-medium">{c.sent > 0 ? `${Math.round((c.opened / c.sent) * 100)}%` : '—'}</td>
                                        <td className="px-5 py-4 text-sm font-medium">{c.sent > 0 ? `${Math.round((c.clicked / c.sent) * 100)}%` : '—'}</td>
                                        <td className="px-5 py-4 font-bold text-green-600 text-sm">{c.revenue}</td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                <button className="text-[#edab1d] hover:bg-[#edab1d]/10 p-1.5 rounded-lg transition-colors">
                                                    <span className="material-symbols-outlined text-[18px]">edit</span>
                                                </button>
                                                <button className="text-neutral-400 hover:bg-neutral-100 p-1.5 rounded-lg transition-colors">
                                                    <span className="material-symbols-outlined text-[18px]">bar_chart</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Discounts Tab */}
            {activeTab === 'discounts' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-6 md:col-span-2">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="font-bold text-[#1b170d]">كوبونات الخصم</h3>
                            <button className="flex items-center gap-2 bg-[#edab1d]/10 text-[#d49511] px-4 py-2 rounded-lg text-sm font-bold">
                                <span className="material-symbols-outlined text-lg">add</span>
                                كوبون جديد
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-right">
                                <thead className="bg-neutral-50 text-xs text-neutral-500 font-medium">
                                    <tr>
                                        <th className="px-4 py-2.5">الكود</th>
                                        <th className="px-4 py-2.5">الخصم</th>
                                        <th className="px-4 py-2.5">الاستخدامات</th>
                                        <th className="px-4 py-2.5">انتهاء الصلاحية</th>
                                        <th className="px-4 py-2.5">الحالة</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-50 text-sm">
                                    {[
                                        { code: 'EID2024', discount: '20%', used: '145 / 200', expires: '30 يونيو', active: true },
                                        { code: 'SUMMER15', discount: '15%', used: '89 / 500', expires: '31 أغسطس', active: true },
                                        { code: 'WELCOME10', discount: '10%', used: '380 / غير محدود', expires: '—', active: true },
                                        { code: 'RAMADAN30', discount: '30%', used: '1,200 / 1,200', expires: '10 أبريل', active: false },
                                    ].map((c, i) => (
                                        <tr key={i} className="hover:bg-neutral-50">
                                            <td className="px-4 py-3 font-mono font-bold text-[#1b170d]">{c.code}</td>
                                            <td className="px-4 py-3 font-bold text-[#edab1d]">{c.discount}</td>
                                            <td className="px-4 py-3 text-neutral-600">{c.used}</td>
                                            <td className="px-4 py-3 text-neutral-500">{c.expires}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${c.active ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-500'}`}>
                                                    {c.active ? 'نشط' : 'منتهي'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-6">
                        <h3 className="font-bold text-[#1b170d] mb-4">خصم تلقائي (Flash Sale)</h3>
                        <div className="space-y-4">
                            {[
                                { label: 'خصم العيد', pct: '25%', ends: 'منتهي', color: 'bg-neutral-100 text-neutral-500' },
                                { label: 'خصم صيف 2024', pct: '15%', ends: 'يبدأ 1 يوليو', color: 'bg-blue-100 text-blue-600' },
                            ].map((f, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-neutral-100 bg-neutral-50">
                                    <div>
                                        <p className="font-bold text-[#1b170d] text-sm">{f.label}</p>
                                        <p className="text-xs text-neutral-400 mt-0.5">{f.ends}</p>
                                    </div>
                                    <span className={`text-sm font-bold px-3 py-1 rounded-full ${f.color}`}>{f.pct}</span>
                                </div>
                            ))}
                            <button className="w-full border-2 border-dashed border-[#edab1d]/40 text-[#d49511] py-3 rounded-xl text-sm font-medium hover:bg-[#edab1d]/5 transition-colors flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined text-lg">add</span>
                                إضافة Flash Sale
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-6">
                        <h3 className="font-bold text-[#1b170d] mb-4">برنامج الولاء</h3>
                        <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100 mb-4">
                            <span className="material-symbols-outlined text-amber-500">stars</span>
                            <div>
                                <p className="text-sm font-bold text-amber-800">غير مفعّل</p>
                                <p className="text-xs text-amber-600">فعّل برنامج النقاط لزيادة ولاء العملاء</p>
                            </div>
                        </div>
                        <div className="space-y-3 opacity-60">
                            <div><p className="text-xs text-neutral-500 mb-1">نقاط مقابل كل QAR 1</p><input className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm" defaultValue="1" disabled /></div>
                            <div><p className="text-xs text-neutral-500 mb-1">قيمة كل 100 نقطة</p><input className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm" defaultValue="QAR 1" disabled /></div>
                        </div>
                        <button className="mt-4 w-full bg-[#edab1d] text-white py-2.5 rounded-lg text-sm font-bold">تفعيل برنامج الولاء</button>
                    </div>
                </div>
            )}

            {/* WhatsApp Tab */}
            {activeTab === 'whatsapp' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-6">
                        <h3 className="font-bold text-[#1b170d] mb-4">إرسال رسالة جماعية</h3>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-[#1b170d] mb-1.5">الجمهور المستهدف</label>
                            <select className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm">
                                <option>جميع العملاء (892)</option>
                                <option>عملاء قطر (640)</option>
                                <option>عملاء السعودية (252)</option>
                                <option>عملاء متكررون</option>
                                <option>عملاء لم يشتروا منذ 30 يوم</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-[#1b170d] mb-1.5">نص الرسالة</label>
                            <textarea rows={5} className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm resize-none text-right" placeholder="أهلاً {اسم العميل}، لدينا عرض خاص لك...&#10;&#10;استخدمي كود: SUMMER15 للحصول على 15% خصم 🎉" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-[#1b170d] mb-1.5">جدولة الإرسال</label>
                            <input type="datetime-local" className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm" />
                        </div>
                        <button className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-3 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined">send</span>
                            إرسال عبر واتساب
                        </button>
                    </div>
                    <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-6">
                        <h3 className="font-bold text-[#1b170d] mb-4">رسائل تلقائية</h3>
                        <div className="space-y-3">
                            {[
                                { label: 'تأكيد الطلب', desc: 'عند استلام طلب جديد', active: true },
                                { label: 'تحديث الشحن', desc: 'عند شحن الطلب', active: true },
                                { label: 'تذكير بالسلة', desc: 'بعد 2 ساعة من التخلي', active: false },
                                { label: 'استعادة العميل', desc: 'بعد 30 يوم من آخر شراء', active: false },
                                { label: 'عيد ميلاد العميلة', desc: 'رسالة تهنئة بالذكرى السنوية', active: false },
                            ].map((msg, i) => (
                                <div key={i} className="flex items-center justify-between p-3 border border-neutral-100 rounded-xl">
                                    <div>
                                        <p className="text-sm font-bold text-[#1b170d]">{msg.label}</p>
                                        <p className="text-xs text-neutral-400">{msg.desc}</p>
                                    </div>
                                    <div className={`w-10 h-5 rounded-full relative cursor-pointer ${msg.active ? 'bg-[#25D366]' : 'bg-neutral-200'}`}>
                                        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${msg.active ? 'right-0.5' : 'left-0.5'}`} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Banners Tab */}
            {activeTab === 'banners' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-6 md:col-span-2">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="font-bold text-[#1b170d]">بنرات الصفحة الرئيسية</h3>
                            <button className="flex items-center gap-2 bg-[#edab1d]/10 text-[#d49511] px-4 py-2 rounded-lg text-sm font-bold">
                                <span className="material-symbols-outlined text-lg">add</span>
                                بنر جديد
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { title: 'هيرو الرئيسية', size: '1440×600', status: 'نشط', color: 'bg-gradient-to-br from-[#edab1d]/20 to-[#edab1d]/5' },
                                { title: 'بنر صيفي', size: '1440×300', status: 'مسودة', color: 'bg-gradient-to-br from-blue-100 to-blue-50' },
                                { title: 'عرض العيد', size: '1440×400', status: 'منتهي', color: 'bg-gradient-to-br from-neutral-200 to-neutral-100' },
                            ].map((b, i) => (
                                <div key={i} className={`${b.color} rounded-xl border border-neutral-200 p-5 flex flex-col gap-3`}>
                                    <div className="h-24 bg-white/60 rounded-lg flex items-center justify-center border border-white/80">
                                        <span className="material-symbols-outlined text-neutral-400 text-4xl">image</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-bold text-[#1b170d] text-sm">{b.title}</p>
                                            <p className="text-xs text-neutral-400">{b.size}</p>
                                        </div>
                                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${b.status === 'نشط' ? 'bg-green-100 text-green-700' : b.status === 'مسودة' ? 'bg-blue-100 text-blue-700' : 'bg-neutral-100 text-neutral-500'}`}>{b.status}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="flex-1 text-sm bg-white border border-neutral-200 py-1.5 rounded-lg font-medium hover:border-[#edab1d] transition-colors">تعديل</button>
                                        <button className="flex-1 text-sm bg-white border border-neutral-200 py-1.5 rounded-lg font-medium hover:border-red-300 hover:text-red-500 transition-colors">حذف</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Abandoned Cart Tab */}
            {activeTab === 'abandoned' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-3 grid grid-cols-3 gap-4">
                        {[
                            { label: 'سلات مهجورة (هذا الشهر)', value: '148', icon: 'remove_shopping_cart', color: 'text-red-500', bg: 'bg-red-50' },
                            { label: 'قيمة السلات المهجورة', value: 'QAR 22,400', icon: 'money_off', color: 'text-amber-500', bg: 'bg-amber-50' },
                            { label: 'تم استعادتها', value: '32 (21.6%)', icon: 'shopping_cart_checkout', color: 'text-green-600', bg: 'bg-green-50' },
                        ].map((m, i) => (
                            <div key={i} className="bg-white rounded-xl border border-neutral-100 shadow-sm p-5 flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full ${m.bg} flex items-center justify-center shrink-0`}>
                                    <span className={`material-symbols-outlined ${m.color}`} style={{ fontSize: '20px' }}>{m.icon}</span>
                                </div>
                                <div>
                                    <p className="text-xs text-neutral-500">{m.label}</p>
                                    <p className="font-bold text-[#1b170d]">{m.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="md:col-span-2 bg-white rounded-xl border border-neutral-100 shadow-sm overflow-hidden">
                        <div className="p-5 border-b border-neutral-100">
                            <h3 className="font-bold text-[#1b170d]">آخر السلات المهجورة</h3>
                        </div>
                        <div className="divide-y divide-neutral-50">
                            {[
                                { name: 'سارة أحمد', phone: '+974 3311 1234', items: 2, value: 'QAR 850', time: 'منذ 2 ساعة' },
                                { name: 'نورة السبيعي', phone: '+966 50 111 2222', items: 1, value: 'QAR 450', time: 'منذ 5 ساعات' },
                                { name: 'فاطمة علي', phone: '+974 5555 9999', items: 3, value: 'QAR 1,200', time: 'منذ يوم' },
                                { name: 'هند محمد', phone: '+966 55 777 8888', items: 1, value: 'QAR 380', time: 'منذ يومين' },
                            ].map((cart, i) => (
                                <div key={i} className="flex items-center justify-between px-5 py-3.5 hover:bg-neutral-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined text-neutral-400 text-[16px]">person</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-[#1b170d]">{cart.name}</p>
                                            <p className="text-xs text-neutral-400">{cart.phone} • {cart.items} منتج • {cart.time}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-[#1b170d] text-sm">{cart.value}</span>
                                        <button className="text-xs bg-[#25D366] text-white px-3 py-1.5 rounded-lg font-medium hover:bg-[#128C7E] transition-colors">
                                            تذكير
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-6">
                        <h3 className="font-bold text-[#1b170d] mb-4">إعدادات الاستعادة</h3>
                        <div className="space-y-3">
                            {[
                                { label: 'بعد ساعة واحدة', type: 'واتساب', active: true },
                                { label: 'بعد 24 ساعة', type: 'إيميل', active: true },
                                { label: 'بعد 72 ساعة + خصم 10%', type: 'واتساب + كوبون', active: false },
                            ].map((r, i) => (
                                <div key={i} className="flex items-center justify-between p-3 border border-neutral-100 rounded-xl">
                                    <div>
                                        <p className="text-sm font-bold text-[#1b170d]">{r.label}</p>
                                        <p className="text-xs text-neutral-400">{r.type}</p>
                                    </div>
                                    <div className={`w-10 h-5 rounded-full relative cursor-pointer ${r.active ? 'bg-[#edab1d]' : 'bg-neutral-200'}`}>
                                        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow ${r.active ? 'right-0.5' : 'left-0.5'}`} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

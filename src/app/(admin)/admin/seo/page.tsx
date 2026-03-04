'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

const seoPages = [
    { page: 'الرئيسية', path: '/', title: 'شوب لاميس - عبايات فاخرة من قطر', desc: 'اكتشفي أرقى العبايات والأزياء النسائية الفاخرة. شحن مجاني داخل قطر.', score: 92 },
    { page: 'المنتجات', path: '/products', title: 'جميع العبايات - شوب لاميس', desc: 'تصفحي مجموعتنا الكاملة من العبايات الفاخرة بأفضل الأسعار.', score: 78 },
    { page: 'من نحن', path: '/about', title: 'من نحن - شوب لاميس', desc: 'تعرفي على قصة لاميس وشغفنا بتصميم العبايات الفاخرة.', score: 65 },
    { page: 'سياسة الخصوصية', path: '/privacy-policy', title: 'سياسة الخصوصية - شوب لاميس', desc: 'نحافظ على خصوصيتك وبياناتك الشخصية.', score: 80 },
    { page: 'شروط الاستخدام', path: '/terms', title: 'شروط الاستخدام - شوب لاميس', desc: 'اقرئي شروط وأحكام استخدام متجر لاميس.', score: 75 },
];

const keywords = [
    { keyword: 'عبايات قطر', position: 3, volume: 4400, change: +2 },
    { keyword: 'شراء عبايات اونلاين', position: 7, volume: 8800, change: -1 },
    { keyword: 'عبايات فاخرة', position: 12, volume: 6600, change: +5 },
    { keyword: 'عباية سوداء', position: 5, volume: 12000, change: +3 },
    { keyword: 'لاميس عبايات', position: 1, volume: 1200, change: 0 },
    { keyword: 'عبايات بالجملة', position: 18, volume: 3300, change: +1 },
];

function ScoreBar({ score }: { score: number }) {
    const color = score >= 85 ? 'bg-green-500' : score >= 60 ? 'bg-amber-400' : 'bg-red-400';
    return (
        <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-neutral-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
            </div>
            <span className={`text-xs font-bold ${score >= 85 ? 'text-green-600' : score >= 60 ? 'text-amber-600' : 'text-red-500'}`}>{score}</span>
        </div>
    );
}

export default function SEOPage() {
    const t = useTranslations('Admin.SEO');
    const [selectedPage, setSelectedPage] = useState(seoPages[0]);
    const [activeTab, setActiveTab] = useState('pages');

    const tabs = [
        { id: 'pages', label: t('tab_pages'), icon: 'web' },
        { id: 'keywords', label: t('tab_keywords'), icon: 'key' },
        { id: 'technical', label: t('tab_integrations'), icon: 'settings' },
        { id: 'analytics', label: t('tab_analytics'), icon: 'bar_chart' },
    ];

    return (
        <div className="flex flex-col gap-6 p-4 md:p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-[28px] font-bold text-[#1b170d]">{t('title')}</h1>
                    <p className="text-neutral-500 text-sm mt-1">{t('subtitle')}</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 bg-white border border-neutral-200 hover:border-[#edab1d] text-neutral-700 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
                        <span className="material-symbols-outlined text-lg">sync</span>
                        تحديث الخريطة
                    </button>
                    <button className="flex items-center gap-2 bg-[#edab1d] hover:bg-[#d49511] text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-md">
                        <span className="material-symbols-outlined text-lg">save</span>
                        حفظ
                    </button>
                </div>
            </div>

            {/* SEO Health Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'متوسط الدرجة', value: '78', icon: 'health_metrics', color: 'text-amber-500', bg: 'bg-amber-50' },
                    { label: 'صفحات مُحسَّنة', value: '12/18', icon: 'check_circle', color: 'text-green-600', bg: 'bg-green-50' },
                    { label: 'مؤشر كور ويب', value: 'جيد', icon: 'speed', color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'روابط معطوبة', value: '0', icon: 'link_off', color: 'text-green-600', bg: 'bg-green-50' },
                ].map((item, i) => (
                    <div key={i} className="bg-white rounded-xl border border-neutral-100 shadow-sm p-4 flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full ${item.bg} flex items-center justify-center`}>
                            <span className={`material-symbols-outlined ${item.color}`} style={{ fontSize: '20px' }}>{item.icon}</span>
                        </div>
                        <div>
                            <p className="text-xs text-neutral-500">{item.label}</p>
                            <p className="text-lg font-bold text-[#1b170d]">{item.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-neutral-100 p-1 rounded-xl w-fit">
                {tabs.map(t => (
                    <button
                        key={t.id}
                        onClick={() => setActiveTab(t.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === t.id ? 'bg-white text-[#1b170d] shadow-sm' : 'text-neutral-500 hover:text-[#1b170d]'}`}
                    >
                        <span className="material-symbols-outlined text-[18px]">{t.icon}</span>
                        <span className="hidden md:inline">{t.label}</span>
                    </button>
                ))}
            </div>

            {/* Pages Tab */}
            {activeTab === 'pages' && (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Pages list */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl border border-neutral-100 shadow-sm overflow-hidden">
                            <div className="p-4 border-b border-neutral-100">
                                <h3 className="font-bold text-[#1b170d]">صفحات المتجر</h3>
                            </div>
                            <div className="divide-y divide-neutral-50">
                                {seoPages.map((page) => (
                                    <button
                                        key={page.path}
                                        onClick={() => setSelectedPage(page)}
                                        className={`w-full text-right px-4 py-3.5 flex items-center justify-between transition-colors
                                            ${selectedPage.path === page.path ? 'bg-[#edab1d]/10' : 'hover:bg-neutral-50'}`}
                                    >
                                        <div>
                                            <p className="text-sm font-bold text-[#1b170d]">{page.page}</p>
                                            <p className="text-xs text-neutral-400 font-mono mt-0.5">{page.path}</p>
                                        </div>
                                        <ScoreBar score={page.score} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Page editor */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-6">
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="font-bold text-[#1b170d]">تحرير: {selectedPage.page}</h3>
                                <ScoreBar score={selectedPage.score} />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-[#1b170d] mb-1.5">عنوان الصفحة (Title Tag)</label>
                                <input
                                    className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#edab1d]/30 focus:border-[#edab1d] text-right"
                                    defaultValue={selectedPage.title}
                                />
                                <div className="flex justify-between text-xs text-neutral-400 mt-1">
                                    <span className="text-green-600">✓ الطول مثالي</span>
                                    <span>{selectedPage.title.length} / 60 حرف</span>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-[#1b170d] mb-1.5">وصف الصفحة (Meta Description)</label>
                                <textarea
                                    rows={3}
                                    className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#edab1d]/30 focus:border-[#edab1d] text-right resize-none"
                                    defaultValue={selectedPage.desc}
                                />
                                <div className="flex justify-between text-xs text-neutral-400 mt-1">
                                    <span className="text-amber-500">⚠ يُنصح بتفصيل أكثر</span>
                                    <span>{selectedPage.desc.length} / 160 حرف</span>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-[#1b170d] mb-1.5">الكلمات المفتاحية (Keywords)</label>
                                <input
                                    className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#edab1d]/30 focus:border-[#edab1d] text-right"
                                    placeholder="عبايات، قطر، فاخرة..."
                                />
                            </div>

                            {/* Google Preview */}
                            <div className="mt-5 p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                                <p className="text-xs text-neutral-500 mb-2 font-medium">معاينة نتيجة جوجل:</p>
                                <div className="text-blue-600 text-base font-medium truncate">{selectedPage.title}</div>
                                <div className="text-green-700 text-xs mt-0.5 font-mono">shop-lamees.com{selectedPage.path}</div>
                                <div className="text-neutral-600 text-sm mt-1 line-clamp-2">{selectedPage.desc}</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Keywords Tab */}
            {activeTab === 'keywords' && (
                <div className="bg-white rounded-xl border border-neutral-100 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between p-5 border-b border-neutral-100">
                        <h3 className="font-bold text-[#1b170d]">تتبع الكلمات المفتاحية</h3>
                        <button className="flex items-center gap-2 bg-[#edab1d]/10 text-[#d49511] px-3 py-1.5 rounded-lg text-sm font-medium">
                            <span className="material-symbols-outlined text-lg">add</span>
                            إضافة كلمة
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-right">
                            <thead className="bg-neutral-50 text-xs text-neutral-500 font-medium">
                                <tr>
                                    <th className="px-5 py-3">الكلمة المفتاحية</th>
                                    <th className="px-5 py-3">الترتيب</th>
                                    <th className="px-5 py-3">حجم البحث/شهر</th>
                                    <th className="px-5 py-3">التغيير</th>
                                    <th className="px-5 py-3">الحالة</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-50">
                                {keywords.map((kw, i) => (
                                    <tr key={i} className="hover:bg-neutral-50 transition-colors">
                                        <td className="px-5 py-4 font-medium text-[#1b170d]">{kw.keyword}</td>
                                        <td className="px-5 py-4">
                                            <span className={`text-sm font-bold ${kw.position <= 3 ? 'text-green-600' : kw.position <= 10 ? 'text-amber-500' : 'text-neutral-500'}`}>
                                                #{kw.position}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-neutral-600">{kw.volume.toLocaleString('ar')}</td>
                                        <td className="px-5 py-4">
                                            <span className={`flex items-center gap-1 text-xs font-bold w-fit ${kw.change > 0 ? 'text-green-600' : kw.change < 0 ? 'text-red-500' : 'text-neutral-400'}`}>
                                                <span className="material-symbols-outlined text-[14px]">{kw.change > 0 ? 'trending_up' : kw.change < 0 ? 'trending_down' : 'remove'}</span>
                                                {kw.change !== 0 ? Math.abs(kw.change) : '—'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${kw.position <= 10 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                {kw.position <= 10 ? 'الصفحة الأولى' : 'خارج الأولى'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Technical Tab */}
            {activeTab === 'technical' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-6">
                        <h3 className="font-bold text-[#1b170d] mb-4">Google Analytics</h3>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-[#1b170d] mb-1.5">رمز القياس (G-XXXXXXXX)</label>
                            <input className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#edab1d]/30 focus:border-[#edab1d] font-mono" placeholder="G-XXXXXXXXXX" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-[#1b170d] mb-1.5">Google Tag Manager (GTM-XXXXXX)</label>
                            <input className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#edab1d]/30 focus:border-[#edab1d] font-mono" placeholder="GTM-XXXXXXX" />
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <span className="text-sm font-medium">Enhanced E-commerce Tracking</span>
                            <div className="w-10 h-5 bg-[#edab1d] rounded-full relative cursor-pointer">
                                <span className="absolute right-1 top-0.5 w-4 h-4 bg-white rounded-full shadow" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-6">
                        <h3 className="font-bold text-[#1b170d] mb-4">Google Search Console</h3>
                        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100 mb-4">
                            <span className="material-symbols-outlined text-green-600">check_circle</span>
                            <div>
                                <p className="text-sm font-bold text-green-700">متصل بنجاح</p>
                                <p className="text-xs text-green-600">shop-lamees.com • تم التحقق</p>
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-[#1b170d] mb-1.5">Meta Verification Tag</label>
                            <input className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm font-mono" placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-6">
                        <h3 className="font-bold text-[#1b170d] mb-4">Sitemap & Robots</h3>
                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100 mb-4">
                            <span className="material-symbols-outlined text-blue-600">sitemap</span>
                            <div>
                                <p className="text-sm font-bold text-blue-700">Sitemap محدَّث</p>
                                <p className="text-xs text-blue-600">shop-lamees.com/sitemap.xml • آخر تحديث: اليوم</p>
                            </div>
                        </div>
                        <label className="block text-sm font-medium text-[#1b170d] mb-1.5">محتوى robots.txt</label>
                        <textarea rows={4} className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm font-mono resize-none" defaultValue={`User-agent: *\nAllow: /\nDisallow: /admin/\nSitemap: https://shop-lamees.com/sitemap.xml`} />
                    </div>

                    <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-6">
                        <h3 className="font-bold text-[#1b170d] mb-4">Pixel & Tracking</h3>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-[#1b170d] mb-1.5">Meta Pixel ID (Facebook)</label>
                            <input className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm font-mono" placeholder="000000000000000" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-[#1b170d] mb-1.5">Snapchat Pixel</label>
                            <input className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm font-mono" placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#1b170d] mb-1.5">TikTok Pixel</label>
                            <input className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm font-mono" placeholder="CXXXXXXXXXXXXXXXXXX" />
                        </div>
                    </div>
                </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-6 md:col-span-2">
                        <h3 className="font-bold text-[#1b170d] mb-5">أداء محركات البحث — آخر 30 يوم</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: 'إجمالي النقرات', value: '12,430', icon: 'ads_click', color: 'text-blue-600', bg: 'bg-blue-50', change: '+18%' },
                                { label: 'مرات الظهور', value: '184,200', icon: 'visibility', color: 'text-purple-600', bg: 'bg-purple-50', change: '+24%' },
                                { label: 'معدل النقر CTR', value: '6.7%', icon: 'percent', color: 'text-green-600', bg: 'bg-green-50', change: '+1.2%' },
                                { label: 'متوسط الترتيب', value: '8.4', icon: 'leaderboard', color: 'text-amber-600', bg: 'bg-amber-50', change: '-0.8' },
                            ].map((m, i) => (
                                <div key={i} className="flex flex-col gap-2 p-4 rounded-xl border border-neutral-100 bg-neutral-50">
                                    <div className={`w-9 h-9 rounded-full ${m.bg} flex items-center justify-center`}>
                                        <span className={`material-symbols-outlined ${m.color}`} style={{ fontSize: '18px' }}>{m.icon}</span>
                                    </div>
                                    <p className="text-xs text-neutral-500">{m.label}</p>
                                    <p className="text-xl font-bold text-[#1b170d]">{m.value}</p>
                                    <p className="text-xs font-bold text-green-600">{m.change} مقارنة بالشهر الماضي</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-6">
                        <h3 className="font-bold text-[#1b170d] mb-4">أكثر الصفحات ظهوراً</h3>
                        <div className="space-y-3">
                            {[
                                { page: 'الرئيسية', clicks: '4,210', ctr: '8.2%' },
                                { page: 'عبايات سوداء', clicks: '2,880', ctr: '7.1%' },
                                { page: 'عبايات فاخرة', clicks: '1,950', ctr: '6.4%' },
                                { page: 'الطلبات', clicks: '1,200', ctr: '5.8%' },
                            ].map((row, i) => (
                                <div key={i} className="flex items-center justify-between text-sm">
                                    <span className="text-neutral-700 font-medium">{row.page}</span>
                                    <div className="flex items-center gap-4">
                                        <span className="text-neutral-500">{row.clicks} نقرة</span>
                                        <span className="text-green-600 font-bold">{row.ctr}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-6">
                        <h3 className="font-bold text-[#1b170d] mb-4">مصادر الزيارات</h3>
                        <div className="space-y-3">
                            {[
                                { source: 'البحث المجاني', pct: 58, color: 'bg-green-400' },
                                { source: 'التواصل الاجتماعي', pct: 24, color: 'bg-blue-400' },
                                { source: 'زيارة مباشرة', pct: 12, color: 'bg-amber-400' },
                                { source: 'مواقع أخرى', pct: 6, color: 'bg-purple-400' },
                            ].map((s, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-xs text-neutral-600 mb-1">
                                        <span>{s.source}</span>
                                        <span className="font-bold">{s.pct}%</span>
                                    </div>
                                    <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                                        <div className={`h-full ${s.color} rounded-full`} style={{ width: `${s.pct}%` }} />
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

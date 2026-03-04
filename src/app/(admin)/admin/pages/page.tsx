'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';

const cmsPages = [
    { id: '1', title: 'من نحن', titleEn: 'About Us', slug: '/about', status: 'published', updatedAt: '10 مايو 2024', updatedAtEn: '10 May 2024' },
    { id: '2', title: 'سياسة الخصوصية', titleEn: 'Privacy Policy', slug: '/privacy-policy', status: 'published', updatedAt: '1 مارس 2024', updatedAtEn: '1 March 2024' },
    { id: '3', title: 'شروط الاستخدام', titleEn: 'Terms of Use', slug: '/terms', status: 'published', updatedAt: '1 مارس 2024', updatedAtEn: '1 March 2024' },
    { id: '4', title: 'سياسة الإرجاع', titleEn: 'Return Policy', slug: '/return-policy', status: 'published', updatedAt: '15 أبريل 2024', updatedAtEn: '15 April 2024' },
    { id: '5', title: 'دليل المقاسات', titleEn: 'Size Guide', slug: '/size-guide', status: 'draft', updatedAt: '5 مايو 2024', updatedAtEn: '5 May 2024' },
    { id: '6', title: 'الأسئلة الشائعة', titleEn: 'FAQ', slug: '/faq', status: 'draft', updatedAt: '8 مايو 2024', updatedAtEn: '8 May 2024' },
    { id: '7', title: 'سياسة الشحن', titleEn: 'Shipping Policy', slug: '/shipping', status: 'published', updatedAt: '20 أبريل 2024', updatedAtEn: '20 April 2024' },
];

const sampleContent: Record<string, string> = {
    '1': 'شوب لاميس هو متجر إلكتروني متخصص في العبايات والأزياء النسائية الفاخرة. تأسسنا عام 2020 بهدف تقديم أرقى التصاميم العصرية الملتزمة بالأصالة العربية. نحرص على اختيار أفخر الأقمشة وأحدث التصاميم لنقدم لكِ تجربة تسوق استثنائية...',
    '4': 'نقبل إرجاع المنتجات خلال 14 يوماً من تاريخ الاستلام بشرط أن تكون بحالتها الأصلية غير المستخدمة. يتحمل العميل رسوم الشحن في حالة الإرجاع ما لم يكن المنتج معيباً...',
};

export default function PagesPage() {
    const t = useTranslations('Admin.Pages');
    const locale = useLocale();
    const isRtl = locale === 'ar';

    const [editingId, setEditingId] = useState<string | null>(null);
    const [content, setContent] = useState(sampleContent);
    const [showNew, setShowNew] = useState(false);

    const editing = cmsPages.find(p => p.id === editingId);

    return (
        <div className="flex flex-col gap-6 p-4 md:p-8" dir={isRtl ? 'rtl' : 'ltr'}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-[28px] font-bold text-[#1b170d]">{t('title')}</h1>
                    <p className="text-neutral-500 text-sm mt-1">{t('subtitle')}</p>
                </div>
                <button onClick={() => setShowNew(true)} className="flex items-center gap-2 bg-[#edab1d] hover:bg-[#d49511] text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-md">
                    <span className="material-symbols-outlined text-lg">add</span>
                    {t('new_page')}
                </button>
            </div>

            {!editingId ? (
                <div className="bg-white rounded-xl border border-neutral-100 shadow-sm overflow-hidden">
                    <table className="w-full text-right">
                        <thead className="bg-neutral-50 text-xs text-neutral-500 font-medium">
                            <tr>
                                <th className="px-5 py-3">{t('col_name_ar')}</th>
                                <th className="px-5 py-3">{t('col_name_en')}</th>
                                <th className="px-5 py-3">{t('col_slug')}</th>
                                <th className="px-5 py-3">{t('col_status')}</th>
                                <th className="px-5 py-3">{t('col_updated')}</th>
                                <th className="px-5 py-3">{t('col_action')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-50">
                            {cmsPages.map((page) => (
                                <tr key={page.id} className="hover:bg-neutral-50 transition-colors">
                                    <td className="px-5 py-4 font-bold text-[#1b170d] text-sm">{page.title}</td>
                                    <td className="px-5 py-4 text-sm text-neutral-600">{page.titleEn}</td>
                                    <td className="px-5 py-4 font-mono text-xs text-neutral-400">{page.slug}</td>
                                    <td className="px-5 py-4">
                                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${page.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {page.status === 'published' ? t('status_published') : t('status_draft')}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-xs text-neutral-400">{isRtl ? page.updatedAt : page.updatedAtEn}</td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => setEditingId(page.id)} className="flex items-center gap-1.5 text-xs bg-[#edab1d]/10 text-[#d49511] px-3 py-1.5 rounded-lg font-bold hover:bg-[#edab1d]/20 transition-colors">
                                                <span className="material-symbols-outlined text-[14px]">edit</span>
                                                {t('btn_edit')}
                                            </button>
                                            <a href={page.slug} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs bg-neutral-100 text-neutral-600 px-3 py-1.5 rounded-lg font-medium hover:bg-neutral-200 transition-colors">
                                                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                                                {t('btn_preview')}
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <button onClick={() => setEditingId(null)} className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                                <span className="material-symbols-outlined text-neutral-500">{isRtl ? 'arrow_forward' : 'arrow_back'}</span>
                            </button>
                            <div>
                                <h2 className="font-bold text-[#1b170d] text-lg">{t('editing_prefix')}: {isRtl ? editing?.title : editing?.titleEn}</h2>
                                <p className="text-xs text-neutral-400 font-mono">{editing?.slug}</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 bg-neutral-100 text-neutral-700 px-4 py-2 rounded-lg text-sm font-medium">{t('status_draft')}</button>
                            <button className="flex items-center gap-2 bg-[#edab1d] hover:bg-[#d49511] text-white px-5 py-2 rounded-lg text-sm font-bold transition-colors">
                                <span className="material-symbols-outlined text-lg">publish</span>
                                {t('publish')}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#1b170d] mb-1.5">{t('field_title_ar')}</label>
                                <input defaultValue={editing?.title} className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#edab1d]/30 focus:border-[#edab1d] text-right" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#1b170d] mb-1.5">{t('field_title_en')}</label>
                                <input defaultValue={editing?.titleEn} className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#edab1d]/30 focus:border-[#edab1d]" dir="ltr" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#1b170d] mb-1.5">{t('field_content_ar')}</label>
                                <textarea
                                    rows={12}
                                    value={content[editingId] ?? ''}
                                    onChange={e => setContent(prev => ({ ...prev, [editingId]: e.target.value }))}
                                    className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#edab1d]/30 focus:border-[#edab1d] text-right resize-none"
                                    placeholder={t('placeholder_content_ar')}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#1b170d] mb-1.5">{t('field_content_en')}</label>
                                <textarea rows={8} className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#edab1d]/30 focus:border-[#edab1d] resize-none" dir="ltr" placeholder="Write page content in English..." />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-neutral-50 rounded-xl border border-neutral-100 p-4">
                                <h4 className="font-bold text-[#1b170d] text-sm mb-3">{t('page_settings')}</h4>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs font-medium text-neutral-500 mb-1">{t('field_slug')}</label>
                                        <input defaultValue={editing?.slug} className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#edab1d]/30" dir="ltr" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-neutral-500 mb-1">{t('col_status')}</label>
                                        <select className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#edab1d]/30">
                                            <option value="published">{t('status_published')}</option>
                                            <option value="draft">{t('status_draft')}</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-neutral-50 rounded-xl border border-neutral-100 p-4">
                                <h4 className="font-bold text-[#1b170d] text-sm mb-3">{t('seo_settings')}</h4>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs font-medium text-neutral-500 mb-1">Meta Title</label>
                                        <input className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#edab1d]/30 text-right" placeholder={t('placeholder_meta_title')} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-neutral-500 mb-1">Meta Description</label>
                                        <textarea rows={3} className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#edab1d]/30 text-right resize-none" placeholder={t('placeholder_meta_desc')} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showNew && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowNew(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg font-bold text-[#1b170d]">{t('new_page')}</h3>
                            <button onClick={() => setShowNew(false)} className="text-neutral-400 hover:text-neutral-600">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div><label className="block text-sm font-medium text-[#1b170d] mb-1">{t('field_name_ar')}</label><input className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#edab1d]/30 text-right" /></div>
                            <div><label className="block text-sm font-medium text-[#1b170d] mb-1">{t('field_name_en')}</label><input className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#edab1d]/30" dir="ltr" /></div>
                            <div><label className="block text-sm font-medium text-[#1b170d] mb-1">Slug</label><input className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#edab1d]/30" dir="ltr" placeholder="/about-us" /></div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setShowNew(false)} className="flex-1 border border-neutral-200 text-neutral-700 py-2.5 rounded-xl text-sm font-medium">{t('cancel')}</button>
                            <button onClick={() => setShowNew(false)} className="flex-1 bg-[#edab1d] hover:bg-[#d49511] text-white py-2.5 rounded-xl text-sm font-bold">{t('create')}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

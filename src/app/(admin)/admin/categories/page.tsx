'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';

const CDN = 'https://cdn.salla.sa/DGwjPD/';

const initialCategories = [
    { id: '1', nameAr: 'عبايات', nameEn: 'Abayas', slug: 'all-abayas', products: 31, sortOrder: 1, isVisible: true, image: `${CDN}f9057b49-ec06-40fe-ae59-4b0ae02c1c19-369.2714453584x500-wytsxECY4TpiZ8jeB370gBy32lswuxn9IQeHTScr.jpg` },
    { id: '2', nameAr: 'عباية كرز', nameEn: 'Kraz Abaya', slug: 'kraz-abaya', products: 9, sortOrder: 2, isVisible: true, image: `${CDN}ec99a87b-4b28-4082-8188-3230a57684ce-406.94006309148x500-gTVdE0Za8jl4ibuGLhTyEeloMG6QfXSXXV11sQY2.jpg` },
    { id: '3', nameAr: 'دانتيل', nameEn: 'Lace', slug: 'dantel', products: 4, sortOrder: 3, isVisible: true, image: `${CDN}a50cb699-82cb-401b-a755-b5d1de0e8c22-381.77940280317x500-gqZJcsKvQcHhrqEknzBolbiwp6uWQOvOx0HsMPwW.jpg` },
    { id: '4', nameAr: 'كولكشن العيد', nameEn: 'Eid Collection', slug: 'eid-collection', products: 6, sortOrder: 4, isVisible: true, image: `${CDN}1daf73a9-a212-4d0f-b053-e4d10927bdb1-367.82354849173x500-12O5eHt28G5YMZ1xjUg0Nwu73oxVlszq7D9liEVP.jpg` },
    { id: '5', nameAr: 'تشكيلة الشتاء', nameEn: 'Winter Collection', slug: 'winter', products: 7, sortOrder: 5, isVisible: true, image: `${CDN}8133fab2-d10f-49e5-aaa8-531a4ed19db4-500x500-YU29F4BTqmWRWz1YgLtkClmBMUCF1rgR8haFauRW.jpg` },
    { id: '6', nameAr: 'نقاب', nameEn: 'Niqab', slug: 'niqab', products: 2, sortOrder: 6, isVisible: true, image: `${CDN}d2a76b00-4964-4afd-92cb-7bfe9c084e0f-379.57446808511x500-Q9Ak4IvksjLAJk5aXmK7xkKw3qhfAzonzT1yVbPq.jpg` },
];

type Category = typeof initialCategories[0];

export default function CategoriesPage() {
    const t = useTranslations('Admin.Categories');
    const locale = useLocale();
    const [categories, setCategories] = useState(initialCategories);
    const [showModal, setShowModal] = useState(false);
    const [editCat, setEditCat] = useState<Category | null>(null);
    const [form, setForm] = useState({ nameAr: '', nameEn: '', slug: '', sortOrder: 0 });

    const openNew = () => {
        setEditCat(null);
        setForm({ nameAr: '', nameEn: '', slug: '', sortOrder: categories.length + 1 });
        setShowModal(true);
    };

    const openEdit = (cat: Category) => {
        setEditCat(cat);
        setForm({ nameAr: cat.nameAr, nameEn: cat.nameEn, slug: cat.slug, sortOrder: cat.sortOrder });
        setShowModal(true);
    };

    const toggleVisibility = (id: string) => {
        setCategories(prev => prev.map(c => c.id === id ? { ...c, isVisible: !c.isVisible } : c));
    };

    return (
        <div className="flex flex-col gap-6 p-4 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-[28px] font-bold text-[#1b170d]">{t('title')}</h1>
                    <p className="text-neutral-500 text-sm mt-1">{t('subtitle')}</p>
                </div>
                <button onClick={openNew} className="flex items-center gap-2 bg-[#edab1d] hover:bg-[#d49511] text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-md">
                    <span className="material-symbols-outlined text-lg">add</span>
                    {t('new_category')}
                </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: t('total_cats'), value: categories.length, icon: 'category', color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: t('active_cats'), value: categories.filter(c => c.isVisible).length, icon: 'visibility', color: 'text-green-600', bg: 'bg-green-50' },
                    { label: t('total_products'), value: categories.reduce((s, c) => s + c.products, 0), icon: 'sell', color: 'text-amber-500', bg: 'bg-amber-50' },
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

            <div className="bg-white rounded-xl border border-neutral-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-neutral-50 text-xs text-neutral-500 font-medium">
                            <tr>
                                <th className="px-5 py-3">{t('sort_order_col')}</th>
                                <th className="px-5 py-3">{t('name_ar_col')}</th>
                                <th className="px-5 py-3">{t('name_en_col')}</th>
                                <th className="px-5 py-3">Slug</th>
                                <th className="px-5 py-3">{t('products_col')}</th>
                                <th className="px-5 py-3">{t('visible_col')}</th>
                                <th className="px-5 py-3">{t('action_col')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-50">
                            {[...categories].sort((a, b) => a.sortOrder - b.sortOrder).map((cat) => (
                                <tr key={cat.id} className="hover:bg-neutral-50 transition-colors">
                                    <td className="px-5 py-4">
                                        <span className="w-7 h-7 bg-neutral-100 rounded-md flex items-center justify-center text-sm font-bold text-neutral-500">
                                            {cat.sortOrder}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-neutral-100 overflow-hidden shrink-0 relative">
                                                {cat.image ? (
                                                    <Image src={cat.image} alt={cat.nameEn} fill className="object-cover" sizes="40px" />
                                                ) : (
                                                    <span className="material-symbols-outlined text-neutral-400 text-[18px] absolute inset-0 flex items-center justify-center">category</span>
                                                )}
                                            </div>
                                            <span className="font-bold text-[#1b170d] text-sm">{locale === 'ar' ? cat.nameAr : cat.nameEn}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-sm text-neutral-600">{cat.nameEn}</td>
                                    <td className="px-5 py-4 font-mono text-xs text-neutral-400">/{cat.slug}</td>
                                    <td className="px-5 py-4">
                                        <span className="bg-[#edab1d]/10 text-[#d49511] text-xs font-bold px-2.5 py-1 rounded-full">{cat.products} {t('products_unit')}</span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <button onClick={() => toggleVisibility(cat.id)} className={`w-10 h-5 rounded-full relative transition-colors ${cat.isVisible ? 'bg-[#edab1d]' : 'bg-neutral-200'}`}>
                                            <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${cat.isVisible ? 'right-0.5' : 'left-0.5'}`} />
                                        </button>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => openEdit(cat)} className="p-1.5 text-[#edab1d] hover:bg-[#edab1d]/10 rounded-lg transition-colors">
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
                            <h3 className="text-lg font-bold text-[#1b170d]">{editCat ? t('edit_cat') : t('new_cat')}</h3>
                            <button onClick={() => setShowModal(false)} className="text-neutral-400 hover:text-neutral-600">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#1b170d] mb-1">{t('name_ar_label')}</label>
                                <input value={form.nameAr} onChange={e => setForm(f => ({ ...f, nameAr: e.target.value }))} className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#edab1d]/30 focus:border-[#edab1d] text-right" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#1b170d] mb-1">{t('name_en_label')}</label>
                                <input value={form.nameEn} onChange={e => setForm(f => ({ ...f, nameEn: e.target.value }))} className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#edab1d]/30 focus:border-[#edab1d]" dir="ltr" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#1b170d] mb-1">{t('slug_label')}</label>
                                <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#edab1d]/30 focus:border-[#edab1d]" dir="ltr" placeholder="black-abayas" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#1b170d] mb-1">{t('sort_order_label')}</label>
                                <input type="number" value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: Number(e.target.value) }))} className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#edab1d]/30 focus:border-[#edab1d]" />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setShowModal(false)} className="flex-1 border border-neutral-200 text-neutral-700 py-2.5 rounded-xl text-sm font-medium hover:bg-neutral-50">{t('cancel')}</button>
                            <button onClick={() => setShowModal(false)} className="flex-1 bg-[#edab1d] hover:bg-[#d49511] text-white py-2.5 rounded-xl text-sm font-bold transition-colors">{t('save')}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

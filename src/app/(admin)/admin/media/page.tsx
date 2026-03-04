'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';

const images = [
    { id: '1', name: 'product-1.jpg', size: '92 KB', type: 'image/jpeg', url: '/images/products/product-1.jpg', used: 3 },
    { id: '2', name: 'product-2.jpg', size: '108 KB', type: 'image/jpeg', url: '/images/products/product-2.jpg', used: 2 },
    { id: '3', name: 'product-3.jpg', size: '136 KB', type: 'image/jpeg', url: '/images/products/product-3.jpg', used: 1 },
    { id: '4', name: 'product-4.jpg', size: '95 KB', type: 'image/jpeg', url: '/images/products/product-4.jpg', used: 4 },
    { id: '5', name: 'product-5.jpg', size: '112 KB', type: 'image/jpeg', url: '/images/products/product-5.jpg', used: 2 },
    { id: '6', name: 'product-6.jpg', size: '98 KB', type: 'image/jpeg', url: '/images/products/product-6.jpg', used: 1 },
    { id: '7', name: 'product-7.jpg', size: '124 KB', type: 'image/jpeg', url: '/images/products/product-7.jpg', used: 5 },
    { id: '8', name: 'product-8.jpg', size: '130 KB', type: 'image/jpeg', url: '/images/products/product-8.jpg', used: 3 },
    { id: '9', name: 'product-9.jpg', size: '118 KB', type: 'image/jpeg', url: '/images/products/product-9.jpg', used: 2 },
    { id: '10', name: 'product-10.jpg', size: '105 KB', type: 'image/jpeg', url: '/images/products/product-10.jpg', used: 1 },
];

export default function MediaPage() {
    const t = useTranslations('Admin.Media');
    const locale = useLocale();
    const isRtl = locale === 'ar';

    const [selected, setSelected] = useState<string[]>([]);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [preview, setPreview] = useState<typeof images[0] | null>(null);

    const toggleSelect = (id: string) => {
        setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const totalSize = images.reduce((sum, img) => sum + parseFloat(img.size), 0);

    return (
        <div className="flex flex-col gap-6 p-4 md:p-8" dir={isRtl ? 'rtl' : 'ltr'}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-[28px] font-bold text-[#1b170d]">{t('title')}</h1>
                    <p className="text-neutral-500 text-sm mt-1">{t('subtitle')}</p>
                </div>
                <div className="flex gap-3">
                    {selected.length > 0 && (
                        <button className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-600 px-4 py-2.5 rounded-lg text-sm font-bold transition-colors">
                            <span className="material-symbols-outlined text-lg">delete</span>
                            {t('delete_selected', { count: selected.length })}
                        </button>
                    )}
                    <label className="flex items-center gap-2 bg-[#edab1d] hover:bg-[#d49511] text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-md cursor-pointer">
                        <span className="material-symbols-outlined text-lg">upload</span>
                        {t('upload')}
                        <input type="file" multiple accept="image/*" className="hidden" />
                    </label>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: t('total_images'), value: images.length, icon: 'image', color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: t('total_size'), value: `${(totalSize / 1024).toFixed(1)} MB`, icon: 'storage', color: 'text-amber-500', bg: 'bg-amber-50' },
                    { label: t('selected'), value: selected.length, icon: 'check_box', color: 'text-green-600', bg: 'bg-green-50' },
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

            {/* Toolbar */}
            <div className="flex items-center justify-between bg-white border border-neutral-100 rounded-xl p-3 shadow-sm">
                <div className="flex items-center gap-2">
                    <button onClick={() => setSelected(images.map(i => i.id))} className="text-xs text-neutral-500 hover:text-[#1b170d] px-3 py-1.5 rounded-lg hover:bg-neutral-100 transition-colors">{t('select_all')}</button>
                    <button onClick={() => setSelected([])} className="text-xs text-neutral-500 hover:text-[#1b170d] px-3 py-1.5 rounded-lg hover:bg-neutral-100 transition-colors">{t('deselect_all')}</button>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <span className={`material-symbols-outlined absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-neutral-400 text-[16px]`}>search</span>
                        <input placeholder={t('search')} className={`border border-neutral-200 rounded-lg ${isRtl ? 'pr-8 pl-4 text-right' : 'pl-8 pr-4 text-left'} py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#edab1d]/30 w-40`} />
                    </div>
                    <div className="flex border border-neutral-200 rounded-lg overflow-hidden">
                        <button onClick={() => setViewMode('grid')} className={`p-2 ${viewMode === 'grid' ? 'bg-[#edab1d] text-white' : 'text-neutral-500 hover:bg-neutral-100'}`}>
                            <span className="material-symbols-outlined text-[18px]">grid_view</span>
                        </button>
                        <button onClick={() => setViewMode('list')} className={`p-2 ${viewMode === 'list' ? 'bg-[#edab1d] text-white' : 'text-neutral-500 hover:bg-neutral-100'}`}>
                            <span className="material-symbols-outlined text-[18px]">list</span>
                        </button>
                    </div>
                </div>
            </div>

            {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {images.map((img) => (
                        <div
                            key={img.id}
                            onClick={() => toggleSelect(img.id)}
                            className={`relative group cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${selected.includes(img.id) ? 'border-[#edab1d] shadow-lg shadow-[#edab1d]/20' : 'border-neutral-100 hover:border-neutral-300'}`}
                        >
                            <div className="aspect-square relative bg-neutral-100">
                                <Image src={img.url} alt={img.name} fill className="object-cover" sizes="200px" />
                                <div className={`absolute inset-0 bg-black/30 transition-opacity ${selected.includes(img.id) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                                {selected.includes(img.id) && (
                                    <div className="absolute top-2 right-2 w-6 h-6 bg-[#edab1d] rounded-full flex items-center justify-center shadow-sm">
                                        <span className="material-symbols-outlined text-white text-[14px]">check</span>
                                    </div>
                                )}
                                <button
                                    onClick={e => { e.stopPropagation(); setPreview(img); }}
                                    className="absolute bottom-2 left-2 p-1.5 bg-white/90 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <span className="material-symbols-outlined text-[16px] text-[#1b170d]">open_in_full</span>
                                </button>
                            </div>
                            <div className="p-2 bg-white">
                                <p className="text-xs font-medium text-[#1b170d] truncate">{img.name}</p>
                                <p className="text-[10px] text-neutral-400">{img.size}</p>
                            </div>
                        </div>
                    ))}

                    {/* Upload Zone */}
                    <label className="aspect-square rounded-xl border-2 border-dashed border-neutral-300 hover:border-[#edab1d] hover:bg-[#edab1d]/5 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer">
                        <span className="material-symbols-outlined text-neutral-400 text-3xl group-hover:text-[#edab1d]">add_photo_alternate</span>
                        <span className="text-xs text-neutral-400">{t('upload_image')}</span>
                        <input type="file" multiple accept="image/*" className="hidden" />
                    </label>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-neutral-100 shadow-sm overflow-hidden">
                    <table className="w-full text-right">
                        <thead className="bg-neutral-50 text-xs text-neutral-500 font-medium">
                            <tr>
                                <th className="px-5 py-3">{t('col_image')}</th>
                                <th className="px-5 py-3">{t('col_name')}</th>
                                <th className="px-5 py-3">{t('col_size')}</th>
                                <th className="px-5 py-3">{t('col_used_in')}</th>
                                <th className="px-5 py-3">{t('col_action')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-50">
                            {images.map((img) => (
                                <tr key={img.id} className="hover:bg-neutral-50 transition-colors">
                                    <td className="px-5 py-3">
                                        <div className="w-12 h-12 rounded-lg overflow-hidden relative bg-neutral-100">
                                            <Image src={img.url} alt={img.name} fill className="object-cover" sizes="48px" />
                                        </div>
                                    </td>
                                    <td className="px-5 py-3 font-medium text-[#1b170d] text-sm">{img.name}</td>
                                    <td className="px-5 py-3 text-sm text-neutral-400">{img.size}</td>
                                    <td className="px-5 py-3"><span className="text-xs bg-neutral-100 px-2.5 py-1 rounded-full">{t('used_in_products', { count: img.used })}</span></td>
                                    <td className="px-5 py-3">
                                        <div className="flex gap-2">
                                            <button onClick={() => setPreview(img)} className="p-1.5 text-blue-400 hover:bg-blue-50 rounded-lg">
                                                <span className="material-symbols-outlined text-[16px]">visibility</span>
                                            </button>
                                            <button onClick={() => navigator.clipboard?.writeText(img.url)} className="p-1.5 text-neutral-400 hover:bg-neutral-100 rounded-lg">
                                                <span className="material-symbols-outlined text-[16px]">content_copy</span>
                                            </button>
                                            <button className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg">
                                                <span className="material-symbols-outlined text-[16px]">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Preview Modal */}
            {preview && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setPreview(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="relative aspect-square">
                            <Image src={preview.url} alt={preview.name} fill className="object-cover" sizes="500px" />
                        </div>
                        <div className="p-4 flex items-center justify-between">
                            <div>
                                <p className="font-bold text-[#1b170d]">{preview.name}</p>
                                <p className="text-xs text-neutral-400">{preview.size} • {preview.type} • {t('used_in_products', { count: preview.used })}</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => navigator.clipboard?.writeText(preview.url)} className="text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-3 py-2 rounded-lg font-medium flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[16px]">content_copy</span>
                                    {t('copy_link')}
                                </button>
                                <button onClick={() => setPreview(null)} className="text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-3 py-2 rounded-lg font-medium">{t('close')}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

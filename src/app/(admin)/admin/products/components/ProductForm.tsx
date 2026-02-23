'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminProduct, ProductStatus, useAdminProducts } from '@/lib/stores/adminProducts';

interface ProductFormProps {
    initialData?: AdminProduct;
    isEdit?: boolean;
    locale: string;
}

export default function ProductForm({ initialData, isEdit, locale }: ProductFormProps) {
    const isRtl = locale === 'ar';
    const router = useRouter();
    const { addProduct, updateProduct } = useAdminProducts();

    const [formData, setFormData] = useState<Partial<AdminProduct>>(initialData || {
        titleAr: '',
        titleEn: '',
        slug: '',
        descriptionAr: '',
        descriptionEn: '',
        price: 0,
        compareAtPrice: undefined,
        category: 'يومي',
        images: [],
        status: 'draft',
        variants: [{ id: 'v_new_1', sku: '', stock: 0 }],
        isCustom: false,
        isMadeToOrder: false,
        leadTimeDays: 0
    });

    const [activeTab, setActiveTab] = useState('general');

    const handleChange = <K extends keyof AdminProduct>(field: K, value: AdminProduct[K]) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        if (isEdit && initialData?.id) {
            updateProduct(initialData.id, formData);
        } else {
            addProduct(formData as Omit<AdminProduct, 'id' | 'createdAt' | 'updatedAt'>);
        }
        router.push(`/admin/products`);
    };

    const tabs = [
        { id: 'general', label: isRtl ? 'المعلومات الأساسية' : 'General Info' },
        { id: 'pricing', label: isRtl ? 'التسعير والمخزون' : 'Pricing & Inventory' },
        { id: 'manufacturing', label: isRtl ? 'التصنيع والخيارات' : 'Manufacturing & Options' },
        { id: 'images', label: isRtl ? 'الصور' : 'Images' }
    ];

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 max-w-5xl mx-auto w-full pb-32">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                        {isEdit ? (isRtl ? 'تعديل المنتج' : 'Edit Product') : (isRtl ? 'إضافة منتج جديد' : 'Add New Product')}
                    </h1>
                    <p className="text-gray-500 mt-1 text-sm">{isEdit ? formData.titleAr : (isRtl ? 'أدخل تفاصيل المنتج الجديد' : 'Enter new product details')}</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                <div className="border-b border-gray-100 px-6 pt-4 bg-gray-50/50">
                    <div className="flex gap-6 overflow-x-auto no-scrollbar">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`pb-3 border-b-2 font-bold text-sm whitespace-nowrap transition-colors ${activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-6 md:p-8">
                    {activeTab === 'general' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-sm font-bold text-gray-700 mb-2">{isRtl ? 'اسم المنتج (عربي)' : 'Product Name (Arabic)'}</label>
                                <input
                                    className="w-full rounded-xl border-gray-200 bg-gray-50 text-gray-900 focus:border-primary focus:ring-primary px-4 py-3"
                                    type="text"
                                    value={formData.titleAr}
                                    onChange={(e) => handleChange('titleAr', e.target.value)}
                                />
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-sm font-bold text-gray-700 mb-2">{isRtl ? 'اسم المنتج (إنجليزي)' : 'Product Name (English)'}</label>
                                <input
                                    className="w-full rounded-xl border-gray-200 bg-gray-50 text-gray-900 focus:border-primary focus:ring-primary px-4 py-3"
                                    type="text"
                                    dir="ltr"
                                    value={formData.titleEn}
                                    onChange={(e) => handleChange('titleEn', e.target.value)}
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">{isRtl ? 'الرابط الدائم (Slug)' : 'URL Slug'}</label>
                                <input
                                    className="w-full rounded-xl border-gray-200 bg-gray-50 text-gray-900 focus:border-primary focus:ring-primary px-4 py-3 font-mono text-sm"
                                    type="text"
                                    dir="ltr"
                                    value={formData.slug}
                                    onChange={(e) => handleChange('slug', e.target.value)}
                                    placeholder="classic-abaya-black"
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">{isRtl ? 'التصنيف' : 'Category'}</label>
                                <select
                                    className="w-full rounded-xl border-gray-200 bg-gray-50 text-gray-900 focus:border-primary focus:ring-primary px-4 py-3"
                                    value={formData.category}
                                    onChange={(e) => handleChange('category', e.target.value)}
                                >
                                    <option value="يومي">يومي (Daily)</option>
                                    <option value="سهرة">سهرة (Evening)</option>
                                    <option value="مجموعة الشتاء">مجموعة الشتاء (Winter Collection)</option>
                                    <option value="اكسسوارات">اكسسوارات (Accessories)</option>
                                </select>
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">{isRtl ? 'الوصف (عربي)' : 'Description (Arabic)'}</label>
                                <textarea
                                    className="w-full rounded-xl border-gray-200 bg-gray-50 text-gray-900 focus:border-primary focus:ring-primary px-4 py-3 h-32 resize-none"
                                    value={formData.descriptionAr}
                                    onChange={(e) => handleChange('descriptionAr', e.target.value)}
                                ></textarea>
                            </div>
                        </div>
                    )}

                    {activeTab === 'pricing' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-sm font-bold text-gray-700 mb-2">{isRtl ? 'السعر' : 'Price'}</label>
                                <input
                                    className="w-full rounded-xl border-gray-200 bg-gray-50 text-gray-900 focus:border-primary focus:ring-primary px-4 py-3"
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => handleChange('price', Number(e.target.value))}
                                />
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-sm font-bold text-gray-700 mb-2">{isRtl ? 'سعر المقارنة (قبل الخصم)' : 'Compare at Price'}</label>
                                <input
                                    className="w-full rounded-xl border-gray-200 bg-gray-50 text-gray-900 focus:border-primary focus:ring-primary px-4 py-3"
                                    type="number"
                                    value={formData.compareAtPrice || ''}
                                    onChange={(e) => handleChange('compareAtPrice', Number(e.target.value))}
                                />
                            </div>

                            <div className="col-span-2 pt-6 border-t border-gray-100">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-gray-900">{isRtl ? 'خيارات المنتج (المتغيرات)' : 'Product Variants'}</h3>
                                    <button
                                        onClick={() => handleChange('variants', [...(formData.variants || []), { id: `v_new_${Date.now()}`, sku: '', stock: 0 }])}
                                        className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                                    >
                                        <span className="material-symbols-outlined text-[16px]">add</span>
                                        إضافة خيار
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {formData.variants?.map((variant, index) => (
                                        <div key={variant.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50 flex flex-wrap md:flex-nowrap gap-4 items-end">
                                            <div className="flex-1 min-w-[120px]">
                                                <label className="block text-xs font-bold text-gray-600 mb-1">SKU</label>
                                                <input
                                                    className="w-full rounded-lg border-gray-200 px-3 py-2 text-sm focus:border-primary focus:ring-primary"
                                                    value={variant.sku}
                                                    onChange={(e) => {
                                                        const newVariants = [...(formData.variants || [])];
                                                        newVariants[index].sku = e.target.value;
                                                        handleChange('variants', newVariants);
                                                    }}
                                                />
                                            </div>
                                            <div className="w-24 shrink-0">
                                                <label className="block text-xs font-bold text-gray-600 mb-1">المقاس</label>
                                                <input
                                                    className="w-full rounded-lg border-gray-200 px-3 py-2 text-sm focus:border-primary focus:ring-primary"
                                                    value={variant.size || ''}
                                                    onChange={(e) => {
                                                        const newVariants = [...(formData.variants || [])];
                                                        newVariants[index].size = e.target.value;
                                                        handleChange('variants', newVariants);
                                                    }}
                                                    placeholder="S, M, L..."
                                                />
                                            </div>
                                            <div className="w-24 shrink-0">
                                                <label className="block text-xs font-bold text-gray-600 mb-1">اللون</label>
                                                <input
                                                    className="w-full rounded-lg border-gray-200 px-3 py-2 text-sm focus:border-primary focus:ring-primary"
                                                    value={variant.color || ''}
                                                    onChange={(e) => {
                                                        const newVariants = [...(formData.variants || [])];
                                                        newVariants[index].color = e.target.value;
                                                        handleChange('variants', newVariants);
                                                    }}
                                                />
                                            </div>
                                            <div className="w-24 shrink-0">
                                                <label className="block text-xs font-bold text-gray-600 mb-1">المخزون</label>
                                                <input
                                                    type="number"
                                                    className="w-full rounded-lg border-gray-200 px-3 py-2 text-sm focus:border-primary focus:ring-primary"
                                                    value={variant.stock}
                                                    onChange={(e) => {
                                                        const newVariants = [...(formData.variants || [])];
                                                        newVariants[index].stock = Number(e.target.value);
                                                        handleChange('variants', newVariants);
                                                    }}
                                                />
                                            </div>
                                            {(formData.variants?.length || 0) > 1 && (
                                                <button
                                                    onClick={() => handleChange('variants', formData.variants?.filter((_, i) => i !== index) || [])}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg mb-[1px]"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">delete</span>
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'manufacturing' && (
                        <div className="max-w-xl space-y-6">
                            <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 bg-gray-50">
                                <div className="pt-1">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={formData.isMadeToOrder}
                                            onChange={(e) => handleChange('isMadeToOrder', e.target.checked)}
                                        />
                                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:trangray-x-full rtl:peer-checked:after:-trangray-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                    </label>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-900 mb-1">{isRtl ? 'صنع حسب الطلب (Made to Order)' : 'Made to Order'}</h4>
                                    <p className="text-sm text-gray-500">هذا المنتج لا يتوفر في المخزون المباشر ويحتاج لفترة تصنيع بعد الطلب.</p>

                                    {formData.isMadeToOrder && (
                                        <div className="mt-4">
                                            <label className="block text-xs font-bold text-gray-700 mb-1">فترة التصنيع (أيام)</label>
                                            <input
                                                className="w-32 rounded-lg border-gray-200 bg-white px-3 py-2 text-sm focus:border-primary focus:ring-primary"
                                                type="number"
                                                value={formData.leadTimeDays || 0}
                                                onChange={(e) => handleChange('leadTimeDays', Number(e.target.value))}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 bg-gray-50">
                                <div className="pt-1">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={formData.isCustom}
                                            onChange={(e) => handleChange('isCustom', e.target.checked)}
                                        />
                                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:trangray-x-full rtl:peer-checked:after:-trangray-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                    </label>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-900 mb-1">{isRtl ? 'يقبل التفصيل الخاص (Custom Measurements)' : 'Accepts Custom Measurements'}</h4>
                                    <p className="text-sm text-gray-500">السماح للعميل بإدخال مقاساته الخاصة بدلاً من المقاسات الجاهزة.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'images' && (
                        <div className="space-y-6">
                            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                                <div className="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
                                    <span className="material-symbols-outlined text-[24px]">cloud_upload</span>
                                </div>
                                <h4 className="font-bold text-gray-900">{isRtl ? 'انقر لرفع صور المنتج' : 'Click to upload product images'}</h4>
                                <p className="text-sm text-gray-500 mt-1">PNG, JPG, أو WEBP (الحد الأقصى للتنزيل 2MB)</p>
                            </div>

                            {formData.images && formData.images.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {formData.images.map((img, idx) => (
                                        <div key={idx} className="relative aspect-[3/4] rounded-xl overflow-hidden border border-gray-200 group">
                                            <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-gray-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                <button className="p-2 bg-white text-gray-700 rounded-full hover:bg-red-50 hover:text-red-500">
                                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Floating Action Bar */}
            <div className={`fixed bottom-0 ${isRtl ? 'right-0 md:right-[5rem] lg:right-72' : 'left-0 md:left-[5rem] lg:left-72'} left-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-200 z-30 flex items-center justify-between`}>
                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-sm text-gray-700">
                        <span className="material-symbols-outlined text-[20px] text-gray-400">visibility</span>
                        الحالة:
                        <select
                            className="bg-transparent border-none text-primary font-black focus:ring-0 p-0 pr-6"
                            value={formData.status}
                            onChange={(e) => handleChange('status', e.target.value as ProductStatus)}
                        >
                            <option value="published">منشور</option>
                            <option value="draft">مسودة</option>
                            <option value="archived">مؤرشف</option>
                        </select>
                    </label>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => router.back()}
                        className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors text-sm"
                    >
                        إلغاء
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-colors shadow-md shadow-primary/20 text-sm"
                    >
                        حفظ التغييرات
                    </button>
                </div>
            </div>
        </div>
    );
}

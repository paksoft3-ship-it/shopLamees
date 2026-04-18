'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { upload } from '@vercel/blob/client';
import { AdminProduct, ProductStatus } from '@/lib/stores/adminProducts';
import { createAdminProduct, updateAdminProduct } from '@/lib/actions/adminProducts';
import { getAdminCategories, AdminCategory } from '@/lib/actions/adminCategories';

interface ProductFormProps {
    initialData?: AdminProduct;
    isEdit?: boolean;
    locale: string;
}

export default function ProductForm({ initialData, isEdit, locale }: ProductFormProps) {
    const isRtl = locale === 'ar';
    const router = useRouter();

    const [formData, setFormData] = useState<Partial<AdminProduct>>(initialData || {
        titleAr: '',
        titleEn: '',
        slug: '',
        descriptionAr: '',
        descriptionEn: '',
        price: 0,
        compareAtPrice: undefined,
        category: '',
        images: [],
        status: 'draft',
        variants: [{ id: 'v_new_1', sku: '', stock: 0 }],
        isCustom: false,
        isMadeToOrder: false,
        leadTimeDays: 0
    });

    const [activeTab, setActiveTab] = useState('general');
    const [uploading, setUploading] = useState(false);
    const [categories, setCategories] = useState<AdminCategory[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        getAdminCategories().then(cats => {
            setCategories(cats);
            if (!isEdit && !formData.category && cats.length > 0) {
                handleChange('category', cats[0].slug);
            }
        });
    }, []);

    const handleChange = <K extends keyof AdminProduct>(field: K, value: AdminProduct[K]) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        try {
            if (isEdit && initialData?.id) {
                await updateAdminProduct(initialData.id, formData);
            } else {
                await createAdminProduct(formData);
            }
            router.refresh();
            router.push(`/admin/products`);
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Failed to save product.');
        }
    };

    const [uploadProgress, setUploadProgress] = useState({ done: 0, total: 0 });

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        if (!files.length) return;

        const maxSizeBytes = 4 * 1024 * 1024;
        const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif']);

        const invalid = files.find(f => !allowedTypes.has(f.type));
        if (invalid) {
            alert(isRtl ? 'نوع الملف غير مدعوم. استخدم JPG/PNG/WEBP/AVIF.' : 'Unsupported file type. Use JPG/PNG/WEBP/AVIF.');
            return;
        }
        const tooBig = files.find(f => f.size > maxSizeBytes);
        if (tooBig) {
            alert(isRtl ? `"${tooBig.name}" كبير جداً. الحد الأقصى 4MB لكل صورة.` : `"${tooBig.name}" is too large. Max 4MB per image.`);
            return;
        }

        setUploading(true);
        setUploadProgress({ done: 0, total: files.length });

        const uploadedUrls: string[] = [];
        for (const file of files) {
            try {
                const ext = file.name.split('.').pop();
                const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
                const blob = await upload(uniqueName, file, {
                    access: 'public',
                    handleUploadUrl: '/api/upload',
                });
                uploadedUrls.push(blob.url);
                setUploadProgress(p => ({ ...p, done: p.done + 1 }));
            } catch (err) {
                const msg = err instanceof Error ? err.message : String(err);
                console.error('Upload error for', file.name, msg);
                alert(`Failed to upload "${file.name}": ${msg}`);
            }
        }

        if (uploadedUrls.length) {
            handleChange('images', [...(formData.images || []), ...uploadedUrls]);
        }

        setUploading(false);
        setUploadProgress({ done: 0, total: 0 });
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removeImage = (index: number) => {
        const newImages = [...(formData.images || [])];
        newImages.splice(index, 1);
        handleChange('images', newImages);
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
                                    {categories.length === 0 && (
                                        <option value="">{isRtl ? 'جاري التحميل...' : 'Loading...'}</option>
                                    )}
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.slug}>
                                            {isRtl ? cat.nameAr : cat.nameEn}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">{isRtl ? 'الوصف (عربي)' : 'Description (Arabic)'}</label>
                                <textarea
                                    className="w-full rounded-xl border-gray-200 bg-gray-50 text-gray-900 focus:border-primary focus:ring-primary px-4 py-3 h-32 resize-none"
                                    dir="rtl"
                                    value={formData.descriptionAr}
                                    onChange={(e) => handleChange('descriptionAr', e.target.value)}
                                    placeholder={isRtl ? 'أدخل وصف المنتج بالعربية...' : 'Enter product description in Arabic...'}
                                ></textarea>
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">{isRtl ? 'الوصف (إنجليزي)' : 'Description (English)'}</label>
                                <textarea
                                    className="w-full rounded-xl border-gray-200 bg-gray-50 text-gray-900 focus:border-primary focus:ring-primary px-4 py-3 h-32 resize-none"
                                    dir="ltr"
                                    value={formData.descriptionEn}
                                    onChange={(e) => handleChange('descriptionEn', e.target.value)}
                                    placeholder="Enter product description in English..."
                                ></textarea>
                            </div>
                        </div>
                    )}

                    {activeTab === 'pricing' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-sm font-bold text-gray-700 mb-2">{isRtl ? 'السعر (يطبّق على جميع الخيارات)' : 'Price (applies to all variants)'}</label>
                                <input
                                    className="w-full rounded-xl border-gray-200 bg-gray-50 text-gray-900 focus:border-primary focus:ring-primary px-4 py-3"
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => {
                                        const newPrice = Number(e.target.value);
                                        handleChange('price', newPrice);
                                        handleChange('variants', (formData.variants || []).map(v => ({ ...v, price: newPrice })));
                                    }}
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
                                        {isRtl ? 'إضافة خيار' : 'Add Variant'}
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
                                                <label className="block text-xs font-bold text-gray-600 mb-1">{isRtl ? 'المقاس' : 'Size'}</label>
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
                                                <label className="block text-xs font-bold text-gray-600 mb-1">{isRtl ? 'اللون' : 'Color'}</label>
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
                                                <label className="block text-xs font-bold text-gray-600 mb-1">{isRtl ? 'السعر' : 'Price'}</label>
                                                <input
                                                    type="number"
                                                    className="w-full rounded-lg border-gray-200 px-3 py-2 text-sm focus:border-primary focus:ring-primary"
                                                    value={variant.price ?? formData.price ?? 0}
                                                    onChange={(e) => {
                                                        const newVariants = [...(formData.variants || [])];
                                                        newVariants[index] = { ...newVariants[index], price: Number(e.target.value) };
                                                        handleChange('variants', newVariants);
                                                    }}
                                                />
                                            </div>
                                            <div className="w-24 shrink-0">
                                                <label className="block text-xs font-bold text-gray-600 mb-1">{isRtl ? 'المخزون' : 'Stock'}</label>
                                                <input
                                                    type="number"
                                                    className="w-full rounded-lg border-gray-200 px-3 py-2 text-sm focus:border-primary focus:ring-primary"
                                                    value={variant.stock}
                                                    onChange={(e) => {
                                                        const newVariants = [...(formData.variants || [])];
                                                        newVariants[index] = { ...newVariants[index], stock: Number(e.target.value) };
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
                            {/* isBestSeller */}
                            <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 bg-gray-50">
                                <div className="pt-1">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={formData.isBestSeller || false}
                                            onChange={(e) => handleChange('isBestSeller', e.target.checked)}
                                        />
                                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                    </label>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-900 mb-1">{isRtl ? 'الأكثر مبيعاً (Best Seller)' : 'Best Seller'}</h4>
                                    <p className="text-sm text-gray-500">{isRtl ? 'تمييز هذا المنتج كأكثر المنتجات مبيعاً.' : 'Mark this product as a best seller.'}</p>
                                </div>
                            </div>

                            {/* Fabric & Color */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">{isRtl ? 'القماش / المادة' : 'Fabric / Material'}</label>
                                    <input
                                        className="w-full rounded-xl border-gray-200 bg-gray-50 text-gray-900 focus:border-primary focus:ring-primary px-4 py-3 text-sm"
                                        type="text"
                                        value={formData.fabric || ''}
                                        onChange={(e) => handleChange('fabric', e.target.value)}
                                        placeholder={isRtl ? 'مثال: كريب، شيفون' : 'e.g. Crepe, Chiffon'}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">{isRtl ? 'اللون الرئيسي' : 'Primary Color'}</label>
                                    <input
                                        className="w-full rounded-xl border-gray-200 bg-gray-50 text-gray-900 focus:border-primary focus:ring-primary px-4 py-3 text-sm"
                                        type="text"
                                        value={formData.color || ''}
                                        onChange={(e) => handleChange('color', e.target.value)}
                                        placeholder={isRtl ? 'مثال: أسود، كحلي' : 'e.g. Black, Navy'}
                                    />
                                </div>
                            </div>

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
                                    <p className="text-sm text-gray-500">{isRtl ? 'هذا المنتج لا يتوفر في المخزون المباشر ويحتاج لفترة تصنيع بعد الطلب.' : 'This product is not kept in stock and requires a production period after ordering.'}</p>

                                    {formData.isMadeToOrder && (
                                        <div className="mt-4">
                                            <label className="block text-xs font-bold text-gray-700 mb-1">{isRtl ? 'فترة التصنيع (أيام)' : 'Lead Time (days)'}</label>
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
                                    <p className="text-sm text-gray-500">{isRtl ? 'السماح للعميل بإدخال مقاساته الخاصة بدلاً من المقاسات الجاهزة.' : 'Allow customers to enter their own measurements instead of standard sizes.'}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'images' && (
                        <div className="space-y-6">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleUpload}
                                accept="image/*"
                                multiple
                                className="hidden"
                            />

                            <div
                                onClick={() => !uploading && fileInputRef.current?.click()}
                                className={`border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-colors cursor-pointer ${uploading ? 'bg-gray-100 opacity-50 cursor-not-allowed' : 'bg-gray-50 hover:bg-gray-100'}`}
                            >
                                <div className="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
                                    <span className={`material-symbols-outlined text-[24px] ${uploading ? 'animate-spin' : ''}`}>
                                        {uploading ? 'sync' : 'cloud_upload'}
                                    </span>
                                </div>
                                <h4 className="font-bold text-gray-900">
                                    {uploading
                                        ? (isRtl
                                            ? `جاري الرفع... ${uploadProgress.done}/${uploadProgress.total}`
                                            : `Uploading... ${uploadProgress.done}/${uploadProgress.total}`)
                                        : (isRtl ? 'انقر لرفع صور المنتج' : 'Click to upload product images')}
                                </h4>
                                <p className="text-sm text-gray-500 mt-1">
                                    {isRtl
                                        ? 'يمكنك اختيار أكثر من صورة في نفس الوقت • PNG، JPG، WEBP (الحد الأقصى 4MB لكل صورة)'
                                        : 'Select multiple images at once • PNG, JPG, WEBP (max 4MB each)'}
                                </p>
                            </div>

                            {formData.images && formData.images.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {formData.images.map((img, idx) => (
                                        <div key={idx} className="relative aspect-[3/4] rounded-xl overflow-hidden border border-gray-200 group bg-gray-50">
                                            <Image
                                                src={img}
                                                alt={`Preview ${idx}`}
                                                fill
                                                className="w-full h-full object-cover"
                                                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 20vw"
                                            />
                                            <div className="absolute inset-0 bg-gray-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => removeImage(idx)}
                                                    className="p-2 bg-white text-gray-700 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors"
                                                >
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
                        {isRtl ? 'الحالة:' : 'Status:'}
                        <select
                            className="bg-transparent border-none text-primary font-black focus:ring-0 p-0 pr-6"
                            value={formData.status}
                            onChange={(e) => handleChange('status', e.target.value as ProductStatus)}
                        >
                            <option value="published">{isRtl ? 'منشور' : 'Published'}</option>
                            <option value="draft">{isRtl ? 'مسودة' : 'Draft'}</option>
                            <option value="archived">{isRtl ? 'مؤرشف' : 'Archived'}</option>
                        </select>
                    </label>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => router.back()}
                        className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors text-sm"
                    >
                        {isRtl ? 'إلغاء' : 'Cancel'}
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-colors shadow-md shadow-primary/20 text-sm"
                    >
                        {isRtl ? 'حفظ التغييرات' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}

'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useAdminProducts, ProductStatus, AdminProduct, ProductVariant } from '@/lib/stores/adminProducts';
import { useLocale } from 'next-intl';
import { formatMoney } from '@/lib/money';

export default function AdminProductsPage() {
    const locale = useLocale();
    const isRtl = locale === 'ar';
    const { products, updateProductStatus } = useAdminProducts();

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    // Derived state
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesSearch =
                product.titleAr.includes(searchQuery) ||
                product.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.slug.includes(searchQuery) ||
                product.variants.some(v => v.sku.toLowerCase().includes(searchQuery.toLowerCase()));

            const matchesStatus = statusFilter === 'all' || product.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [products, searchQuery, statusFilter]);

    // Removed unused getStatusStyles

    const getStatusLabel = (status: ProductStatus) => {
        switch (status) {
            case 'published': return 'منشور';
            case 'draft': return 'مسودة';
            case 'archived': return 'مؤرشف';
            default: return status;
        }
    };

    const calculateTotalStock = (product: AdminProduct) => {
        return product.variants.reduce((total: number, v: ProductVariant) => total + v.stock, 0);
    };

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">المنتجات</h1>
                    <p className="text-gray-500 mt-1 text-sm flex items-center gap-2">
                        إدارة كتالوج المنتجات
                        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs font-bold">{products.length} منتج</span>
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center justify-center gap-2 px-4 h-10 rounded-xl bg-white border border-gray-200 text-gray-700 text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm">
                        <span className="material-symbols-outlined text-[20px]">filter_list</span>
                        <span className="hidden sm:inline">تصفية متقدمة</span>
                    </button>
                    <Link href={`/${locale}/admin/products/new`} className="flex items-center justify-center gap-2 px-5 h-10 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/20">
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        <span>إضافة منتج</span>
                    </Link>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex flex-col gap-4">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 relative min-w-[240px]">
                        <span className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -trangray-y-1/2 text-gray-400 material-symbols-outlined`}>search</span>
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`w-full h-11 ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'} rounded-xl border-gray-200 bg-gray-50 text-gray-900 text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all`}
                            placeholder="بحث باسم المنتج، رمز SKU..."
                            type="text"
                        />
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative group">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className={`appearance-none h-11 ${isRtl ? 'pr-4 pl-10' : 'pl-4 pr-10'} rounded-xl border-gray-200 bg-white text-gray-700 text-sm font-medium focus:ring-2 focus:ring-primary/50 focus:border-primary cursor-pointer min-w-[140px]`}>
                                <option value="all">كل الحالات</option>
                                <option value="published">منشور</option>
                                <option value="draft">مسودة</option>
                                <option value="archived">مؤرشف</option>
                            </select>
                            <span className={`absolute ${isRtl ? 'left-3' : 'right-3'} top-1/2 -trangray-y-1/2 text-gray-400 pointer-events-none material-symbols-outlined text-[20px]`}>expand_more</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:flex bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="py-4 px-6 w-12">
                                    <input className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary cursor-pointer" type="checkbox" />
                                </th>
                                <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-20">صورة</th>
                                <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">اسم المنتج</th>
                                <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">التصنيف</th>
                                <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">السعر</th>
                                <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">المخزون الإجمالي</th>
                                <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">الحالة</th>
                                <th className="py-4 px-6 w-16"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredProducts.map(product => {
                                const totalStock = calculateTotalStock(product);
                                const stockPercent = Math.min((totalStock / 100) * 100, 100); // mock percentage based on 100 top
                                const stockColor = totalStock === 0 ? 'bg-red-500' : totalStock < 10 ? 'bg-orange-500' : 'bg-green-500';

                                return (
                                    <tr key={product.id} className="group hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-6">
                                            <input className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary cursor-pointer" type="checkbox" />
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="size-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 shrink-0">
                                                {product.images[0] ? (
                                                    <img src={product.images[0]} alt={product.titleAr} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="material-symbols-outlined text-gray-400 w-full h-full flex items-center justify-center">image</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex flex-col">
                                                <Link href={`/${locale}/admin/products/${product.id}/edit`} className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors">
                                                    {isRtl ? product.titleAr : product.titleEn}
                                                </Link>
                                                <span className="text-xs text-gray-500 font-mono mt-1">{product.variants[0]?.sku || product.slug}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-gray-600 text-xs font-medium border border-gray-200">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-gray-900">{formatMoney(product.price, locale as 'ar' | 'en')}</span>
                                                {product.compareAtPrice && <span className="text-xs text-gray-400 line-through">{formatMoney(product.compareAtPrice, locale as 'ar' | 'en')}</span>}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex flex-col gap-1.5 w-32">
                                                <div className="flex justify-between text-xs">
                                                    <span className={`font-medium ${totalStock === 0 ? 'text-red-600' : totalStock < 10 ? 'text-orange-600' : 'text-gray-700'}`}>
                                                        {totalStock}
                                                    </span>
                                                    <span className="text-gray-400 text-[10px]">{totalStock === 0 ? 'نفذت الكمية' : 'قطعة'}</span>
                                                </div>
                                                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                                    <div className={`${stockColor} h-1.5 rounded-full`} style={{ width: `${stockPercent}%` }}></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={product.status === 'published'}
                                                    onChange={(e) => updateProductStatus(product.id, e.target.checked ? 'published' : 'draft')}
                                                />
                                                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:trangray-x-full rtl:peer-checked:after:-trangray-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                                            </label>
                                            <div className="mt-1 text-[10px] text-gray-500">{getStatusLabel(product.status)}</div>
                                        </td>
                                        <td className="py-4 px-6 text-left">
                                            <Link href={`/${locale}/admin/products/${product.id}/edit`} className="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 transition-colors inline-block">
                                                <span className="material-symbols-outlined text-lg">edit</span>
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {filteredProducts.length === 0 && (
                        <div className="p-12 text-center text-gray-500">
                            لا توجد منتجات تطابق بحثك.
                        </div>
                    )}
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-gray-200 flex items-center justify-between">
                    <span className="text-sm text-gray-500">عرض {filteredProducts.length} من {products.length} منتجات</span>
                    <div className="flex items-center gap-1">
                        <button className="flex items-center justify-center size-8 rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-50 transition-colors">
                            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                        </button>
                        <button className="size-8 rounded-lg bg-primary text-white text-sm font-bold flex items-center justify-center shadow-md shadow-primary/30">1</button>
                        <button className="flex items-center justify-center size-8 rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 transition-colors">
                            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden space-y-4">
                {filteredProducts.map(product => {
                    const totalStock = calculateTotalStock(product);

                    return (
                        <div key={product.id} className={`group relative bg-white p-3 rounded-2xl shadow-sm border border-gray-100 transition-all ${product.status === 'draft' ? 'opacity-80' : ''}`}>
                            <div className="flex gap-3">
                                <div className="relative shrink-0 w-24 h-28 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                                    {product.images[0] ? (
                                        <img src={product.images[0]} alt={product.titleAr} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="material-symbols-outlined text-gray-400 w-full h-full justify-center flex items-center">image</span>
                                    )}
                                    {product.status === 'draft' && (
                                        <span className="absolute top-1 right-1 bg-gray-100 text-gray-600 text-[10px] font-bold px-1.5 py-0.5 rounded-md">مسودة</span>
                                    )}
                                </div>
                                <div className="flex-1 flex flex-col justify-between py-1">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <Link href={`/${locale}/admin/products/${product.id}/edit`} className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 pr-4 pl-1">
                                                {isRtl ? product.titleAr : product.titleEn}
                                            </Link>
                                            <Link href={`/${locale}/admin/products/${product.id}/edit`} className="text-gray-400 hover:text-primary shrink-0">
                                                <span className="material-symbols-outlined text-lg">edit</span>
                                            </Link>
                                        </div>
                                        <p className="text-gray-500 text-xs mt-1">{product.category} • {product.variants[0]?.sku || product.slug}</p>
                                    </div>
                                    <div className="flex items-end justify-between mt-2">
                                        <div className="flex flex-col">
                                            <span className="text-gray-900 font-bold text-base">{formatMoney(product.price, locale as 'ar' | 'en')}</span>
                                            <span className={`text-xs font-medium ${totalStock === 0 ? 'text-red-500' : totalStock < 10 ? 'text-orange-500' : 'text-gray-500'}`}>
                                                {totalStock} قطعة
                                            </span>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={product.status === 'published'}
                                                onChange={(e) => updateProductStatus(product.id, e.target.checked ? 'published' : 'draft')}
                                            />
                                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:trangray-x-full rtl:peer-checked:after:-trangray-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {filteredProducts.length === 0 && (
                    <div className="p-8 text-center text-gray-500 bg-white rounded-2xl border border-gray-100">
                        لا توجد منتجات تطابق بحثك.
                    </div>
                )}
            </div>
        </div>
    );
}
'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { getAdminProduct } from '@/lib/actions/adminProducts';
import { AdminProduct } from '@/lib/stores/adminProducts';
import ProductForm from '../../components/ProductForm';

export default function EditProductPage({ params }: { params: { id: string } }) {
    const locale = useLocale();
    const router = useRouter();

    const [product, setProduct] = useState<AdminProduct | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAdminProduct(params.id).then(data => {
            setProduct(data);
            setLoading(false);
        });
    }, [params.id]);

    if (loading) {
        return (
            <div className="flex flex-1 justify-center items-center p-20">
                <span className="material-symbols-outlined animate-spin text-4xl text-gray-400">progress_activity</span>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8">
                <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">inventory_2</span>
                <h2 className="text-xl font-bold text-gray-900 mb-2">المنتج غير موجود</h2>
                <button onClick={() => router.back()} className="text-primary hover:underline font-medium">العودة للمنتجات</button>
            </div>
        );
    }

    return <ProductForm isEdit={true} locale={locale} initialData={product} />;
}
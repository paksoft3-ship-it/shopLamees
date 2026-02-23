'use client';

import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useAdminProducts } from '@/lib/stores/adminProducts';
import ProductForm from '../../components/ProductForm';

export default function EditProductPage({ params }: { params: { id: string } }) {
    const locale = useLocale();
    const router = useRouter();
    const { products } = useAdminProducts();

    const product = products.find(p => p.id === params.id);

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
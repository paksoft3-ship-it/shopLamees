'use client';

import { ProductForm } from '@/components/admin/ProductForm';
import { mockAdminProducts } from '@/mock/admin';

export default function EditProductPage({ params }: { params: { id: string } }) {
    const product = mockAdminProducts.find(p => p.id === params.id) || mockAdminProducts[0];

    return <ProductForm isEdit={true} initialData={product} />;
}
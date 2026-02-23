'use client';

import { useLocale } from 'next-intl';
import ProductForm from '../components/ProductForm';

export default function NewProductPage() {
    const locale = useLocale();

    return <ProductForm isEdit={false} locale={locale} />;
}
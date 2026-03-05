export type ProductStatus = 'published' | 'draft' | 'archived';

export interface ProductVariant {
    id: string;
    size?: string;
    cut?: string;
    color?: string;
    sku: string;
    price?: number;
    stock: number;
}

export interface AdminProduct {
    id: string;
    titleEn: string;
    titleAr: string;
    slug: string;
    descriptionEn?: string;
    descriptionAr?: string;
    price: number;
    compareAtPrice?: number;
    category: string;
    categorySlug: string;
    images: string[];
    status: ProductStatus;
    variants: ProductVariant[];
    isCustom: boolean;
    isMadeToOrder: boolean;
    isBestSeller?: boolean;
    fabric?: string;
    color?: string;
    leadTimeDays?: number;
    createdAt: string;
    updatedAt: string;
}

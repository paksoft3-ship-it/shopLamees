export interface CategoryDTO {
    id: string;
    slug: string;
    nameAr: string;
    nameEn: string;
    image: string | null;
    sortOrder: number;
    createdAt: Date;
    // Helper fields
    name: { ar: string; en: string };
}

export interface ProductImageDTO {
    id: string;
    url: string;
    altAr: string | null;
    altEn: string | null;
    sortOrder: number;
}

export interface VariantDTO {
    id: string;
    sku: string | null;
    size: string | null;
    cut: string | null;
    color: string | null;
    stock: number;
    priceSar: number;
    priceQar: number;
    isDefault: boolean;
}

export interface ProductDTO {
    id: string;
    slug: string;
    titleAr: string;
    titleEn: string;
    descAr: string | null;
    descEn: string | null;
    basePriceSar: number;
    basePriceQar: number;
    rating: number;
    isBestSeller: boolean;
    isPublished: boolean;
    fabric: string | null;
    color: string | null;
    badgeAr: string | null;
    badgeEn: string | null;
    images: ProductImageDTO[];
    variants: VariantDTO[];
    // Helper fields for UI components
    name: { ar: string; en: string };
    description: { ar: string; en: string };
    image: string;
    allImages: string[];
    badge?: { ar: string; en: string };
    availability: boolean;
    sizes: string[];
    categoryPaths?: CategoryDTO[];
}

import { prisma } from '@/lib/db';
import { CategoryDTO, ProductDTO, VariantDTO } from './types';
import { Prisma } from '@prisma/client';

type ProductWithRelations = Prisma.ProductGetPayload<{
    include: {
        images: true;
        variants: true;
        categories: { include: { category: true } };
    };
}>;

export async function getCategories(): Promise<CategoryDTO[]> {
    const categories = await prisma.category.findMany({
        orderBy: { sortOrder: 'asc' },
    });
    return (categories as unknown as (CategoryDTO & { nameAr: string; nameEn: string })[]).map(c => ({
        id: c.id,
        slug: c.slug,
        nameAr: c.nameAr,
        nameEn: c.nameEn,
        image: c.image || null,
        sortOrder: c.sortOrder,
        createdAt: c.createdAt,
        name: { ar: c.nameAr, en: c.nameEn }
    }));
}

export async function getCategoryBySlug(slug: string): Promise<CategoryDTO | null> {
    const category = await prisma.category.findUnique({
        where: { slug },
    });
    if (!category) return null;
    return {
        id: category.id,
        slug: category.slug,
        nameAr: category.nameAr,
        nameEn: category.nameEn,
        image: category.image || null,
        sortOrder: category.sortOrder,
        createdAt: category.createdAt,
        name: { ar: category.nameAr, en: category.nameEn }
    };
}

export async function getFeaturedProducts(): Promise<ProductDTO[]> {
    const dbProducts = await prisma.product.findMany({
        where: { isPublished: true, isBestSeller: true },
        take: 8,
        include: {
            images: { orderBy: { sortOrder: 'asc' } },
            variants: { orderBy: { createdAt: 'asc' } },
            categories: { include: { category: true } }
        },
    });

    return dbProducts.map(mapToUIProduct);
}

export async function getProductsByCategory(categorySlug: string): Promise<ProductDTO[]> {
    const dbProducts = await prisma.product.findMany({
        where: {
            isPublished: true,
            categories: {
                some: {
                    category: { slug: categorySlug }
                }
            }
        },
        include: {
            images: { orderBy: { sortOrder: 'asc' } },
            variants: { orderBy: { createdAt: 'asc' } },
            categories: { include: { category: true } }
        },
    });

    return dbProducts.map(mapToUIProduct);
}

export async function getAllProducts(): Promise<ProductDTO[]> {
    const dbProducts = await prisma.product.findMany({
        where: { isPublished: true },
        orderBy: { createdAt: 'desc' },
        include: {
            images: { orderBy: { sortOrder: 'asc' } },
            variants: { orderBy: { createdAt: 'asc' } },
            categories: { include: { category: true } }
        },
    });

    return dbProducts.map(mapToUIProduct);
}

export async function getRelatedProducts(productId: string, limit: number = 4): Promise<ProductDTO[]> {
    const dbProducts = await prisma.product.findMany({
        where: {
            id: { not: productId },
            isPublished: true,
        },
        take: limit,
        include: {
            images: { orderBy: { sortOrder: 'asc' } },
            variants: { orderBy: { createdAt: 'asc' } },
            categories: { include: { category: true } }
        },
    });

    return dbProducts.map(mapToUIProduct);
}

export async function getProductBySlug(slug: string): Promise<ProductDTO | null> {
    const dbProduct = await prisma.product.findUnique({
        where: { slug },
        include: {
            images: { orderBy: { sortOrder: 'asc' } },
            variants: true,
            categories: {
                include: { category: true }
            }
        },
    });

    if (!dbProduct) return null;

    const uiProduct = mapToUIProduct(dbProduct as unknown as ProductWithRelations);
    return {
        ...uiProduct,
        categoryPaths: (dbProduct as unknown as ProductWithRelations).categories.map((c: { category: { id: string; slug: string; nameAr: string; nameEn: string; image: string | null; sortOrder: number; createdAt: Date; } }) => ({
            id: c.category.id,
            slug: c.category.slug,
            nameAr: c.category.nameAr,
            nameEn: c.category.nameEn,
            image: c.category.image || null,
            sortOrder: c.category.sortOrder,
            createdAt: c.category.createdAt,
            name: { ar: c.category.nameAr, en: c.category.nameEn }
        })),
    };
}

export async function searchProducts(query: string): Promise<ProductDTO[]> {
    if (!query || query.trim().length === 0) return [];

    const dbProducts = await prisma.product.findMany({
        where: {
            isPublished: true,
            OR: [
                { titleAr: { contains: query, mode: 'insensitive' } },
                { titleEn: { contains: query, mode: 'insensitive' } },
                { descAr: { contains: query, mode: 'insensitive' } },
                { descEn: { contains: query, mode: 'insensitive' } },
                { slug: { contains: query, mode: 'insensitive' } },
            ],
        },
        include: {
            images: { orderBy: { sortOrder: 'asc' } },
            variants: { orderBy: { createdAt: 'asc' } },
            categories: { include: { category: true } }
        },
        take: 20,
    });

    return dbProducts.map(mapToUIProduct);
}

// Helper to map DB Product to DTO Product type
function mapToUIProduct(p: ProductWithRelations): ProductDTO {
    const variants = p.variants || [];
    const defaultVariant = variants[0];

    // Using explicit types for map parameters to avoid implicit any errors
    const uiVariants = variants.map((v: {
        id: string;
        priceSar: Prisma.Decimal;
        priceQar: Prisma.Decimal;
        stock: number;
        size: string;
        sku: string;
        cut: string;
        color: string;
    }) => ({
        ...v,
        priceSar: Number(v.priceSar),
        priceQar: Number(v.priceQar),
        isDefault: v.id === defaultVariant?.id
    }));

    return {
        id: p.id,
        slug: p.slug,
        titleAr: p.titleAr,
        titleEn: p.titleEn,
        descAr: p.descAr,
        descEn: p.descEn,
        basePriceSar: defaultVariant ? Number(defaultVariant.priceSar) : 0,
        basePriceQar: defaultVariant ? Number(defaultVariant.priceQar) : 0,
        rating: p.rating,
        isBestSeller: p.isBestSeller,
        isPublished: p.isPublished,
        fabric: p.fabric,
        color: p.color,
        badgeAr: p.badgeAr,
        badgeEn: p.badgeEn,
        images: p.images || [],
        variants: uiVariants.map((v: {
            id: string;
            sku: string;
            size: string | null;
            cut: string | null;
            color: string | null;
            stock: number;
            isDefault: boolean;
        }) => ({
            ...v,
            sku: v.sku || null,
            size: v.size || null,
            cut: v.cut || null,
            color: v.color || null,
            stock: v.stock || 0,
            isDefault: v.isDefault
        })) as VariantDTO[], // Cast to VariantDTO[] to satisfy ProductDTO

        // Helper fields for UI compatibility
        name: { ar: p.titleAr, en: p.titleEn },
        description: { ar: p.descAr || '', en: p.descEn || '' },
        image: p.images?.[0]?.url || '/placeholder.png',
        allImages: p.images?.map((img: { url: string }) => img.url) || [],
        badge: (p.badgeAr || p.badgeEn) ? { ar: p.badgeAr || '', en: p.badgeEn || '' } : undefined,
        availability: defaultVariant ? defaultVariant.stock > 0 : false,
        sizes: Array.from(new Set(variants.map((v: { size: string | null }) => v.size).filter((s): s is string => typeof s === 'string'))),
    };
}

'use server';

import prisma from '@/lib/db';
import { ProductStatus, AdminProduct } from '@/lib/stores/adminProducts';
import { revalidatePath, revalidateTag } from 'next/cache';

async function findCategoryBySlug(slug: string) {
    const cat = await prisma.category.findUnique({ where: { slug } });
    if (cat) return cat;
    return prisma.category.findFirst({ orderBy: { sortOrder: 'asc' } });
}

export async function getAdminProducts(): Promise<AdminProduct[]> {
    const products = await prisma.product.findMany({
        include: {
            images: {
                orderBy: { sortOrder: 'asc' }
            },
            variants: true,
            categories: {
                include: {
                    category: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return products.map(p => {
        const primaryCat = p.categories[0]?.category;

        return {
            id: p.id,
            slug: p.slug,
            titleAr: p.titleAr,
            titleEn: p.titleEn,
            descriptionAr: p.descAr || undefined,
            descriptionEn: p.descEn || undefined,
            price: p.variants.length > 0 ? Number(p.variants[0].priceQar) : 0,
            compareAtPrice: undefined, // Currently not in Prisma schema directly
            category: primaryCat?.slug || '',
            categorySlug: primaryCat?.slug || '',
            images: p.images.map(img => img.url),
            status: p.isPublished ? 'published' : 'draft',
            variants: p.variants.map(v => ({
                id: v.id,
                size: v.size,
                cut: v.cut,
                color: v.color,
                sku: v.sku,
                stock: v.stock,
                price: Number(v.priceQar)
            })),
            isCustom: p.isCustom,
            isMadeToOrder: p.madeToOrder,
            isBestSeller: p.isBestSeller,
            fabric: p.fabric || undefined,
            color: p.color || undefined,
            leadTimeDays: p.leadTimeDays || undefined,
            createdAt: p.createdAt.toISOString(),
            updatedAt: p.updatedAt.toISOString(),
        } as AdminProduct;
    });
}

export async function updateAdminProductStatus(id: string, status: ProductStatus) {
    const isPublished = status === 'published';

    await prisma.product.update({
        where: { id },
        data: {
            isPublished
        }
    });

    revalidateTag('products');
    revalidateTag('featured-products');
    revalidatePath('/admin/products');
}

export async function deleteAdminProduct(id: string) {
    await prisma.product.delete({
        where: { id }
    });

    revalidateTag('products');
    revalidateTag('featured-products');
    revalidateTag('categories');
    revalidatePath('/admin/products');
}

export async function getAdminProduct(id: string): Promise<AdminProduct | null> {
    const p = await prisma.product.findUnique({
        where: { id },
        include: {
            images: { orderBy: { sortOrder: 'asc' } },
            variants: true,
            categories: { include: { category: true } }
        }
    });

    if (!p) return null;

    const primaryCat = p.categories[0]?.category;

    return {
        id: p.id,
        slug: p.slug,
        titleAr: p.titleAr,
        titleEn: p.titleEn,
        descriptionAr: p.descAr || undefined,
        descriptionEn: p.descEn || undefined,
        price: p.variants.length > 0 ? Number(p.variants[0].priceQar) : 0,
        compareAtPrice: undefined,
        category: primaryCat?.slug || '',
        categorySlug: primaryCat?.slug || 'uncategorized',
        images: p.images.map(img => img.url),
        status: p.isPublished ? 'published' : 'draft',
        variants: p.variants.map(v => ({
            id: v.id,
            size: v.size,
            cut: v.cut,
            color: v.color,
            sku: v.sku,
            stock: v.stock,
            price: Number(v.priceQar)
        })),
        isCustom: p.isCustom,
        isMadeToOrder: p.madeToOrder,
        isBestSeller: p.isBestSeller,
        fabric: p.fabric || undefined,
        color: p.color || undefined,
        leadTimeDays: p.leadTimeDays || undefined,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
    } as AdminProduct;
}

export async function createAdminProduct(data: Partial<AdminProduct>) {
    const {
        titleAr, titleEn, slug, descriptionAr, descriptionEn,
        status, isCustom, isMadeToOrder, leadTimeDays, isBestSeller, fabric, color,
        images = [], variants = [], category
    } = data;

    const catRecord = await findCategoryBySlug(category || '');
    const fallbackPrice = data.price || 0;

    await prisma.product.create({
        data: {
            titleAr: titleAr || '',
            titleEn: titleEn || '',
            slug: slug || `product-${Date.now()}`,
            descAr: descriptionAr || '',
            descEn: descriptionEn || '',
            isPublished: status === 'published',
            isCustom: isCustom || false,
            madeToOrder: isMadeToOrder || false,
            leadTimeDays: leadTimeDays || 0,
            isBestSeller: isBestSeller || false,
            fabric: fabric || null,
            color: color || null,
            ...(catRecord ? {
                categories: {
                    create: {
                        category: { connect: { id: catRecord.id } }
                    }
                }
            } : {}),
            images: {
                create: images.map((url, idx) => ({
                    url,
                    sortOrder: idx
                }))
            },
            variants: {
                create: variants.map(v => ({
                    sku: v.sku || `SKU-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                    size: v.size || 'Standard',
                    color: v.color || 'Default',
                    stock: v.stock || 0,
                    priceQar: v.price != null && v.price > 0 ? v.price : fallbackPrice,
                    priceSar: v.price != null && v.price > 0 ? v.price : fallbackPrice,
                }))
            }
        }
    });

    revalidateTag('products');
    revalidateTag('featured-products');
    revalidatePath('/admin/products');
}

export async function updateAdminProduct(id: string, data: Partial<AdminProduct>) {
    const {
        titleAr, titleEn, slug, descriptionAr, descriptionEn,
        status, isCustom, isMadeToOrder, leadTimeDays, isBestSeller, fabric, color,
        images = [], variants = [], category
    } = data;

    // First delete old variants and images to replace them (simplified approach)
    await prisma.productVariant.deleteMany({ where: { productId: id } });
    await prisma.productImage.deleteMany({ where: { productId: id } });
    await prisma.productCategory.deleteMany({ where: { productId: id } });

    const catRecord = await findCategoryBySlug(category || '');

    // Use top-level price as authoritative fallback for variants without their own price
    const fallbackPrice = data.price || 0;

    await prisma.product.update({
        where: { id },
        data: {
            titleAr: titleAr,
            titleEn: titleEn,
            slug: slug,
            descAr: descriptionAr,
            descEn: descriptionEn,
            isPublished: status === 'published',
            isCustom: isCustom,
            madeToOrder: isMadeToOrder,
            leadTimeDays: leadTimeDays,
            isBestSeller: isBestSeller ?? false,
            fabric: fabric || null,
            color: color || null,
            ...(catRecord ? {
                categories: {
                    create: {
                        category: { connect: { id: catRecord.id } }
                    }
                }
            } : {}),
            images: {
                create: images.map((url, idx) => ({
                    url,
                    sortOrder: idx
                }))
            },
            variants: {
                create: variants.map(v => ({
                    sku: v.sku || `SKU-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                    size: v.size || 'Standard',
                    color: v.color || 'Default',
                    stock: v.stock || 0,
                    priceQar: v.price != null && v.price > 0 ? v.price : fallbackPrice,
                    priceSar: v.price != null && v.price > 0 ? v.price : fallbackPrice,
                }))
            }
        }
    });

    revalidateTag('products');
    revalidateTag('featured-products');
    revalidateTag(`product:${id}`);
    revalidateTag('categories');
    revalidatePath('/admin/products');
    revalidatePath(`/admin/products/${id}`);
}

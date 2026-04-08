'use server';

import prisma from '@/lib/db';
import { ProductStatus, AdminProduct } from '@/lib/stores/adminProducts';
import { revalidatePath } from 'next/cache';

// Mapping of Arabic category name → stable slug + English name
const CATEGORY_MAP: Record<string, { slug: string; nameEn: string }> = {
    'يومي': { slug: 'daily', nameEn: 'Daily' },
    'سهرة': { slug: 'evening', nameEn: 'Evening' },
    'مجموعة الشتاء': { slug: 'winter-collection', nameEn: 'Winter Collection' },
    'اكسسوارات': { slug: 'accessories', nameEn: 'Accessories' },
};

async function findOrCreateCategory(nameAr: string) {
    const meta = CATEGORY_MAP[nameAr] || { slug: nameAr.toLowerCase().replace(/\s+/g, '-'), nameEn: nameAr };
    return prisma.category.upsert({
        where: { slug: meta.slug },
        update: {},
        create: { nameAr, nameEn: meta.nameEn, slug: meta.slug },
    });
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
            category: primaryCat?.nameAr || primaryCat?.nameEn || 'يومي',
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

    revalidatePath('/admin/products');
    revalidatePath('/[locale]/products', 'layout');
}

export async function deleteAdminProduct(id: string) {
    await prisma.product.delete({
        where: { id }
    });

    revalidatePath('/admin/products');
    revalidatePath('/[locale]/products', 'layout');
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
        category: primaryCat?.nameAr || primaryCat?.nameEn || 'يومي',
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
        status, isCustom, isMadeToOrder, leadTimeDays,
        images = [], variants = [], category
    } = data;

    const catRecord = await findOrCreateCategory(category || 'يومي');

    const priceQar = (variants.length > 0 && variants[0].price != null && variants[0].price > 0)
        ? variants[0].price
        : (data.price || 0);

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
            categories: {
                create: {
                    category: { connect: { id: catRecord.id } }
                }
            },
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
                    priceQar: v.price || priceQar || 0,
                    priceSar: v.price || priceQar || 0
                }))
            }
        }
    });

    revalidatePath('/admin/products');
    revalidatePath('/[locale]/products', 'layout');
}

export async function updateAdminProduct(id: string, data: Partial<AdminProduct>) {
    const {
        titleAr, titleEn, slug, descriptionAr, descriptionEn,
        status, isCustom, isMadeToOrder, leadTimeDays,
        images = [], variants = [], category
    } = data;

    // First delete old variants and images to replace them (simplified approach)
    await prisma.productVariant.deleteMany({ where: { productId: id } });
    await prisma.productImage.deleteMany({ where: { productId: id } });
    await prisma.productCategory.deleteMany({ where: { productId: id } });

    const catRecord = await findOrCreateCategory(category || 'يومي');

    const priceQar = (variants.length > 0 && variants[0].price != null && variants[0].price > 0)
        ? variants[0].price
        : (data.price || 0);

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
            categories: {
                create: {
                    category: { connect: { id: catRecord.id } }
                }
            },
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
                    priceQar: v.price || priceQar || 0,
                    priceSar: v.price || priceQar || 0
                }))
            }
        }
    });

    revalidatePath('/admin/products');
    revalidatePath(`/admin/products/${id}`);
    revalidatePath('/[locale]/products', 'layout');
}

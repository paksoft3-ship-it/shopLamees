'use server';

import prisma from '@/lib/db';
import { revalidatePath, revalidateTag } from 'next/cache';

export interface AdminCategory {
  id: string;
  nameAr: string;
  nameEn: string;
  slug: string;
  sortOrder: number;
  image: string | null;
  products: number;
  createdAt: string;
}

function mapCategory(cat: {
  id: string;
  nameAr: string;
  nameEn: string;
  slug: string;
  sortOrder: number;
  image: string | null;
  createdAt: Date;
  _count: { products: number };
}): AdminCategory {
  return {
    id: cat.id,
    nameAr: cat.nameAr,
    nameEn: cat.nameEn,
    slug: cat.slug,
    sortOrder: cat.sortOrder,
    image: cat.image,
    products: cat._count.products,
    createdAt: cat.createdAt.toISOString(),
  };
}

export async function getAdminCategories(): Promise<AdminCategory[]> {
  const categories = await prisma.category.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
  });

  return categories.map(mapCategory);
}

export async function createAdminCategory(data: {
  nameAr: string;
  nameEn: string;
  slug: string;
  sortOrder: number;
  image?: string;
}): Promise<{ error?: string }> {
  const nameAr = data.nameAr.trim();
  const nameEn = data.nameEn.trim();
  const slug = data.slug.trim();

  const existing = await prisma.category.findFirst({
    where: {
      OR: [
        { nameAr: { equals: nameAr, mode: 'insensitive' } },
        { nameEn: { equals: nameEn, mode: 'insensitive' } },
        { slug: { equals: slug, mode: 'insensitive' } },
      ],
    },
    select: { nameAr: true, nameEn: true, slug: true },
  });

  if (existing) {
    if (existing.nameAr.toLowerCase() === nameAr.toLowerCase()) {
      return { error: `A category with Arabic name "${existing.nameAr}" already exists.` };
    }
    if (existing.nameEn.toLowerCase() === nameEn.toLowerCase()) {
      return { error: `A category with English name "${existing.nameEn}" already exists.` };
    }
    return { error: `A category with slug "${existing.slug}" already exists.` };
  }

  await prisma.category.create({
    data: { nameAr, nameEn, slug, sortOrder: data.sortOrder, image: data.image?.trim() || null },
  });

  revalidateTag('categories');
  revalidatePath('/admin/categories');
  return {};
}

export async function updateAdminCategory(
  id: string,
  data: {
    nameAr: string;
    nameEn: string;
    slug: string;
    sortOrder: number;
    image?: string;
  }
): Promise<{ error?: string }> {
  const nameAr = data.nameAr.trim();
  const nameEn = data.nameEn.trim();
  const slug = data.slug.trim();

  const conflict = await prisma.category.findFirst({
    where: {
      id: { not: id },
      OR: [
        { nameAr: { equals: nameAr, mode: 'insensitive' } },
        { nameEn: { equals: nameEn, mode: 'insensitive' } },
        { slug: { equals: slug, mode: 'insensitive' } },
      ],
    },
    select: { nameAr: true, nameEn: true, slug: true },
  });

  if (conflict) {
    if (conflict.nameAr.toLowerCase() === nameAr.toLowerCase()) {
      return { error: `Another category with Arabic name "${conflict.nameAr}" already exists.` };
    }
    if (conflict.nameEn.toLowerCase() === nameEn.toLowerCase()) {
      return { error: `Another category with English name "${conflict.nameEn}" already exists.` };
    }
    return { error: `Another category with slug "${conflict.slug}" already exists.` };
  }

  await prisma.category.update({
    where: { id },
    data: {
      nameAr: data.nameAr.trim(),
      nameEn: data.nameEn.trim(),
      slug: data.slug.trim(),
      sortOrder: data.sortOrder,
      image: data.image?.trim() || null,
    },
  });

  revalidateTag('categories');
  revalidateTag(`category:${data.slug}`);
  revalidatePath('/admin/categories');
  return {};
}

export async function deleteAdminCategory(id: string) {
  await prisma.category.delete({ where: { id } });
  revalidateTag('categories');
  revalidatePath('/admin/categories');
}

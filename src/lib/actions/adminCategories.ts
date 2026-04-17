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
}) {
  await prisma.category.create({
    data: {
      nameAr: data.nameAr.trim(),
      nameEn: data.nameEn.trim(),
      slug: data.slug.trim(),
      sortOrder: data.sortOrder,
      image: data.image?.trim() || null,
    },
  });

  revalidateTag('categories');
  revalidatePath('/admin/categories');
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
) {
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
}

export async function deleteAdminCategory(id: string) {
  await prisma.category.delete({ where: { id } });
  revalidateTag('categories');
  revalidatePath('/admin/categories');
}

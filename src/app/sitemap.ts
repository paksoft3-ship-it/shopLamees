import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/db';
import { getLocalizedPath, getSiteUrl } from '@/lib/site';

const staticPaths = [
  '',
  'latest',
  'category/all',
  'cart',
  'search',
  'privacy-policy',
  'terms',
  'return-policy',
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const now = new Date();

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.category.findMany({
      select: { slug: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  const locales: Array<'ar' | 'en'> = ['ar', 'en'];
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of staticPaths) {
      const url = `${siteUrl}${getLocalizedPath(locale, path)}`;
      entries.push({
        url,
        lastModified: now,
        changeFrequency: path === '' ? 'daily' : 'weekly',
        priority: path === '' ? 1 : 0.7,
      });
    }

    for (const category of categories) {
      entries.push({
        url: `${siteUrl}${getLocalizedPath(locale, `category/${category.slug}`)}`,
        lastModified: category.createdAt,
        changeFrequency: 'weekly',
        priority: 0.75,
      });
    }

    for (const product of products) {
      entries.push({
        url: `${siteUrl}${getLocalizedPath(locale, `product/${product.slug}`)}`,
        lastModified: product.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
  }

  return entries;
}

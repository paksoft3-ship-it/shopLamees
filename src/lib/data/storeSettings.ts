import { prisma } from '@/lib/db';
import { HomeVideoItem, normalizeHomeVideos } from '@/lib/homeVideos';
import { unstable_cache } from 'next/cache';

export async function getStoreStats() {
  return unstable_cache(
    async () => {
      const [productCount, orderCount, ratingAgg] = await Promise.all([
        prisma.product.count({ where: { isPublished: true } }),
        prisma.order.count(),
        prisma.product.aggregate({
          _avg: { rating: true },
          where: { isPublished: true, rating: { gt: 0 } },
        }),
      ]);
      const avgRating = ratingAgg._avg.rating
        ? Number(Number(ratingAgg._avg.rating).toFixed(1))
        : 4.9;
      return { productCount, orderCount, avgRating };
    },
    ['store-stats'],
    { revalidate: 3600, tags: ['products', 'orders'] }
  )();
}

export async function getStoreContact() {
  return unstable_cache(
    async () => {
      const settings = await prisma.storeSettings.upsert({
        where: { id: 1 },
        update: {},
        create: { id: 1 },
        select: { whatsappNumber: true, storeName: true },
      });
      return { phone: settings.whatsappNumber, storeName: settings.storeName };
    },
    ['store-contact'],
    { revalidate: 3600, tags: ['store-settings'] }
  )();
}

export async function getHomeVideosFromSettings(): Promise<HomeVideoItem[]> {
  return unstable_cache(
    async () => {
      const settings = await prisma.storeSettings.upsert({
        where: { id: 1 },
        update: {},
        create: { id: 1 },
        select: { homeVideosJson: true },
      });

      let raw: unknown = [];
      try {
        raw = JSON.parse(settings.homeVideosJson || '[]');
      } catch {
        raw = [];
      }

      return normalizeHomeVideos(raw);
    },
    ['store-home-videos'],
    { revalidate: 300, tags: ['home-videos'] }
  )();
}

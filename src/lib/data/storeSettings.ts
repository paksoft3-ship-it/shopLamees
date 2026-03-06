import { prisma } from '@/lib/db';
import { HomeVideoItem, normalizeHomeVideos } from '@/lib/homeVideos';
import { unstable_cache } from 'next/cache';

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

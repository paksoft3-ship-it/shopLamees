export type HomeVideoItem = {
  src: string;
  poster: string;
  label: string;
  enabled: boolean;
  sortOrder: number;
};

export function buildDefaultHomeVideos(): HomeVideoItem[] {
  return Array.from({ length: 12 }, (_, index) => {
    const n = index + 1;
    return {
      src: `/videos/video-${n}.mp4`,
      poster: `/videos/posters/video-${n}.jpg`,
      label: '',
      enabled: true,
      sortOrder: n,
    };
  });
}

export function normalizeHomeVideos(input: unknown): HomeVideoItem[] {
  if (!Array.isArray(input)) return buildDefaultHomeVideos();

  const normalized = input
    .map((item, index) => {
      const row = (item || {}) as Partial<HomeVideoItem>;
      return {
        src: typeof row.src === 'string' ? row.src.trim() : '',
        poster: typeof row.poster === 'string' ? row.poster.trim() : '',
        label: typeof row.label === 'string' ? row.label.trim() : '',
        enabled: typeof row.enabled === 'boolean' ? row.enabled : true,
        sortOrder: typeof row.sortOrder === 'number' ? row.sortOrder : index + 1,
      };
    })
    .filter((item) => item.src.length > 0)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return normalized.length > 0 ? normalized : buildDefaultHomeVideos();
}

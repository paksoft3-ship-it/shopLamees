export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv && /^https?:\/\//.test(fromEnv)) {
    return fromEnv.replace(/\/+$/, '');
  }
  return 'https://shop-lamees.com';
}

export function getLocalizedPath(locale: 'ar' | 'en', path: string = ''): string {
  const normalized = path.replace(/^\/+/, '');
  if (!normalized) return locale === 'ar' ? '/' : '/en';
  return locale === 'ar' ? `/${normalized}` : `/en/${normalized}`;
}

export function getLocalizedUrl(locale: 'ar' | 'en', path: string = ''): string {
  return `${getSiteUrl()}${getLocalizedPath(locale, path)}`;
}

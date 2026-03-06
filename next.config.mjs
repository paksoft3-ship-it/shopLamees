import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
            },
            {
                protocol: 'https',
                hostname: 'cdn.salla.sa',
            },
        ],
    },
    experimental: {
        optimizePackageImports: ['lucide-react'],
    },
    async headers() {
        return [
            {
                source: '/robots.txt',
                headers: [{ key: 'Cache-Control', value: 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400' }],
            },
            {
                source: '/sitemap.xml',
                headers: [{ key: 'Cache-Control', value: 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400' }],
            },
            {
                source: '/llms.txt',
                headers: [{ key: 'Cache-Control', value: 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400' }],
            },
            {
                source: '/llms-full.txt',
                headers: [{ key: 'Cache-Control', value: 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400' }],
            },
        ];
    },
};

export default withNextIntl(nextConfig);

'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ArrowRight, Play } from 'lucide-react';
import { useRef, useState } from 'react';

const videos = [
    {
        src: '/videos/video-3.mp4',
        poster: '/videos/posters/video-3.jpg',
        labelKey: 'video_detail',
    },
    {
        src: '/videos/video-4.mp4',
        poster: '/videos/posters/video-4.jpg',
        labelKey: 'video_collection',
    },
    {
        src: '/videos/video-5.mp4',
        poster: '/videos/posters/video-5.jpg',
        labelKey: 'video_style',
    },
];

function VideoCard({ src, poster, label }: { src: string; poster: string; label: string }) {
    const ref = useRef<HTMLVideoElement>(null);
    const [playing, setPlaying] = useState(false);

    const handlePlay = () => {
        if (!playing) {
            ref.current?.play();
            setPlaying(true);
        } else {
            ref.current?.pause();
            setPlaying(false);
        }
    };

    return (
        <div className="relative rounded-2xl overflow-hidden aspect-video group cursor-pointer border border-border shadow-soft" onClick={handlePlay}>
            <video
                ref={ref}
                src={src}
                poster={poster}
                loop
                muted
                playsInline
                preload="none"
                className="w-full h-full object-cover"
            />
            {/* Overlay */}
            <div className={`absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity duration-300 ${playing ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
                <div className="w-14 h-14 rounded-full bg-surface/80 backdrop-blur flex items-center justify-center border border-border/50 shadow-card">
                    <Play className="w-6 h-6 text-on-surface fill-on-surface" />
                </div>
            </div>
            {/* Label */}
            <div className="absolute bottom-4 ltr:left-4 rtl:right-4 bg-surface/80 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold text-on-surface border border-border/30">
                {label}
            </div>
        </div>
    );
}

export function VideoShowcase() {
    const t = useTranslations('Home.VideoShowcase');

    return (
        <section className="py-16 lg:py-24 bg-surface border-y border-border">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <h2 className="text-3xl font-bold font-display text-on-surface mb-2">{t('title')}</h2>
                        <p className="text-subtle">{t('subtitle')}</p>
                    </div>
                    <Link href="/category/all" className="hidden sm:flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
                        {t('shop_now')}
                        <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {videos.map((v) => (
                        <VideoCard key={v.src} src={v.src} poster={v.poster} label={t(v.labelKey)} />
                    ))}
                </div>
            </div>
        </section>
    );
}

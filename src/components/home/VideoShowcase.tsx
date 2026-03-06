'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ArrowRight, Play, Pause } from 'lucide-react';
import { useRef, useState } from 'react';
import { HomeVideoItem, normalizeHomeVideos } from '@/lib/homeVideos';

function VideoCard({ src, poster, label }: { src: string; poster: string; label: string }) {
    const ref = useRef<HTMLVideoElement>(null);
    const [playing, setPlaying] = useState(false);

    const handleClick = () => {
        if (!playing) {
            ref.current?.play();
            setPlaying(true);
        } else {
            ref.current?.pause();
            setPlaying(false);
        }
    };

    return (
        <div
            className="relative rounded-2xl overflow-hidden aspect-[9/16] group cursor-pointer border border-border shadow-soft bg-black"
            onClick={handleClick}
        >
            <video
                ref={ref}
                src={src}
                poster={poster}
                loop
                muted
                playsInline
                preload="metadata"
                className="w-full h-full object-cover"
            />

            {/* Overlay */}
            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300
                ${playing ? 'bg-black/0 opacity-0 group-hover:opacity-100 group-hover:bg-black/20' : 'bg-black/30'}`}
            >
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-lg transition-transform duration-200 group-hover:scale-110">
                    {playing
                        ? <Pause className="w-7 h-7 text-white fill-white" />
                        : <Play className="w-7 h-7 text-white fill-white translate-x-0.5" />
                    }
                </div>
            </div>

            {/* Label */}
            <div className="absolute bottom-4 ltr:left-4 rtl:right-4 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full text-white text-xs font-semibold border border-white/20">
                {label}
            </div>
        </div>
    );
}

export function VideoShowcase({ videos = [] }: { videos?: HomeVideoItem[] }) {
    const t = useTranslations('Home.VideoShowcase');
    const configuredVideos = normalizeHomeVideos(videos).filter((item) => item.enabled);
    const visibleVideos = configuredVideos.length > 0 ? configuredVideos : normalizeHomeVideos([]);
    const fallbackLabels = [t('video_collection'), t('video_style'), t('video_detail')];

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

                {/* 3-column portrait grid — 9:16 cards match the video format exactly */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {visibleVideos.map((video, index) => (
                        <VideoCard
                            key={`${video.src}-${index}`}
                            src={video.src}
                            poster={video.poster}
                            label={video.label || fallbackLabels[index % fallbackLabels.length]}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';

export function Hero() {
    const t = useTranslations('Home.Hero');
    const locale = useLocale();
    const isRtl = locale === 'ar';

    return (
        <section className="relative overflow-hidden w-full min-h-[480px] sm:min-h-[520px] lg:min-h-[580px]">

            {/* Mobile image */}
            <Image
                alt="Hero Abaya"
                src={isRtl ? '/images/modest_hero_banner_mobile_reversed.png' : '/images/modest_hero_banner_mobile.png'}
                fill
                sizes="100vw"
                className="object-cover object-center md:hidden"
                priority
            />
            {/* Desktop image */}
            <Image
                alt="Hero Abaya"
                src={isRtl ? '/images/modest_hero_banner_wide_reversed.png' : '/images/modest_hero_banner_wide.png'}
                fill
                sizes="100vw"
                className="object-cover object-center hidden md:block"
                priority
            />

            {/* Mobile overlay — dark center + blurred left/right edges */}
            <div className="md:hidden absolute inset-0 z-10 bg-black/50" />
            <div className="md:hidden absolute inset-y-0 left-0 w-16 z-10 backdrop-blur-sm bg-black/20" />
            <div className="md:hidden absolute inset-y-0 right-0 w-16 z-10 backdrop-blur-sm bg-black/20" />

            {/* Desktop gradient overlay — flips direction for RTL */}
            <div className={`hidden md:block absolute inset-0 z-10 ${isRtl ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-black/88 via-black/60 to-black/10`} />

            {/* Content */}
            <div className={`absolute inset-y-0 z-20 flex items-center ${isRtl ? 'right-0' : 'left-0'}`}>
                <div className="w-[90vw] max-w-[520px] lg:max-w-[560px] px-6 sm:px-10 lg:px-16 xl:px-20 py-14">

                    {/* Heading */}
                    <h1 className="font-display text-[2.6rem] sm:text-5xl lg:text-[3.4rem] font-black text-white leading-[1.1] mb-4">
                        {t('title_1')}<br />
                        {t('title_2')}
                    </h1>

                    {/* Description */}
                    <p className="text-[#b0a99f] text-sm sm:text-base leading-relaxed mb-7 max-w-[380px]">
                        {t('description')}
                    </p>

                    {/* Buttons */}
                    <div className="flex items-center gap-3 mb-10 flex-wrap">
                        <Link
                            href="/category/all"
                            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-[#e8ddd0] text-[#1a1a1a] font-bold text-sm hover:bg-[#f0e8dc] transition-colors"
                        >
                            {t('shop_now')}
                            <span className="text-[15px] leading-none">↗</span>
                        </Link>
                        <Link
                            href="/latest"
                            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white font-bold text-sm hover:bg-white/15 transition-colors"
                        >
                            {t('latest_products')}
                        </Link>
                    </div>

                    {/* Stats card */}
                    <div className="inline-flex items-center gap-0 bg-white/10 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm">
                        <div className="flex flex-col items-center gap-1 px-5 py-3.5">
                            <span className="material-symbols-outlined text-[#b0a99f] text-[18px]">group</span>
                            <p className="text-white font-black text-base leading-none">5k+</p>
                            <p className="text-[#b0a99f] text-[11px] whitespace-nowrap">{t('stats_customers')}</p>
                        </div>
                        <div className="w-px self-stretch bg-white/10" />
                        <div className="flex flex-col items-center gap-1 px-5 py-3.5">
                            <span className="material-symbols-outlined text-[#b0a99f] text-[18px]">description</span>
                            <p className="text-white font-black text-base leading-none">200+</p>
                            <p className="text-[#b0a99f] text-[11px] whitespace-nowrap">{t('stats_models')}</p>
                        </div>
                        <div className="w-px self-stretch bg-white/10" />
                        <div className="flex flex-col items-center gap-1 px-5 py-3.5">
                            <span className="material-symbols-outlined text-[#b0a99f] text-[18px]">star</span>
                            <p className="text-white font-black text-base leading-none">4.9</p>
                            <p className="text-[#b0a99f] text-[11px] whitespace-nowrap">{t('stats_rating')}</p>
                        </div>
                    </div>

                </div>
            </div>

        </section>
    );
}

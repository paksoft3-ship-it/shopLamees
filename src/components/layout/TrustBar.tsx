import { useTranslations } from 'next-intl';

export function TrustBar() {
    const t = useTranslations('Home.Layout.TrustBar');

    return (
        <div className="bg-[#111] text-white text-xs py-2 overflow-hidden relative flex">
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes scroll-left {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .scrolling-text {
                    animation: scroll-left 15s linear infinite;
                    white-space: nowrap;
                }
            `}} />
            <div className="scrolling-text w-full flex justify-center items-center gap-8">
                <span>{t('free_delivery')}</span>
                <span>•</span>
                <span>{t('free_returns')}</span>
                <span>•</span>
                <span>{t('free_delivery')}</span>
            </div>
        </div>
    );
}

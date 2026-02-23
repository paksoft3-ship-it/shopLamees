import { useTranslations } from 'next-intl';
import { BadgeCheck, Tag, HeadphonesIcon } from 'lucide-react';

export function ValueProps() {
    const t = useTranslations('Home.ValueProps');

    return (
        <section className="py-16 bg-surface border-y border-border">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-background-light">
                        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-4">
                            <BadgeCheck className="w-8 h-8" />
                        </div>
                        <h3 className="font-display font-bold text-xl mb-2 text-on-surface">{t('quality_title')}</h3>
                        <p className="text-subtle">{t('quality_desc')}</p>
                    </div>
                    <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-background-light">
                        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-4">
                            <Tag className="w-8 h-8" />
                        </div>
                        <h3 className="font-display font-bold text-xl mb-2 text-on-surface">{t('price_title')}</h3>
                        <p className="text-subtle">{t('price_desc')}</p>
                    </div>
                    <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-background-light">
                        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-4">
                            <HeadphonesIcon className="w-8 h-8" />
                        </div>
                        <h3 className="font-display font-bold text-xl mb-2 text-on-surface">{t('support_title')}</h3>
                        <p className="text-subtle">{t('support_desc')}</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

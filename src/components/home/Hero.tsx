import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ArrowRight, BadgeCheck } from 'lucide-react';

export function Hero() {
    const t = useTranslations('Home.Hero');
    const locale = useLocale() as 'ar' | 'en';

    return (
        <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-background-light">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20">
                    <div className="flex-1 text-start space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                            <BadgeCheck className="w-4 h-4" />
                            <span>{t('badge')}</span>
                        </div>
                        <h1 className="font-display text-4xl lg:text-6xl font-black text-on-surface leading-[1.2]">
                            {t('title_1')} <br />
                            <span className="text-subtle">{t('title_2')}</span>
                        </h1>
                        <p className="text-lg text-subtle max-w-lg leading-relaxed">
                            {t('description')}
                        </p>
                        <div className="flex flex-wrap gap-4 pt-4">
                            <Link href="/category/all" className="bg-primary hover:bg-primary-dark text-on-surface px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 flex items-center gap-2 shadow-soft hover:shadow-card">
                                <span>{t('shop_now')}</span>
                                <ArrowRight className="w-5 h-5 rtl:rotate-180" />
                            </Link>
                            <Link href="/latest" className="bg-surface border border-border text-on-surface px-8 py-4 rounded-full font-bold text-lg transition-colors hover:bg-background-light">
                                {t('latest_products')}
                            </Link>
                        </div>
                        <div className="flex items-center gap-8 pt-8 border-t border-border mt-8">
                            <div>
                                <p className="text-2xl font-bold font-display text-on-surface">5k+</p>
                                <p className="text-sm text-subtle">{t('stats_customers')}</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold font-display text-on-surface">200+</p>
                                <p className="text-sm text-subtle">{t('stats_models')}</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold font-display text-on-surface">4.9</p>
                                <p className="text-sm text-subtle">{t('stats_rating')}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 w-full relative">
                        <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-card xl:aspect-[4/5] aspect-[3/4] group border border-border">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-20"></div>
                            <img alt="Hero Abaya" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgmJDFoc56IuOXchDZHsDjni4lu7ViXZzwRC75YuiivHIzXdESyXxCWo5KH_FZC9I99uyZvWn1Qt2lJyxHximisLicSWAupa2Q6PUCxImrNQcksQ1f__N7lYOs2pEg601fIWwh_nJcGRaau-95AqXKqd_pSqLsq8vNPPuVQXHa7CjjvtXQacQX63zVZv9T1X-pGhEKPsBqod7y8M8aiXN6zb6lwLR7U8CXpLOEwpKNLeO30BNTfTTL0lVeR2zLIvLZBYjryxoEsMM" />
                            <div className="absolute bottom-6 rtl:right-6 ltr:left-6 z-30 bg-surface/90 backdrop-blur p-4 rounded-2xl shadow-soft max-w-[200px] border border-border/50">
                                <p className="text-xs text-subtle mb-1">{t('bestseller')}</p>
                                <p className="font-bold text-on-surface text-sm">{t('abaya_name')}</p>
                                <p className="text-primary font-bold mt-1">
                                    {new Intl.NumberFormat(locale === 'ar' ? 'ar-QA' : 'en-QA', { style: 'currency', currency: 'QAR', maximumFractionDigits: 0 }).format(450)}
                                </p>
                            </div>
                        </div>
                        <div className="absolute -top-10 rtl:-right-10 ltr:-left-10 w-full h-full border-2 border-primary/20 rounded-[3rem] -z-0 hidden lg:block"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}

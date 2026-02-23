import { useTranslations } from 'next-intl';

export function Newsletter() {
    const t = useTranslations('Home.Newsletter');

    return (
        <section className="relative py-20 bg-on-surface overflow-hidden">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%23f4c025\\' fill-opacity=\\'1\\'%3E%3Cpath d=\\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }}></div>
            <div className="container mx-auto px-4 relative z-10 text-center">
                <h2 className="font-display text-3xl lg:text-4xl font-bold text-surface mb-4">{t('title')}</h2>
                <p className="text-surface/80 mb-8 max-w-lg mx-auto">{t('subtitle')}</p>
                <form className="flex flex-col sm:flex-row justify-center max-w-md mx-auto gap-3">
                    <input className="bg-surface/10 backdrop-blur border border-surface/20 text-surface placeholder-surface/50 rounded-full py-3 px-6 w-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary rtl:text-right ltr:text-left" placeholder={t('placeholder')} type="email" />
                    <button className="bg-primary text-on-surface font-bold py-3 px-8 rounded-full hover:bg-primary-dark transition-colors whitespace-nowrap" type="button">{t('subscribe')}</button>
                </form>
            </div>
        </section>
    );
}

import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';

export default async function ReturnPolicyPage({ params: { locale } }: { params: { locale: string } }) {
    const t = await getTranslations('Policy');
    const isAr = locale === 'ar';

    const page = await prisma.page.findUnique({
        where: { slug: '/return-policy' }
    });

    if (!page) {
        return notFound();
    }

    const content = isAr ? page.contentAr : page.contentEn;

    return (
        <section className="bg-[#FBF7F2] min-h-screen">
            <div className="w-full max-w-[1280px] mx-auto px-4 md:px-10 py-8">

                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm mb-8 font-kufi text-slate-500">
                    <Link href="/" className="hover:text-primary transition-colors">{t('home')}</Link>
                    <span className="material-symbols-outlined text-[16px] text-slate-400 rtl:rotate-180">chevron_right</span>
                    <span className="text-slate-900 font-medium">{t('return_title')}</span>
                </nav>

                {/* Page Header */}
                <header className="mb-12 border-b border-slate-200 pb-8">
                    <h1 className="text-3xl md:text-4xl font-bold font-kufi text-slate-900 mb-3">{isAr ? page.titleAr : page.titleEn}</h1>
                    <div className="flex items-center gap-2 text-slate-500">
                        <span className="material-symbols-outlined text-[18px]">update</span>
                        <span className="text-sm">{t('last_updated')}: {new Date(page.updatedAt).toLocaleDateString(isAr ? 'ar-QA' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
                    {/* Main Content */}
                    <div className="lg:col-span-9 flex flex-col gap-8">

                        <div className="bg-white rounded-xl p-6 md:p-10 shadow-sm border border-slate-100">
                            <div className="text-lg leading-loose text-slate-700 whitespace-pre-wrap font-kufi">
                                {content}
                            </div>
                        </div>

                        {/* Contact Box */}
                        <div className="bg-white border border-slate-100 rounded-xl p-6 text-center shadow-sm">
                            <p className="font-bold text-lg mb-2 font-kufi">{isAr ? 'هل لديك استفسار آخر؟' : 'Have a question?'}</p>
                            <p className="text-slate-500 text-sm mb-4">{isAr ? 'فريق خدمة العملاء جاهز لمساعدتك عبر الواتساب' : 'Our team is ready to help via WhatsApp'}</p>
                            <a
                                href="https://wa.me/97433114232"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-full font-bold hover:bg-[#20bd5a] transition-colors font-kufi"
                            >
                                <span className="material-symbols-outlined text-xl">chat</span>
                                {isAr ? 'تواصل معنا الآن' : 'Contact Us Now'}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

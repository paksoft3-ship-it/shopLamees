'use client';

import { useTranslations, useLocale } from 'next-intl';

export function CustomizationSection() {
    const t = useTranslations('Home.Customization');
    const locale = useLocale() as 'ar' | 'en';
    const whatsappNumber = '97433114232';
    const whatsappMsg = locale === 'ar'
        ? 'مرحباً، أريد الاستفسار عن خدمة التفصيل والتخصيص'
        : 'Hello, I would like to inquire about your customization service';

    const steps = [
        { icon: 'chat', title: t('step1_title'), desc: t('step1_desc') },
        { icon: 'straighten', title: t('step2_title'), desc: t('step2_desc') },
        { icon: 'local_shipping', title: t('step3_title'), desc: t('step3_desc') },
    ];

    return (
        <section className="py-12 lg:py-16 bg-white border-y border-[#e8dfcf]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-primary/15 text-[#8a6a00] px-3 py-1 rounded-full text-xs font-bold font-kufi mb-2">
                            <span className="material-symbols-outlined text-[14px]">design_services</span>
                            {locale === 'ar' ? 'خدمة حصرية' : 'Exclusive Service'}
                        </div>
                        <h2 className="text-2xl font-bold font-kufi text-[#0e1b12]">{t('title')}</h2>
                        <p className="text-[#5c4a35] font-kufi text-sm mt-1 leading-relaxed max-w-md">{t('subtitle')}</p>
                    </div>
                    <a
                        href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMsg)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-[#0e1b12] text-white font-bold font-kufi px-5 py-3 rounded-full hover:bg-primary hover:text-[#0e1b12] transition-colors text-sm whitespace-nowrap self-start sm:self-center"
                    >
                        <span className="material-symbols-outlined text-[18px]">chat</span>
                        {t('cta')}
                    </a>
                </div>

                {/* Steps */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    {steps.map((step, i) => (
                        <div key={i} className="flex items-start gap-4 bg-[#FBF7F2] rounded-xl p-4 border border-[#e8dfcf]">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-primary text-[20px]">{step.icon}</span>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-[#C5A059] font-kufi uppercase tracking-wide mb-0.5">
                                    {locale === 'ar' ? `الخطوة ${i + 1}` : `Step ${i + 1}`}
                                </p>
                                <h3 className="text-[#0e1b12] font-bold font-kufi text-sm mb-1">{step.title}</h3>
                                <p className="text-[#6b5742] font-kufi text-xs leading-relaxed">{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Notice */}
                <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                    <span className="material-symbols-outlined text-amber-500 text-[18px] shrink-0 mt-0.5">info</span>
                    <p className="text-amber-800 font-kufi text-xs leading-relaxed">{t('non_refundable_notice')}</p>
                </div>

            </div>
        </section>
    );
}

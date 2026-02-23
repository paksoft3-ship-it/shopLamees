'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function ReturnPolicyPage() {
    const t = useTranslations('Policy');
    const locale = useLocale() as 'ar' | 'en';
    const isAr = locale === 'ar';

    const sections = [
        { id: 'conditions', icon: 'check_circle', label: isAr ? 'شروط الاسترجاع' : 'Return Conditions' },
        { id: 'timeframe', icon: 'schedule', label: isAr ? 'المدة الزمنية' : 'Timeframe' },
        { id: 'method', icon: 'ads_click', label: isAr ? 'طريقة الاسترجاع' : 'Return Method' },
        { id: 'fees', icon: 'local_shipping', label: isAr ? 'رسوم الشحن' : 'Shipping Fees' },
    ];

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
                    <h1 className="text-3xl md:text-4xl font-bold font-kufi text-slate-900 mb-3">{t('return_title')}</h1>
                    <div className="flex items-center gap-2 text-slate-500">
                        <span className="material-symbols-outlined text-[18px]">update</span>
                        <span className="text-sm">{t('last_updated')}: {isAr ? '٢٤ يناير ٢٠٢٦' : 'January 24, 2026'}</span>
                    </div>
                </header>

                {/* Layout Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">

                    {/* Sidebar Navigation (Desktop) */}
                    <aside className="hidden lg:block lg:col-span-3">
                        <div className="sticky top-24 bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
                            <h3 className="font-kufi font-bold text-lg mb-4 text-slate-900 px-2">{t('nav_title')}</h3>
                            <nav className="flex flex-col gap-1 font-kufi">
                                {sections.map((s, i) => (
                                    <a
                                        key={s.id}
                                        href={`#${s.id}`}
                                        className={`flex items-center justify-between p-3 rounded-lg transition-all ${i === 0 ? 'bg-primary/10 text-primary font-bold border-s-4 border-primary' : 'text-slate-700 hover:bg-slate-50 hover:text-primary border-s-4 border-transparent'}`}
                                    >
                                        <span>{s.label}</span>
                                        <span className="material-symbols-outlined text-[18px] rtl:rotate-180">chevron_right</span>
                                    </a>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* Mobile Section Dropdown */}
                    <div className="lg:hidden sticky top-16 z-40 bg-[#FBF7F2]/95 backdrop-blur px-1 py-3 border-b border-slate-200 mb-2">
                        <select className="appearance-none w-full bg-white text-slate-900 font-bold text-sm rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 border border-slate-200">
                            <option disabled selected>{isAr ? 'انتقل إلى قسم...' : 'Jump to section...'}</option>
                            {sections.map((s) => (
                                <option key={s.id} value={s.id}>{s.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-9 flex flex-col gap-8">

                        {/* Intro */}
                        <div className="bg-white rounded-xl p-6 md:p-10 shadow-sm border border-slate-100">
                            <p className="text-lg leading-loose text-slate-600">
                                {isAr
                                    ? <>في <strong className="text-slate-900">شوب لاميس</strong>، نسعى لتقديم تجربة تسوق مميزة تليق بكم. نحن نتفهم أنه قد يتغير رأيك أحيانًا، أو قد لا يكون المنتج مناسبًا تمامًا. لذلك قمنا بتسهيل عملية الاسترجاع والاستبدال لتكون مرنة وواضحة.</>
                                    : <>At <strong className="text-slate-900">Shop Lamees</strong>, we strive to provide a shopping experience worthy of you. We understand that you may sometimes change your mind, or a product may not be the perfect fit. That&apos;s why we&apos;ve made our return and exchange process flexible and transparent.</>
                                }
                            </p>
                        </div>

                        {/* Callout: Important Exception */}
                        <div className="bg-amber-50 border-s-4 border-primary rounded-xl p-6 flex gap-4 items-start shadow-sm">
                            <span className="material-symbols-outlined text-primary text-[28px] mt-1 shrink-0">warning</span>
                            <div>
                                <h4 className="font-kufi font-bold text-slate-900 text-lg mb-2">{isAr ? 'تنبيه هام' : 'Important Notice'}</h4>
                                <p className="text-slate-600 leading-relaxed">
                                    {isAr
                                        ? <>حرصاً على صحتكم وسلامتكم، ونظراً لطبيعة الاستخدام الشخصي، <span className="font-bold text-amber-700">لا يمكن استرجاع أو استبدال النقاب والطرح</span> بعد فتح غلافها الأصلي لأسباب صحية، إلا في حالة وجود عيب مصنعي واضح.</>
                                        : <>For health and safety reasons, due to the personal nature of these items, <span className="font-bold text-amber-700">niqabs and scarves cannot be returned or exchanged</span> once the original packaging is opened, unless there is a clear manufacturing defect.</>
                                    }
                                </p>
                            </div>
                        </div>

                        {/* Section: Conditions */}
                        <section className="scroll-mt-24" id="conditions">
                            <h2 className="text-2xl font-kufi font-bold text-slate-900 mb-6 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary">
                                    <span className="material-symbols-outlined text-[20px]">check_circle</span>
                                </span>
                                {isAr ? 'شروط الاسترجاع' : 'Return Conditions'}
                            </h2>
                            <div className="bg-white rounded-xl p-6 md:p-10 shadow-sm border border-slate-100">
                                <ul className="space-y-4 text-slate-600 list-disc list-inside marker:text-primary">
                                    <li>
                                        {isAr ? 'أن يكون المنتج بحالته الأصلية ولم يتم استخدامه، وعليه كافة البطاقات والملصقات غير منزوعة.' : 'The product must be in its original condition, unused, with all tags and labels intact.'}
                                    </li>
                                    <li>
                                        {isAr ? 'يجب أن يكون المنتج في عبوته الأصلية وبكامل ملحقاته.' : 'The product must be in its original packaging with all accessories.'}
                                    </li>
                                    <li>
                                        {isAr ? 'إرفاق الفاتورة الأصلية أو رقم الطلب لتسهيل عملية التحقق.' : 'Include the original invoice or order number for verification.'}
                                    </li>
                                    <li>
                                        {isAr ? 'المنتجات التي تم تعديلها بناءً على طلب العميل (مثل تقصير الطول) غير قابلة للاسترجاع إلا في حال وجود عيب مصنعي.' : 'Custom-altered products (e.g. shortened length) cannot be returned unless there is a manufacturing defect.'}
                                    </li>
                                </ul>
                            </div>
                        </section>

                        {/* Section: Timeframe */}
                        <section className="scroll-mt-24" id="timeframe">
                            <h2 className="text-2xl font-kufi font-bold text-slate-900 mb-6 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary">
                                    <span className="material-symbols-outlined text-[20px]">schedule</span>
                                </span>
                                {isAr ? 'المدة الزمنية' : 'Timeframe'}
                            </h2>
                            <div className="bg-white rounded-xl p-6 md:p-10 shadow-sm border border-slate-100 grid md:grid-cols-2 gap-6">
                                <div className="bg-[#FBF7F2] p-6 rounded-xl border border-slate-100 text-center">
                                    <span className="material-symbols-outlined text-4xl text-primary mb-4">cached</span>
                                    <h3 className="font-bold text-lg mb-2 font-kufi">{isAr ? 'الاستبدال' : 'Exchange'}</h3>
                                    <p className="text-slate-600">{isAr ? <>خلال <span className="font-bold text-slate-900">٧ أيام</span> من تاريخ استلام الطلب.</> : <>Within <span className="font-bold text-slate-900">7 days</span> of receiving the order.</>}</p>
                                </div>
                                <div className="bg-[#FBF7F2] p-6 rounded-xl border border-slate-100 text-center">
                                    <span className="material-symbols-outlined text-4xl text-primary mb-4">keyboard_return</span>
                                    <h3 className="font-bold text-lg mb-2 font-kufi">{isAr ? 'الاسترجاع' : 'Return'}</h3>
                                    <p className="text-slate-600">{isAr ? <>خلال <span className="font-bold text-slate-900">٣ أيام</span> من تاريخ استلام الطلب.</> : <>Within <span className="font-bold text-slate-900">3 days</span> of receiving the order.</>}</p>
                                </div>
                            </div>
                        </section>

                        {/* Section: Method */}
                        <section className="scroll-mt-24" id="method">
                            <h2 className="text-2xl font-kufi font-bold text-slate-900 mb-6 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary">
                                    <span className="material-symbols-outlined text-[20px]">ads_click</span>
                                </span>
                                {isAr ? 'طريقة الاسترجاع' : 'Return Method'}
                            </h2>
                            <div className="bg-white rounded-xl p-6 md:p-10 shadow-sm border border-slate-100">
                                <ol className="relative border-s border-slate-200 ms-4 space-y-10">
                                    {[
                                        { title: isAr ? 'تقديم الطلب' : 'Submit Request', desc: isAr ? 'قم بتسجيل الدخول إلى حسابك، وانتقل إلى قسم "طلباتي"، ثم اختر الطلب واضغط على "طلب استرجاع".' : 'Log in to your account, go to "My Orders," select the order, and click "Request Return."' },
                                        { title: isAr ? 'تجهيز الشحنة' : 'Prepare Shipment', desc: isAr ? 'قم بتغليف المنتج في عبوته الأصلية. سنرسل لك بوليصة الشحن عبر البريد الإلكتروني.' : 'Pack the product in its original packaging. We will send you a shipping label via email.' },
                                        { title: isAr ? 'تسليم الشحنة' : 'Ship It Back', desc: isAr ? 'سلم الشحنة لأقرب فرع لشركة الشحن. بمجرد وصول الشحنة وفحصها، سيتم إعادة المبلغ خلال ٥-١٤ يوم عمل.' : 'Drop off the package at the nearest shipping branch. Once received and inspected, a refund will be issued within 5-14 business days.' },
                                    ].map((step, i) => (
                                        <li key={i} className="ms-6">
                                            <span className={`absolute flex items-center justify-center w-8 h-8 rounded-full -ms-4 ring-4 ring-white font-bold font-display text-sm ${i === 0 ? 'bg-primary text-white' : 'bg-white border-2 border-primary text-primary'}`}>
                                                {i + 1}
                                            </span>
                                            <h3 className="text-lg font-bold text-slate-900 ms-4 mb-1">{step.title}</h3>
                                            <p className="text-slate-500 ms-4">{step.desc}</p>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        </section>

                        {/* Section: Fees Table */}
                        <section className="scroll-mt-24" id="fees">
                            <h2 className="text-2xl font-kufi font-bold text-slate-900 mb-6 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary">
                                    <span className="material-symbols-outlined text-[20px]">local_shipping</span>
                                </span>
                                {isAr ? 'رسوم الشحن للاسترجاع' : 'Return Shipping Fees'}
                            </h2>
                            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-start text-slate-600 min-w-[500px]">
                                        <thead className="bg-[#FBF7F2] text-slate-900 border-b border-slate-100 text-sm">
                                            <tr>
                                                <th className="px-6 py-4 font-bold font-kufi">{isAr ? 'المنطقة' : 'Region'}</th>
                                                <th className="px-6 py-4 font-bold font-kufi">{isAr ? 'رسوم الاسترجاع' : 'Return Fee'}</th>
                                                <th className="px-6 py-4 font-bold font-kufi">{isAr ? 'ملاحظات' : 'Notes'}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            <tr className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-slate-900">{isAr ? 'قطر' : 'Qatar'}</td>
                                                <td className="px-6 py-4 text-primary font-bold">{isAr ? '٢٥ ر.ق' : '25 QAR'}</td>
                                                <td className="px-6 py-4 text-sm">{isAr ? 'تخصم من المبلغ المسترد' : 'Deducted from refund'}</td>
                                            </tr>
                                            <tr className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-slate-900">{isAr ? 'دول الخليج' : 'GCC Countries'}</td>
                                                <td className="px-6 py-4 text-primary font-bold">{isAr ? '٥٠ ر.ق' : '50 QAR'}</td>
                                                <td className="px-6 py-4 text-sm">{isAr ? 'تخصم من المبلغ المسترد + رسوم الجمارك إن وجدت' : 'Deducted from refund + customs if applicable'}</td>
                                            </tr>
                                            <tr className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-slate-900">{isAr ? 'عيوب مصنعية' : 'Manufacturing Defects'}</td>
                                                <td className="px-6 py-4 text-green-600 font-bold">{isAr ? 'مجاناً' : 'Free'}</td>
                                                <td className="px-6 py-4 text-sm">{isAr ? 'نتحمل كافة التكاليف' : 'We cover all costs'}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </section>

                        {/* Contact Box */}
                        <div className="bg-white border border-slate-100 rounded-xl p-6 text-center shadow-sm">
                            <p className="font-bold text-lg mb-2 font-kufi">{isAr ? 'هل لديك استفسار آخر؟' : 'Have a question?'}</p>
                            <p className="text-slate-500 text-sm mb-4">{isAr ? 'فريق خدمة العملاء جاهز لمساعدتك عبر الواتساب' : 'Our team is ready to help via WhatsApp'}</p>
                            <a
                                href="https://wa.me/97477808007"
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

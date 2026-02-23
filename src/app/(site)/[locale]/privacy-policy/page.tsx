'use client';

import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function PrivacyPolicyPage() {
    const locale = useLocale() as 'ar' | 'en';
    const isAr = locale === 'ar';

    const sections = [
        { id: 'collection', icon: 'database', label: isAr ? 'جمع المعلومات' : 'Information Collection' },
        { id: 'usage', icon: 'analytics', label: isAr ? 'استخدام المعلومات' : 'Information Use' },
        { id: 'sharing', icon: 'share', label: isAr ? 'مشاركة المعلومات' : 'Information Sharing' },
        { id: 'security', icon: 'shield', label: isAr ? 'أمان البيانات' : 'Data Security' },
        { id: 'rights', icon: 'gavel', label: isAr ? 'حقوقك' : 'Your Rights' },
    ];

    return (
        <section className="bg-[#FBF7F2] min-h-screen">
            <div className="w-full max-w-[1280px] mx-auto px-4 md:px-10 py-8">
                <nav className="flex items-center gap-2 text-sm mb-8 font-kufi text-slate-500">
                    <Link href="/" className="hover:text-primary transition-colors">{isAr ? 'الرئيسية' : 'Home'}</Link>
                    <span className="material-symbols-outlined text-[16px] text-slate-400 rtl:rotate-180">chevron_right</span>
                    <span className="text-slate-900 font-medium">{isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}</span>
                </nav>

                <header className="mb-12 border-b border-slate-200 pb-8">
                    <h1 className="text-3xl md:text-4xl font-bold font-kufi text-slate-900 mb-3">{isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}</h1>
                    <div className="flex items-center gap-2 text-slate-500">
                        <span className="material-symbols-outlined text-[18px]">update</span>
                        <span className="text-sm">{isAr ? 'آخر تحديث: ٢٤ يناير ٢٠٢٦' : 'Last updated: January 24, 2026'}</span>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
                    <aside className="hidden lg:block lg:col-span-3">
                        <div className="sticky top-24 bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
                            <h3 className="font-kufi font-bold text-lg mb-4 text-slate-900 px-2">{isAr ? 'قائمة التنقل' : 'Navigation'}</h3>
                            <nav className="flex flex-col gap-1 font-kufi">
                                {sections.map((s, i) => (
                                    <a key={s.id} href={`#${s.id}`} className={`flex items-center justify-between p-3 rounded-lg transition-all ${i === 0 ? 'bg-primary/10 text-primary font-bold border-s-4 border-primary' : 'text-slate-700 hover:bg-slate-50 hover:text-primary border-s-4 border-transparent'}`}>
                                        <span>{s.label}</span>
                                    </a>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    <div className="lg:col-span-9 flex flex-col gap-8">
                        <div className="bg-white rounded-xl p-6 md:p-10 shadow-sm border border-slate-100">
                            <p className="text-lg leading-loose text-slate-600">
                                {isAr ? <>نحن في <strong className="text-slate-900">شوب لاميس</strong> نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية. توضح هذه السياسة كيفية جمع واستخدام ومشاركة معلوماتك عند استخدام موقعنا وخدماتنا.</> : <>At <strong className="text-slate-900">Shop Lamees</strong>, we respect your privacy and are committed to protecting your personal data. This policy explains how we collect, use, and share your information when you use our website and services.</>}
                            </p>
                        </div>

                        <section className="scroll-mt-24" id="collection">
                            <h2 className="text-2xl font-kufi font-bold text-slate-900 mb-6 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary"><span className="material-symbols-outlined text-[20px]">database</span></span>
                                {isAr ? 'المعلومات التي نجمعها' : 'Information We Collect'}
                            </h2>
                            <div className="bg-white rounded-xl p-6 md:p-10 shadow-sm border border-slate-100">
                                <ul className="space-y-4 text-slate-600 list-disc list-inside marker:text-primary">
                                    <li>{isAr ? 'المعلومات الشخصية: الاسم، البريد الإلكتروني، رقم الهاتف، العنوان.' : 'Personal info: name, email, phone, address.'}</li>
                                    <li>{isAr ? 'معلومات الدفع: بيانات البطاقة المشفرة عبر بوابات دفع آمنة.' : 'Payment info: encrypted card details via secure payment gateways.'}</li>
                                    <li>{isAr ? 'بيانات التصفح: الصفحات التي تزورها، المنتجات التي تشاهدها.' : 'Browsing data: pages visited, products viewed.'}</li>
                                    <li>{isAr ? 'معلومات الجهاز: نوع المتصفح، نظام التشغيل، عنوان IP.' : 'Device info: browser, OS, IP address.'}</li>
                                </ul>
                            </div>
                        </section>

                        <section className="scroll-mt-24" id="usage">
                            <h2 className="text-2xl font-kufi font-bold text-slate-900 mb-6 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary"><span className="material-symbols-outlined text-[20px]">analytics</span></span>
                                {isAr ? 'كيف نستخدم معلوماتك' : 'How We Use Your Info'}
                            </h2>
                            <div className="bg-white rounded-xl p-6 md:p-10 shadow-sm border border-slate-100">
                                <ul className="space-y-4 text-slate-600 list-disc list-inside marker:text-primary">
                                    <li>{isAr ? 'معالجة وإتمام الطلبات وتوصيلها.' : 'Process and fulfill orders.'}</li>
                                    <li>{isAr ? 'تحسين تجربة التسوق وتخصيص المحتوى.' : 'Improve shopping experience and personalize content.'}</li>
                                    <li>{isAr ? 'إرسال تحديثات عن الطلبات والعروض (بموافقتك).' : 'Send order updates and promotions (with your consent).'}</li>
                                    <li>{isAr ? 'الامتثال للمتطلبات القانونية.' : 'Comply with legal requirements.'}</li>
                                </ul>
                            </div>
                        </section>

                        <section className="scroll-mt-24" id="sharing">
                            <h2 className="text-2xl font-kufi font-bold text-slate-900 mb-6 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary"><span className="material-symbols-outlined text-[20px]">share</span></span>
                                {isAr ? 'مشاركة المعلومات' : 'Information Sharing'}
                            </h2>
                            <div className="bg-white rounded-xl p-6 md:p-10 shadow-sm border border-slate-100">
                                <p className="text-slate-600 leading-relaxed">
                                    {isAr ? 'لا نبيع أو نشارك بياناتك مع أطراف ثالثة إلا في الحالات التالية: شركات الشحن لتوصيل طلبك، بوابات الدفع لمعالجة المدفوعات، أو عند الطلب القانوني من الجهات المختصة.' : 'We do not sell or share your data with third parties except for: shipping companies to deliver your order, payment gateways to process payments, or when legally required by authorities.'}
                                </p>
                            </div>
                        </section>

                        <section className="scroll-mt-24" id="security">
                            <h2 className="text-2xl font-kufi font-bold text-slate-900 mb-6 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary"><span className="material-symbols-outlined text-[20px]">shield</span></span>
                                {isAr ? 'أمان البيانات' : 'Data Security'}
                            </h2>
                            <div className="bg-white rounded-xl p-6 md:p-10 shadow-sm border border-slate-100">
                                <p className="text-slate-600 leading-relaxed">
                                    {isAr ? 'نستخدم تقنيات تشفير متقدمة (SSL) لحماية بياناتك أثناء النقل والتخزين. كما نلتزم بأعلى معايير أمان بيانات الدفع (PCI DSS).' : 'We use advanced SSL encryption to protect your data in transit and at rest. We comply with the highest payment data security standards (PCI DSS).'}
                                </p>
                            </div>
                        </section>

                        <section className="scroll-mt-24" id="rights">
                            <h2 className="text-2xl font-kufi font-bold text-slate-900 mb-6 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary"><span className="material-symbols-outlined text-[20px]">gavel</span></span>
                                {isAr ? 'حقوقك' : 'Your Rights'}
                            </h2>
                            <div className="bg-white rounded-xl p-6 md:p-10 shadow-sm border border-slate-100">
                                <ul className="space-y-4 text-slate-600 list-disc list-inside marker:text-primary">
                                    <li>{isAr ? 'طلب الاطلاع على بياناتك الشخصية المحفوظة لدينا.' : 'Request access to your personal data.'}</li>
                                    <li>{isAr ? 'طلب تصحيح أو تحديث بياناتك.' : 'Request correction or update of your data.'}</li>
                                    <li>{isAr ? 'طلب حذف بياناتك (حق النسيان).' : 'Request deletion of your data (right to be forgotten).'}</li>
                                    <li>{isAr ? 'إلغاء الاشتراك في النشرات الترويجية في أي وقت.' : 'Unsubscribe from promotional emails anytime.'}</li>
                                </ul>
                            </div>
                        </section>

                        <div className="bg-white border border-slate-100 rounded-xl p-6 text-center shadow-sm">
                            <p className="font-bold text-lg mb-2 font-kufi">{isAr ? 'هل لديك استفسار؟' : 'Have a question?'}</p>
                            <p className="text-slate-500 text-sm mb-4">{isAr ? 'تواصل معنا عبر الواتساب' : 'Contact us via WhatsApp'}</p>
                            <a href="https://wa.me/97477808007" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-full font-bold hover:bg-[#20bd5a] transition-colors font-kufi">
                                <span className="material-symbols-outlined text-xl">chat</span>
                                {isAr ? 'تواصل معنا' : 'Contact Us'}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

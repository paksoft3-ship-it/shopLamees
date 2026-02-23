'use client';

import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function TermsPage() {
    const locale = useLocale() as 'ar' | 'en';
    const isAr = locale === 'ar';

    const sections = [
        { id: 'general', icon: 'description', label: isAr ? 'أحكام عامة' : 'General Terms' },
        { id: 'orders', icon: 'shopping_cart', label: isAr ? 'الطلبات والدفع' : 'Orders & Payment' },
        { id: 'shipping', icon: 'local_shipping', label: isAr ? 'الشحن والتوصيل' : 'Shipping & Delivery' },
        { id: 'ip', icon: 'copyright', label: isAr ? 'الملكية الفكرية' : 'Intellectual Property' },
        { id: 'liability', icon: 'gavel', label: isAr ? 'حدود المسؤولية' : 'Liability' },
    ];

    return (
        <section className="bg-[#FBF7F2] min-h-screen">
            <div className="w-full max-w-[1280px] mx-auto px-4 md:px-10 py-8">
                <nav className="flex items-center gap-2 text-sm mb-8 font-kufi text-slate-500">
                    <Link href="/" className="hover:text-primary transition-colors">{isAr ? 'الرئيسية' : 'Home'}</Link>
                    <span className="material-symbols-outlined text-[16px] text-slate-400 rtl:rotate-180">chevron_right</span>
                    <span className="text-slate-900 font-medium">{isAr ? 'الشروط والأحكام' : 'Terms & Conditions'}</span>
                </nav>

                <header className="mb-12 border-b border-slate-200 pb-8">
                    <h1 className="text-3xl md:text-4xl font-bold font-kufi text-slate-900 mb-3">{isAr ? 'الشروط والأحكام' : 'Terms & Conditions'}</h1>
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
                                {isAr ? <>باستخدامك لموقع <strong className="text-slate-900">شوب لاميس</strong> فإنك توافق على الالتزام بالشروط والأحكام التالية. يرجى قراءتها بعناية قبل إجراء أي عملية شراء.</> : <>By using the <strong className="text-slate-900">Shop Lamees</strong> website, you agree to the following terms and conditions. Please read them carefully before making any purchase.</>}
                            </p>
                        </div>

                        <section className="scroll-mt-24" id="general">
                            <h2 className="text-2xl font-kufi font-bold text-slate-900 mb-6 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary"><span className="material-symbols-outlined text-[20px]">description</span></span>
                                {isAr ? 'أحكام عامة' : 'General Terms'}
                            </h2>
                            <div className="bg-white rounded-xl p-6 md:p-10 shadow-sm border border-slate-100">
                                <ul className="space-y-4 text-slate-600 list-disc list-inside marker:text-primary">
                                    <li>{isAr ? 'يحق لنا تعديل هذه الشروط في أي وقت. التعديلات تكون سارية فور نشرها على الموقع.' : 'We reserve the right to modify these terms at any time. Changes are effective immediately upon posting.'}</li>
                                    <li>{isAr ? 'يجب أن يكون عمر المستخدم ١٨ عاماً أو أكثر لإجراء عملية شراء.' : 'Users must be 18 years or older to make a purchase.'}</li>
                                    <li>{isAr ? 'جميع الأسعار المعروضة شاملة لضريبة القيمة المضافة ما لم يذكر خلاف ذلك.' : 'All prices include VAT unless stated otherwise.'}</li>
                                </ul>
                            </div>
                        </section>

                        <section className="scroll-mt-24" id="orders">
                            <h2 className="text-2xl font-kufi font-bold text-slate-900 mb-6 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary"><span className="material-symbols-outlined text-[20px]">shopping_cart</span></span>
                                {isAr ? 'الطلبات والدفع' : 'Orders & Payment'}
                            </h2>
                            <div className="bg-white rounded-xl p-6 md:p-10 shadow-sm border border-slate-100">
                                <ul className="space-y-4 text-slate-600 list-disc list-inside marker:text-primary">
                                    <li>{isAr ? 'إتمام الطلب يعتبر موافقة على الشراء بالسعر المحدد.' : 'Completing an order constitutes agreement to purchase at the listed price.'}</li>
                                    <li>{isAr ? 'نقبل الدفع عبر البطاقات الائتمانية، مدى، Apple Pay، والدفع عند الاستلام في مناطق محددة.' : 'We accept credit cards, Mada, Apple Pay, and cash on delivery in select areas.'}</li>
                                    <li>{isAr ? 'يحق لنا رفض أو إلغاء أي طلب في حالة عدم توفر المنتج أو وجود خطأ في التسعير.' : 'We reserve the right to cancel orders if a product is unavailable or a pricing error occurs.'}</li>
                                    <li>{isAr ? 'ستتلقى تأكيداً بالبريد الإلكتروني عند إتمام الطلب بنجاح.' : 'You will receive an email confirmation upon successful order placement.'}</li>
                                </ul>
                            </div>
                        </section>

                        <section className="scroll-mt-24" id="shipping">
                            <h2 className="text-2xl font-kufi font-bold text-slate-900 mb-6 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary"><span className="material-symbols-outlined text-[20px]">local_shipping</span></span>
                                {isAr ? 'الشحن والتوصيل' : 'Shipping & Delivery'}
                            </h2>
                            <div className="bg-white rounded-xl p-6 md:p-10 shadow-sm border border-slate-100">
                                <ul className="space-y-4 text-slate-600 list-disc list-inside marker:text-primary">
                                    <li>{isAr ? 'مدة التوصيل المتوقعة من ٣ إلى ٧ أيام عمل حسب الموقع.' : 'Expected delivery time is 3-7 business days depending on location.'}</li>
                                    <li>{isAr ? 'نحن غير مسؤولين عن التأخيرات الناتجة عن شركات الشحن أو الجمارك.' : 'We are not responsible for delays caused by shipping companies or customs.'}</li>
                                    <li>{isAr ? 'يجب التأكد من صحة عنوان التوصيل. أي خطأ في العنوان قد يؤدي لتأخير أو رسوم إضافية.' : 'Ensure your delivery address is correct. Errors may cause delays or extra charges.'}</li>
                                </ul>
                            </div>
                        </section>

                        <section className="scroll-mt-24" id="ip">
                            <h2 className="text-2xl font-kufi font-bold text-slate-900 mb-6 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary"><span className="material-symbols-outlined text-[20px]">copyright</span></span>
                                {isAr ? 'الملكية الفكرية' : 'Intellectual Property'}
                            </h2>
                            <div className="bg-white rounded-xl p-6 md:p-10 shadow-sm border border-slate-100">
                                <p className="text-slate-600 leading-relaxed">
                                    {isAr ? 'جميع المحتويات على الموقع من نصوص وصور وتصاميم وشعارات وعلامات تجارية هي ملك لشوب لاميس ومحمية بموجب قوانين الملكية الفكرية. يمنع نسخها أو استخدامها دون إذن كتابي مسبق.' : 'All content on this website including text, images, designs, logos, and trademarks are the property of Shop Lamees and are protected by intellectual property laws. Copying or using them without prior written permission is prohibited.'}
                                </p>
                            </div>
                        </section>

                        <section className="scroll-mt-24" id="liability">
                            <h2 className="text-2xl font-kufi font-bold text-slate-900 mb-6 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary"><span className="material-symbols-outlined text-[20px]">gavel</span></span>
                                {isAr ? 'حدود المسؤولية' : 'Limitation of Liability'}
                            </h2>
                            <div className="bg-white rounded-xl p-6 md:p-10 shadow-sm border border-slate-100">
                                <ul className="space-y-4 text-slate-600 list-disc list-inside marker:text-primary">
                                    <li>{isAr ? 'لا نتحمل المسؤولية عن أي أضرار غير مباشرة ناتجة عن استخدام الموقع.' : 'We are not liable for any indirect damages arising from the use of this website.'}</li>
                                    <li>{isAr ? 'قد تختلف ألوان المنتجات الفعلية قليلاً عن الصور المعروضة بسبب إعدادات الشاشة.' : 'Actual product colors may vary slightly from displayed images due to screen settings.'}</li>
                                    <li>{isAr ? 'نحتفظ بالحق في تعديل أو إيقاف أي خدمة أو منتج دون إشعار مسبق.' : 'We reserve the right to modify or discontinue any service or product without prior notice.'}</li>
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

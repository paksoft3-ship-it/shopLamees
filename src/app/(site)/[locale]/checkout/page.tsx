'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useCartStore } from '@/lib/stores/cart';
import { usePrefsStore } from '@/lib/stores/prefs';
import { formatPrice } from '@/lib/utils/price';
import { trackEvent } from '@/lib/tracking/track';
import { useEffect } from 'react';

type Step = 'info' | 'address' | 'shipping' | 'payment';
const STEPS: Step[] = ['info', 'address', 'shipping', 'payment'];

export default function CheckoutPage() {
    const t = useTranslations('Checkout');
    const locale = useLocale() as 'ar' | 'en';
    const { items } = useCartStore();
    const { currency } = usePrefsStore();
    const [currentStep, setCurrentStep] = useState<Step>('address');
    const [paymentMethod, setPaymentMethod] = useState('apple_pay');
    const [coupon, setCoupon] = useState('');

    useEffect(() => {
        if (items.length > 0) {
            trackEvent('begin_checkout', {
                currency,
                value: subtotal,
                items: items.map(item => ({
                    item_id: item.variantId,
                    item_name: item.name,
                    price: item.price,
                    quantity: item.quantity
                }))
            });
        }
    }, []);

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const vat = Math.round(subtotal * 0.05);
    const total = subtotal + vat;
    // const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

    const stepIndex = STEPS.indexOf(currentStep);

    const stepLabels: Record<Step, string> = {
        info: t('step_info'),
        address: t('step_address'),
        shipping: t('step_shipping'),
        payment: t('step_payment'),
    };

    const goNext = () => {
        const idx = STEPS.indexOf(currentStep);
        if (idx < STEPS.length - 1) setCurrentStep(STEPS[idx + 1]);
    };
    const goBack = () => {
        const idx = STEPS.indexOf(currentStep);
        if (idx > 0) setCurrentStep(STEPS[idx - 1]);
    };

    // If cart is empty, show message
    if (items.length === 0) {
        return (
            <section className="bg-[#FBF7F2] min-h-screen flex items-center justify-center">
                <div className="text-center max-w-sm mx-auto px-4">
                    <span className="material-symbols-outlined text-6xl text-slate-200 mb-4">shopping_cart</span>
                    <h2 className="text-xl font-bold text-slate-900 font-kufi mb-2">{t('empty_cart')}</h2>
                    <p className="text-sm text-slate-500 font-kufi mb-6">{t('empty_cart_hint')}</p>
                    <Link href="/" className="bg-slate-900 text-white font-bold py-3 px-10 rounded-full hover:bg-slate-800 transition-all font-kufi">
                        {t('back_shopping')}
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-[#f6f6f8] min-h-screen">
            {/* Minimal Checkout Header */}
            <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-center">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-3xl">shopping_bag</span>
                        <h1 className="text-xl font-bold tracking-tight font-display uppercase">
                            {locale === 'ar' ? 'شوب لاميس' : 'Shop Lamees'}
                        </h1>
                    </div>
                </div>
            </header>

            <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative">

                    {/* ORDER SUMMARY SIDEBAR */}
                    <aside className="w-full lg:w-[380px] lg:flex-shrink-0 order-1 lg:order-1 h-fit lg:sticky lg:top-24">
                        <div className="bg-[#FBF7F2] rounded-xl p-6 shadow-sm border border-slate-100">
                            <h2 className="text-lg font-bold mb-6 font-kufi">{t('order_summary')}</h2>

                            {/* Cart Items */}
                            <div className="space-y-4 mb-6">
                                {items.map((item) => (
                                    <div key={item.variantId} className="flex gap-4">
                                        <div className="w-20 h-24 bg-slate-200 rounded-lg overflow-hidden flex-shrink-0 relative">
                                            {item.image && (
                                                <img alt={item.name} className="w-full h-full object-cover" src={item.image} />
                                            )}
                                            <span className="absolute top-0 ltr:left-0 rtl:right-0 bg-primary text-white text-xs px-1.5 py-0.5 ltr:rounded-br-lg rtl:rounded-bl-lg font-display">
                                                {item.quantity}
                                            </span>
                                        </div>
                                        <div className="flex flex-col justify-between py-1">
                                            <div>
                                                <h3 className="font-medium text-sm leading-tight mb-1">{item.name}</h3>
                                                {item.size && (
                                                    <p className="text-xs text-slate-500">
                                                        {locale === 'ar' ? 'المقاس: ' : 'Size: '}{item.size}
                                                    </p>
                                                )}
                                            </div>
                                            <p className="font-bold text-sm font-display">
                                                {formatPrice(item.price * item.quantity, currency, locale)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="h-px w-full bg-slate-200 my-4" />

                            {/* Costs */}
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between text-slate-600">
                                    <span>{t('subtotal')}</span>
                                    <span className="font-display font-medium">{formatPrice(subtotal, currency, locale)}</span>
                                </div>
                                <div className="flex justify-between text-slate-600">
                                    <span>{t('vat')}</span>
                                    <span className="font-display font-medium">{formatPrice(vat, currency, locale)}</span>
                                </div>
                                <div className="flex justify-between text-slate-600">
                                    <span>{t('shipping')}</span>
                                    <span className="text-xs text-primary font-bold bg-primary/10 px-2 py-0.5 rounded">{t('shipping_next')}</span>
                                </div>
                            </div>

                            <div className="h-px w-full bg-slate-200 my-4" />

                            {/* Total */}
                            <div className="flex justify-between items-end mb-2">
                                <span className="font-bold text-lg">{t('total')}</span>
                                <div className="text-end">
                                    <span className="text-xs text-slate-500 block">{t('inc_vat')}</span>
                                    <span className="font-bold text-2xl font-display text-primary">
                                        {formatPrice(total, currency, locale)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="mt-4 flex justify-center gap-4 opacity-60">
                            <div className="h-8 flex items-center justify-center bg-white rounded px-3 shadow-sm text-xs font-bold font-display tracking-widest text-slate-600">VISA</div>
                            <div className="h-8 flex items-center justify-center bg-white rounded px-3 shadow-sm text-xs font-bold font-display tracking-widest text-slate-600">MASTERCARD</div>
                            <div className="h-8 flex items-center justify-center bg-white rounded px-3 shadow-sm text-xs font-bold font-display tracking-widest text-slate-600">MADA</div>
                        </div>
                    </aside>

                    {/* MAIN FORM COLUMN */}
                    <div className="flex-1 order-2 lg:order-2">

                        {/* Stepper */}
                        <nav className="mb-8 overflow-x-auto pb-2">
                            <ol className="flex items-center min-w-max">
                                {STEPS.map((step, i) => (
                                    <li key={step} className="relative px-3 lg:px-6 first:ps-0">
                                        <div className="flex items-center">
                                            {i < stepIndex ? (
                                                <span className="flex items-center justify-center w-8 h-8 bg-primary rounded-full ring-4 ring-[#f6f6f8]">
                                                    <span className="material-symbols-outlined text-white text-lg">check</span>
                                                </span>
                                            ) : i === stepIndex ? (
                                                <span className="flex items-center justify-center w-8 h-8 bg-primary rounded-full ring-4 ring-[#f6f6f8] shadow-lg shadow-primary/30">
                                                    <span className="font-display text-white font-bold text-sm">{i + 1}</span>
                                                </span>
                                            ) : (
                                                <span className="flex items-center justify-center w-8 h-8 bg-white border-2 border-slate-300 rounded-full">
                                                    <span className="font-display text-slate-500 font-medium text-sm">{i + 1}</span>
                                                </span>
                                            )}
                                            <span className={`ltr:ml-3 rtl:mr-3 text-sm font-medium font-kufi ${i === stepIndex ? 'text-slate-900 font-bold' : i < stepIndex ? 'text-primary' : 'text-slate-500'}`}>
                                                {stepLabels[step]}
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </nav>

                        {/* Form Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 lg:p-10">

                            {/* Step Header */}
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold text-slate-900 font-kufi">
                                    {currentStep === 'info' && t('title_info')}
                                    {currentStep === 'address' && t('title_address')}
                                    {currentStep === 'shipping' && t('title_shipping')}
                                    {currentStep === 'payment' && t('title_payment')}
                                </h2>
                                <span className="text-sm text-slate-500">
                                    {locale === 'ar' ? `الخطوة ${stepIndex + 1} من ${STEPS.length}` : `Step ${stepIndex + 1} of ${STEPS.length}`}
                                </span>
                            </div>

                            {/* STEP: Customer Info */}
                            {currentStep === 'info' && (
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">{t('full_name')}</label>
                                        <input type="text" placeholder={locale === 'ar' ? 'الاسم الكامل' : 'Full name'} className="block w-full rounded-lg border-slate-300 py-3 px-4 text-slate-900 shadow-sm focus:border-primary focus:ring-primary sm:text-sm placeholder:text-slate-400" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">{t('phone')}</label>
                                        <input type="tel" placeholder="+974 XXXX XXXX" className="block w-full rounded-lg border-slate-300 py-3 px-4 text-slate-900 shadow-sm focus:border-primary focus:ring-primary sm:text-sm placeholder:text-slate-400" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">{t('email')} <span className="text-slate-400 font-normal">({t('optional')})</span></label>
                                        <input type="email" placeholder="email@example.com" className="block w-full rounded-lg border-slate-300 py-3 px-4 text-slate-900 shadow-sm focus:border-primary focus:ring-primary sm:text-sm placeholder:text-slate-400" />
                                    </div>
                                </div>
                            )}

                            {/* STEP: Address */}
                            {currentStep === 'address' && (
                                <div className="space-y-6">
                                    <div className="relative">
                                        <label className="block text-sm font-medium text-slate-700 mb-2">{t('country')}</label>
                                        <select className="block w-full rounded-lg border-slate-300 py-3 pr-4 pl-10 text-slate-900 shadow-sm focus:border-primary focus:ring-primary sm:text-base font-medium">
                                            <option value="QA">{locale === 'ar' ? 'قطر' : 'Qatar'}</option>
                                            <option value="SA">{locale === 'ar' ? 'المملكة العربية السعودية' : 'Saudi Arabia'}</option>
                                            <option value="AE">{locale === 'ar' ? 'الإمارات العربية المتحدة' : 'UAE'}</option>
                                            <option value="KW">{locale === 'ar' ? 'الكويت' : 'Kuwait'}</option>
                                            <option value="BH">{locale === 'ar' ? 'البحرين' : 'Bahrain'}</option>
                                            <option value="OM">{locale === 'ar' ? 'عُمان' : 'Oman'}</option>
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">{t('city')}</label>
                                            <input type="text" placeholder={locale === 'ar' ? 'مثال: الدوحة' : 'e.g. Doha'} className="block w-full rounded-lg border-slate-300 py-3 px-4 text-slate-900 shadow-sm focus:border-primary focus:ring-primary sm:text-sm placeholder:text-slate-400" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">{t('zone')}</label>
                                            <input type="text" placeholder={locale === 'ar' ? 'مثال: الدفنة' : 'e.g. Al Dafna'} className="block w-full rounded-lg border-slate-300 py-3 px-4 text-slate-900 shadow-sm focus:border-primary focus:ring-primary sm:text-sm placeholder:text-slate-400" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">{t('street')}</label>
                                        <input type="text" placeholder={locale === 'ar' ? 'اسم الشارع أو رقمه' : 'Street name or number'} className="block w-full rounded-lg border-slate-300 py-3 px-4 text-slate-900 shadow-sm focus:border-primary focus:ring-primary sm:text-sm placeholder:text-slate-400" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">{t('building')}</label>
                                            <input type="text" placeholder={locale === 'ar' ? 'رقم المبنى' : 'Building no.'} className="block w-full rounded-lg border-slate-300 py-3 px-4 text-slate-900 shadow-sm focus:border-primary focus:ring-primary sm:text-sm placeholder:text-slate-400" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">{t('unit')} <span className="text-slate-400 font-normal">({t('optional')})</span></label>
                                            <input type="text" placeholder={locale === 'ar' ? 'رقم الشقة' : 'Apt. no.'} className="block w-full rounded-lg border-slate-300 py-3 px-4 text-slate-900 shadow-sm focus:border-primary focus:ring-primary sm:text-sm placeholder:text-slate-400" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STEP: Shipping */}
                            {currentStep === 'shipping' && (
                                <div className="space-y-4">
                                    {[
                                        { id: 'standard', label: locale === 'ar' ? 'شحن عادي (5-7 أيام)' : 'Standard (5-7 days)', price: 25 },
                                        { id: 'express', label: locale === 'ar' ? 'شحن سريع (2-3 أيام)' : 'Express (2-3 days)', price: 50 },
                                    ].map((opt) => (
                                        <label key={opt.id} className="flex items-center p-4 rounded-xl border border-slate-200 hover:border-primary/30 bg-white cursor-pointer transition-all shadow-sm">
                                            <input type="radio" name="shipping" defaultChecked={opt.id === 'standard'} className="h-5 w-5 text-primary focus:ring-primary" />
                                            <div className="flex justify-between items-center w-full ltr:ml-4 rtl:mr-4">
                                                <span className="text-sm font-bold text-slate-900 font-kufi">{opt.label}</span>
                                                <span className="font-bold text-sm font-display">{formatPrice(opt.price, currency, locale)}</span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            )}

                            {/* STEP: Payment */}
                            {currentStep === 'payment' && (
                                <div className="space-y-4">
                                    {[
                                        { id: 'apple_pay', label: 'Apple Pay', sub: locale === 'ar' ? 'ادفع بأمان وسرعة' : 'Pay securely & fast', icon: 'phone_iphone' },
                                        { id: 'credit_card', label: locale === 'ar' ? 'بطاقة ائتمان' : 'Credit Card', sub: 'Visa / Mastercard', icon: 'credit_card' },
                                        { id: 'cod', label: locale === 'ar' ? 'الدفع عند الاستلام' : 'Cash on Delivery', sub: locale === 'ar' ? 'متاح في بعض المناطق' : 'Available in select areas', icon: 'payments' },
                                    ].map((opt) => (
                                        <label
                                            key={opt.id}
                                            className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all shadow-sm ${paymentMethod === opt.id ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                                        >
                                            <input type="radio" name="payment" checked={paymentMethod === opt.id} onChange={() => setPaymentMethod(opt.id)} className="sr-only" />
                                            <div className="w-12 h-8 bg-slate-100 rounded flex items-center justify-center text-slate-600 shrink-0">
                                                <span className="material-symbols-outlined">{opt.icon}</span>
                                            </div>
                                            <div className="flex flex-col grow ltr:ml-4 rtl:mr-4">
                                                <span className="text-sm font-bold text-slate-900">{opt.label}</span>
                                                <span className="text-xs text-slate-500">{opt.sub}</span>
                                            </div>
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === opt.id ? 'border-primary' : 'border-slate-300'}`}>
                                                {paymentMethod === opt.id && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                                            </div>
                                        </label>
                                    ))}

                                    {/* Coupon */}
                                    <div className="mt-6 pt-6 border-t border-slate-100">
                                        <label className="text-sm font-medium text-slate-900 mb-2 block font-kufi">{t('coupon_label')}</label>
                                        <div className="flex gap-2 h-11">
                                            <input
                                                type="text"
                                                value={coupon}
                                                onChange={(e) => setCoupon(e.target.value)}
                                                placeholder={t('coupon_placeholder')}
                                                className="flex-1 rounded-lg border-slate-200 bg-white text-sm focus:border-primary focus:ring-primary"
                                            />
                                            <button className="bg-slate-900 text-white px-4 rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors font-kufi">
                                                {t('coupon_apply')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-6 mt-8 border-t border-slate-100">
                                {stepIndex > 0 ? (
                                    <button onClick={goBack} className="text-slate-500 hover:text-slate-800 font-medium text-sm py-3 px-4 transition-colors">
                                        <span className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-lg rtl:rotate-180">arrow_back</span>
                                            {t('back')}
                                        </span>
                                    </button>
                                ) : (
                                    <Link href="/cart" className="text-slate-500 hover:text-slate-800 font-medium text-sm py-3 px-4 transition-colors">
                                        <span className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-lg rtl:rotate-180">arrow_back</span>
                                            {t('back_to_cart')}
                                        </span>
                                    </Link>
                                )}

                                {currentStep === 'payment' ? (
                                    <Link href="/checkout/confirmation" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-bold py-3.5 px-8 rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 font-kufi">
                                        {t('confirm_order')}
                                        <span className="material-symbols-outlined text-lg">check_circle</span>
                                    </Link>
                                ) : (
                                    <button onClick={goNext} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-bold py-3.5 px-8 rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 font-kufi">
                                        {t('continue')}
                                        <span className="material-symbols-outlined text-lg ltr:rotate-0 rtl:rotate-180">arrow_back</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Footer Links */}
                        <div className="mt-8 text-center text-xs text-slate-400 flex justify-center gap-6 font-kufi">
                            <a href="#" className="hover:underline">{t('privacy')}</a>
                            <a href="#" className="hover:underline">{t('terms')}</a>
                            <a href="#" className="hover:underline">{t('returns')}</a>
                        </div>
                    </div>
                </div>
            </main>
        </section>
    );
}
'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { useCartStore } from '@/lib/stores/cart';
import { usePrefsStore } from '@/lib/stores/prefs';
import { formatPrice } from '@/lib/utils/price';
import { trackEvent } from '@/lib/tracking/track';
import { createOrder } from '@/lib/actions/orders';
import Image from 'next/image';

type Step = 'info' | 'address' | 'shipping' | 'payment';
const STEPS: Step[] = ['info', 'address', 'shipping', 'payment'];
const VAT_RATE = 0.15;

export default function CheckoutPage() {
    const t = useTranslations('Checkout');
    const locale = useLocale() as 'ar' | 'en';
    const router = useRouter();
    const { items, clearCart } = useCartStore();
    const { currency } = usePrefsStore();
    const [currentStep, setCurrentStep] = useState<Step>('info');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const hasTrackedBeginCheckout = useRef(false);

    // ── Form State ──────────────────────────────────────────────────
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [country, setCountry] = useState('QA');
    const [city, setCity] = useState('');
    const [zone, setZone] = useState('');
    const [street, setStreet] = useState('');
    const [building, setBuilding] = useState('');
    const [unit, setUnit] = useState('');
    const [shippingMethod, setShippingMethod] = useState('standard');
    const [customerNote, setCustomerNote] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'EFT' | 'TAP'>('TAP');

    const shippingOptions = [
        { id: 'standard', label: locale === 'ar' ? 'شحن عادي (5-7 أيام)' : 'Standard (5-7 days)', price: 0 },
        { id: 'express', label: locale === 'ar' ? 'شحن سريع (2-3 أيام)' : 'Express (2-3 days)', price: 50 },
    ];
    const shippingFee = shippingOptions.find(o => o.id === shippingMethod)?.price ?? 0;

    const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const vat = Math.round(subtotal * VAT_RATE);
    const total = subtotal + vat + shippingFee;

    useEffect(() => {
        if (!hasTrackedBeginCheckout.current && items.length > 0) {
            hasTrackedBeginCheckout.current = true;
            trackEvent('begin_checkout', {
                currency,
                value: subtotal,
                items: items.map(item => ({
                    item_id: item.variantId,
                    item_name: item.name,
                    price: item.unitPrice,
                    quantity: item.quantity,
                })),
            });
        }
    }, [items, currency, subtotal]);

    const stepIndex = STEPS.indexOf(currentStep);
    const stepLabels: Record<Step, string> = {
        info: t('step_info'),
        address: t('step_address'),
        shipping: t('step_shipping'),
        payment: t('step_payment'),
    };

    // ── Validation ──────────────────────────────────────────────────
    const validate = (step: Step): boolean => {
        const errs: Record<string, string> = {};
        const required = locale === 'ar' ? 'هذا الحقل مطلوب' : 'This field is required';

        if (step === 'info') {
            if (!name.trim()) errs.name = required;
            if (!phone.trim()) errs.phone = required;
        }
        if (step === 'address') {
            if (!city.trim()) errs.city = required;
            if (!street.trim()) errs.street = required;
        }
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const goNext = () => {
        if (!validate(currentStep)) return;
        const idx = STEPS.indexOf(currentStep);
        if (idx < STEPS.length - 1) {
            setCurrentStep(STEPS[idx + 1]);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };
    const goBack = () => {
        setErrors({});
        const idx = STEPS.indexOf(currentStep);
        if (idx > 0) {
            setCurrentStep(STEPS[idx - 1]);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const orderPayload = () => ({
        locale,
        customerName: name,
        phone,
        email: email || undefined,
        country,
        city,
        zone: zone || undefined,
        street,
        building: building || undefined,
        unit: unit || undefined,
        shippingMethod,
        shippingFee,
        currency,
        subtotal,
        vat,
        total,
        customerNote: customerNote || undefined,
        items: items.map(item => ({
            variantId: item.variantId,
            productId: item.productId,
            name: item.name,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
            image: item.image,
            size: item.size,
            cut: item.cut,
        })),
    });

    const handleConfirm = async () => {
        if (!validate('payment')) return;
        setIsSubmitting(true);

        if (paymentMethod === 'TAP') {
            try {
                const res = await fetch('/api/payment/tap/initiate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(orderPayload()),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Payment initiation failed');
                clearCart();
                window.location.href = data.redirectUrl;
            } catch (err) {
                console.error(err);
                setErrors({ submit: locale === 'ar' ? 'فشل الاتصال بخدمة الدفع، يرجى المحاولة مجدداً' : 'Payment service error. Please try again.' });
                setIsSubmitting(false);
            }
            return;
        }

        // Bank Transfer (EFT) flow
        try {
            const { orderNumber } = await createOrder({ ...orderPayload(), paymentMethod: 'EFT' });
            trackEvent('purchase', {
                transaction_id: orderNumber,
                currency,
                value: total,
                items: items.map(item => ({
                    item_id: item.variantId,
                    item_name: item.name,
                    price: item.unitPrice,
                    quantity: item.quantity,
                })),
            });
            clearCart();
            router.push(`/checkout/confirmation?order=${orderNumber}`);
        } catch (err) {
            console.error(err);
            setErrors({ submit: locale === 'ar' ? 'حدث خطأ، يرجى المحاولة مجدداً' : 'Something went wrong. Please try again.' });
            setIsSubmitting(false);
        }
    };

    const inputCls = (field: string) =>
        `block w-full rounded-lg py-3 px-4 text-slate-900 shadow-sm sm:text-sm placeholder:text-slate-400 border ${errors[field] ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : 'border-slate-300 focus:border-primary focus:ring-primary'}`;

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
            {/* Header */}
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
                    <aside className="w-full lg:w-[380px] lg:flex-shrink-0 order-2 lg:order-1 h-fit lg:sticky lg:top-24">
                        <div className="bg-[#FBF7F2] rounded-xl p-6 shadow-sm border border-slate-100">
                            <h2 className="text-lg font-bold mb-6 font-kufi">{t('order_summary')}</h2>
                            <div className="space-y-4 mb-6">
                                {items.map((item) => (
                                    <div key={item.variantId} className="flex gap-4">
                                        <div className="w-20 h-24 bg-slate-200 rounded-lg overflow-hidden flex-shrink-0 relative">
                                            {item.image && (
                                                <Image alt={item.name} className="w-full h-full object-cover" src={item.image} fill sizes="80px" />
                                            )}
                                            <span className="absolute top-0 ltr:left-0 rtl:right-0 bg-primary text-white text-xs px-1.5 py-0.5 ltr:rounded-br-lg rtl:rounded-bl-lg font-display">
                                                {item.quantity}
                                            </span>
                                        </div>
                                        <div className="flex flex-col justify-between py-1">
                                            <div>
                                                <h3 className="font-medium text-sm leading-tight mb-1">{item.name}</h3>
                                                {item.size && <p className="text-xs text-slate-500">{locale === 'ar' ? 'المقاس: ' : 'Size: '}{item.size} cm</p>}
                                                {item.cut && <p className="text-xs text-slate-500">{item.cut}</p>}
                                            </div>
                                            <p className="font-bold text-sm font-display">{formatPrice(item.unitPrice * item.quantity, currency, locale)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="h-px w-full bg-slate-200 my-4" />
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
                                    <span className="font-display font-medium">
                                        {shippingFee === 0
                                            ? <span className="text-green-600 font-bold">{locale === 'ar' ? 'مجاني' : 'Free'}</span>
                                            : formatPrice(shippingFee, currency, locale)
                                        }
                                    </span>
                                </div>
                            </div>
                            <div className="h-px w-full bg-slate-200 my-4" />
                            <div className="flex justify-between items-end mb-2">
                                <span className="font-bold text-lg">{t('total')}</span>
                                <div className="text-end">
                                    <span className="text-xs text-slate-500 block">{t('inc_vat')}</span>
                                    <span className="font-bold text-2xl font-display text-primary">{formatPrice(total, currency, locale)}</span>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* MAIN FORM */}
                    <div className="flex-1 order-1 lg:order-2">
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

                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 lg:p-10">
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
                                        <label className="block text-sm font-medium text-slate-700 mb-2">{t('full_name')} <span className="text-red-500">*</span></label>
                                        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder={locale === 'ar' ? 'الاسم الكامل' : 'Full name'} className={inputCls('name')} />
                                        {errors.name && <p className="text-xs text-red-500 mt-1 font-kufi">{errors.name}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">{t('phone')} <span className="text-red-500">*</span></label>
                                        <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+974 XXXX XXXX" className={inputCls('phone')} />
                                        {errors.phone && <p className="text-xs text-red-500 mt-1 font-kufi">{errors.phone}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">{t('email')} <span className="text-slate-400 font-normal">({t('optional')})</span></label>
                                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com" className={inputCls('email')} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            {locale === 'ar' ? 'ملاحظات إضافية' : 'Order Notes'} <span className="text-slate-400 font-normal">({t('optional')})</span>
                                        </label>
                                        <textarea value={customerNote} onChange={e => setCustomerNote(e.target.value)} rows={3} placeholder={locale === 'ar' ? 'أي ملاحظات خاصة بطلبك...' : 'Any special notes for your order...'} className="block w-full rounded-lg border-slate-300 py-3 px-4 text-slate-900 shadow-sm sm:text-sm placeholder:text-slate-400 focus:border-primary focus:ring-primary resize-none" />
                                    </div>
                                </div>
                            )}

                            {/* STEP: Address */}
                            {currentStep === 'address' && (
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">{t('country')}</label>
                                        <div className="relative">
                                            <select value={country} onChange={e => setCountry(e.target.value)} className="block w-full appearance-none bg-white bg-none rounded-lg border-slate-300 py-3 px-4 ltr:pr-10 rtl:pl-10 text-slate-900 shadow-sm focus:border-primary focus:ring-primary sm:text-base font-medium">
                                                <option value="QA">{locale === 'ar' ? 'قطر' : 'Qatar'}</option>
                                                <option value="SA">{locale === 'ar' ? 'المملكة العربية السعودية' : 'Saudi Arabia'}</option>
                                                <option value="AE">{locale === 'ar' ? 'الإمارات العربية المتحدة' : 'UAE'}</option>
                                                <option value="KW">{locale === 'ar' ? 'الكويت' : 'Kuwait'}</option>
                                                <option value="BH">{locale === 'ar' ? 'البحرين' : 'Bahrain'}</option>
                                                <option value="OM">{locale === 'ar' ? 'عُمان' : 'Oman'}</option>
                                            </select>
                                            <span className="pointer-events-none absolute inset-y-0 ltr:right-3 rtl:left-3 flex items-center text-slate-500">
                                                <span className="material-symbols-outlined text-[20px]">expand_more</span>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">{t('city')} <span className="text-red-500">*</span></label>
                                            <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder={locale === 'ar' ? 'مثال: الدوحة' : 'e.g. Doha'} className={inputCls('city')} />
                                            {errors.city && <p className="text-xs text-red-500 mt-1 font-kufi">{errors.city}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">{t('zone')} <span className="text-slate-400 font-normal">({t('optional')})</span></label>
                                            <input type="text" value={zone} onChange={e => setZone(e.target.value)} placeholder={locale === 'ar' ? 'مثال: الدفنة' : 'e.g. Al Dafna'} className={inputCls('zone')} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">{t('street')} <span className="text-red-500">*</span></label>
                                        <input type="text" value={street} onChange={e => setStreet(e.target.value)} placeholder={locale === 'ar' ? 'اسم الشارع أو رقمه' : 'Street name or number'} className={inputCls('street')} />
                                        {errors.street && <p className="text-xs text-red-500 mt-1 font-kufi">{errors.street}</p>}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">{t('building')} <span className="text-slate-400 font-normal">({t('optional')})</span></label>
                                            <input type="text" value={building} onChange={e => setBuilding(e.target.value)} placeholder={locale === 'ar' ? 'رقم المبنى' : 'Building no.'} className={inputCls('building')} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">{t('unit')} <span className="text-slate-400 font-normal">({t('optional')})</span></label>
                                            <input type="text" value={unit} onChange={e => setUnit(e.target.value)} placeholder={locale === 'ar' ? 'رقم الشقة' : 'Apt. no.'} className={inputCls('unit')} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STEP: Shipping */}
                            {currentStep === 'shipping' && (
                                <div className="space-y-4">
                                    {shippingOptions.map((opt) => (
                                        <label key={opt.id} className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all shadow-sm ${shippingMethod === opt.id ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-slate-300 bg-white'}`}>
                                            <input type="radio" name="shipping" checked={shippingMethod === opt.id} onChange={() => setShippingMethod(opt.id)} className="h-5 w-5 text-primary focus:ring-primary" />
                                            <div className="flex justify-between items-center w-full ltr:ml-4 rtl:mr-4">
                                                <span className="text-sm font-bold text-slate-900 font-kufi">{opt.label}</span>
                                                <span className="font-bold text-sm font-display">
                                                    {opt.price === 0 ? <span className="text-green-600">{locale === 'ar' ? 'مجاني' : 'Free'}</span> : formatPrice(opt.price, currency, locale)}
                                                </span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            )}

                            {/* STEP: Payment */}
                            {currentStep === 'payment' && (
                                <div className="space-y-4">
                                    {/* Tap — Card / Apple Pay / All methods */}
                                    <label
                                        onClick={() => setPaymentMethod('TAP')}
                                        className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all shadow-sm ${paymentMethod === 'TAP' ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                                    >
                                        <div className="w-12 h-8 bg-slate-900 rounded flex items-center justify-center shrink-0">
                                            <svg viewBox="0 0 40 16" fill="none" className="h-4 w-auto px-1">
                                                <text x="0" y="13" fontSize="13" fontWeight="bold" fill="white" fontFamily="Arial">tap</text>
                                            </svg>
                                        </div>
                                        <div className="flex flex-col grow ltr:ml-4 rtl:mr-4">
                                            <span className="text-sm font-bold text-slate-900">
                                                {locale === 'ar' ? 'بطاقة ائتمانية / مدى / Apple Pay' : 'Card / mada / Apple Pay'}
                                            </span>
                                            <span className="text-xs text-slate-500">
                                                {locale === 'ar' ? 'دفع آمن عبر بوابة Tap Payments' : 'Secure payment via Tap Payments'}
                                            </span>
                                        </div>
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${paymentMethod === 'TAP' ? 'border-primary' : 'border-slate-300'}`}>
                                            {paymentMethod === 'TAP' && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                                        </div>
                                    </label>

                                    {/* Tap card icons */}
                                    {paymentMethod === 'TAP' && (
                                        <div className="flex items-center gap-2 px-4">
                                            {['VISA', 'MC', 'mada', 'AMEX'].map(brand => (
                                                <span key={brand} className="text-[10px] font-bold border border-slate-200 rounded px-1.5 py-0.5 text-slate-500 bg-white">{brand}</span>
                                            ))}
                                            <span className="text-[10px] font-bold border border-slate-200 rounded px-1.5 py-0.5 text-slate-500 bg-white"> Pay</span>
                                        </div>
                                    )}

                                    {/* Bank Transfer */}
                                    <label
                                        onClick={() => setPaymentMethod('EFT')}
                                        className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all shadow-sm ${paymentMethod === 'EFT' ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                                    >
                                        <div className="w-12 h-8 bg-slate-100 rounded flex items-center justify-center text-slate-600 shrink-0">
                                            <span className="material-symbols-outlined">account_balance</span>
                                        </div>
                                        <div className="flex flex-col grow ltr:ml-4 rtl:mr-4">
                                            <span className="text-sm font-bold text-slate-900">{locale === 'ar' ? 'تحويل بنكي' : 'Bank Transfer'}</span>
                                            <span className="text-xs text-slate-500">{locale === 'ar' ? 'حوّل المبلغ وأرسل إيصال التحويل عبر واتساب' : 'Transfer the amount and send receipt via WhatsApp'}</span>
                                        </div>
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${paymentMethod === 'EFT' ? 'border-primary' : 'border-slate-300'}`}>
                                            {paymentMethod === 'EFT' && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                                        </div>
                                    </label>

                                    {/* Bank details — shown only when EFT selected */}
                                    {paymentMethod === 'EFT' && (
                                        <>
                                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                                                <p className="text-slate-800 font-kufi text-sm font-bold mb-2 flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-[18px] text-primary">account_balance</span>
                                                    {locale === 'ar' ? 'بيانات الحساب البنكي' : 'Bank Account Details'}
                                                </p>
                                                {[
                                                    { label: locale === 'ar' ? 'اسم الحساب' : 'Account Name', value: 'MUHAMMAD OMAR FAROOQ' },
                                                    { label: locale === 'ar' ? 'رقم الحساب' : 'Account Number', value: '473010890020101' },
                                                    { label: 'IBAN', value: 'QA66CBQA000000473010890020101' },
                                                    { label: 'SWIFT', value: 'CBQAQAQA' },
                                                    { label: locale === 'ar' ? 'البنك' : 'Bank', value: 'Commercial Bank (QSC) — Doha, Qatar' },
                                                ].map(({ label, value }) => (
                                                    <div key={label} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-0.5 text-xs border-b border-slate-100 last:border-0 py-1">
                                                        <span className="text-slate-500 font-kufi">{label}</span>
                                                        <span className="font-bold text-slate-800 font-display tracking-wide" dir="ltr">{value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                                <p className="text-amber-800 font-kufi text-sm font-bold mb-1">
                                                    {locale === 'ar' ? 'تعليمات الدفع' : 'Payment Instructions'}
                                                </p>
                                                <p className="text-amber-700 font-kufi text-xs leading-relaxed">
                                                    {locale === 'ar'
                                                        ? 'بعد تأكيد طلبك، يرجى تحويل المبلغ الكامل وإرسال صورة إيصال التحويل عبر واتساب على الرقم: +974 3311 4232'
                                                        : 'After confirming your order, please transfer the full amount and send a photo of the receipt via WhatsApp to: +974 3311 4232'}
                                                </p>
                                            </div>
                                        </>
                                    )}

                                    {errors.submit && (
                                        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                            <p className="text-red-700 font-kufi text-sm">{errors.submit}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-6 mt-8 border-t border-slate-100">
                                {stepIndex > 0 ? (
                                    <button onClick={goBack} disabled={isSubmitting} className="text-slate-500 hover:text-slate-800 font-medium text-sm py-3 px-4 transition-colors">
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
                                    <button
                                        onClick={handleConfirm}
                                        disabled={isSubmitting}
                                        className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-bold py-3.5 px-8 rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 font-kufi disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className="animate-spin material-symbols-outlined text-lg">autorenew</span>
                                                {locale === 'ar' ? 'جارٍ التأكيد...' : 'Placing order...'}
                                            </>
                                        ) : paymentMethod === 'TAP' ? (
                                            <>
                                                <span className="material-symbols-outlined text-lg">lock</span>
                                                {locale === 'ar' ? 'الدفع الآن' : 'Pay Now'}
                                            </>
                                        ) : (
                                            <>
                                                {t('confirm_order')}
                                                <span className="material-symbols-outlined text-lg">check_circle</span>
                                            </>
                                        )}
                                    </button>
                                ) : (
                                    <button onClick={goNext} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-bold py-3.5 px-8 rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 font-kufi">
                                        {t('continue')}
                                        <span className="material-symbols-outlined text-lg ltr:rotate-0 rtl:rotate-180">arrow_back</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 text-center text-xs text-slate-400 flex justify-center gap-6 font-kufi pb-8">
                    <a href="#" className="hover:underline">{t('privacy')}</a>
                    <a href="#" className="hover:underline">{t('terms')}</a>
                    <a href="#" className="hover:underline">{t('returns')}</a>
                </div>
            </main>
        </section>
    );
}

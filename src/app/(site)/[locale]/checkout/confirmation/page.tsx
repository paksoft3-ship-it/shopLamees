'use client';

import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { trackEvent } from '@/lib/tracking/track';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getOrderByNumber } from '@/lib/actions/orders';

type Order = Awaited<ReturnType<typeof getOrderByNumber>>;

type PayState = 'loading' | 'paid' | 'pending_eft' | 'failed';

function buildWhatsAppReceipt(order: Order, locale: 'ar' | 'en'): string {
    if (!order) return '';
    const isAr = locale === 'ar';
    const lines = order.items.map(i =>
        `• ${i.nameSnapshotAr} × ${i.qty} = ${(Number(i.unitPrice) * i.qty).toFixed(0)} ${order.currency}`
    );
    const msg = isAr
        ? `🛍️ *طلبي من شوب لاميس*\n\nرقم الطلب: *${order.orderNumber}*\n\n${lines.join('\n')}\n\nالإجمالي: *${Number(order.total).toFixed(0)} ${order.currency}*`
        : `🛍️ *My Lamees Order*\n\nOrder: *${order.orderNumber}*\n\n${lines.join('\n')}\n\nTotal: *${Number(order.total).toFixed(0)} ${order.currency}*`;
    return encodeURIComponent(msg);
}

export default function OrderConfirmationPage() {
    const locale = useLocale() as 'ar' | 'en';
    const searchParams = useSearchParams();
    const orderNumber = searchParams.get('order') || '';
    const statusParam = searchParams.get('status'); // 'failed' | null
    const hasTracked = useRef(false);

    const [order, setOrder] = useState<Order>(null);
    const [state, setState] = useState<PayState>('loading');

    useEffect(() => {
        if (!orderNumber) { setState('failed'); return; }
        getOrderByNumber(orderNumber).then(data => {
            setOrder(data);
            if (!data) { setState('failed'); return; }

            if (statusParam === 'failed' || data.status === 'CANCELLED') {
                setState('failed');
            } else if (data.paymentMethod === 'TAP' && data.status === 'PROCESSING') {
                setState('paid');
            } else if (data.paymentMethod === 'TAP' && data.status === 'NEW') {
                // Still processing — poll once more after a short delay
                setTimeout(() => {
                    getOrderByNumber(orderNumber).then(d => {
                        setState(d?.status === 'PROCESSING' ? 'paid' : d?.status === 'CANCELLED' ? 'failed' : 'paid');
                        if (d) setOrder(d);
                    });
                }, 2500);
            } else {
                setState('pending_eft');
            }
        });
    }, [orderNumber, statusParam]);

    // Track purchase once on success
    useEffect(() => {
        if (state === 'paid' && !hasTracked.current && orderNumber) {
            hasTracked.current = true;
            trackEvent('purchase', { transaction_id: orderNumber, value: Number(order?.total || 0) });
        }
    }, [state, orderNumber, order]);

    const waMsg = buildWhatsAppReceipt(order, locale);
    const waUrl = `https://wa.me/97433114232?text=${waMsg}`;

    if (state === 'loading') {
        return (
            <section className="bg-[#FBF7F2] min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <span className="animate-spin material-symbols-outlined text-4xl text-primary">autorenew</span>
                    <p className="font-kufi text-slate-500 mt-4">
                        {locale === 'ar' ? 'جارٍ التحقق من الدفع...' : 'Verifying payment...'}
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-[#f6f4f0] min-h-screen flex flex-col">
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

            <main className="flex-grow flex flex-col items-center justify-center py-10 px-4 relative overflow-hidden">
                {/* Background glows */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[100px] ${state === 'paid' ? 'bg-green-200/30' : state === 'failed' ? 'bg-red-200/30' : 'bg-primary/5'}`} />
                    <div className={`absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[100px] ${state === 'paid' ? 'bg-primary/10' : state === 'failed' ? 'bg-red-200/20' : 'bg-primary/5'}`} />
                </div>

                <div className="w-full max-w-md relative z-10 space-y-4">

                    {/* ── STATE: PAID (Tap) ── */}
                    {state === 'paid' && (
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center">
                            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5 ring-8 ring-green-50">
                                <span className="material-symbols-outlined text-green-500 text-[44px]">check_circle</span>
                            </div>
                            <h1 className="text-2xl font-bold text-slate-900 font-kufi mb-1">
                                {locale === 'ar' ? 'تم الدفع بنجاح! 🎉' : 'Payment Successful! 🎉'}
                            </h1>
                            <p className="text-slate-500 font-kufi text-sm mb-6">
                                {locale === 'ar' ? 'طلبك قيد التجهيز الآن' : 'Your order is now being processed'}
                            </p>

                            <OrderSummaryCard order={order} locale={locale} />

                            <div className="flex flex-col gap-3 mt-6">
                                <a href={waUrl} target="_blank" rel="noopener noreferrer"
                                    className="w-full h-12 bg-[#25D366] hover:bg-[#1ebe5d] text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 font-kufi">
                                    <span className="material-symbols-outlined text-[20px]">chat</span>
                                    {locale === 'ar' ? 'احتفظ بإيصالك عبر واتساب' : 'Save Receipt via WhatsApp'}
                                </a>
                                <button onClick={() => window.print()}
                                    className="w-full h-12 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 font-kufi">
                                    <span className="material-symbols-outlined text-[20px]">print</span>
                                    {locale === 'ar' ? 'طباعة الإيصال' : 'Print Receipt'}
                                </button>
                                <Link href="/"
                                    className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 font-kufi">
                                    {locale === 'ar' ? 'متابعة التسوق' : 'Continue Shopping'}
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* ── STATE: PENDING EFT (Bank Transfer) ── */}
                    {state === 'pending_eft' && (
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center">
                            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-5 ring-8 ring-amber-50">
                                <span className="material-symbols-outlined text-amber-500 text-[44px]">check_circle</span>
                            </div>
                            <h1 className="text-2xl font-bold text-slate-900 font-kufi mb-1">
                                {locale === 'ar' ? 'تم استلام طلبك ✓' : 'Order Received ✓'}
                            </h1>
                            <p className="text-slate-500 font-kufi text-sm mb-6">
                                {locale === 'ar' ? 'أتمم التحويل البنكي لتأكيد طلبك' : 'Complete the bank transfer to confirm your order'}
                            </p>

                            <OrderSummaryCard order={order} locale={locale} />

                            {/* Bank details */}
                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mt-4 text-start space-y-2">
                                <p className="text-slate-700 font-kufi text-sm font-bold mb-2 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px] text-primary">account_balance</span>
                                    {locale === 'ar' ? 'بيانات التحويل البنكي' : 'Bank Transfer Details'}
                                </p>
                                {[
                                    { label: locale === 'ar' ? 'اسم الحساب' : 'Account Name', value: 'MUHAMMAD OMAR FAROOQ' },
                                    { label: 'IBAN', value: 'QA66CBQA000000473010890020101' },
                                    { label: 'SWIFT', value: 'CBQAQAQA' },
                                ].map(({ label, value }) => (
                                    <div key={label} className="flex justify-between text-xs border-b border-slate-100 last:border-0 py-1">
                                        <span className="text-slate-500">{label}</span>
                                        <span className="font-bold text-slate-800" dir="ltr">{value}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col gap-3 mt-5">
                                <a href={waUrl} target="_blank" rel="noopener noreferrer"
                                    className="w-full h-12 bg-[#25D366] hover:bg-[#1ebe5d] text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 font-kufi">
                                    <span className="material-symbols-outlined text-[20px]">chat</span>
                                    {locale === 'ar' ? 'أرسل إيصال التحويل عبر واتساب' : 'Send Transfer Receipt via WhatsApp'}
                                </a>
                                <Link href="/"
                                    className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 font-kufi">
                                    {locale === 'ar' ? 'متابعة التسوق' : 'Continue Shopping'}
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* ── STATE: FAILED ── */}
                    {state === 'failed' && (
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center">
                            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5 ring-8 ring-red-50">
                                <span className="material-symbols-outlined text-red-500 text-[44px]">cancel</span>
                            </div>
                            <h1 className="text-2xl font-bold text-slate-900 font-kufi mb-1">
                                {locale === 'ar' ? 'فشلت عملية الدفع' : 'Payment Failed'}
                            </h1>
                            <p className="text-slate-500 font-kufi text-sm mb-2">
                                {locale === 'ar'
                                    ? 'لم تكتمل عملية الدفع. يمكنك المحاولة مجدداً أو الدفع عبر التحويل البنكي.'
                                    : 'Your payment was not completed. You can try again or pay via bank transfer.'}
                            </p>
                            {orderNumber && (
                                <p className="text-xs text-slate-400 font-kufi mb-6">
                                    {locale === 'ar' ? `رقم الطلب: ${orderNumber}` : `Order: ${orderNumber}`}
                                </p>
                            )}

                            <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6 text-start">
                                <p className="text-red-700 font-kufi text-xs leading-relaxed">
                                    {locale === 'ar'
                                        ? 'قد يكون السبب: رصيد غير كافٍ، بطاقة منتهية الصلاحية، أو إلغاء العملية. تأكد من بياناتك وأعد المحاولة.'
                                        : 'Possible reasons: insufficient balance, expired card, or cancelled transaction. Please verify your card details and try again.'}
                                </p>
                            </div>

                            <div className="flex flex-col gap-3">
                                <Link href="/cart"
                                    className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 font-kufi">
                                    <span className="material-symbols-outlined text-[20px]">refresh</span>
                                    {locale === 'ar' ? 'حاول مجدداً' : 'Try Again'}
                                </Link>
                                <a href={`https://wa.me/97433114232?text=${encodeURIComponent(locale === 'ar' ? `مرحباً، أريد الدفع عبر تحويل بنكي لطلب رقم ${orderNumber}` : `Hello, I'd like to pay via bank transfer for order ${orderNumber}`)}`}
                                    target="_blank" rel="noopener noreferrer"
                                    className="w-full h-12 bg-[#25D366] hover:bg-[#1ebe5d] text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 font-kufi">
                                    <span className="material-symbols-outlined text-[20px]">chat</span>
                                    {locale === 'ar' ? 'ادفع عبر تحويل بنكي' : 'Pay via Bank Transfer'}
                                </a>
                                <Link href="/"
                                    className="w-full h-12 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-colors flex items-center justify-center font-kufi">
                                    {locale === 'ar' ? 'العودة للمتجر' : 'Back to Store'}
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Trust badges */}
                    <div className="flex items-center justify-center gap-6 text-xs text-slate-400 font-kufi pt-2">
                        <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">lock</span>
                            {locale === 'ar' ? 'دفع آمن' : 'Secure'}
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">local_shipping</span>
                            {locale === 'ar' ? 'شحن سريع' : 'Fast delivery'}
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">headset_mic</span>
                            {locale === 'ar' ? 'دعم على واتساب' : 'WhatsApp support'}
                        </span>
                    </div>
                </div>
            </main>
        </section>
    );
}

function OrderSummaryCard({ order, locale }: { order: Order; locale: 'ar' | 'en' }) {
    if (!order) return null;
    const isAr = locale === 'ar';

    return (
        <div className="w-full bg-[#fdf9f3] rounded-xl border border-slate-100 overflow-hidden text-start">
            {/* Items */}
            {order.items.length > 0 && (
                <div className="divide-y divide-slate-100">
                    {order.items.map((item, i) => (
                        <div key={i} className="flex items-center justify-between px-4 py-3 gap-3">
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-900 truncate font-kufi">
                                    {isAr ? item.nameSnapshotAr : item.nameSnapshotEn}
                                </p>
                                {item.variantLabel && (
                                    <p className="text-xs text-slate-400 font-kufi">{item.variantLabel}</p>
                                )}
                            </div>
                            <div className="text-xs text-slate-500 shrink-0">×{item.qty}</div>
                            <div className="text-sm font-bold text-slate-900 shrink-0 font-display">
                                {(Number(item.unitPrice) * item.qty).toFixed(0)} {order.currency}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {/* Totals */}
            <div className="px-4 py-3 border-t border-slate-200 space-y-1.5">
                <div className="flex justify-between text-xs text-slate-500">
                    <span className="font-kufi">{isAr ? 'المجموع الفرعي' : 'Subtotal'}</span>
                    <span>{Number(order.subtotal).toFixed(0)} {order.currency}</span>
                </div>
                {Number(order.shippingFee) > 0 && (
                    <div className="flex justify-between text-xs text-slate-500">
                        <span className="font-kufi">{isAr ? 'الشحن' : 'Shipping'}</span>
                        <span>{Number(order.shippingFee).toFixed(0)} {order.currency}</span>
                    </div>
                )}
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-1 border-t border-slate-200">
                    <span className="font-kufi">{isAr ? 'الإجمالي' : 'Total'}</span>
                    <span className="text-primary font-display">{Number(order.total).toFixed(0)} {order.currency}</span>
                </div>
            </div>
            {/* Order number */}
            <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                <span className="text-xs text-slate-500 font-kufi">{isAr ? 'رقم الطلب' : 'Order'}</span>
                <span className="text-xs font-bold text-primary font-display" dir="ltr">{order.orderNumber}</span>
            </div>
        </div>
    );
}

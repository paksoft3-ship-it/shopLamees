'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { usePrefsStore } from '@/lib/stores/prefs';
import { trackEvent } from '@/lib/tracking/track';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getOrderByNumber } from '@/lib/actions/orders';

const ADMIN_WHATSAPP = '97433114232';

type Order = Awaited<ReturnType<typeof getOrderByNumber>>;

function buildAdminWhatsAppMessage(order: NonNullable<Order>, locale: string): string {
    const flag = order.country === 'QA' ? '🇶🇦' : '🇸🇦';
    const items = order.items.map(i =>
        `  • ${i.nameSnapshotAr}${i.variantLabel ? ` (${i.variantLabel})` : ''} × ${i.qty} = ${Number(i.lineTotal).toFixed(0)} ${order.currency}`
    ).join('\n');

    if (locale === 'ar') {
        return `🛍️ *طلب جديد - شوب لاميس*

📋 رقم الطلب: *${order.orderNumber}*
👤 الاسم: ${order.customerName}
📞 الهاتف: ${order.phone}${order.email ? `\n📧 البريد: ${order.email}` : ''}

🛒 *المنتجات:*
${items}

💰 المجموع الفرعي: ${Number(order.subtotal).toFixed(0)} ${order.currency}
🚚 الشحن: ${Number(order.shippingFee).toFixed(0)} ${order.currency}
✅ *الإجمالي: ${Number(order.total).toFixed(0)} ${order.currency}*

${flag} *العنوان:*
${order.address?.city ?? ''}${order.address?.zone ? '، ' + order.address.zone : ''}
${order.address?.street ?? ''}${order.address?.building ? '، مبنى ' + order.address.building : ''}${order.address?.unit ? '، شقة ' + order.address.unit : ''}

💳 طريقة الدفع: تحويل بنكي (EFT / Havale)${order.customerNote ? `\n\n📝 ملاحظة: ${order.customerNote}` : ''}`;
    }

    return `🛍️ *New Order - Shop Lamees*

📋 Order: *${order.orderNumber}*
👤 Name: ${order.customerName}
📞 Phone: ${order.phone}${order.email ? `\n📧 Email: ${order.email}` : ''}

🛒 *Items:*
${items}

💰 Subtotal: ${Number(order.subtotal).toFixed(0)} ${order.currency}
🚚 Shipping: ${Number(order.shippingFee).toFixed(0)} ${order.currency}
✅ *Total: ${Number(order.total).toFixed(0)} ${order.currency}*

${flag} *Address:*
${order.address?.city ?? ''}${order.address?.zone ? ', ' + order.address.zone : ''}
${order.address?.street ?? ''}${order.address?.building ? ', Bldg ' + order.address.building : ''}${order.address?.unit ? ', Unit ' + order.address.unit : ''}

💳 Payment: Bank Transfer (EFT / Havale)${order.customerNote ? `\n\n📝 Note: ${order.customerNote}` : ''}`;
}

export default function OrderConfirmationPage() {
    const t = useTranslations('OrderConfirmation');
    const locale = useLocale() as 'ar' | 'en';
    const { currency } = usePrefsStore();
    const searchParams = useSearchParams();
    const orderNumber = searchParams.get('order') || '';
    const hasTracked = useRef(false);
    const hasOpenedWA = useRef(false);

    const [order, setOrder] = useState<Order>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!orderNumber) { setLoading(false); return; }
        getOrderByNumber(orderNumber).then(data => {
            setOrder(data);
            setLoading(false);
        });
    }, [orderNumber]);

    // Track purchase once
    useEffect(() => {
        if (!hasTracked.current && orderNumber) {
            hasTracked.current = true;
            trackEvent('purchase', { transaction_id: orderNumber, currency });
        }
    }, [orderNumber, currency]);

    // Auto-open admin WhatsApp once order is loaded
    useEffect(() => {
        if (!order || hasOpenedWA.current) return;
        hasOpenedWA.current = true;
        const msg = buildAdminWhatsAppMessage(order, locale);
        const url = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(msg)}`;
        // Small delay so the page renders first
        const timer = setTimeout(() => window.open(url, '_blank'), 1200);
        return () => clearTimeout(timer);
    }, [order, locale]);

    const adminWhatsAppUrl = order
        ? `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(buildAdminWhatsAppMessage(order, locale))}`
        : '#';

    if (loading) {
        return (
            <section className="bg-[#FBF7F2] min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <span className="animate-spin material-symbols-outlined text-4xl text-primary">autorenew</span>
                    <p className="font-kufi text-slate-500 mt-4">{locale === 'ar' ? 'جارٍ تحميل تفاصيل طلبك...' : 'Loading your order...'}</p>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-[#FBF7F2] min-h-screen flex flex-col">
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

            <main className="flex-grow flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none z-0">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px]" />
                </div>

                <div className="w-full max-w-lg bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-10 relative z-10 flex flex-col items-center text-center">

                    {/* Success icon */}
                    <div className="mb-6 relative">
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-green-500 text-[40px]">check_circle</span>
                        </div>
                        <span className="material-symbols-outlined absolute -top-2 -right-2 text-primary/40 text-xl">star</span>
                        <span className="material-symbols-outlined absolute bottom-0 -left-4 text-primary/40 text-lg">star</span>
                    </div>

                    <h1 className="text-2xl font-bold text-slate-900 font-kufi mb-1">{t('thank_you')}</h1>
                    <p className="text-slate-500 font-kufi text-sm mb-6">
                        {locale === 'ar' ? 'تم استلام طلبك بنجاح' : 'Your order has been received'}
                    </p>

                    {/* Order details */}
                    <div className="w-full bg-[#FBF7F2] rounded-xl p-5 mb-5 border border-slate-100 space-y-3 text-sm text-start">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 font-kufi">{t('order_number')}</span>
                            <span className="font-bold text-primary font-display" dir="ltr">{orderNumber || '—'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 font-kufi">{t('payment_method')}</span>
                            <span className="font-medium text-slate-900 font-kufi text-xs">{locale === 'ar' ? 'تحويل بنكي (EFT / Havale)' : 'Bank Transfer (EFT / Havale)'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 font-kufi">{t('delivery_estimate')}</span>
                            <span className="font-medium text-primary font-kufi">{t('delivery_days')}</span>
                        </div>
                        {order && (
                            <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                                <span className="font-bold text-slate-900 font-kufi">{t('total')}</span>
                                <span className="font-bold text-lg font-display text-slate-900">
                                    {formatPrice(Number(order.total), currency, locale)}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* WhatsApp instruction box */}
                    <div className="w-full bg-[#e7fce8] border border-[#a8e6aa] rounded-xl p-4 mb-6 text-start">
                        <div className="flex items-start gap-3">
                            <span className="material-symbols-outlined text-[#25D366] text-xl shrink-0 mt-0.5">chat</span>
                            <div>
                                <p className="text-green-900 font-kufi text-sm font-bold mb-1">
                                    {locale === 'ar' ? 'خطوة مهمة: أرسل تفاصيل طلبك عبر واتساب' : 'Important: Send your order via WhatsApp'}
                                </p>
                                <p className="text-green-800 font-kufi text-xs leading-relaxed">
                                    {locale === 'ar'
                                        ? 'تم فتح واتساب تلقائياً برسالة جاهزة تحتوي على تفاصيل طلبك. اضغط إرسال حتى نتمكن من تأكيد طلبك وتجهيزه بعد استلام التحويل.'
                                        : 'WhatsApp has been opened automatically with your order details ready to send. Press Send so we can confirm your order after receiving the transfer.'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-col w-full gap-3">
                        <a
                            href={adminWhatsAppUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full h-12 bg-[#25D366] hover:bg-[#1ebe5d] text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 font-kufi"
                        >
                            <span className="material-symbols-outlined text-[20px]">chat</span>
                            {locale === 'ar' ? 'أرسل طلبك عبر واتساب' : 'Send Order via WhatsApp'}
                        </a>
                        <Link
                            href="/"
                            className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 font-kufi"
                        >
                            {t('continue_shopping')}
                        </Link>
                    </div>
                </div>
            </main>
        </section>
    );
}

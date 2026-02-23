'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAdminOrders, OrderStatus } from '@/lib/stores/adminOrders';
import { useLocale } from 'next-intl';
import { formatMoney } from '@/lib/money';

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
    const locale = useLocale();
    const isRtl = locale === 'ar';
    const router = useRouter();

    const orders = useAdminOrders(state => state.orders);
    const updateOrderStatus = useAdminOrders(state => state.updateOrderStatus);
    const updateInternalNote = useAdminOrders(state => state.updateInternalNote);

    const order = orders.find(o => o.id === params.id);

    // Local state for UI
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const [noteText, setNoteText] = useState(order?.internalNote || '');
    const [isEditingNote, setIsEditingNote] = useState(false);

    if (!order) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8">
                <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">search_off</span>
                <h2 className="text-xl font-bold text-slate-900 mb-2">الطلب غير موجود</h2>
                <button onClick={() => router.back()} className="text-primary hover:underline font-medium">العودة للطلبات</button>
            </div>
        );
    }

    const handleStatusUpdate = (newStatus: OrderStatus) => {
        updateOrderStatus(order.id, newStatus);
        setIsUpdatingStatus(false);
    };

    const handleSaveNote = () => {
        updateInternalNote(order.id, noteText);
        setIsEditingNote(false);
    };

    const StatusBadge = ({ status }: { status: OrderStatus }) => {
        const styles = {
            pending: 'bg-orange-100 text-orange-800 border-orange-200',
            processing: 'bg-[#edab1d]/20 text-yellow-800 border-[#edab1d]/20',
            shipped: 'bg-blue-100 text-blue-800 border-blue-200',
            completed: 'bg-green-100 text-green-800 border-green-200',
            cancelled: 'bg-red-100 text-red-800 border-red-200'
        }[status] || 'bg-gray-100 text-gray-800 border-gray-200';

        const label = {
            pending: 'بانتظار الدفع',
            processing: 'جاري التجهيز',
            shipped: 'تم الشحن',
            completed: 'مكتمل',
            cancelled: 'ملغي'
        }[status] || status;

        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold border ${styles}`}>
                {status === 'processing' && <span className="size-2 rounded-full bg-yellow-500 animate-pulse"></span>}
                {status === 'completed' && <span className="material-symbols-outlined text-[16px]">check_circle</span>}
                {label}
            </span>
        );
    };

    return (
        <div className="layout-container flex h-full grow flex-col px-4 md:px-10 py-8 gap-6 max-w-[1400px] mx-auto w-full">
            {/* Breadcrumbs & Actions Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-sm text-slate-500 font-medium whitespace-nowrap overflow-x-auto pb-1">
                        <Link href={`/${locale}/admin/orders`} className="hover:text-primary transition-colors focus:outline-none">الطلبات</Link>
                        <span className={`material-symbols-outlined text-sm pt-1 ${isRtl ? '' : 'rotate-180'}`}>chevron_left</span>
                        <span className="text-slate-900">تفاصيل الطلب</span>
                    </div>
                    <div className="flex items-center gap-4 flex-wrap">
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">طلب #{order.id}</h1>
                        <div className="flex items-center gap-2">
                            <StatusBadge status={order.status} />
                        </div>
                    </div>
                    <p className="text-slate-500 text-sm">تم الإنشاء: {order.date}</p>
                </div>

                {/* Primary Actions */}
                <div className="flex flex-wrap gap-3 items-center">
                    <button className="h-10 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm transition-colors flex items-center gap-2 shadow-sm">
                        <span className="material-symbols-outlined text-[18px]">print</span>
                        <span className="hidden sm:inline">طباعة</span>
                    </button>

                    <div className="relative">
                        <button
                            onClick={() => setIsUpdatingStatus(!isUpdatingStatus)}
                            className="h-10 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm transition-colors flex items-center gap-2 shadow-sm">
                            <span className="material-symbols-outlined text-[18px]">edit_note</span>
                            تحديث الحالة
                        </button>
                        {isUpdatingStatus && (
                            <div className={`absolute top-12 ${isRtl ? 'left-0' : 'right-0'} w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden`}>
                                {(order.status !== 'pending') && <button onClick={() => handleStatusUpdate('pending')} className="w-full text-right px-4 py-3 hover:bg-slate-50 font-medium text-sm border-b border-slate-100">بانتظار الدفع</button>}
                                {(order.status !== 'processing') && <button onClick={() => handleStatusUpdate('processing')} className="w-full text-right px-4 py-3 hover:bg-slate-50 font-medium text-sm border-b border-slate-100 text-[#edab1d]">جاري التجهيز</button>}
                                {(order.status !== 'shipped') && <button onClick={() => handleStatusUpdate('shipped')} className="w-full text-right px-4 py-3 hover:bg-slate-50 font-medium text-sm border-b border-slate-100 text-blue-600">تم الشحن</button>}
                                {(order.status !== 'completed') && <button onClick={() => handleStatusUpdate('completed')} className="w-full text-right px-4 py-3 hover:bg-slate-50 font-medium text-sm border-b border-slate-100 text-emerald-600">مكتمل</button>}
                                {(order.status !== 'cancelled') && <button onClick={() => handleStatusUpdate('cancelled')} className="w-full text-right px-4 py-3 hover:bg-slate-50 font-medium text-sm text-red-600">ملغي</button>}
                            </div>
                        )}
                    </div>

                    <button className="h-10 px-6 rounded-xl bg-primary hover:bg-[#edab1d]/90 text-slate-900 font-bold text-sm transition-colors flex items-center gap-2 shadow-md shadow-primary/20">
                        <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                        <span className="hidden sm:inline">إنشاء شحنة</span>
                    </button>
                </div>
            </div>

            {/* Main Layout Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

                {/* Main Content - 8 Cols */}
                <div className="xl:col-span-8 flex flex-col gap-6">
                    {/* Order Items */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                                <span className="material-symbols-outlined text-slate-400">shopping_bag</span>
                                {order.items.length > 0 ? `المنتجات (${order.items.length})` : 'المنتجات'}
                            </h3>
                            <span className="text-sm text-slate-500 font-medium">الشحن: ارامكس</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-right">
                                <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                                    <tr>
                                        <th className="px-6 py-4">المنتج</th>
                                        <th className="px-6 py-4">رمز المنتج</th>
                                        <th className="px-6 py-4 text-center">الكمية</th>
                                        <th className={`px-6 py-4 ${isRtl ? 'text-left' : 'text-right'}`}>الإجمالي</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {order.items.length === 0 ? (
                                        <tr><td colSpan={4} className="text-center py-8 text-slate-500">لا توجد منتجات مسجلة</td></tr>
                                    ) : order.items.map((item, idx) => (
                                        <tr key={idx} className="group hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="size-16 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 mb-1">{item.name}</p>
                                                        {item.variant && <p className="text-xs text-slate-500">{item.variant}</p>}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 font-mono text-sm">{item.sku}</td>
                                            <td className="px-6 py-4 text-center text-slate-900 font-medium">{item.quantity}</td>
                                            <td className={`px-6 py-4 font-bold text-slate-900 ${isRtl ? 'text-left' : 'text-right'}`}>{formatMoney(item.price * item.quantity)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Timeline & Notes Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Timeline */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                            <h3 className="font-bold text-lg text-slate-900 mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-slate-400">history</span>
                                سجل النشاط
                            </h3>
                            <div className="relative space-y-0 before:absolute before:inset-0 before:mx-2 before:h-full before:w-0.5 before:bg-slate-100">
                                {order.timeline.map((event, idx) => (
                                    <div key={idx} className={`relative flex gap-4 pb-8 group ${event.isFuture ? 'opacity-50' : ''}`}>
                                        <div className={`absolute ${isRtl ? '-right-0' : '-left-0'} mt-1 size-4 rounded-full border-2 border-white z-10 
                                            ${event.isCurrent ? 'bg-primary ring-4 ring-[#edab1d]/20 shadow-sm'
                                                : (event.isFuture ? 'bg-slate-200' : 'bg-slate-300 shadow-sm')}
                                        `}></div>
                                        <div className={`flex flex-col ${isRtl ? 'mr-8' : 'ml-8'}`}>
                                            <p className={`text-sm font-bold ${event.isCurrent ? 'text-primary' : 'text-slate-900'}`}>{event.label}</p>
                                            <p className="text-xs text-slate-500 mt-1">
                                                {event.date}
                                                {event.note && <span className="text-slate-700 font-medium mr-1"> {event.note}</span>}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="flex flex-col gap-6">
                            {order.customerNote && (
                                <div className="bg-amber-50 rounded-2xl border border-amber-100 p-5 shadow-sm">
                                    <h4 className="font-bold text-amber-900 mb-2 flex items-center gap-2 text-sm">
                                        <span className="material-symbols-outlined text-[18px]">comment</span>
                                        ملاحظة العميل
                                    </h4>
                                    <p className="text-amber-800 text-sm leading-relaxed">
                                        &quot;{order.customerNote}&quot;
                                    </p>
                                </div>
                            )}

                            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex-1">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[18px] text-slate-400">lock</span>
                                        ملاحظات داخلية
                                    </h4>
                                    {isEditingNote ? (
                                        <button onClick={handleSaveNote} className="text-xs text-primary font-bold hover:underline">حفظ</button>
                                    ) : (
                                        <button onClick={() => setIsEditingNote(true)} className="text-xs text-slate-400 font-bold hover:underline">تحرير</button>
                                    )}
                                </div>
                                {isEditingNote ? (
                                    <textarea
                                        value={noteText}
                                        onChange={(e) => setNoteText(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 p-3 h-24 resize-none focus:ring-1 focus:ring-[#edab1d] placeholder:text-slate-400 outline-none"
                                        placeholder="أضف ملاحظة للفريق..."
                                    />
                                ) : (
                                    <div className="w-full bg-slate-50 border-0 rounded-lg text-sm text-slate-700 p-3 h-24 whitespace-pre-wrap overflow-y-auto">
                                        {order.internalNote || <span className="text-slate-400">لا توجد ملاحظات داخلية...</span>}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Left Sidebar - 4 Cols */}
                <div className="xl:col-span-4 flex flex-col gap-6">
                    {/* Customer */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 relative overflow-hidden group">
                        <div className={`absolute top-0 ${isRtl ? 'right-0' : 'left-0'} w-full h-1 bg-gradient-to-l from-primary to-orange-300`}></div>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="size-14 rounded-full bg-slate-100 overflow-hidden ring-2 ring-white shadow-sm flex items-center justify-center">
                                {order.customerAvatar ? (
                                    <img src={order.customerAvatar} alt={order.customerName} className="w-full h-full object-cover" />
                                ) : <span className="material-symbols-outlined text-slate-400">person</span>}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-slate-900">{order.customerName}</h3>
                                <div className="flex items-center gap-1 text-xs text-slate-500">
                                    <span className="material-symbols-outlined text-[14px] text-amber-500 fill-current">star</span>
                                    <span>عميل مسجل</span>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4 mb-6">
                            <a href={`tel:${order.customerPhone}`} className="flex items-center gap-3 text-slate-600 hover:text-primary transition-colors group/link p-2 rounded-lg hover:bg-slate-50">
                                <div className="size-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover/link:text-primary group-hover/link:bg-yellow-50 transition-colors">
                                    <span className="material-symbols-outlined text-[18px]">call</span>
                                </div>
                                <span className="text-sm font-medium dir-ltr text-right">{order.customerPhone}</span>
                            </a>
                            <a href={`mailto:${order.customerEmail}`} className="flex items-center gap-3 text-slate-600 hover:text-primary transition-colors group/link p-2 rounded-lg hover:bg-slate-50">
                                <div className="size-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover/link:text-primary group-hover/link:bg-yellow-50 transition-colors">
                                    <span className="material-symbols-outlined text-[18px]">mail</span>
                                </div>
                                <span className="text-sm font-medium">{order.customerEmail}</span>
                            </a>
                        </div>
                        <button className="w-full h-11 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-[20px]">chat</span>
                            تواصل واتساب
                        </button>
                    </div>

                    {/* Address Card */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                        <div className="flex justify-between items-center mb-4 border-b border-slate-50 pb-3">
                            <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                <span className="material-symbols-outlined text-slate-400">location_on</span>
                                عنوان التوصيل
                            </h3>
                            <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md text-xs font-bold border border-emerald-100">
                                <span className="material-symbols-outlined text-[14px]">verified_user</span>
                                تم التحقق
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="w-full h-24 rounded-lg bg-slate-100 overflow-hidden relative border border-slate-200">
                                <div className="absolute inset-0 bg-cover bg-center opacity-60 grayscale" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDkUhhS1mZBckdm1KmuEiXEU_aMWdvN56jViMeFWcTAngMViPXJFEuQz5V9zLenr0O0A0x7NxVPa36YTWaILlIqYin1odbarBZ1Kn39IHj8CC3Cty53dAL-ztVlhEBDTS3OgyLUIT3fw-8EbLJlxTxnaOoTwhu6x2s_VHzW5FlTznoaV89dpBmcw04e17UOP0vrC6xELXq0iepoccRjSXG61QEmEUWo85CxtL11K0tLO0rRXKaFPE-kMbYSpXnEO-XqOHBuo2QYRWw')" }}></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-red-500 text-4xl drop-shadow-md">location_on</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="bg-slate-50 p-3 rounded-lg">
                                    <p className="text-xs text-slate-500 mb-1">المدينة</p>
                                    <p className="font-bold text-slate-900">{order.shippingAddress.city}</p>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-lg">
                                    <p className="text-xs text-slate-500 mb-1">المنطقة</p>
                                    <p className="font-bold text-slate-900">{order.shippingAddress.zone}</p>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-lg">
                                    <p className="text-xs text-slate-500 mb-1">الشارع</p>
                                    <p className="font-bold text-slate-900">{order.shippingAddress.street}</p>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-lg">
                                    <p className="text-xs text-slate-500 mb-1">المبنى</p>
                                    <p className="font-bold text-slate-900">{order.shippingAddress.building}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Summary */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-slate-400">receipt_long</span>
                            ملخص الدفع
                        </h3>
                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">المجموع الفرعي</span>
                                <span className="font-medium text-slate-900">{formatMoney(order.amount - order.shippingFee + (order.discount || 0))}</span>
                            </div>
                            {order.discount !== undefined && order.discount > 0 && (
                                <div className="flex justify-between text-sm text-red-500">
                                    <span className="flex items-center gap-1">
                                        <span>الخصم</span>
                                        {order.discountCode && <span className="text-xs bg-red-50 px-1 rounded border border-red-100">{order.discountCode}</span>}
                                    </span>
                                    <span className="font-medium">- {formatMoney(order.discount)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">الشحن والتوصيل</span>
                                <span className="font-medium text-slate-900">{order.shippingFee === 0 ? 'مجاني' : formatMoney(order.shippingFee)}</span>
                            </div>
                        </div>
                        <div className="border-t border-slate-100 pt-4 pb-2">
                            <div className="flex justify-between items-end">
                                <span className="text-base font-bold text-slate-900">الإجمالي</span>
                                <span className="text-2xl font-black text-slate-900 tracking-tight">{formatMoney(order.amount)}</span>
                            </div>
                            <p className={`text-xs text-slate-400 mt-2 ${isRtl ? 'text-right' : 'text-left'}`}>مدفوع بواسطة {order.paymentMethod}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

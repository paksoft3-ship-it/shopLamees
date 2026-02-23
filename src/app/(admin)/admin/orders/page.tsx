'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useAdminOrders, OrderStatus } from '@/lib/stores/adminOrders';
import { useLocale } from 'next-intl';
import { formatMoney } from '@/lib/money';

export default function AdminOrdersPage() {
    const locale = useLocale();
    const isRtl = locale === 'ar';
    const orders = useAdminOrders((state) => state.orders);

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    // Derived state
    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const matchesSearch =
                order.id.includes(searchQuery) ||
                order.customerName.includes(searchQuery) ||
                order.customerPhone.includes(searchQuery);

            const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [orders, searchQuery, statusFilter]);

    const handleExportCSV = () => {
        const csvContent = [
            ['Order ID', 'Customer', 'Country', 'Amount', 'Payment', 'Status', 'Date'],
            ...filteredOrders.map(o => [
                o.id,
                o.customerName,
                o.country,
                o.amount,
                o.paymentMethod,
                o.status,
                o.date
            ])
        ].map(e => e.join(",")).join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'orders_export.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getStatusStyles = (status: OrderStatus) => {
        switch (status) {
            case 'pending': return 'bg-orange-100 text-orange-800 border-orange-200   ';
            case 'processing': return 'bg-[#edab1d]/20 text-yellow-800 border-[#edab1d]/20 ';
            case 'shipped': return 'bg-blue-100 text-blue-800 border-blue-200   ';
            case 'completed': return 'bg-green-100 text-green-800 border-green-200   ';
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-200   ';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusLabel = (status: OrderStatus) => {
        switch (status) {
            case 'pending': return 'بانتظار الدفع';
            case 'processing': return 'جاري التجهيز';
            case 'shipped': return 'تم الشحن';
            case 'completed': return 'مكتمل';
            case 'cancelled': return 'ملغي';
            default: return status;
        }
    };

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">إدارة الطلبات</h1>
                    <p className="text-slate-500 mt-1 text-sm">عرض وإدارة جميع طلبات العملاء الحالية والسابقة</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleExportCSV}
                        className="flex items-center justify-center gap-2 px-4 h-10 rounded-xl bg-white border border-[#e7e0cf] text-slate-700 text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm">
                        <span className="material-symbols-outlined text-[20px]">download</span>
                        <span>تصدير CSV</span>
                    </button>
                    <button className="flex items-center justify-center gap-2 px-5 h-10 rounded-xl bg-[#edab1d] text-slate-900 text-sm font-bold hover:brightness-110 transition-all shadow-md shadow-[#edab1d]/20">
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        <span className="hidden sm:inline">إنشاء طلب جديد</span>
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-[#e7e0cf] shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs text-slate-500 font-medium">إجمالي الطلبات</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{orders.length}</p>
                    </div>
                    <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                        <span className="material-symbols-outlined">shopping_cart</span>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#e7e0cf] shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs text-slate-500 font-medium">بانتظار الدفع</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{orders.filter(o => o.status === 'pending').length}</p>
                    </div>
                    <div className="h-10 w-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                        <span className="material-symbols-outlined">pending</span>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#e7e0cf] shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs text-slate-500 font-medium">جاري التجهيز</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{orders.filter(o => o.status === 'processing').length}</p>
                    </div>
                    <div className="h-10 w-10 rounded-lg bg-[#edab1d]/20 text-yellow-600 flex items-center justify-center">
                        <span className="material-symbols-outlined">inventory_2</span>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#e7e0cf] shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs text-slate-500 font-medium">مكتمل</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{orders.filter(o => o.status === 'completed').length}</p>
                    </div>
                    <div className="h-10 w-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
                        <span className="material-symbols-outlined">check_circle</span>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-[#e7e0cf] shadow-sm p-4 flex flex-col gap-4">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 relative min-w-[240px]">
                        <span className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined`}>search</span>
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`w-full h-11 ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'} rounded-xl border-slate-200 bg-slate-50 text-slate-900 text-sm focus:ring-2 focus:ring-[#edab1d]/50 focus:border-[#edab1d] transition-all`}
                            placeholder="بحث برقم الطلب أو اسم العميل / الهاتف..."
                            type="text"
                        />
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative group">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className={`appearance-none h-11 ${isRtl ? 'pr-4 pl-10' : 'pl-4 pr-10'} rounded-xl border-slate-200 bg-white text-slate-700 text-sm font-medium focus:ring-2 focus:ring-[#edab1d]/50 focus:border-[#edab1d] cursor-pointer min-w-[140px]`}>
                                <option value="all">جميع الحالات</option>
                                <option value="pending">بانتظار الدفع</option>
                                <option value="processing">جاري التجهيز</option>
                                <option value="shipped">تم الشحن</option>
                                <option value="completed">مكتمل</option>
                                <option value="cancelled">ملغي</option>
                            </select>
                            <span className={`absolute ${isRtl ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none material-symbols-outlined text-[20px]`}>expand_more</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:flex bg-white rounded-2xl border border-[#e7e0cf] shadow-sm overflow-hidden flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse">
                        <thead className="bg-slate-50 border-b border-[#e7e0cf]">
                            <tr>
                                <th className="py-4 px-6 w-12">
                                    <input className="w-4 h-4 text-[#edab1d] rounded border-gray-300 focus:ring-[#edab1d] cursor-pointer" type="checkbox" />
                                </th>
                                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">رقم الطلب</th>
                                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">العميل</th>
                                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">الدولة</th>
                                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">المبلغ</th>
                                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">طريقة الدفع</th>
                                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">الحالة</th>
                                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">التاريخ</th>
                                <th className="py-4 px-6 w-16"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#e7e0cf]">
                            {filteredOrders.map(order => (
                                <tr key={order.id} className="group hover:bg-slate-50 transition-colors">
                                    <td className="py-4 px-6">
                                        <input className="w-4 h-4 text-[#edab1d] rounded border-gray-300 focus:ring-[#edab1d] cursor-pointer" type="checkbox" />
                                    </td>
                                    <td className="py-4 px-6">
                                        <Link href={`/${locale}/admin/orders/${order.id}`} className="text-sm font-semibold text-[#edab1d] hover:underline">
                                            #{order.id}
                                        </Link>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-slate-900">{order.customerName}</span>
                                            <span className="text-xs text-slate-500">{order.customerEmail}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">{order.countryCode}</span>
                                            <span className="text-sm text-slate-700">{order.country}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="text-sm font-bold text-slate-900">{formatMoney(order.amount)}</span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-slate-400 text-lg">credit_card</span>
                                            <span className="text-sm text-slate-700">{order.paymentMethod}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusStyles(order.status)}`}>
                                            {getStatusLabel(order.status)}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="text-sm text-slate-500">{order.date}</span>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <Link href={`/${locale}/admin/orders/${order.id}`} className="p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors inline-block">
                                            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredOrders.length === 0 && (
                        <div className="p-12 text-center text-slate-500">
                            لا توجد طلبات تطابق بحثك.
                        </div>
                    )}
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-[#e7e0cf] flex items-center justify-between">
                    <button className="flex items-center gap-1 px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 disabled:opacity-50 transition-colors">
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                        <span>السابق</span>
                    </button>
                    <div className="flex items-center gap-1">
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#edab1d] text-slate-900 text-sm font-bold">1</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 text-sm">2</button>
                    </div>
                    <button className="flex items-center gap-1 px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 transition-colors">
                        <span>التالي</span>
                        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                    </button>
                </div>
            </div>

            {/* Mobile View */}
            <div className="md:hidden space-y-4">
                {filteredOrders.map((order) => (
                    <Link key={order.id} href={`/${locale}/admin/orders/${order.id}`} className="block bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-slate-900">#{order.id}</span>
                                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium border ${getStatusStyles(order.status)}`}>
                                    {getStatusLabel(order.status)}
                                </span>
                            </div>
                            <span className="text-xs text-slate-400">{order.date}</span>
                        </div>
                        <div className="flex gap-4 items-center">
                            <div className="size-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
                                {order.customerAvatar ? (
                                    <img src={order.customerAvatar} alt={order.customerName} className="size-full object-cover" />
                                ) : (
                                    <span className="material-symbols-outlined text-slate-400">person</span>
                                )}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-base font-bold text-slate-900">{order.customerName}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-sm font-medium text-[#edab1d]">{formatMoney(order.amount)}</span>
                                    <span className="size-1 rounded-full bg-slate-300"></span>
                                    <div className="flex items-center gap-1 text-xs text-slate-500">
                                        <span className="material-symbols-outlined text-[14px]">location_on</span>
                                        {order.shippingAddress.city}، {order.country}
                                    </div>
                                </div>
                            </div>
                            <span className={`material-symbols-outlined text-slate-300 ${isRtl ? '' : 'rotate-180'}`}>chevron_left</span>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Mobile Empty State */}
            {filteredOrders.length === 0 && (
                <div className="md:hidden p-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-100">
                    لا توجد طلبات تطابق بحثك.
                </div>
            )}
        </div>
    );
}
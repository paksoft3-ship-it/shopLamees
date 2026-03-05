'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { formatMoney } from '@/lib/money';
import { AdminCustomerDetails, getAdminCustomerDetails } from '@/lib/actions/adminCustomers';

export default function CustomerDetailsPage({ params }: { params: { id: string } }) {
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const [customer, setCustomer] = useState<AdminCustomerDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminCustomerDetails(decodeURIComponent(params.id)).then((data) => {
      setCustomer(data);
      setLoading(false);
    });
  }, [params.id]);

  if (loading) {
    return <div className="p-8 text-center text-neutral-500">{isRtl ? 'جاري تحميل بيانات العميل...' : 'Loading customer details...'}</div>;
  }

  if (!customer) {
    return <div className="p-8 text-center text-red-500">{isRtl ? 'لم يتم العثور على العميل' : 'Customer not found'}</div>;
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1b170d]">{customer.name}</h1>
          <p className="text-sm text-neutral-500">{customer.email || (isRtl ? 'بدون بريد إلكتروني' : 'No email')}</p>
        </div>
        <Link href="/admin/customers" className="text-sm text-primary hover:underline">
          {isRtl ? 'العودة للعملاء' : 'Back to customers'}
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-4">
          <p className="text-xs text-neutral-500">{isRtl ? 'إجمالي الطلبات' : 'Total orders'}</p>
          <p className="text-xl font-bold text-[#1b170d] mt-1">{customer.orders}</p>
        </div>
        <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-4">
          <p className="text-xs text-neutral-500">{isRtl ? 'إجمالي الإنفاق' : 'Total spend'}</p>
          <p className="text-xl font-bold text-[#1b170d] mt-1">{formatMoney(customer.spent, locale as 'ar' | 'en')}</p>
        </div>
        <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-4">
          <p className="text-xs text-neutral-500">{isRtl ? 'آخر طلب' : 'Last order'}</p>
          <p className="text-xl font-bold text-[#1b170d] mt-1">{new Date(customer.lastOrderAt).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US')}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-5 space-y-3">
        <h2 className="font-bold text-[#1b170d]">{isRtl ? 'بيانات التواصل' : 'Contact details'}</h2>
        <p className="text-sm"><span className="font-medium">{isRtl ? 'الهاتف:' : 'Phone:'}</span> {customer.phone}</p>
        <p className="text-sm"><span className="font-medium">{isRtl ? 'الدولة:' : 'Country:'}</span> {customer.country}</p>
      </div>

      <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-5 space-y-3">
        <h2 className="font-bold text-[#1b170d]">{isRtl ? 'العنوان الأخير' : 'Latest address'}</h2>
        {customer.latestAddress ? (
          <div className="text-sm text-neutral-700 space-y-1">
            <p>{customer.latestAddress.city} {customer.latestAddress.zone ? `- ${customer.latestAddress.zone}` : ''}</p>
            <p>{customer.latestAddress.street}</p>
            <p>{customer.latestAddress.building}</p>
            <p>{customer.latestAddress.country}</p>
          </div>
        ) : (
          <p className="text-sm text-neutral-400">{isRtl ? 'لا يوجد عنوان متاح' : 'No address available'}</p>
        )}
      </div>

      <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-5 space-y-3">
        <h2 className="font-bold text-[#1b170d]">{isRtl ? 'الطلبات' : 'Orders'}</h2>
        <div className="flex flex-wrap gap-2">
          {customer.orderIds.map((orderId) => (
            <Link key={orderId} href={`/admin/orders/${orderId}`} className="text-xs bg-[#edab1d]/10 text-[#d49511] px-2.5 py-1.5 rounded-lg font-semibold hover:bg-[#edab1d]/20 transition-colors">
              #{orderId}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { AdminShippingInsight, getAdminShippingInsights, getAdminStoreSettings } from '@/lib/actions/adminInsights';
import { formatMoney } from '@/lib/money';

export default function ShippingPage() {
  const t = useTranslations('Admin.Shipping');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const [data, setData] = useState<AdminShippingInsight | null>(null);
  const [settings, setSettings] = useState<{ shippingQarQA: number; shippingSarSA: number; freeShipAbove: number } | null>(null);

  useEffect(() => {
    Promise.all([getAdminShippingInsights(), getAdminStoreSettings()]).then(([shipping, s]) => {
      setData(shipping);
      setSettings({ shippingQarQA: s.shippingQarQA, shippingSarSA: s.shippingSarSA, freeShipAbove: s.freeShipAbove });
    });
  }, []);

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <div>
        <h1 className="text-[28px] font-bold text-[#1b170d]">{t('title')}</h1>
        <p className="text-neutral-500 text-sm mt-1">{t('subtitle')}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: isRtl ? 'طلبات قيد الشحن' : 'Shipped orders', value: data?.shippingOrders ?? '—', icon: 'local_shipping', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: isRtl ? 'متوسط التجهيز (يوم)' : 'Avg fulfillment (days)', value: data ? data.avgFulfillmentDays.toFixed(1) : '—', icon: 'schedule', color: 'text-amber-500', bg: 'bg-amber-50' },
          { label: isRtl ? 'نسبة الشحن المجاني' : 'Free shipping rate', value: data ? `${Math.round(data.freeShippingRate)}%` : '—', icon: 'free_cancellation', color: 'text-green-600', bg: 'bg-green-50' },
          { label: isRtl ? 'نسبة نجاح التسليم' : 'Delivery success rate', value: data ? `${Math.round(data.successRate)}%` : '—', icon: 'verified', color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((m, i) => (
          <div key={i} className="bg-white rounded-xl border border-neutral-100 shadow-sm p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-full ${m.bg} flex items-center justify-center shrink-0`}>
              <span className={`material-symbols-outlined ${m.color} text-[18px]`}>{m.icon}</span>
            </div>
            <div>
              <p className="text-xs text-neutral-500">{m.label}</p>
              <p className="text-base font-bold text-[#1b170d]">{m.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-6">
          <h3 className="font-bold text-[#1b170d] mb-4">{isRtl ? 'إعدادات المناطق والشحن' : 'Zones and shipping settings'}</h3>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-100">
              <p className="text-sm font-medium text-[#1b170d]">{isRtl ? 'قطر (QA)' : 'Qatar (QA)'}</p>
              <p className="text-xs text-neutral-500 mt-1">{isRtl ? 'رسوم الشحن' : 'Shipping fee'}: {formatMoney(settings?.shippingQarQA ?? 0, locale as 'ar' | 'en')}</p>
            </div>
            <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-100">
              <p className="text-sm font-medium text-[#1b170d]">{isRtl ? 'السعودية (SA)' : 'Saudi Arabia (SA)'}</p>
              <p className="text-xs text-neutral-500 mt-1">{isRtl ? 'رسوم الشحن' : 'Shipping fee'}: {formatMoney(settings?.shippingSarSA ?? 0, locale as 'ar' | 'en')}</p>
            </div>
            <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-100">
              <p className="text-sm font-medium text-[#1b170d]">{isRtl ? 'حد الشحن المجاني' : 'Free shipping threshold'}</p>
              <p className="text-xs text-neutral-500 mt-1">{formatMoney(settings?.freeShipAbove ?? 0, locale as 'ar' | 'en')}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-6">
          <h3 className="font-bold text-[#1b170d] mb-4">{isRtl ? 'ملخص حسب الدولة' : 'Country summary'}</h3>
          <div className="space-y-3">
            {(data?.zones || []).map((z) => (
              <div key={z.country} className="p-3 rounded-lg bg-neutral-50 border border-neutral-100">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-[#1b170d]">{z.country === 'QA' ? (isRtl ? 'قطر' : 'Qatar') : (isRtl ? 'السعودية' : 'Saudi Arabia')}</span>
                  <span className="font-bold text-neutral-700">{z.orders}</span>
                </div>
                <p className="text-xs text-neutral-500 mt-1">{isRtl ? 'متوسط رسوم الشحن' : 'Avg shipping fee'}: {formatMoney(z.shippingFeeAvg, locale as 'ar' | 'en')}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-neutral-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-neutral-100"><h3 className="font-bold text-[#1b170d]">{isRtl ? 'الشحنات الأخيرة' : 'Recent shipments'}</h3></div>
        <div className="overflow-x-auto">
          <table className={`w-full ${isRtl ? 'text-right' : 'text-left'}`}>
            <thead className="bg-neutral-50 text-xs text-neutral-500 font-medium">
              <tr>
                <th className="px-5 py-3">{isRtl ? 'رقم الطلب' : 'Order ID'}</th>
                <th className="px-5 py-3">{isRtl ? 'العميل' : 'Customer'}</th>
                <th className="px-5 py-3">{isRtl ? 'الدولة' : 'Country'}</th>
                <th className="px-5 py-3">{isRtl ? 'الحالة' : 'Status'}</th>
                <th className="px-5 py-3">{isRtl ? 'تاريخ متوقع' : 'Expected date'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {(data?.recentShipments || []).slice(0, 12).map((r) => (
                <tr key={r.orderId} className="hover:bg-neutral-50">
                  <td className="px-5 py-4 font-mono text-xs text-neutral-500">{r.orderId}</td>
                  <td className="px-5 py-4 text-sm text-[#1b170d]">{r.customer}</td>
                  <td className="px-5 py-4 text-sm">{r.country}</td>
                  <td className="px-5 py-4 text-xs"><span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-bold">{r.status}</span></td>
                  <td className="px-5 py-4 text-xs text-neutral-400">{new Date(r.expectedDate).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

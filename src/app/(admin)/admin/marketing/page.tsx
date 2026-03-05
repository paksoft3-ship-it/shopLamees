'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { formatMoney } from '@/lib/money';
import { AdminMarketingInsight, getAdminMarketingInsights } from '@/lib/actions/adminInsights';

export default function MarketingPage() {
  const t = useTranslations('Admin.Marketing');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const [data, setData] = useState<AdminMarketingInsight | null>(null);

  useEffect(() => {
    getAdminMarketingInsights().then(setData);
  }, []);

  const top = useMemo(() => (data?.discountCodePerformance || []).slice(0, 10), [data]);

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-[#1b170d]">{t('title')}</h1>
          <p className="text-neutral-500 text-sm mt-1">{t('subtitle')}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: isRtl ? 'إيراد الخصومات' : 'Discount-attributed revenue', value: formatMoney(data?.totalAttributedRevenue || 0, locale as 'ar' | 'en'), icon: 'payments', color: 'text-green-600', bg: 'bg-green-50' },
          { label: isRtl ? 'أكواد نشطة' : 'Active codes', value: data?.activeDiscountCodes || 0, icon: 'sell', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: isRtl ? 'إجمالي الأكواد' : 'Total codes', value: data?.discountCodePerformance.length || 0, icon: 'loyalty', color: 'text-amber-500', bg: 'bg-amber-50' },
          { label: isRtl ? 'دول العملاء' : 'Customer countries', value: data?.topCountries.length || 0, icon: 'public', color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((m, i) => (
          <div key={i} className="bg-white rounded-xl border border-neutral-100 shadow-sm p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${m.bg} flex items-center justify-center shrink-0`}>
              <span className={`material-symbols-outlined ${m.color}`} style={{ fontSize: '20px' }}>{m.icon}</span>
            </div>
            <div>
              <p className="text-xs text-neutral-500 leading-tight">{m.label}</p>
              <p className="text-base font-bold text-[#1b170d]">{m.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-neutral-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-neutral-100">
            <h3 className="font-bold text-[#1b170d]">{isRtl ? 'أداء أكواد الخصم' : 'Discount code performance'}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className={`w-full ${isRtl ? 'text-right' : 'text-left'}`}>
              <thead className="bg-neutral-50 text-xs text-neutral-500 font-medium">
                <tr>
                  <th className="px-5 py-3">{isRtl ? 'الكود' : 'Code'}</th>
                  <th className="px-5 py-3">{isRtl ? 'عدد الاستخدام' : 'Uses'}</th>
                  <th className="px-5 py-3">{isRtl ? 'إيراد' : 'Revenue'}</th>
                  <th className="px-5 py-3">{isRtl ? 'خصم ممنوح' : 'Granted discount'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {!data ? (
                  <tr><td className="px-5 py-6 text-neutral-400" colSpan={4}>{isRtl ? 'جاري التحميل...' : 'Loading...'}</td></tr>
                ) : top.length === 0 ? (
                  <tr><td className="px-5 py-8 text-neutral-400" colSpan={4}>{isRtl ? 'لا توجد بيانات تسويق بعد.' : 'No marketing data yet.'}</td></tr>
                ) : top.map((r) => (
                  <tr key={r.code} className="hover:bg-neutral-50">
                    <td className="px-5 py-4 font-mono font-bold text-[#1b170d]">{r.code}</td>
                    <td className="px-5 py-4 text-sm">{r.uses}</td>
                    <td className="px-5 py-4 text-sm font-bold text-green-600">{formatMoney(r.revenue, locale as 'ar' | 'en')}</td>
                    <td className="px-5 py-4 text-sm font-bold text-red-500">{formatMoney(r.discount, locale as 'ar' | 'en')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-6">
          <h3 className="font-bold text-[#1b170d] mb-4">{isRtl ? 'توزيع العملاء حسب الدولة' : 'Customers by country'}</h3>
          <div className="space-y-3">
            {(data?.topCountries || []).map((c) => (
              <div key={c.country} className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 border border-neutral-100">
                <span className="text-sm font-medium text-[#1b170d]">{c.country}</span>
                <span className="text-sm font-bold text-neutral-600">{c.customers}</span>
              </div>
            ))}
            {data && data.topCountries.length === 0 && (
              <p className="text-sm text-neutral-400">{isRtl ? 'لا توجد بيانات عملاء كافية.' : 'No enough customer data.'}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

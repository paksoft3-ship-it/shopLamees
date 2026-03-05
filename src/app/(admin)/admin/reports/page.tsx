'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { formatMoney } from '@/lib/money';
import { AdminReportInsight, getAdminReportInsights } from '@/lib/actions/adminInsights';

export default function ReportsPage() {
  const t = useTranslations('Admin.Reports');
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const [data, setData] = useState<AdminReportInsight | null>(null);

  useEffect(() => {
    getAdminReportInsights().then(setData);
  }, []);

  const maxRevenue = useMemo(() => Math.max(...(data?.monthlyRevenue.map((m) => m.revenue) || [1])), [data]);

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-[#1b170d]">{t('title')}</h1>
          <p className="text-neutral-500 text-sm mt-1">{t('subtitle')}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: t('total_revenue'), value: formatMoney(data?.totalRevenue || 0, locale as 'ar' | 'en'), icon: 'payments', color: 'text-green-600', bg: 'bg-green-50' },
          { label: t('total_orders'), value: (data?.totalOrders || 0).toLocaleString(locale === 'ar' ? 'ar' : 'en'), icon: 'shopping_bag', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: t('avg_order'), value: formatMoney(data?.avgOrder || 0, locale as 'ar' | 'en'), icon: 'analytics', color: 'text-amber-500', bg: 'bg-amber-50' },
          { label: isRtl ? 'نسبة الإلغاء' : 'Cancel rate', value: data?.totalOrders ? `${Math.round((data.cancelledOrders / data.totalOrders) * 100)}%` : '0%', icon: 'cancel', color: 'text-red-500', bg: 'bg-red-50' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white rounded-xl border border-neutral-100 shadow-sm p-5">
            <div className={`w-10 h-10 rounded-full ${kpi.bg} flex items-center justify-center mb-3`}>
              <span className={`material-symbols-outlined ${kpi.color}`} style={{ fontSize: '20px' }}>{kpi.icon}</span>
            </div>
            <p className="text-xs text-neutral-500 mb-1">{kpi.label}</p>
            <p className="text-xl font-bold text-[#1b170d]">{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-6">
        <h3 className="text-lg font-bold text-[#1b170d] mb-5">{t('revenue_chart')}</h3>
        <div className="relative h-52">
          <div className="absolute inset-0 flex items-end justify-between px-2 gap-3">
            {(data?.monthlyRevenue || []).map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex items-end gap-1 h-40">
                  <div className="flex-1 bg-[#edab1d] rounded-t-md" style={{ height: `${(d.revenue / maxRevenue) * 100}%` }} />
                  <div className="flex-1 bg-blue-200 rounded-t-md" style={{ height: `${(d.orders / Math.max(...(data?.monthlyRevenue.map((m) => m.orders) || [1]))) * 80}%` }} />
                </div>
                <span className="text-xs text-neutral-500 font-medium">{d.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-neutral-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-neutral-100"><h3 className="font-bold text-[#1b170d]">{t('top_products')}</h3></div>
          <div className="overflow-x-auto">
            <table className={`w-full ${isRtl ? 'text-right' : 'text-left'}`}>
              <thead className="bg-neutral-50 text-xs text-neutral-500 font-medium">
                <tr>
                  <th className="px-5 py-3">{t('product')}</th>
                  <th className="px-5 py-3">SKU</th>
                  <th className="px-5 py-3">{t('units')}</th>
                  <th className="px-5 py-3">{t('revenue')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {(data?.topProducts || []).slice(0, 8).map((p) => (
                  <tr key={p.sku} className="hover:bg-neutral-50">
                    <td className="px-5 py-4 text-sm font-medium text-[#1b170d]">{isRtl ? p.nameAr : p.nameEn}</td>
                    <td className="px-5 py-4 text-xs font-mono text-neutral-400">{p.sku}</td>
                    <td className="px-5 py-4 text-sm">{p.sold}</td>
                    <td className="px-5 py-4 text-sm font-bold text-green-600">{formatMoney(p.revenue, locale as 'ar' | 'en')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-6">
          <h3 className="font-bold text-[#1b170d] mb-4">{t('sales_by_country')}</h3>
          <div className="space-y-3">
            {(data?.countrySales || []).map((c) => (
              <div key={c.country} className="p-3 rounded-lg bg-neutral-50 border border-neutral-100">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-[#1b170d]">{c.country}</span>
                  <span className="font-bold text-neutral-700">{formatMoney(c.revenue, locale as 'ar' | 'en')}</span>
                </div>
                <p className="text-xs text-neutral-500">{t('orders')}: {c.orders}</p>
              </div>
            ))}
          </div>

          <h3 className="font-bold text-[#1b170d] mt-6 mb-4">{t('payment_methods')}</h3>
          <div className="space-y-3">
            {(data?.paymentMethods || []).map((pm) => (
              <div key={pm.method} className="flex items-center justify-between text-sm">
                <span className="text-neutral-700">{pm.method}</span>
                <span className="font-bold text-[#1b170d]">{pm.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

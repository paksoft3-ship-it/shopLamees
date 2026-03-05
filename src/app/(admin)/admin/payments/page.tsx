'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { formatMoney } from '@/lib/money';
import { AdminPaymentsInsight, getAdminPaymentsInsights } from '@/lib/actions/adminInsights';

const statusLabel = (status: string, isRtl: boolean) => {
  switch (status) {
    case 'COMPLETED': return isRtl ? 'مكتمل' : 'Completed';
    case 'SHIPPED': return isRtl ? 'تم الشحن' : 'Shipped';
    case 'PROCESSING': return isRtl ? 'قيد المعالجة' : 'Processing';
    case 'NEW': return isRtl ? 'جديد' : 'New';
    case 'CANCELLED': return isRtl ? 'ملغي' : 'Cancelled';
    default: return status;
  }
};

export default function PaymentsPage() {
  const t = useTranslations('Admin.Payments');
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const [data, setData] = useState<AdminPaymentsInsight | null>(null);

  useEffect(() => {
    getAdminPaymentsInsights().then(setData);
  }, []);

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <div>
        <h1 className="text-[28px] font-bold text-[#1b170d]">{t('title')}</h1>
        <p className="text-neutral-500 text-sm mt-1">{t('subtitle')}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: isRtl ? 'إيرادات آخر 30 يوم' : 'Last 30 days revenue', value: formatMoney(data?.monthlyRevenue || 0, locale as 'ar' | 'en'), icon: 'payments', color: 'text-green-600', bg: 'bg-green-50' },
          { label: isRtl ? 'معاملات ناجحة' : 'Successful transactions', value: data?.successfulTransactions ?? '—', icon: 'check_circle', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: isRtl ? 'معاملات معلقة' : 'Pending transactions', value: data?.pendingTransactions ?? '—', icon: 'pending', color: 'text-amber-500', bg: 'bg-amber-50' },
          { label: isRtl ? 'إجمالي الملغى' : 'Cancelled amount', value: formatMoney(data?.refundedAmount || 0, locale as 'ar' | 'en'), icon: 'currency_exchange', color: 'text-red-500', bg: 'bg-red-50' },
        ].map((m, i) => (
          <div key={i} className="bg-white rounded-xl border border-neutral-100 shadow-sm p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-full ${m.bg} flex items-center justify-center shrink-0`}>
              <span className={`material-symbols-outlined ${m.color} text-[18px]`}>{m.icon}</span>
            </div>
            <div>
              <p className="text-xs text-neutral-500 leading-tight">{m.label}</p>
              <p className="text-base font-bold text-[#1b170d]">{m.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-6">
          <h3 className="font-bold text-[#1b170d] mb-4">{isRtl ? 'توزيع طرق الدفع' : 'Payment method distribution'}</h3>
          <div className="space-y-3">
            {(data?.methodDistribution || []).map((pm) => (
              <div key={pm.method} className="p-3 rounded-lg bg-neutral-50 border border-neutral-100">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-[#1b170d]">{pm.method}</span>
                  <span className="font-bold text-neutral-700">{pm.count}</span>
                </div>
                <p className="text-xs text-neutral-500">{formatMoney(pm.amount, locale as 'ar' | 'en')}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-6">
          <h3 className="font-bold text-[#1b170d] mb-4">{isRtl ? 'حالة المعاملات' : 'Transaction status'}</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm"><span>{isRtl ? 'ناجحة' : 'Successful'}</span><span className="font-bold text-green-600">{data?.successfulTransactions ?? 0}</span></div>
            <div className="flex items-center justify-between text-sm"><span>{isRtl ? 'معلقة' : 'Pending'}</span><span className="font-bold text-amber-600">{data?.pendingTransactions ?? 0}</span></div>
            <div className="flex items-center justify-between text-sm"><span>{isRtl ? 'فاشلة/ملغية' : 'Failed/Cancelled'}</span><span className="font-bold text-red-500">{data?.failedTransactions ?? 0}</span></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-neutral-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-neutral-100"><h3 className="font-bold text-[#1b170d]">{isRtl ? 'أحدث المعاملات' : 'Recent transactions'}</h3></div>
        <div className="overflow-x-auto">
          <table className={`w-full ${isRtl ? 'text-right' : 'text-left'}`}>
            <thead className="bg-neutral-50 text-xs text-neutral-500 font-medium">
              <tr>
                <th className="px-5 py-3">{isRtl ? 'الطلب' : 'Order'}</th>
                <th className="px-5 py-3">{isRtl ? 'العميل' : 'Customer'}</th>
                <th className="px-5 py-3">{isRtl ? 'المبلغ' : 'Amount'}</th>
                <th className="px-5 py-3">{isRtl ? 'الطريقة' : 'Method'}</th>
                <th className="px-5 py-3">{t('status')}</th>
                <th className="px-5 py-3">{t('date')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {(data?.recentTransactions || []).slice(0, 20).map((tx) => (
                <tr key={tx.orderId} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-5 py-4 font-mono text-xs text-neutral-500">{tx.orderId}</td>
                  <td className="px-5 py-4 text-sm text-[#1b170d]">{tx.customer}</td>
                  <td className="px-5 py-4 text-sm font-bold">{formatMoney(tx.amount, locale as 'ar' | 'en')}</td>
                  <td className="px-5 py-4 text-sm">{tx.method}</td>
                  <td className="px-5 py-4 text-xs"><span className="px-2 py-1 rounded-full bg-neutral-100 text-neutral-700 font-bold">{statusLabel(tx.status, isRtl)}</span></td>
                  <td className="px-5 py-4 text-xs text-neutral-400">{new Date(tx.date).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

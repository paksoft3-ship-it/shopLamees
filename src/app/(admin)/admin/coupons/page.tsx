'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { formatMoney } from '@/lib/money';
import { AdminCouponInsight, getAdminCouponInsights } from '@/lib/actions/adminInsights';

export default function CouponsPage() {
  const t = useTranslations('Admin.Coupons');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const [coupons, setCoupons] = useState<AdminCouponInsight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminCouponInsights().then((data) => {
      setCoupons(data);
      setLoading(false);
    });
  }, []);

  const totals = useMemo(() => {
    const totalUses = coupons.reduce((s, c) => s + c.uses, 0);
    const savings = coupons.reduce((s, c) => s + c.totalDiscount, 0);
    const active = coupons.filter((c) => c.active).length;
    const expired = coupons.length - active;
    return { totalUses, savings, active, expired };
  }, [coupons]);

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
          { label: t('active_coupons'), value: totals.active, icon: 'loyalty', color: 'text-green-600', bg: 'bg-green-50' },
          { label: t('total_uses'), value: totals.totalUses.toLocaleString(locale === 'ar' ? 'ar' : 'en'), icon: 'redeem', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: t('expired'), value: totals.expired, icon: 'event_busy', color: 'text-neutral-500', bg: 'bg-neutral-100' },
          { label: t('savings'), value: formatMoney(totals.savings, locale as 'ar' | 'en'), icon: 'savings', color: 'text-amber-500', bg: 'bg-amber-50' },
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

      <div className="bg-white rounded-xl border border-neutral-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className={`w-full ${isRtl ? 'text-right' : 'text-left'}`}>
            <thead className="bg-neutral-50 text-xs text-neutral-500 font-medium">
              <tr>
                <th className="px-5 py-3">{t('code_col')}</th>
                <th className="px-5 py-3">{t('usage_col')}</th>
                <th className="px-5 py-3">{isRtl ? 'الخصم الممنوح' : 'Total discount'}</th>
                <th className="px-5 py-3">{isRtl ? 'إيرادات من الكود' : 'Revenue from code'}</th>
                <th className="px-5 py-3">{t('expires_col')}</th>
                <th className="px-5 py-3">{t('status_col')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {loading ? (
                <tr><td className="px-5 py-6 text-neutral-400" colSpan={6}>{isRtl ? 'جاري التحميل...' : 'Loading...'}</td></tr>
              ) : coupons.length === 0 ? (
                <tr><td className="px-5 py-8 text-neutral-400" colSpan={6}>{isRtl ? 'لا توجد أكواد خصم مستخدمة بعد.' : 'No discount codes have been used yet.'}</td></tr>
              ) : coupons.map((c) => (
                <tr key={c.code} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-5 py-4"><span className="font-mono font-bold text-[#1b170d] bg-neutral-100 px-3 py-1 rounded-md text-sm">{c.code}</span></td>
                  <td className="px-5 py-4 text-sm font-bold text-[#1b170d]">{c.uses}</td>
                  <td className="px-5 py-4 text-sm text-red-500 font-bold">{formatMoney(c.totalDiscount, locale as 'ar' | 'en')}</td>
                  <td className="px-5 py-4 text-sm text-green-600 font-bold">{formatMoney(c.totalRevenue, locale as 'ar' | 'en')}</td>
                  <td className="px-5 py-4 text-xs text-neutral-400">{new Date(c.lastUsedAt).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US')}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${c.active ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-500'}`}>
                      {c.active ? (isRtl ? 'نشط' : 'Active') : (isRtl ? 'غير نشط' : 'Inactive')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

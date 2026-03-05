'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { AdminSEOInsight, getAdminSEOInsights } from '@/lib/actions/adminInsights';

export default function SEOPage() {
  const t = useTranslations('Admin.SEO');
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const [data, setData] = useState<AdminSEOInsight | null>(null);

  useEffect(() => {
    getAdminSEOInsights().then(setData);
  }, []);

  const health = useMemo(() => {
    if (!data) return 0;
    const productTitle = data.productsCount ? (data.productsWithEnTitle / data.productsCount) * 100 : 0;
    const productDesc = data.productsCount ? (data.productsWithEnDesc / data.productsCount) * 100 : 0;
    const categoryName = data.categoriesCount ? (data.categoriesWithEnName / data.categoriesCount) * 100 : 0;
    return Math.round((productTitle + productDesc + categoryName) / 3);
  }, [data]);

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
          { label: isRtl ? 'درجة الصحة' : 'SEO health', value: `${health}%`, icon: 'monitoring', color: 'text-amber-500', bg: 'bg-amber-50' },
          { label: isRtl ? 'منتجات بعنوان EN' : 'Products with EN title', value: data ? `${data.productsWithEnTitle}/${data.productsCount}` : '—', icon: 'sell', color: 'text-green-600', bg: 'bg-green-50' },
          { label: isRtl ? 'منتجات بوصف EN' : 'Products with EN description', value: data ? `${data.productsWithEnDesc}/${data.productsCount}` : '—', icon: 'description', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: isRtl ? 'تصنيفات باسم EN' : 'Categories with EN name', value: data ? `${data.categoriesWithEnName}/${data.categoriesCount}` : '—', icon: 'category', color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-xl border border-neutral-100 shadow-sm p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${item.bg} flex items-center justify-center`}>
              <span className={`material-symbols-outlined ${item.color}`} style={{ fontSize: '20px' }}>{item.icon}</span>
            </div>
            <div>
              <p className="text-xs text-neutral-500">{item.label}</p>
              <p className="text-lg font-bold text-[#1b170d]">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-neutral-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-neutral-100">
          <h3 className="font-bold text-[#1b170d]">{isRtl ? 'صفحات أساسية للمراجعة' : 'Core pages audit'}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className={`w-full ${isRtl ? 'text-right' : 'text-left'}`}>
            <thead className="bg-neutral-50 text-xs text-neutral-500 font-medium">
              <tr>
                <th className="px-5 py-3">{isRtl ? 'الصفحة' : 'Page'}</th>
                <th className="px-5 py-3">Path</th>
                <th className="px-5 py-3">{t('meta_title')}</th>
                <th className="px-5 py-3">{t('meta_desc')}</th>
                <th className="px-5 py-3">{isRtl ? 'الدرجة' : 'Score'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {!data ? (
                <tr><td className="px-5 py-6 text-neutral-400" colSpan={5}>{isRtl ? 'جاري التحميل...' : 'Loading...'}</td></tr>
              ) : data.pages.map((p) => (
                <tr key={p.path} className="hover:bg-neutral-50">
                  <td className="px-5 py-4 font-medium text-[#1b170d]">{p.page}</td>
                  <td className="px-5 py-4 text-xs font-mono text-neutral-400">{p.path}</td>
                  <td className="px-5 py-4 text-sm text-neutral-700">{p.title}</td>
                  <td className="px-5 py-4 text-sm text-neutral-600">{p.desc}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${p.score >= 85 ? 'bg-green-100 text-green-700' : p.score >= 70 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-600'}`}>
                      {p.score}
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

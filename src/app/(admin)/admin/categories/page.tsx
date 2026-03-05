'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import {
  AdminCategory,
  createAdminCategory,
  deleteAdminCategory,
  getAdminCategories,
  updateAdminCategory,
} from '@/lib/actions/adminCategories';

type CategoryForm = {
  nameAr: string;
  nameEn: string;
  slug: string;
  sortOrder: number;
  image: string;
};

const emptyForm: CategoryForm = {
  nameAr: '',
  nameEn: '',
  slug: '',
  sortOrder: 1,
  image: '',
};

export default function CategoriesPage() {
  const t = useTranslations('Admin.Categories');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editCat, setEditCat] = useState<AdminCategory | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<CategoryForm>(emptyForm);

  const loadCategories = async () => {
    const data = await getAdminCategories();
    setCategories(data);
    setLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const totals = useMemo(() => {
    return {
      totalCats: categories.length,
      totalProducts: categories.reduce((sum, c) => sum + c.products, 0),
      withProducts: categories.filter((c) => c.products > 0).length,
    };
  }, [categories]);

  const openNew = () => {
    setEditCat(null);
    setForm({ ...emptyForm, sortOrder: categories.length + 1 });
    setShowModal(true);
  };

  const openEdit = (cat: AdminCategory) => {
    setEditCat(cat);
    setForm({
      nameAr: cat.nameAr,
      nameEn: cat.nameEn,
      slug: cat.slug,
      sortOrder: cat.sortOrder,
      image: cat.image || '',
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.nameAr.trim() || !form.nameEn.trim() || !form.slug.trim()) return;

    setSaving(true);
    try {
      if (editCat) {
        await updateAdminCategory(editCat.id, form);
      } else {
        await createAdminCategory(form);
      }
      setShowModal(false);
      await loadCategories();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(isRtl ? 'هل تريد حذف التصنيف؟' : 'Delete this category?')) return;
    await deleteAdminCategory(id);
    await loadCategories();
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-[#1b170d]">{t('title')}</h1>
          <p className="text-neutral-500 text-sm mt-1">{t('subtitle')}</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-[#edab1d] hover:bg-[#d49511] text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-md">
          <span className="material-symbols-outlined text-lg">add</span>
          {t('new_category')}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: t('total_cats'), value: totals.totalCats, icon: 'category', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: t('active_cats'), value: totals.withProducts, icon: 'inventory_2', color: 'text-green-600', bg: 'bg-green-50' },
          { label: t('total_products'), value: totals.totalProducts, icon: 'sell', color: 'text-amber-500', bg: 'bg-amber-50' },
        ].map((m, i) => (
          <div key={i} className="bg-white rounded-xl border border-neutral-100 shadow-sm p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-full ${m.bg} flex items-center justify-center shrink-0`}>
              <span className={`material-symbols-outlined ${m.color} text-[18px]`}>{m.icon}</span>
            </div>
            <div>
              <p className="text-xs text-neutral-500">{m.label}</p>
              <p className="text-lg font-bold text-[#1b170d]">{m.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-neutral-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-neutral-500">{isRtl ? 'جاري التحميل...' : 'Loading...'}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className={`w-full ${isRtl ? 'text-right' : 'text-left'}`}>
              <thead className="bg-neutral-50 text-xs text-neutral-500 font-medium">
                <tr>
                  <th className="px-5 py-3">{t('sort_order_col')}</th>
                  <th className="px-5 py-3">{t('name_ar_col')}</th>
                  <th className="px-5 py-3">{t('name_en_col')}</th>
                  <th className="px-5 py-3">Slug</th>
                  <th className="px-5 py-3">{t('products_col')}</th>
                  <th className="px-5 py-3">{t('action_col')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-5 py-4">
                      <span className="w-7 h-7 bg-neutral-100 rounded-md flex items-center justify-center text-sm font-bold text-neutral-500">
                        {cat.sortOrder}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-neutral-100 overflow-hidden shrink-0 relative">
                          {cat.image ? (
                            <Image src={cat.image} alt={cat.nameEn} fill className="object-cover" sizes="40px" />
                          ) : (
                            <span className="material-symbols-outlined text-neutral-400 text-[18px] absolute inset-0 flex items-center justify-center">category</span>
                          )}
                        </div>
                        <span className="font-bold text-[#1b170d] text-sm">{locale === 'ar' ? cat.nameAr : cat.nameEn}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-neutral-600">{cat.nameEn}</td>
                    <td className="px-5 py-4 font-mono text-xs text-neutral-400">/{cat.slug}</td>
                    <td className="px-5 py-4">
                      <span className="bg-[#edab1d]/10 text-[#d49511] text-xs font-bold px-2.5 py-1 rounded-full">{cat.products} {t('products_unit')}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(cat)} className="p-1.5 text-[#edab1d] hover:bg-[#edab1d]/10 rounded-lg transition-colors">
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button onClick={() => handleDelete(cat.id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-[#1b170d]">{editCat ? t('edit_cat') : t('new_cat')}</h3>
              <button onClick={() => setShowModal(false)} className="text-neutral-400 hover:text-neutral-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1b170d] mb-1">{t('name_ar_label')}</label>
                <input value={form.nameAr} onChange={(e) => setForm((f) => ({ ...f, nameAr: e.target.value }))} className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#edab1d]/30 focus:border-[#edab1d]" dir="rtl" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1b170d] mb-1">{t('name_en_label')}</label>
                <input value={form.nameEn} onChange={(e) => setForm((f) => ({ ...f, nameEn: e.target.value }))} className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#edab1d]/30 focus:border-[#edab1d]" dir="ltr" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1b170d] mb-1">{t('slug_label')}</label>
                <input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#edab1d]/30 focus:border-[#edab1d]" dir="ltr" placeholder="black-abayas" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1b170d] mb-1">{isRtl ? 'رابط الصورة' : 'Image URL'}</label>
                <input value={form.image} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))} className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#edab1d]/30 focus:border-[#edab1d]" dir="ltr" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1b170d] mb-1">{t('sort_order_label')}</label>
                <input type="number" value={form.sortOrder} onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))} className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#edab1d]/30 focus:border-[#edab1d]" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 border border-neutral-200 text-neutral-700 py-2.5 rounded-xl text-sm font-medium hover:bg-neutral-50">{t('cancel')}</button>
              <button disabled={saving} onClick={handleSave} className="flex-1 bg-[#edab1d] hover:bg-[#d49511] disabled:opacity-60 text-white py-2.5 rounded-xl text-sm font-bold transition-colors">{saving ? (isRtl ? 'جاري الحفظ...' : 'Saving...') : t('save')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

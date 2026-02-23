'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useCartStore } from '@/lib/stores/cart';
import { usePrefsStore } from '@/lib/stores/prefs';
import { products } from '@/mock/products';
import { Link } from '@/i18n/navigation';

export function CartList() {
    const t = useTranslations('Cart');
    const locale = useLocale();
    const { items, removeItem, updateQuantity, updateNote } = useCartStore();
    const { currency } = usePrefsStore();
    const currencySymbol = currency === 'QAR' ? 'ر.ق' : 'ر.س';

    return (
        <div className="space-y-6">
            {items.map((item) => {
                const originalProduct = products.find(p => p.id === item.id);
                const productImage = item.image || originalProduct?.image || '';
                const productSlug = originalProduct?.slug || 'black-crepe-abaya';

                return (
                    <div key={item.variantId} className="group bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all">
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                            {/* Image */}
                            <div className="shrink-0">
                                <Link href={`/product/${productSlug}`} className="block">
                                    <div className="bg-slate-100 rounded-xl overflow-hidden h-28 w-28 sm:h-40 sm:w-40 group-hover:opacity-90 transition-opacity">
                                        <img
                                            src={productImage}
                                            alt={item.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                </Link>
                            </div>

                            {/* Details */}
                            <div className="flex flex-1 flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <Link href={`/product/${productSlug}`} className="hover:text-primary transition-colors">
                                            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight font-kufi">
                                                {item.name}
                                            </h3>
                                        </Link>
                                        <button
                                            onClick={() => removeItem(item.variantId)}
                                            aria-label="Remove item"
                                            className="text-slate-400 hover:text-red-500 transition-colors p-1"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">delete</span>
                                        </button>
                                    </div>

                                    <p className="text-primary font-bold text-lg mb-2 font-display">
                                        {item.price} {currencySymbol}
                                    </p>

                                    {/* Size / Cut Tags */}
                                    <div className="flex flex-wrap gap-2 text-sm text-slate-500 mb-4">
                                        {item.size && (
                                            <span className="bg-slate-50 px-2.5 py-1 rounded text-xs font-medium">
                                                {locale === 'ar' ? 'المقاس' : 'Size'}: {item.size}
                                            </span>
                                        )}
                                        {item.cut && (
                                            <span className="bg-slate-50 px-2.5 py-1 rounded text-xs font-medium">
                                                {locale === 'ar' ? 'القصة' : 'Cut'}: {item.cut}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Quantity Stepper */}
                                <div className="flex flex-wrap items-end justify-between gap-4">
                                    <div className="flex items-center gap-0 bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
                                        <button
                                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                                            className="w-9 h-9 flex items-center justify-center hover:bg-white text-slate-600 transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">add</span>
                                        </button>
                                        <span className="w-8 text-center font-bold text-sm text-slate-900 font-display">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                                            className="w-9 h-9 flex items-center justify-center hover:bg-white text-slate-600 transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">remove</span>
                                        </button>
                                    </div>

                                    {/* Line total on mobile */}
                                    <span className="text-base font-bold text-slate-900 font-display sm:hidden">
                                        {item.price * item.quantity} {currencySymbol}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Tailoring Note */}
                        <div className="mt-5 pt-4 border-t border-slate-100">
                            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2 cursor-pointer select-none font-kufi">
                                <span className="material-symbols-outlined text-[18px] text-primary">edit_note</span>
                                {locale === 'ar' ? 'ملاحظات الخياطة (اختياري)' : 'Tailoring Notes (optional)'}
                            </label>
                            <textarea
                                className="w-full rounded-xl border-slate-200 bg-slate-50 text-sm focus:border-primary focus:ring-primary placeholder:text-slate-400 resize-none h-16 font-kufi"
                                placeholder={locale === 'ar' ? 'أضيفي تعديلاتك هنا (مثال: تقصير الطول 2 سم، تضييق الأكمام...)' : 'Add your alterations here (e.g., shorten length by 2cm...)'}
                                value={item.note || ''}
                                onChange={(e) => updateNote(item.variantId, e.target.value)}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

'use client';

import { useLocale } from 'next-intl';
import { useCartStore } from '@/lib/stores/cart';
import { useFormattedMoney } from '@/lib/money';
import { products } from '@/mock/products';
import { Link } from '@/i18n/navigation';

export function CartList() {
    const locale = useLocale();
    const { items, removeItem, updateQuantity, updateNote } = useCartStore();
    const { format } = useFormattedMoney();

    return (
        <div className="space-y-6">
            {items.map((item) => {
                const originalProduct = products.find(p => p.id === item.id);
                const productImage = item.image || originalProduct?.image || '';
                const productSlug = originalProduct?.slug || 'black-crepe-abaya';

                return (
                    <div key={item.variantId} className="group bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-border hover:shadow-md transition-all">
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                            {/* Image */}
                            <div className="shrink-0">
                                <Link href={`/product/${productSlug}`} className="block">
                                    <div className="bg-surface rounded-xl overflow-hidden h-28 w-28 sm:h-40 sm:w-40 group-hover:opacity-90 transition-opacity">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
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
                                            <h3 className="text-base sm:text-lg font-bold text-on-surface leading-tight font-kufi">
                                                {item.name}
                                            </h3>
                                        </Link>
                                        <button
                                            onClick={() => removeItem(item.variantId)}
                                            aria-label="Remove item"
                                            className="text-subtle hover:text-red-500 transition-colors p-1"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">delete</span>
                                        </button>
                                    </div>

                                    <p className="text-primary font-bold text-lg mb-2 font-display">
                                        {format(item.price)}
                                    </p>

                                    {/* Size / Cut Tags */}
                                    <div className="flex flex-wrap gap-2 text-sm text-subtle mb-4">
                                        {item.size && (
                                            <span className="bg-background-light px-2.5 py-1 rounded text-xs font-medium">
                                                {locale === 'ar' ? 'المقاس' : 'Size'}: {item.size}
                                            </span>
                                        )}
                                        {item.cut && (
                                            <span className="bg-background-light px-2.5 py-1 rounded text-xs font-medium">
                                                {locale === 'ar' ? 'القصة' : 'Cut'}: {item.cut}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Quantity Stepper */}
                                <div className="flex flex-wrap items-end justify-between gap-4">
                                    <div className="flex items-center gap-0 bg-background-light rounded-lg border border-border overflow-hidden">
                                        <button
                                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                                            className="w-9 h-9 flex items-center justify-center hover:bg-white text-subtle transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">add</span>
                                        </button>
                                        <span className="w-8 text-center font-bold text-sm text-on-surface font-display">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                                            className="w-9 h-9 flex items-center justify-center hover:bg-white text-subtle transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">remove</span>
                                        </button>
                                    </div>

                                    {/* Line total on mobile */}
                                    <span className="text-base font-bold text-on-surface font-display sm:hidden">
                                        {format(item.price * item.quantity)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Tailoring Note */}
                        <div className="mt-5 pt-4 border-t border-border">
                            <label className="flex items-center gap-2 text-sm font-medium text-subtle mb-2 cursor-pointer select-none font-kufi">
                                <span className="material-symbols-outlined text-[18px] text-primary">edit_note</span>
                                {locale === 'ar' ? 'ملاحظات الخياطة (اختياري)' : 'Tailoring Notes (optional)'}
                            </label>
                            <textarea
                                className="w-full rounded-xl border-border bg-background-light text-sm focus:border-primary focus:ring-primary placeholder:text-subtle resize-none h-16 font-kufi"
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

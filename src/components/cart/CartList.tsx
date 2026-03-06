'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import { useCartStore } from '@/lib/stores/cart';
import { useFormattedMoney } from '@/lib/money';
import { Link } from '@/i18n/navigation';

export function CartList() {
    const locale = useLocale();
    const { items, removeItem, updateQuantity, updateNote } = useCartStore();
    const { format } = useFormattedMoney();
    const [openNotes, setOpenNotes] = useState<Record<string, boolean>>({});

    return (
        <div className="space-y-5">
            {items.map((item) => {
                const productImage = item.image || '/placeholder.png';
                const productSlug = item.slug;
                const noteOpen = openNotes[item.variantId] || Boolean(item.note?.trim());

                return (
                    <div key={item.variantId} className="rounded-2xl border border-[#e8e8eb] bg-white p-4 md:p-5">
                        <div className="space-y-4">
                            <div className="flex items-start justify-between gap-3">
                                <button
                                    onClick={() => removeItem(item.variantId)}
                                    aria-label={locale === 'ar' ? 'حذف المنتج' : 'Remove item'}
                                    className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#e56f6f] text-white transition-colors hover:bg-[#d96161]"
                                >
                                    <span className="material-symbols-outlined text-[18px]">close</span>
                                </button>

                                <div className="flex flex-1 items-start justify-end gap-4">
                                    <div className="text-end">
                                        <Link href={`/product/${productSlug}`} className="hover:text-primary transition-colors">
                                            <h3 className="text-base sm:text-lg font-bold text-on-surface leading-tight font-kufi mb-1">
                                                {item.name}
                                            </h3>
                                        </Link>
                                        <p className="text-[#ad3425] font-bold text-lg font-display mb-2">
                                            {format(item.unitPrice)}
                                        </p>
                                        <div className="space-y-1 text-sm text-subtle font-kufi">
                                            {item.size && (
                                                <p>{locale === 'ar' ? `المقاس: ${item.size}` : `Size: ${item.size}`}</p>
                                            )}
                                            {item.cut && (
                                                <p>{locale === 'ar' ? `القصة: ${item.cut}` : `Cut: ${item.cut}`}</p>
                                            )}
                                        </div>
                                    </div>

                                    <Link href={`/product/${productSlug}`} className="block shrink-0">
                                        <div className="relative bg-surface rounded-xl overflow-hidden h-24 w-24 sm:h-28 sm:w-28">
                                            <Image src={productImage} alt={item.name} fill className="h-full w-full object-cover" sizes="112px" />
                                        </div>
                                    </Link>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="inline-flex items-center overflow-hidden rounded-xl border border-[#d6d7dd] bg-[#f8f8fa]">
                                    <button
                                        onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                                        aria-label={locale === 'ar' ? 'تقليل الكمية' : 'Decrease quantity'}
                                        className="h-12 w-12 flex items-center justify-center text-subtle transition-colors hover:bg-white"
                                    >
                                        <span className="material-symbols-outlined text-[22px]">remove</span>
                                    </button>
                                    <span className="h-12 w-14 border-x border-[#d6d7dd] flex items-center justify-center text-lg font-bold text-on-surface font-display">
                                        {item.quantity}
                                    </span>
                                    <button
                                        onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                                        aria-label={locale === 'ar' ? 'زيادة الكمية' : 'Increase quantity'}
                                        className="h-12 w-12 flex items-center justify-center text-subtle transition-colors hover:bg-white"
                                    >
                                        <span className="material-symbols-outlined text-[22px]">add</span>
                                    </button>
                                </div>

                                <span className="text-base font-bold text-on-surface font-display">
                                    {locale === 'ar' ? 'المجموع:' : 'Total:'} {format(item.unitPrice * item.quantity)}
                                </span>
                            </div>

                            {noteOpen ? (
                                <textarea
                                    className="w-full rounded-xl border-[#d6d7dd] bg-[#fafafb] text-sm focus:border-primary focus:ring-primary placeholder:text-subtle resize-none h-16 font-kufi"
                                    placeholder={locale === 'ar' ? 'أضيفي تعديلاتك هنا (اختياري)' : 'Add tailoring notes (optional)'}
                                    value={item.note || ''}
                                    onChange={(e) => updateNote(item.variantId, e.target.value)}
                                />
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setOpenNotes((prev) => ({ ...prev, [item.variantId]: true }))}
                                    className="w-full h-12 rounded-xl bg-[#f1f1f3] text-subtle font-kufi font-semibold inline-flex items-center justify-center gap-2 hover:bg-[#e9e9ee] transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[20px]">edit_note</span>
                                    {locale === 'ar' ? 'إضافة ملاحظة' : 'Add Note'}
                                </button>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

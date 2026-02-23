import { useTranslations } from 'next-intl';
import { ProductDTO } from '@/lib/data/types';

export function ProductSpecs({ product }: { product: ProductDTO }) {
    const t = useTranslations('Product.Specs');

    return (
        <div className="lg:col-span-4 space-y-6">
            <h3 className="text-xl font-bold font-kufi text-[#0e1b12]">{t('title')}</h3>
            <div className="space-y-4 font-cairo text-sm">
                <div className="flex justify-between py-3 border-b border-[#f3f4f6]">
                    <span className="text-[#6b7280]">{t('fabric_label')}</span>
                    <span className="font-bold text-[#0e1b12]">{product.fabric || t('fabric_value')}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-[#f3f4f6]">
                    <span className="text-[#6b7280]">{t('color_label')}</span>
                    <span className="font-bold text-[#0e1b12]">{product.color || t('color_value')}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-[#f3f4f6]">
                    <span className="text-[#6b7280]">{t('cut_label')}</span>
                    <span className="font-bold text-[#0e1b12]">{t('cut_value')}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-[#f3f4f6]">
                    <span className="text-[#6b7280]">{t('origin_label')}</span>
                    <span className="font-bold text-[#0e1b12]">{t('origin_value')}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-[#f3f4f6]">
                    <span className="text-[#6b7280]">{t('washing_label')}</span>
                    <span className="font-bold text-[#0e1b12]">{t('washing_value')}</span>
                </div>
            </div>
        </div>
    );
}

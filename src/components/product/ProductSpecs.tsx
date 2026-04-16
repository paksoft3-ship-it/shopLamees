import { useTranslations, useLocale } from 'next-intl';
import { ProductDTO } from '@/lib/data/types';

const arDict: Record<string, string> = {
    'crepe': 'كريب',
    'black': 'أسود',
    'white': 'أبيض',
    'navy': 'كحلي',
    'beige': 'بيج',
    'grey': 'رمادي',
    'gray': 'رمادي',
    'brown': 'بني',
    'olive': 'زيتي',
    'chiffon': 'شيفون',
    'silk': 'حرير',
    'linen': 'كتان',
    'cotton': 'قطن',
    'satin': 'ساتان',
    'nida': 'ندى'
};

function translateSpec(val: string | null | undefined, locale: string) {
    if (!val) return null;
    if (locale !== 'ar') return val;
    return arDict[val.toLowerCase().trim()] || val;
}

export function ProductSpecs({ product }: { product: ProductDTO }) {
    const t = useTranslations('Product.Specs');
    const locale = useLocale();

    return (
        <div className="lg:col-span-4 space-y-6">
            <h3 className="text-xl font-bold font-kufi text-[#0e1b12]">{t('title')}</h3>
            <div className="space-y-4 font-cairo text-sm">
                <div className="flex justify-between py-3 border-b border-[#f3f4f6]">
                    <span className="text-[#6b7280]">{t('fabric_label')}</span>
                    <span className="font-bold text-[#0e1b12]">{translateSpec(product.fabric, locale) || t('fabric_value')}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-[#f3f4f6]">
                    <span className="text-[#6b7280]">{t('color_label')}</span>
                    <span className="font-bold text-[#0e1b12]">{translateSpec(product.color, locale) || t('color_value')}</span>
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

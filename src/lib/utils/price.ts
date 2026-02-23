export const formatPrice = (price: number, currency: 'QAR' | 'SAR', locale: 'ar' | 'en' = 'ar') => {
    return new Intl.NumberFormat(locale === 'ar' ? 'ar-QA' : 'en-QA', {
        style: 'currency',
        currency: currency,
        maximumFractionDigits: 0
    }).format(price);
};

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { LayoutGrid } from 'lucide-react';

interface Category {
    id: string;
    slug: string;
    nameAr: string;
    nameEn: string;
    image: string | null;
}

interface CategoriesRowProps {
    categories: Category[];
}

export function CategoriesRow({ categories }: CategoriesRowProps) {
    const t = useTranslations('Home.Categories');
    const locale = useLocale() as 'ar' | 'en';

    return (
        <section className="py-10 border-y border-border bg-surface">
            <div className="container mx-auto px-4 overflow-x-auto no-scrollbar">
                <div className="flex justify-start lg:justify-center gap-4 min-w-max pb-2">
                    {categories.map((cat) => (
                        <Link href={`/category/${cat.slug}`} key={cat.id} className="group flex flex-col items-center gap-3 min-w-[100px]">
                            <div className="w-20 h-20 rounded-full bg-background-light flex items-center justify-center border border-border group-hover:border-primary transition-colors overflow-hidden">
                                {cat.image && <img src={cat.image} alt={locale === 'ar' ? cat.nameAr : cat.nameEn} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />}
                            </div>
                            <span className="font-bold text-on-surface group-hover:text-primary text-sm">{locale === 'ar' ? cat.nameAr : cat.nameEn}</span>
                        </Link>
                    ))}
                    <Link href="/category/all" className="group flex flex-col items-center gap-3 min-w-[100px]">
                        <div className="w-20 h-20 rounded-full bg-background-light flex items-center justify-center border border-border group-hover:border-primary transition-colors">
                            <LayoutGrid className="w-6 h-6 text-subtle group-hover:text-primary" />
                        </div>
                        <span className="font-bold text-on-surface group-hover:text-primary text-sm">{t('all')}</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}

import { Noto_Sans_Arabic, Cairo, Manrope } from 'next/font/google';
import '../../globals.css';
import { AdminLayoutClient } from '@/components/admin/AdminLayoutClient';

const notoSansArabic = Noto_Sans_Arabic({ subsets: ['arabic'], variable: '--font-noto-sans-arabic' });
const cairo = Cairo({ subsets: ['arabic'], variable: '--font-cairo' });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' });

import arMessages from '../../../messages/ar.json';
import enMessages from '../../../messages/en.json';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ar" dir="rtl" suppressHydrationWarning>
            <body className={`${notoSansArabic.variable} ${cairo.variable} ${manrope.variable} antialiased font-body bg-background-light text-on-surface`} suppressHydrationWarning>
                <AdminLayoutClient arMessages={arMessages} enMessages={enMessages}>
                    {children}
                </AdminLayoutClient>
            </body>
        </html>
    );
}

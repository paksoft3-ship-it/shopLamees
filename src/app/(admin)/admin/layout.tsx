import { Noto_Sans_Arabic, Cairo, Manrope } from 'next/font/google';
import '../../globals.css';
import { AdminLayoutClient } from '@/components/admin/AdminLayoutClient';

const notoSansArabic = Noto_Sans_Arabic({ subsets: ['arabic'], variable: '--font-noto-sans-arabic' });
const cairo = Cairo({ subsets: ['arabic'], variable: '--font-cairo' });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' });


import { NextIntlClientProvider } from 'next-intl';

import arMessages from '../../../messages/ar.json';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ar" dir="rtl">
            <head>
                <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet" />
            </head>
            <body className={`${notoSansArabic.variable} ${cairo.variable} ${manrope.variable} antialiased font-body bg-background-light text-on-surface`}>
                <NextIntlClientProvider locale="ar" messages={arMessages}>
                    <AdminLayoutClient>
                        {children}
                    </AdminLayoutClient>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}

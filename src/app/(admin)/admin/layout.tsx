import { Noto_Kufi_Arabic, Cairo, Inter } from 'next/font/google';
import '../../globals.css';
import { AdminLayoutClient } from '@/components/admin/AdminLayoutClient';

const notoKufi = Noto_Kufi_Arabic({ subsets: ['arabic'], variable: '--font-noto-kufi' });
const cairo = Cairo({ subsets: ['arabic'], variable: '--font-cairo' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" dir="ltr">
            <body className={`${notoKufi.variable} ${cairo.variable} ${inter.variable} antialiased font-body bg-background-light text-on-surface`}>
                <AdminLayoutClient>
                    {children}
                </AdminLayoutClient>
            </body>
        </html>
    );
}

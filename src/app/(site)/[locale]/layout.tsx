import { setRequestLocale, getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { TrustBar } from '@/components/layout/TrustBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppChatbot } from '@/components/layout/WhatsAppChatbot';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { ToasterProvider } from '@/components/providers/ToasterProvider';
import { Noto_Kufi_Arabic, Cairo, Inter } from 'next/font/google';
import '../../globals.css';

const notoKufi = Noto_Kufi_Arabic({ subsets: ['arabic'], variable: '--font-noto-kufi' });
const cairo = Cairo({ subsets: ['arabic'], variable: '--font-cairo' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export default async function SiteLayout({
    children,
    params: { locale }
}: {
    children: React.ReactNode;
    params: { locale: string };
}) {
    // Explicitly set the locale context for next-intl server APIs
    setRequestLocale(locale);

    const messages = await getMessages();

    return (
        <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
            <body className={`${notoKufi.variable} ${cairo.variable} ${inter.variable} antialiased font-body bg-background-light text-on-surface`}>
                <ToasterProvider />
                <NextIntlClientProvider messages={messages}>
                    <div className="flex flex-col min-h-screen">
                        <TrustBar />
                        <Header />
                        <main className="flex-1 pb-20 lg:pb-0">{children}</main>
                        <Footer />
                        <MobileBottomNav />
                        <WhatsAppChatbot />
                    </div>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}

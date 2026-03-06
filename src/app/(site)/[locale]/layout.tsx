import { setRequestLocale, getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { TrustBar } from '@/components/layout/TrustBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { ToasterProvider } from '@/components/providers/ToasterProvider';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { WebVitalsReporter } from '@/components/analytics/WebVitalsReporter';
import { Analytics } from '@vercel/analytics/next';
import { Noto_Kufi_Arabic, Cairo, Inter } from 'next/font/google';
import { routing } from '@/i18n/routing';
import '../../globals.css';

const notoKufi = Noto_Kufi_Arabic({ subsets: ['arabic'], variable: '--font-noto-kufi' });
const cairo = Cairo({ subsets: ['arabic'], variable: '--font-cairo' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const WhatsAppChatbot = dynamic(
    () => import('@/components/layout/WhatsAppChatbot').then((m) => m.WhatsAppChatbot),
    { ssr: false }
);

export default async function SiteLayout({
    children,
    params: { locale }
}: {
    children: React.ReactNode;
    params: { locale: string };
}) {
    if (!routing.locales.includes(locale as 'ar' | 'en')) {
        notFound();
    }

    setRequestLocale(locale);
    const messages = await getMessages();

    return (
        <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
            <body className={`${notoKufi.variable} ${cairo.variable} ${inter.variable} antialiased font-body bg-background-light text-on-surface`}>
                <ToasterProvider />
                <WebVitalsReporter />
                <Analytics />
                <NextIntlClientProvider messages={messages}>
                    <CartDrawer />
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

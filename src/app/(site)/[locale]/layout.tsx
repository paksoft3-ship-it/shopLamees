import { setRequestLocale, getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { TrustBar } from '@/components/layout/TrustBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getCategories } from '@/lib/data/catalog';
import { getStoreContact } from '@/lib/data/storeSettings';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { ToasterProvider } from '@/components/providers/ToasterProvider';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { WebVitalsReporter } from '@/components/analytics/WebVitalsReporter';
import { Analytics } from '@vercel/analytics/next';
import { Almarai, Inter } from 'next/font/google';
import { routing } from '@/i18n/routing';
import '../../globals.css';

const almarai = Almarai({ weight: ['300', '400', '700', '800'], subsets: ['arabic'], variable: '--font-almarai' });
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
    const [messages, navCategories, storeContact] = await Promise.all([
        getMessages(),
        getCategories(),
        getStoreContact(),
    ]);

    return (
        <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
            <body className={`${almarai.variable} ${inter.variable} antialiased font-body bg-background-light text-on-surface`}>
                <ToasterProvider />
                <WebVitalsReporter />
                <Analytics />
                <NextIntlClientProvider messages={messages}>
                    <CartDrawer />
                    <div className="flex flex-col min-h-screen">
                        <TrustBar />
                        <Header categories={navCategories} />
                        <main className="flex-1 pb-20 lg:pb-0">{children}</main>
                        <Footer categories={navCategories} phone={storeContact.phone} email={storeContact.email} addressAr={storeContact.addressAr} addressEn={storeContact.addressEn} />
                        <MobileBottomNav />
                        <WhatsAppChatbot />
                    </div>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}

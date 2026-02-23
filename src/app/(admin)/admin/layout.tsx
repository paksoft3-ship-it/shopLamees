import { Noto_Kufi_Arabic, Cairo, Inter } from 'next/font/google';
import '../../globals.css';

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
                <div className="min-h-screen bg-background-light flex font-body" dir="ltr">
                    {/* Sidebar Placeholder */}
                    <aside className="w-64 bg-surface border-l border-[#e6e2dd] flex-shrink-0 sticky top-0 h-screen p-4">
                        <h2 className="font-heading font-bold text-lg mb-8 text-on-surface">Shop Lamees Admin</h2>
                        <nav className="space-y-2 text-sm text-subtle">
                            <p>Dashboard</p>
                            <p>Orders</p>
                            <p>Products</p>
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 flex flex-col">
                        <header className="h-16 bg-surface border-b border-[#e6e2dd] px-6 items-center flex justify-between">
                            <span className="font-medium text-on-surface">Admin Panel</span>
                            <div className="flex gap-4">Admin Staff</div>
                        </header>
                        <div className="p-8">
                            {children}
                        </div>
                    </main>
                </div>
            </body>
        </html>
    );
}

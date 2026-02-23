import { Link } from '@/i18n/navigation';
import { MapPin, Smartphone, Mail, Diamond } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function Footer() {
    const t = useTranslations('Home.Layout.Footer');

    return (
        <footer className="bg-[#111] text-white pt-16 pb-32 lg:pb-8 border-t border-slate-800">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Info */}
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <Diamond className="text-primary w-8 h-8" />
                            <h3 className="font-display text-2xl font-bold">{t('brand_name')}</h3>
                        </div>
                        <p className="text-gray-400 leading-relaxed mb-6">
                            {t('description')}
                        </p>
                        <div className="flex gap-4">
                            <a className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary hover:text-slate-900 transition-colors" href="#">
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path></svg>
                            </a>
                            <a className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary hover:text-slate-900 transition-colors" href="#">
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.85-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></svg>
                            </a>
                        </div>
                    </div>
                    {/* Quick Links */}
                    <div>
                        <h4 className="font-display font-bold text-lg mb-6 text-white">{t('quick_links')}</h4>
                        <ul className="space-y-3">
                            <li><Link className="text-gray-400 hover:text-primary transition-colors" href="/about">{t('about')}</Link></li>
                            <li><Link className="text-gray-400 hover:text-primary transition-colors" href="/refund">{t('refund_policy')}</Link></li>
                            <li><Link className="text-gray-400 hover:text-primary transition-colors" href="/size-guide">{t('size_guide')}</Link></li>
                            <li><Link className="text-gray-400 hover:text-primary transition-colors" href="/shipping">{t('shipping')}</Link></li>
                            <li><Link className="text-gray-400 hover:text-primary transition-colors" href="/faq">{t('faq')}</Link></li>
                        </ul>
                    </div>
                    {/* Categories */}
                    <div>
                        <h4 className="font-display font-bold text-lg mb-6 text-white">{t('categories')}</h4>
                        <ul className="space-y-3">
                            <li><Link className="text-gray-400 hover:text-primary transition-colors" href="/category/black">{t('black_abayas')}</Link></li>
                            <li><Link className="text-gray-400 hover:text-primary transition-colors" href="/category/color">{t('color_abayas')}</Link></li>
                            <li><Link className="text-gray-400 hover:text-primary transition-colors" href="/category/niqab">{t('niqabs')}</Link></li>
                            <li><Link className="text-gray-400 hover:text-primary transition-colors" href="/category/occasion">{t('occasion_abayas')}</Link></li>
                            <li><Link className="text-gray-400 hover:text-primary transition-colors" href="/category/luxury">{t('luxury_sets')}</Link></li>
                        </ul>
                    </div>
                    {/* Contact */}
                    <div>
                        <h4 className="font-display font-bold text-lg mb-6 text-white">{t('contact_us')}</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin className="text-primary mt-1 w-5 h-5" />
                                <span className="text-gray-400">{t('address')}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Smartphone className="text-primary w-5 h-5" />
                                <span className="text-gray-400 dir-ltr text-right">+966 50 123 4567</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="text-primary w-5 h-5" />
                                <span className="text-gray-400">info@shop-lamees.com</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-gray-500 text-sm">
                    {/* Left: Copyright */}
                    <p>&copy; {new Date().getFullYear()} {t('brand_name')}. {t('copyright')}</p>

                    {/* Center: Developed by */}
                    <a
                        href="https://paksoft.com.tr"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 group"
                    >
                        <span className="group-hover:text-primary transition-colors">Developed by</span>
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 -rotate-12 text-primary">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.85 0 3.58-.5 5.08-1.38-.7.13-1.42.21-2.16.21-5.52 0-10-4.48-10-10S9.42 2.83 14.92 2.83c.74 0 1.46.08 2.16.21C15.58 2.5 13.85 2 12 2z" />
                        </svg>
                        <span className="font-bold text-primary">PakSoft</span>
                    </a>

                    {/* Right: Payment Icons */}
                    <div className="flex items-center gap-3 grayscale opacity-60">
                        <img alt="Visa" className="h-5 object-contain" src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2000px-Visa_Inc._logo.svg.png" />
                        <img alt="Mastercard" className="h-5 object-contain" src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1000px-Mastercard-logo.svg.png" />
                        <img alt="Apple Pay" className="h-5 object-contain" src="https://upload.wikimedia.org/wikipedia/ar/thumb/a/ab/Apple_Pay_logo.svg/2560px-Apple_Pay_logo.svg.png" />
                    </div>
                </div>
            </div>
        </footer>
    );
}

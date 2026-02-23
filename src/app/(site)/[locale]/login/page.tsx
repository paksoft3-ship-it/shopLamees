'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Eye, EyeOff, Lock, User, Mail, Smartphone, Diamond } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const t = useTranslations('Auth');
    const locale = useLocale() as 'ar' | 'en';
    const isAr = locale === 'ar';

    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success('Login successful (Mock)');
        // router.push('/') logic would go here
    };

    return (
        <div className="min-h-screen bg-[#f0ece3] lg:bg-background-light flex items-center justify-center p-4 relative font-display">
            {/* Desktop Decorative Backgrounds */}
            <div className="hidden lg:block fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] bg-gradient-to-b from-[#f3eae0] to-transparent rounded-full blur-3xl opacity-50"></div>
                <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] bg-gradient-to-t from-[#f0e6da] to-transparent rounded-full blur-3xl opacity-50"></div>
            </div>

            {/* Main Form Container */}
            {/* Mobile uses app-like 100vh overlay styling, Desktop uses floating card */}
            <div className={`
                w-full max-w-[480px] bg-background-light md:bg-surface 
                rounded-[32px] md:rounded-3xl shadow-none md:shadow-[0_8px_30px_rgb(0,0,0,0.04)]
                border-[6px] border-[#e7e1cf] md:border-none overflow-hidden
                flex flex-col relative z-10 
            `}>
                {/* Header & Branding */}
                <header className="flex flex-col items-center justify-center px-8 pt-8 pb-6 bg-background-light md:bg-surface">
                    <div className="w-12 h-12 mb-3 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                        <Diamond className="text-white w-6 h-6" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-on-surface uppercase tracking-widest hidden md:block">
                        Shop Lamees
                    </h1>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto px-6 md:px-8 pb-10">
                    {/* Welcome Text (Mobile focuses on this more) */}
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-on-surface mb-2">{t('welcome')}</h2>
                        <p className="text-subtle text-sm">{t('subtitle')}</p>
                    </div>

                    {/* Tabs */}
                    <div className="mb-8">
                        <div className="flex border-b border-border relative">
                            <button
                                onClick={() => setActiveTab('login')}
                                className={`flex-1 pb-4 text-center relative font-bold text-sm md:text-base transition-colors ${activeTab === 'login' ? 'text-primary' : 'text-subtle hover:text-on-surface'}`}
                            >
                                {t('tab_login')}
                                {activeTab === 'login' && (
                                    <span className="absolute bottom-0 left-0 right-0 w-full h-[3px] bg-primary rounded-t-full"></span>
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab('register')}
                                className={`flex-1 pb-4 text-center relative font-bold text-sm md:text-base transition-colors ${activeTab === 'register' ? 'text-primary' : 'text-subtle hover:text-on-surface'}`}
                            >
                                {t('tab_register')}
                                {activeTab === 'register' && (
                                    <span className="absolute bottom-0 left-0 right-0 w-full h-[3px] bg-primary rounded-t-full"></span>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Form Section */}
                    <form onSubmit={handleLogin} className="flex flex-col gap-5">
                        {/* Email/Phone Input */}
                        <div className="flex flex-col gap-2 relative group">
                            <label className="text-sm font-bold text-on-surface mb-1">
                                {t('email_phone')}
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    className={`w-full h-14 bg-surface md:bg-background-light border border-[#e7e1cf] md:border-border rounded-xl px-4 ${isAr ? 'pr-12 pl-4' : 'pl-12 pr-4'} text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-subtle/50 text-on-surface ${isAr ? 'text-right dir-rtl' : 'text-left'}`}
                                    placeholder={isAr ? t('phone_placeholder') : t('email_placeholder')}
                                    required
                                />
                                <div className={`absolute top-1/2 -translate-y-1/2 flex items-center justify-center w-12 ${isAr ? 'right-0' : 'left-0'} text-subtle`}>
                                    <User className="w-5 h-5 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="flex flex-col gap-2 relative group">
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-sm font-bold text-on-surface">
                                    {t('password')}
                                </label>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className={`w-full h-14 bg-surface md:bg-background-light border border-[#e7e1cf] md:border-border rounded-xl px-4 ${isAr ? 'pr-12 pl-[70px]' : 'pl-12 pr-[70px]'} text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-subtle/50 text-on-surface ${isAr ? 'text-right dir-rtl' : 'text-left'}`}
                                    placeholder={t('password_placeholder')}
                                    required
                                />
                                <div className={`absolute top-1/2 -translate-y-1/2 flex items-center justify-center w-12 ${isAr ? 'right-0' : 'left-0'} text-subtle`}>
                                    <Lock className="w-5 h-5 pointer-events-none" />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className={`absolute top-1/2 -translate-y-1/2 ${isAr ? 'left-4' : 'right-4'} text-primary text-xs font-bold hover:underline`}
                                >
                                    {showPassword ? t('hide') : t('show')}
                                </button>
                            </div>
                            <div className={`flex mt-2 ${isAr ? 'justify-start pl-1' : 'justify-end pr-1'}`}>
                                <Link href="#" className="text-primary text-xs font-bold hover:underline">
                                    {t('forgot_password')}
                                </Link>
                            </div>
                        </div>

                        {/* Primary Action */}
                        <button
                            type="submit"
                            className="w-full h-14 bg-on-surface lg:bg-primary text-white rounded-xl font-bold text-base shadow-lg hover:shadow-xl active:scale-[0.98] transition-all mt-2 lg:hover:bg-primary/90"
                        >
                            {t('login_button')}
                        </button>

                        {/* OTP Login */}
                        <div className="flex justify-center mt-1">
                            <Link href="#" className="text-sm font-bold text-primary border-b border-primary/20 hover:border-primary transition-all pb-0.5">
                                {t('login_otp_button')}
                            </Link>
                        </div>

                        {/* Divider */}
                        <div className="flex items-center gap-4 my-2 opacity-70">
                            <div className="flex-1 border-t border-border"></div>
                            <span className="text-xs text-subtle font-bold uppercase tracking-wider">{t('or_continue')}</span>
                            <div className="flex-1 border-t border-border"></div>
                        </div>

                        {/* Social Login Mock */}
                        <div className="flex gap-4 h-12">
                            <button type="button" className="flex-1 flex items-center justify-center gap-2 bg-surface lg:bg-background-light border border-border rounded-xl hover:bg-background-light lg:hover:bg-surface transition-colors">
                                {/* Google Icon Mock */}
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" /></svg>
                                <span className="text-sm font-bold text-on-surface">Google</span>
                            </button>
                            <button type="button" className="flex-1 flex items-center justify-center gap-2 bg-surface lg:bg-background-light border border-border rounded-xl hover:bg-background-light lg:hover:bg-surface transition-colors">
                                {/* Apple Icon Mock */}
                                <svg className="w-5 h-5 text-on-surface" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.05 2.62.8 3.39.8.81 0 2.36-.93 4.14-.79 1.43.08 2.73.66 3.65 1.7-3.14 1.84-2.61 6.32.44 7.64-.69 1.76-1.55 3.42-3.62 3.62M12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25" /></svg>
                                <span className="text-sm font-bold text-on-surface">Apple</span>
                            </button>
                        </div>

                        {/* Guest Checkout */}
                        <Link href="/checkout" className="w-full h-12 bg-transparent border-2 border-on-surface lg:border-border text-on-surface rounded-xl font-bold text-sm flex items-center justify-center hover:bg-background-light transition-all mt-2">
                            {t('guest_checkout')}
                        </Link>

                        {/* Security Badge */}
                        <div className="mt-6 flex flex-col items-center justify-center gap-2 text-subtle opacity-80">
                            <Lock className="w-5 h-5" />
                            <span className="text-[10px] font-bold tracking-widest uppercase">{t('secure_data')}</span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}


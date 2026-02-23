'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/lib/stores/adminAuth';
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck, RefreshCw, Diamond } from 'lucide-react';

export default function AdminLogin() {
    const { login } = useAdminAuth();
    const router = useRouter();

    // State: 'login' | 'verify'
    const [step, setStep] = useState<'login' | 'verify'>('login');
    const [email, setEmail] = useState('owner@shoplamees.com');
    const [password, setPassword] = useState('password');
    const [showPassword, setShowPassword] = useState(false);

    // OTP State
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [timeLeft, setTimeLeft] = useState(59);

    // Initial focus on verify step
    useEffect(() => {
        if (step === 'verify') {
            inputRefs.current[0]?.focus();
            const timer = setInterval(() => {
                setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [step]);

    const handleLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock validation: proceed to 2FA automatically
        setStep('verify');
    };

    const handleVerifySubmit = () => {
        // Mock 2FA validation
        const enteredOtp = otp.join('');
        if (enteredOtp.length === 6) {
            // Determine mock role based on email simply
            const role = email.includes('staff') ? 'admin_staff' : 'admin_owner';
            login(email, role);
            router.push('/admin');
        } else {
            alert('Please enter a 6-digit code');
        }
    };

    const handleOtpChange = (index: number, val: string) => {
        // Only allow numbers
        if (!/^\d*$/.test(val)) return;

        const newOtp = [...otp];
        newOtp[index] = val.slice(-1); // Take last char if they type fast
        setOtp(newOtp);

        if (val && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace') {
            if (!otp[index] && index > 0) {
                // Moving backward
                inputRefs.current[index - 1]?.focus();
            } else {
                // Clear current
                const newOtp = [...otp];
                newOtp[index] = '';
                setOtp(newOtp);
            }
        } else if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === 'ArrowRight' && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (!pasteData) return;

        const newOtp = [...otp];
        let lastFilledIndex = 0;
        pasteData.split('').forEach((char, i) => {
            if (i < 6) {
                newOtp[i] = char;
                lastFilledIndex = i;
            }
        });
        setOtp(newOtp);

        // Focus next empty or last
        if (lastFilledIndex < 5) {
            inputRefs.current[lastFilledIndex + 1]?.focus();
        } else {
            inputRefs.current[5]?.focus();
        }
    };

    return (
        <div className="min-h-screen bg-background-light flex flex-col font-display antialiased text-on-surface relative overflow-hidden">
            {/* Abstract Background Decoration (from 2FA ref) */}
            <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[100px]"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[100px]"></div>
            </div>

            <div className="flex-1 flex flex-col justify-center items-center py-10 px-4 sm:px-6 z-10">
                <div className="w-full max-w-[480px] flex flex-col gap-8">

                    {/* Brand Header */}
                    {step === 'verify' && (
                        <div className="flex flex-col items-center gap-3 text-center">
                            <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center mb-2">
                                <ShieldCheck className="w-8 h-8 text-on-surface" strokeWidth={1.5} />
                            </div>
                            <h1 className="text-3xl font-black tracking-tight text-on-surface">
                                SHOP LAMEES
                            </h1>
                            <p className="text-subtle text-sm">Admin Panel</p>
                        </div>
                    )}

                    {/* Main Card */}
                    <div className="bg-surface shadow-soft rounded-2xl border border-border overflow-hidden">

                        {step === 'login' ? (
                            <div className="p-8 sm:p-12">
                                {/* Branding Section (from Login ref) */}
                                <div className="flex flex-col items-center justify-center mb-10 gap-4">
                                    <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mb-2 shadow-lg shadow-primary/20">
                                        <Diamond className="w-8 h-8" />
                                    </div>
                                    <div className="text-center">
                                        <h1 className="text-on-surface text-2xl font-bold tracking-tight mb-1">Shop Lamees</h1>
                                        <h2 className="text-subtle text-lg font-medium">Admin Panel</h2>
                                    </div>
                                </div>

                                <form onSubmit={handleLoginSubmit} className="flex flex-col gap-5">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-on-surface text-sm font-bold">Email address</label>
                                        <div className="relative">
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full rounded-2xl border border-border bg-background-light h-12 px-4 pl-12 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-subtle/50 text-sm transition-all duration-200"
                                                placeholder="name@company.com"
                                                required
                                            />
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-subtle pointer-events-none flex items-center">
                                                <Mail className="w-5 h-5" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-on-surface text-sm font-bold">Password</label>
                                        <div className="relative flex items-center">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full rounded-2xl border border-border bg-background-light h-12 px-4 pr-12 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-subtle/50 text-sm transition-all duration-200"
                                                placeholder="********"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-0 top-0 bottom-0 px-4 text-subtle hover:text-primary transition-colors flex items-center justify-center"
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                        <div className="flex justify-end mt-1">
                                            <a href="#" className="text-xs font-bold text-subtle hover:text-primary transition-colors">Forgot Password?</a>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full h-12 bg-on-surface hover:bg-on-surface/90 text-white text-base font-bold rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 mt-4 group"
                                    >
                                        <span>Sign In</span>
                                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                    </button>
                                </form>

                                <div className="mt-10 pt-6 border-t border-border flex items-center justify-center gap-2 text-subtle">
                                    <Lock className="w-4 h-4" />
                                    <span className="text-xs font-bold">Secure access for administrators only</span>
                                </div>
                            </div>
                        ) : (
                            // ** 2FA Verification Step **
                            <div className="flex flex-col h-full">
                                <div className="p-8 sm:p-10 flex flex-col gap-8">
                                    <div className="flex flex-col gap-2 text-center">
                                        <h2 className="text-2xl font-bold text-on-surface">
                                            2-Step Verification
                                        </h2>
                                        <p className="text-subtle text-sm">
                                            Enter the code sent to your email <strong>{email}</strong>
                                        </p>
                                    </div>

                                    <div className="flex justify-center" dir="ltr">
                                        <div className="flex gap-2 sm:gap-3">
                                            {otp.map((digit, index) => (
                                                <input
                                                    key={index}
                                                    type="text"
                                                    inputMode="numeric"
                                                    maxLength={1}
                                                    value={digit}
                                                    ref={(el) => {
                                                        inputRefs.current[index] = el;
                                                    }}
                                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                                    onPaste={handleOtpPaste}
                                                    className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold bg-background-light border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-on-surface"
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleVerifySubmit}
                                        className="w-full flex items-center justify-center gap-2 bg-on-surface hover:bg-on-surface/90 text-white py-4 rounded-xl font-bold text-base transition-colors shadow-lg"
                                    >
                                        <span>Verify and Login</span>
                                        <ArrowRight className="w-5 h-5 transition-transform hover:translate-x-1" />
                                    </button>

                                    <div className="flex flex-col items-center justify-center gap-2 pt-2">
                                        <p className="text-subtle text-xs">Didn&apos;t receive the code?</p>
                                        <div className="flex items-center gap-2 font-bold">
                                            <button
                                                className={`text-on-surface transition-colors text-xs font-bold flex items-center gap-1 group ${timeLeft > 0 ? 'opacity-50 cursor-not-allowed' : 'hover:text-primary'}`}
                                                disabled={timeLeft > 0}
                                                onClick={() => { setTimeLeft(59); setOtp(['', '', '', '', '', '']); }}
                                            >
                                                <RefreshCw className={`w-4 h-4 ${timeLeft === 0 && 'group-hover:rotate-180 transition-transform duration-500'}`} />
                                                Resend Code
                                            </button>
                                            <span className="text-border">|</span>
                                            <span className="text-subtle text-xs tabular-nums tracking-widest" dir="ltr">
                                                00:{timeLeft.toString().padStart(2, '0')}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-background-light p-4 border-t border-border flex items-start gap-3 mt-auto">
                                    <Lock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                    <p className="text-xs text-subtle leading-relaxed">
                                        This is a secure area. For security purposes, you will be required to enter a verification code each time you attempt to login from a new device.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="text-center text-subtle text-xs">
                        <p>© 2026 Shop Lamees. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}


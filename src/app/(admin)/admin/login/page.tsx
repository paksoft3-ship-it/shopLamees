'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/lib/stores/adminAuth';
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';

export default function AdminLogin() {
    const { login } = useAdminAuth();
    const router = useRouter();

    const [step, setStep] = useState<'login' | 'verify'>('login');
    const [email, setEmail] = useState('owner@shoplamees.com');
    const [password, setPassword] = useState('password');
    const [showPassword, setShowPassword] = useState(false);

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [timeLeft, setTimeLeft] = useState(59);

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
        setStep('verify');
    };

    const handleVerifySubmit = () => {
        const enteredOtp = otp.join('');
        if (enteredOtp.length === 6) {
            const role = email.includes('staff') ? 'admin_staff' : 'admin_owner';
            login(email, role);
            router.push('/admin');
        } else {
            alert('Please enter a 6-digit code');
        }
    };

    const handleOtpChange = (index: number, val: string) => {
        if (!/^\d*$/.test(val)) return;

        const newOtp = [...otp];
        newOtp[index] = val.slice(-1);
        setOtp(newOtp);

        if (val && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace') {
            if (!otp[index] && index > 0) {
                inputRefs.current[index - 1]?.focus();
            } else {
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

        if (lastFilledIndex < 5) {
            inputRefs.current[lastFilledIndex + 1]?.focus();
        } else {
            inputRefs.current[5]?.focus();
        }
    };

    return (
        <div className="w-full relative overflow-hidden">
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-10 right-16 w-72 h-72 rounded-full bg-[#edab1d]/10 blur-[80px]"></div>
                <div className="absolute bottom-8 left-12 w-72 h-72 rounded-full bg-[#edab1d]/10 blur-[80px]"></div>
            </div>

            <div className="relative z-10 w-full max-w-[560px] mx-auto px-4 py-8 sm:py-12">
                <div className="flex flex-col items-center text-center mb-6">
                    <Image
                        src="/images/logo.png"
                        alt="Shop Lamees"
                        width={260}
                        height={90}
                        className="h-20 w-auto object-contain"
                        priority
                    />
                    <p className="text-sm text-[#6b6b6b] mt-2">Admin Panel</p>
                    <h2 className="mt-3 text-xl sm:text-2xl font-black text-[#0f172a] tracking-wide">
                        <a
                            href="https://paksoft.com.tr"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 hover:text-[#edab1d] transition-colors"
                        >
                            <span className="material-symbols-outlined text-[20px]">brightness_2</span>
                            <span>DEVELOPED BY PAKSOFT</span>
                        </a>
                    </h2>
                </div>

                <div className="bg-white shadow-xl rounded-2xl border border-[#ece7da] overflow-hidden">
                    {step === 'login' ? (
                        <div className="p-7 sm:p-10">
                            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-5">
                                <div className="flex flex-col gap-2">
                                    <label className="text-[#0f172a] text-sm font-bold">Email address</label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full rounded-xl border border-[#e6dfcf] bg-[#fbfaf8] h-12 px-4 pl-12 text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#edab1d]/30 focus:border-[#edab1d] text-sm"
                                            placeholder="name@company.com"
                                            required
                                        />
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none flex items-center">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-[#0f172a] text-sm font-bold">Password</label>
                                    <div className="relative flex items-center">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full rounded-xl border border-[#e6dfcf] bg-[#fbfaf8] h-12 px-4 pr-12 text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#edab1d]/30 focus:border-[#edab1d] text-sm"
                                            placeholder="********"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-0 top-0 bottom-0 px-4 text-neutral-500 hover:text-[#edab1d] transition-colors flex items-center justify-center"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full h-12 bg-[#111827] hover:bg-[#0b1220] text-white text-base font-bold rounded-xl transition-all flex items-center justify-center gap-2 mt-2 group"
                                >
                                    <span>Sign In</span>
                                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                </button>
                            </form>

                            <div className="mt-8 pt-5 border-t border-[#ece7da] flex items-center justify-center gap-2 text-neutral-500">
                                <Lock className="w-4 h-4" />
                                <span className="text-xs font-bold">Secure access for administrators only</span>
                            </div>
                        </div>
                    ) : (
                        <div className="p-7 sm:p-10 flex flex-col gap-7">
                            <div className="flex flex-col gap-2 text-center">
                                <div className="w-14 h-14 mx-auto bg-[#edab1d]/15 rounded-xl flex items-center justify-center">
                                    <ShieldCheck className="w-8 h-8 text-[#8a6207]" strokeWidth={1.5} />
                                </div>
                                <h2 className="text-2xl font-bold text-[#0f172a] mt-2">2-Step Verification</h2>
                                <p className="text-neutral-500 text-sm">
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
                                            className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold bg-[#fbfaf8] border border-[#e6dfcf] rounded-xl focus:outline-none focus:border-[#edab1d] focus:ring-2 focus:ring-[#edab1d]/30 text-[#0f172a]"
                                        />
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={handleVerifySubmit}
                                className="w-full flex items-center justify-center gap-2 bg-[#111827] hover:bg-[#0b1220] text-white py-4 rounded-xl font-bold text-base transition-colors"
                            >
                                <span>Verify and Login</span>
                                <ArrowRight className="w-5 h-5" />
                            </button>

                            <div className="flex flex-col items-center justify-center gap-2 pt-1">
                                <p className="text-neutral-500 text-xs">Didn&apos;t receive the code?</p>
                                <div className="flex items-center gap-2 font-bold">
                                    <button
                                        className={`text-[#0f172a] transition-colors text-xs font-bold flex items-center gap-1 group ${timeLeft > 0 ? 'opacity-50 cursor-not-allowed' : 'hover:text-[#edab1d]'}`}
                                        disabled={timeLeft > 0}
                                        onClick={() => {
                                            setTimeLeft(59);
                                            setOtp(['', '', '', '', '', '']);
                                        }}
                                    >
                                        <RefreshCw className={`w-4 h-4 ${timeLeft === 0 && 'group-hover:rotate-180 transition-transform duration-500'}`} />
                                        Resend Code
                                    </button>
                                    <span className="text-[#c9bfaa]">|</span>
                                    <span className="text-neutral-500 text-xs tabular-nums tracking-widest" dir="ltr">
                                        00:{timeLeft.toString().padStart(2, '0')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

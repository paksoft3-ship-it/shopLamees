'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/lib/stores/adminAuth';
import { Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react';
import { loginAdmin } from '@/lib/actions/adminAuth';

export default function AdminLogin() {
  const { login } = useAdminAuth();
  const router = useRouter();

  const [email, setEmail] = useState('owner@shoplamees.com');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await loginAdmin(email, password);
      if (!res.ok || !res.user) {
        setError(res.message || 'Login failed');
        return;
      }

      login(res.user.email, res.user.role);
      router.push('/admin');
    } catch {
      setError('Unable to login right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-10 right-16 w-72 h-72 rounded-full bg-[#edab1d]/10 blur-[80px]" />
        <div className="absolute bottom-8 left-12 w-72 h-72 rounded-full bg-[#edab1d]/10 blur-[80px]" />
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
              dir="ltr"
              className="inline-flex flex-row items-center gap-2 hover:text-[#edab1d] transition-colors [unicode-bidi:isolate]"
            >
              <span>Developed By</span>
              <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0.8" className="w-7 h-7 -rotate-12 text-primary">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.85 0 3.58-.5 5.08-1.38-.7.13-1.42.21-2.16.21-5.52 0-10-4.48-10-10S9.42 2.83 14.92 2.83c.74 0 1.46.08 2.16.21C15.58 2.5 13.85 2 12 2z" />
              </svg>
              <span>Paksoft</span>
            </a>
          </h2>
        </div>

        <div className="bg-white shadow-xl rounded-2xl border border-[#ece7da] overflow-hidden">
          <div className="p-7 sm:p-10">
            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-5" dir="ltr">
              <div className="flex flex-col gap-2">
                <label className="text-[#0f172a] text-sm font-bold">Email address</label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    dir="ltr"
                    className="w-full rounded-xl border border-[#e6dfcf] bg-[#fbfaf8] h-12 px-4 pl-12 text-[#0f172a] text-left placeholder:text-left focus:outline-none focus:ring-2 focus:ring-[#edab1d]/30 focus:border-[#edab1d] text-sm"
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
                    dir="ltr"
                    className="w-full rounded-xl border border-[#e6dfcf] bg-[#fbfaf8] h-12 px-4 pr-12 text-[#0f172a] text-left placeholder:text-left focus:outline-none focus:ring-2 focus:ring-[#edab1d]/30 focus:border-[#edab1d] text-sm"
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

              {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-[#111827] hover:bg-[#0b1220] disabled:opacity-60 text-white text-base font-bold rounded-xl transition-all flex items-center justify-center gap-2 mt-2 group"
              >
                <span>{loading ? 'Signing In...' : 'Sign In'}</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
            </form>

            <div className="mt-8 pt-5 border-t border-[#ece7da] flex items-center justify-center gap-2 text-neutral-500">
              <Lock className="w-4 h-4" />
              <span className="text-xs font-bold">Secure access for administrators only</span>
            </div>
          </div>
        </div>

        <div className="text-center mt-5">
          <a
            href="https://paksoft.com.tr"
            target="_blank"
            rel="noopener noreferrer"
            dir="ltr"
            className="inline-flex flex-row items-center gap-2 text-sm font-extrabold text-[#0f172a] tracking-wider hover:text-[#edab1d] transition-colors [unicode-bidi:isolate]"
          >
            <span>Developed By</span>
            <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0.8" className="w-6 h-6 -rotate-12 text-primary">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.85 0 3.58-.5 5.08-1.38-.7.13-1.42.21-2.16.21-5.52 0-10-4.48-10-10S9.42 2.83 14.92 2.83c.74 0 1.46.08 2.16.21C15.58 2.5 13.85 2 12 2z" />
            </svg>
            <span>Paksoft</span>
          </a>
        </div>
      </div>
    </div>
  );
}

'use client';

import {
    DollarSign,
    ShoppingBag,
    TrendingUp,
    TrendingDown,
    Users,
    Calendar,
    Plus,
    LineChart,
    AlertTriangle,
    Truck,
    MessageSquare,
    Package
} from 'lucide-react';
import { useAdminAuth } from '@/lib/stores/adminAuth';
import Link from 'next/link';

export default function AdminDashboard() {
    const { user } = useAdminAuth();

    return (
        <div className="flex flex-col gap-8 pb-10">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-on-surface tracking-tight text-[28px] md:text-[32px] font-bold leading-tight mb-2">
                        Store Overview
                    </h1>
                    <p className="text-subtle text-sm">
                        Welcome back, {user?.email.split('@')[0]}. Here's a summary of your store's performance today.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 bg-surface border border-border hover:border-primary/50 text-on-surface px-4 py-2 rounded-xl text-sm font-bold transition-colors shadow-soft">
                        <Calendar className="w-4 h-4" />
                        <span>Last 30 Days</span>
                    </button>
                    <Link href="/admin/products/new" className="flex items-center gap-2 bg-primary text-on-surface px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                        <Plus className="w-4 h-4" />
                        <span>New Product</span>
                    </Link>
                </div>
            </div>

            {/* Mobile Hero Card: Today's Sales (Hidden on Desktop) */}
            <div className="md:hidden bg-primary text-white p-6 rounded-2xl shadow-lg relative overflow-hidden group mb-2 mt-2">
                {/* Decorative Circles matching reference */}
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-white/80 text-sm font-medium">Today's Sales</p>
                        <span className="bg-white/20 px-2 py-1 rounded text-xs font-bold backdrop-blur-sm">+15%</span>
                    </div>
                    <h2 className="text-4xl font-bold font-display tracking-tight mb-1" dir="ltr">SAR 12,450</h2>
                    <p className="text-white/70 text-xs text-right">vs 10,800 yesterday</p>
                </div>
            </div>

            {/* 1. Key Stats Row (Desktop Grid, Mobile Horizontal Scroll) */}
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">

                {/* Stat Card 1 */}
                <div className="min-w-[150px] md:min-w-0 bg-surface p-4 md:p-6 rounded-2xl shadow-soft border border-border relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 snap-center md:snap-align-none shrink-0">
                    <div className="flex justify-between items-start md:mb-4 mb-2">
                        <div className="p-2 bg-background-light rounded-xl text-primary w-10 h-10 flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-on-surface" />
                        </div>
                        <span className="hidden md:flex items-center gap-1 text-green-700 text-xs font-bold bg-green-100 px-2 py-1 rounded-full">
                            <TrendingUp className="w-3 h-3" />
                            12%
                        </span>
                    </div>
                    <p className="text-subtle text-xs md:text-sm font-bold mb-1">Total Sales</p>
                    <h3 className="text-on-surface text-xl md:text-2xl font-bold font-display">124.5k QAR</h3>
                    {/* Subtle decorative curve (Desktop only) */}
                    <div className="hidden md:block absolute bottom-0 left-0 w-full h-12 opacity-15 pointer-events-none">
                        <svg className="w-full h-full fill-primary/30" preserveAspectRatio="none" viewBox="0 0 200 100">
                            <path d="M0 80 Q 50 20 100 50 T 200 30 V 100 H 0 Z"></path>
                        </svg>
                    </div>
                </div>

                {/* Stat Card 2 */}
                <div className="min-w-[150px] md:min-w-0 bg-surface p-4 md:p-6 rounded-2xl shadow-soft border border-border relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 snap-center md:snap-align-none shrink-0">
                    <div className="flex justify-between items-start md:mb-4 mb-2">
                        <div className="p-2 bg-background-light rounded-xl text-primary w-10 h-10 flex items-center justify-center">
                            <ShoppingBag className="w-5 h-5 text-on-surface" />
                        </div>
                        <span className="hidden md:flex items-center gap-1 text-green-700 text-xs font-bold bg-green-100 px-2 py-1 rounded-full">
                            <TrendingUp className="w-3 h-3" />
                            5%
                        </span>
                    </div>
                    <p className="text-subtle text-xs md:text-sm font-bold mb-1">Orders</p>
                    <h3 className="text-on-surface text-xl md:text-2xl font-bold font-display">450</h3>
                    <div className="hidden md:block absolute bottom-0 left-0 w-full h-12 opacity-15 pointer-events-none">
                        <svg className="w-full h-full fill-primary/30" preserveAspectRatio="none" viewBox="0 0 200 100">
                            <path d="M0 70 Q 70 60 120 30 T 200 60 V 100 H 0 Z"></path>
                        </svg>
                    </div>
                </div>

                {/* Stat Card 3 */}
                <div className="min-w-[150px] md:min-w-0 bg-surface p-4 md:p-6 rounded-2xl shadow-soft border border-border relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 snap-center md:snap-align-none shrink-0">
                    <div className="flex justify-between items-start md:mb-4 mb-2">
                        <div className="p-2 bg-background-light rounded-xl text-primary w-10 h-10 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-on-surface" />
                        </div>
                        <span className="hidden md:flex items-center gap-1 text-red-700 text-xs font-bold bg-red-100 px-2 py-1 rounded-full">
                            <TrendingDown className="w-3 h-3" />
                            2%
                        </span>
                    </div>
                    <p className="text-subtle text-xs md:text-sm font-bold mb-1">Conv. Rate</p>
                    <h3 className="text-on-surface text-xl md:text-2xl font-bold font-display">3.2%</h3>
                    <div className="hidden md:block absolute bottom-0 left-0 w-full h-12 opacity-10 pointer-events-none">
                        <svg className="w-full h-full fill-red-500" preserveAspectRatio="none" viewBox="0 0 200 100">
                            <path d="M0 40 Q 60 60 120 70 T 200 80 V 100 H 0 Z"></path>
                        </svg>
                    </div>
                </div>

                {/* Stat Card 4 */}
                <div className="min-w-[150px] md:min-w-0 bg-surface p-4 md:p-6 rounded-2xl shadow-soft border border-border relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 snap-center md:snap-align-none shrink-0">
                    <div className="flex justify-between items-start md:mb-4 mb-2">
                        <div className="p-2 bg-background-light rounded-xl text-primary w-10 h-10 flex items-center justify-center">
                            <Users className="w-5 h-5 text-on-surface" />
                        </div>
                        <span className="hidden md:flex items-center gap-1 text-green-700 text-xs font-bold bg-green-100 px-2 py-1 rounded-full">
                            <TrendingUp className="w-3 h-3" />
                            8%
                        </span>
                    </div>
                    <p className="text-subtle text-xs md:text-sm font-bold mb-1">Visitors</p>
                    <h3 className="text-on-surface text-xl md:text-2xl font-bold font-display">1,200</h3>
                    <div className="hidden md:block absolute bottom-0 left-0 w-full h-12 opacity-15 pointer-events-none">
                        <svg className="w-full h-full fill-primary/30" preserveAspectRatio="none" viewBox="0 0 200 100">
                            <path d="M0 90 Q 50 50 100 40 T 200 10 V 100 H 0 Z"></path>
                        </svg>
                    </div>
                </div>
            </div>

            {/* 2. Sales Chart Section */}
            <div className="bg-surface rounded-2xl shadow-soft border border-border p-6">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                        <LineChart className="w-5 h-5 text-subtle" />
                        Sales Analysis
                    </h3>
                    <div className="flex bg-background-light p-1 rounded-xl border border-border">
                        <button className="px-4 py-1.5 rounded-lg text-xs font-bold bg-surface text-on-surface shadow-sm transition-all border border-border/50">All</button>
                        <button className="px-4 py-1.5 rounded-lg text-xs font-bold text-subtle hover:text-on-surface transition-all">Qatar</button>
                        <button className="px-4 py-1.5 rounded-lg text-xs font-bold text-subtle hover:text-on-surface transition-all">Saudi Arabia</button>
                        <button className="px-4 py-1.5 rounded-lg text-xs font-bold text-subtle hover:text-on-surface transition-all">Kuwait</button>
                    </div>
                </div>

                {/* Mini Chart Mock (Mobile Only) */}
                <div className="md:hidden flex flex-col mt-4">
                    <div className="flex justify-between items-end h-32 gap-2">
                        {/* Bar */}
                        <div className="flex flex-col items-center gap-2 flex-1 group cursor-pointer">
                            <div className="w-full bg-background-light rounded-t-md relative h-full flex items-end overflow-hidden">
                                <div className="w-full bg-primary/30 h-[40%] rounded-t-md transition-all duration-500 group-hover:bg-primary/50"></div>
                            </div>
                            <span className="text-[10px] text-subtle font-medium">Sat</span>
                        </div>
                        {/* Bar */}
                        <div className="flex flex-col items-center gap-2 flex-1 group cursor-pointer">
                            <div className="w-full bg-background-light rounded-t-md relative h-full flex items-end overflow-hidden">
                                <div className="w-full bg-primary/40 h-[65%] rounded-t-md transition-all duration-500 group-hover:bg-primary/60"></div>
                            </div>
                            <span className="text-[10px] text-subtle font-medium">Sun</span>
                        </div>
                        {/* Bar */}
                        <div className="flex flex-col items-center gap-2 flex-1 group cursor-pointer">
                            <div className="w-full bg-background-light rounded-t-md relative h-full flex items-end overflow-hidden">
                                <div className="w-full bg-primary h-[85%] rounded-t-md shadow-[0_0_10px_rgba(242,185,13,0.3)]"></div>
                            </div>
                            <span className="text-[10px] text-primary font-bold">Mon</span>
                        </div>
                        {/* Bar */}
                        <div className="flex flex-col items-center gap-2 flex-1 group cursor-pointer">
                            <div className="w-full bg-background-light rounded-t-md relative h-full flex items-end overflow-hidden">
                                <div className="w-full bg-primary/30 h-[50%] rounded-t-md transition-all duration-500 group-hover:bg-primary/50"></div>
                            </div>
                            <span className="text-[10px] text-subtle font-medium">Tue</span>
                        </div>
                        {/* Bar */}
                        <div className="flex flex-col items-center gap-2 flex-1 group cursor-pointer">
                            <div className="w-full bg-background-light rounded-t-md relative h-full flex items-end overflow-hidden">
                                <div className="w-full bg-primary/30 h-[30%] rounded-t-md transition-all duration-500 group-hover:bg-primary/50"></div>
                            </div>
                            <span className="text-[10px] text-subtle font-medium">Wed</span>
                        </div>
                    </div>
                </div>

                {/* SVG Chart Mock (Desktop Only) */}
                <div className="hidden md:flex w-full h-[300px] relative items-end justify-between px-2 pb-6 pt-10 border-b border-l border-border border-l-0">
                    {/* Y-axis labels */}
                    <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-subtle w-10 text-left pl-2 font-display">
                        <span>10k</span>
                        <span>7.5k</span>
                        <span>5k</span>
                        <span>2.5k</span>
                        <span>0</span>
                    </div>
                    {/* Grid lines */}
                    <div className="absolute inset-0 left-10 top-0 flex flex-col justify-between pointer-events-none hidden sm:flex">
                        <div className="w-full h-px bg-transparent border-dashed border-b border-border/50"></div>
                        <div className="w-full h-px bg-transparent border-dashed border-b border-border/50"></div>
                        <div className="w-full h-px bg-transparent border-dashed border-b border-border/50"></div>
                        <div className="w-full h-px bg-transparent border-dashed border-b border-border/50"></div>
                        <div className="w-full h-px bg-transparent border-dashed border-b border-border/50"></div>
                    </div>
                    {/* SVG Curve Component matching reference */}
                    <div className="absolute inset-0 left-10 top-4 bottom-6 overflow-hidden">
                        <svg className="w-full h-full drop-shadow-lg" preserveAspectRatio="none" viewBox="0 0 1000 300">
                            <defs>
                                <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                                    <stop offset="0%" stopColor="#f2d00d" stopOpacity="0.2"></stop>
                                    <stop offset="100%" stopColor="#f2d00d" stopOpacity="0"></stop>
                                </linearGradient>
                            </defs>
                            <path d="M0 250 C 100 200, 200 280, 300 150 S 500 50, 600 100 S 800 200, 1000 50" fill="url(#chartGradient)" stroke="none"></path>
                            <path d="M0 250 C 100 200, 200 280, 300 150 S 500 50, 600 100 S 800 200, 1000 50" fill="none" stroke="#f2d00d" strokeLinecap="round" strokeWidth="3"></path>
                        </svg>
                    </div>
                    {/* X-axis labels */}
                    <div className="absolute bottom-0 left-10 right-0 flex justify-between text-xs font-bold text-subtle px-4 pt-2">
                        <span>Jun 1</span>
                        <span className="hidden sm:inline">Jun 5</span>
                        <span>Jun 10</span>
                        <span className="hidden sm:inline">Jun 15</span>
                        <span>Jun 20</span>
                        <span className="hidden sm:inline">Jun 25</span>
                        <span>Jun 30</span>
                    </div>
                </div>
            </div>

            {/* 3. Orders & Distribution Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Recent Orders */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                    <div className="bg-surface rounded-2xl shadow-soft border border-border flex flex-col h-full overflow-hidden">
                        <div className="p-6 border-b border-border flex justify-between items-center bg-background-light/50">
                            <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5 text-subtle" />
                                Recent Orders
                            </h3>
                            <Link href="/admin/orders" className="text-primary text-sm font-bold hover:underline">View All</Link>
                        </div>
                        <div className="p-0 overflow-x-auto">

                            {/* Mobile View: Stacked Cards (Hidden on Desktop) */}
                            <div className="sm:hidden flex flex-col divide-y divide-border px-4 py-2">
                                <div className="py-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-background-light flex items-center justify-center text-subtle">
                                            <Package className="w-5 h-5 text-on-surface" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-on-surface">ORD-003</p>
                                            <p className="text-xs text-subtle">Amira F.</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1.5">
                                        <span className="font-bold text-on-surface text-sm font-display">450 QAR</span>
                                        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-[10px] border border-yellow-200 rounded-full font-bold">Processing</span>
                                    </div>
                                </div>
                                <div className="py-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-background-light flex items-center justify-center text-subtle">
                                            <Package className="w-5 h-5 text-on-surface" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-on-surface">ORD-002</p>
                                            <p className="text-xs text-subtle">Fatima A.</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1.5">
                                        <span className="font-bold text-on-surface text-sm font-display">1,200 QAR</span>
                                        <span className="px-2 py-0.5 bg-green-100 text-green-800 text-[10px] border border-green-200 rounded-full font-bold">Shipped</span>
                                    </div>
                                </div>
                                <div className="py-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-background-light flex items-center justify-center text-subtle">
                                            <Package className="w-5 h-5 text-on-surface" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-on-surface">ORD-001</p>
                                            <p className="text-xs text-subtle">Layla K.</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1.5">
                                        <span className="font-bold text-on-surface text-sm font-display">320 QAR</span>
                                        <span className="px-2 py-0.5 bg-green-100 text-green-800 text-[10px] border border-green-200 rounded-full font-bold">Delivered</span>
                                    </div>
                                </div>
                            </div>

                            {/* Desktop View: Full Table (Hidden on Mobile) */}
                            <table className="hidden sm:table w-full text-left whitespace-nowrap">
                                <thead className="bg-background-light text-subtle text-xs font-bold uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">Order ID</th>
                                        <th className="px-6 py-4">Customer</th>
                                        <th className="px-6 py-4">Amount</th>
                                        <th className="px-6 py-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm font-medium divide-y divide-border/50">
                                    <tr className="hover:bg-background-light/50 transition-colors">
                                        <td className="px-6 py-4 text-on-surface">
                                            <Link href="/admin/orders/ORD-003" className="hover:text-primary transition-colors flex items-center gap-2">
                                                ORD-003
                                                {/* Status indicator dot built into ID for quick scanning */}
                                                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">Amira F.</td>
                                        <td className="px-6 py-4 text-on-surface">450 QAR</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 border border-yellow-200">
                                                Processing
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-background-light/50 transition-colors">
                                        <td className="px-6 py-4 text-on-surface">
                                            <Link href="/admin/orders/ORD-002" className="hover:text-primary transition-colors flex items-center gap-2">
                                                ORD-002
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">Fatima A.</td>
                                        <td className="px-6 py-4 text-on-surface">1,200 QAR</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200">
                                                Shipped
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-background-light/50 transition-colors">
                                        <td className="px-6 py-4 text-on-surface">
                                            <Link href="/admin/orders/ORD-001" className="hover:text-primary transition-colors flex items-center gap-2">
                                                ORD-001
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">Layla K.</td>
                                        <td className="px-6 py-4 text-on-surface">320 QAR</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200">
                                                Delivered
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Column: Distribution & Alerts */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                    {/* Sales Distribution Donut */}
                    <div className="bg-surface rounded-2xl shadow-soft border border-border p-6 flex flex-col">
                        <h3 className="text-lg font-bold text-on-surface mb-6">Sales by Region</h3>
                        <div className="flex items-center justify-center gap-8 flex-1">
                            {/* CSS Donut Chart translating the reference conic gradient */}
                            <div className="relative w-32 h-32 rounded-full shadow-inner" style={{ background: 'conic-gradient(#f2b90d 0% 45%, #e7e4d6 45% 75%, #ffffff 75% 100%)' }}>
                                {/* Inner circle to create donut effect mapping to bg-surface */}
                                <div className="absolute inset-4 bg-surface rounded-full flex items-center justify-center shadow-sm">
                                    <div className="text-center">
                                        <span className="block text-xl font-bold font-display text-on-surface mt-1">100%</span>
                                    </div>
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-3">
                                    <span className="w-3 h-3 rounded-full bg-[#f2b90d] shadow-sm"></span>
                                    <span className="text-sm font-bold text-on-surface">Qatar (45%)</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="w-3 h-3 rounded-full bg-[#e7e4d6] border border-border"></span>
                                    <span className="text-sm font-bold text-subtle">Saudi Arabia (30%)</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="w-3 h-3 rounded-full bg-white border border-border"></span>
                                    <span className="text-sm font-bold text-subtle">Kuwait (25%)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Alerts Widget */}
                    <div className="bg-surface rounded-2xl shadow-soft border border-border flex flex-col flex-1">
                        <div className="p-4 border-b border-border flex justify-between items-center">
                            <h3 className="text-lg font-bold text-on-surface">Alerts & Tasks</h3>
                            <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest border border-red-100">3 New</span>
                        </div>
                        <div className="p-4 flex flex-col gap-3">
                            {/* Alert 1 */}
                            <div className="flex items-start gap-3 p-3 rounded-xl bg-red-50 border border-red-100">
                                <div className="text-red-500 mt-0.5">
                                    <AlertTriangle className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-red-900">Out of Stock</p>
                                    <p className="text-xs text-red-700/80 mt-1 font-medium">Black Crepe Abaya - Size L is out of stock.</p>
                                </div>
                            </div>
                            {/* Alert 2 */}
                            <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-50 border border-amber-100">
                                <div className="text-amber-600 mt-0.5">
                                    <Truck className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-amber-900">Ready for Shipping</p>
                                    <p className="text-xs text-amber-700/80 mt-1 font-medium">5 orders are ready for courier pickup.</p>
                                </div>
                            </div>
                            {/* Alert 3 */}
                            <div className="flex items-start gap-3 p-3 rounded-xl bg-background-light border border-border/50">
                                <div className="text-subtle mt-0.5">
                                    <MessageSquare className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-on-surface">Customer Reviews</p>
                                    <p className="text-xs text-subtle mt-1 font-medium">3 new reviews require manual approval.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockOrders } from '@/mock/admin';
import { useAdminAuth } from '@/lib/stores/adminAuth';
import Link from 'next/link';
import { ArrowLeft, Save, MapPin, CreditCard, Clock, User, Phone, Mail } from 'lucide-react';

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { user } = useAdminAuth();

    // Find mock order or fallback
    const initialOrder = mockOrders.find(o => o.id === params.id) || mockOrders[0];
    const [status, setStatus] = useState(initialOrder.status);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        // Mock save delay
        setTimeout(() => {
            setIsSaving(false);
            alert(`Order status updated to ${status}`);
        }, 500);
    };

    const getStatusStyle = (s: string) => {
        switch (s) {
            case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/orders" className="p-2 bg-surface border border-border rounded-xl text-subtle hover:bg-background-light hover:text-on-surface transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-2xl font-bold font-display text-on-surface">Order {initialOrder.id}</h1>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border capitalize ml-4 ${getStatusStyle(status)}`}>
                    {status}
                </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Status Updater */}
                    <div className="bg-surface rounded-2xl shadow-soft border border-border p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div>
                            <h3 className="font-bold text-on-surface mb-1">Update Status</h3>
                            <p className="text-sm text-subtle">Change the current state of this order.</p>
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value as any)}
                                className="w-full md:w-auto bg-background-light border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 cursor-pointer disabled:opacity-50"
                                disabled={user?.role !== 'admin_owner'}
                            >
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                            <button
                                onClick={handleSave}
                                disabled={isSaving || user?.role !== 'admin_owner' || status === initialOrder.status}
                                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm whitespace-nowrap"
                            >
                                <Save className="w-4 h-4" />
                                {isSaving ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                    {user?.role !== 'admin_owner' && (
                        <p className="text-sm text-amber-600 px-2 mt-[-16px]">Staff members cannot change order status.</p>
                    )}

                    {/* Order Items Mock */}
                    <div className="bg-surface rounded-2xl shadow-soft border border-border overflow-hidden">
                        <div className="px-6 py-4 border-b border-border">
                            <h3 className="font-bold text-on-surface">Order Items ({initialOrder.items})</h3>
                        </div>
                        <div className="divide-y divide-border px-6">
                            {[...Array(initialOrder.items)].map((_, i) => (
                                <div key={i} className="py-4 flex gap-4 items-center">
                                    <div className="w-16 h-20 bg-background-light rounded-lg border border-border flex-shrink-0" />
                                    <div className="flex-1">
                                        <h4 className="font-bold text-sm text-on-surface">Luxury Abaya Set</h4>
                                        <p className="text-xs text-subtle mt-1">Size: M | Color: Black</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-sm text-on-surface">{(initialOrder.total / initialOrder.items).toFixed(0)} QAR</div>
                                        <div className="text-xs text-subtle mt-1">Qty: 1</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="bg-background-light p-6 space-y-2 border-t border-border">
                            <div className="flex justify-between text-sm text-subtle">
                                <span>Subtotal</span>
                                <span>{initialOrder.total} QAR</span>
                            </div>
                            <div className="flex justify-between text-sm text-subtle">
                                <span>Shipping</span>
                                <span className="text-green-600 font-bold">Free</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg text-on-surface pt-2 border-t border-border/50 mt-2">
                                <span>Total</span>
                                <span>{initialOrder.total} QAR</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Customer Info */}
                <div className="space-y-6">
                    <div className="bg-surface rounded-2xl shadow-soft border border-border p-6">
                        <h3 className="font-bold text-on-surface mb-6 flex items-center gap-2">
                            <User className="w-5 h-5 text-subtle" />
                            Customer Info
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <User className="w-4 h-4 text-primary mt-0.5" />
                                <div>
                                    <div className="text-sm text-subtle mb-0.5">Name</div>
                                    <div className="text-sm font-bold text-on-surface">{initialOrder.customer.name}</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Phone className="w-4 h-4 text-primary mt-0.5" />
                                <div>
                                    <div className="text-sm text-subtle mb-0.5">Phone</div>
                                    <div className="text-sm font-bold text-on-surface" dir="ltr">{initialOrder.customer.phone}</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Mail className="w-4 h-4 text-primary mt-0.5" />
                                <div>
                                    <div className="text-sm text-subtle mb-0.5">Email</div>
                                    <div className="text-sm font-bold text-on-surface">{initialOrder.customer.email}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-surface rounded-2xl shadow-soft border border-border p-6">
                        <h3 className="font-bold text-on-surface mb-6 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-subtle" />
                            Shipping
                        </h3>
                        <p className="text-sm text-on-surface leading-loose">
                            {initialOrder.customer.name}<br />
                            Al Olaya Street, Building 45<br />
                            Riyadh, 12211<br />
                            Saudi Arabia
                        </p>
                    </div>

                    <div className="bg-surface rounded-2xl shadow-soft border border-border p-6">
                        <h3 className="font-bold text-on-surface mb-6 flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-subtle" />
                            Payment Method
                        </h3>
                        <div className="flex items-center gap-3">
                            <div className="px-3 py-1 bg-background-light border border-border rounded-lg text-xs font-bold font-display tracking-widest text-subtle">
                                {initialOrder.paymentMethod.toUpperCase()}
                            </div>
                            <span className="text-sm font-bold text-on-surface">Paid</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

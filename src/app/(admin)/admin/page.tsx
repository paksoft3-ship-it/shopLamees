'use client';

import { TrendingUp, Users, ShoppingBag, DollarSign } from 'lucide-react';
import { useAdminAuth } from '@/lib/stores/adminAuth';

export default function AdminDashboard() {
    const { user } = useAdminAuth();

    const stats = [
        { label: 'Total Revenue', value: '42,500 QAR', icon: DollarSign, trend: '+12%' },
        { label: 'Active Orders', value: '24', icon: ShoppingBag, trend: '+5%' },
        { label: 'Total Customers', value: '1,240', icon: Users, trend: '+18%' },
        { label: 'Conversion Rate', value: '3.2%', icon: TrendingUp, trend: '+1.1%' },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="bg-surface rounded-2xl shadow-soft border border-border p-8">
                <h2 className="text-2xl font-bold font-display text-on-surface mb-2">
                    Welcome back, {user?.role === 'admin_owner' ? 'Owner' : 'Staff'}!
                </h2>
                <p className="text-subtle text-sm">Here's what's happening with Shop Lamees today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-surface rounded-2xl shadow-soft border border-border p-6 flex flex-col justify-between h-36">
                        <div className="flex justify-between items-start">
                            <span className="text-subtle text-sm font-bold">{stat.label}</span>
                            <div className="p-2 bg-background-light rounded-lg">
                                <stat.icon className="w-5 h-5 text-primary" />
                            </div>
                        </div>
                        <div className="flex items-end justify-between">
                            <span className="text-2xl font-bold font-display text-on-surface">{stat.value}</span>
                            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">{stat.trend}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-surface rounded-2xl shadow-soft border border-border p-8 text-center py-20">
                <div className="w-16 h-16 bg-background-light border border-border rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-subtle" />
                </div>
                <h3 className="font-bold text-on-surface mb-2">Analytics Placeholder</h3>
                <p className="text-subtle text-sm max-w-sm mx-auto">
                    Sales performance charts and recent activity will be displayed here in future iterations.
                </p>
            </div>
        </div>
    );
}

'use client';

import { useState } from 'react';
import { mockOrders } from '@/mock/admin';
import Link from 'next/link';
import { Search, Filter, Download, Eye } from 'lucide-react';

export default function OrdersPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredOrders = mockOrders.filter(o => {
        const matchesSearch = o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o.customer.phone.includes(searchTerm);
        const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold font-display text-on-surface">Orders</h1>
                <button className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-xl text-sm font-bold text-on-surface hover:bg-background-light transition-colors">
                    <Download className="w-4 h-4" /> Export CSV
                </button>
            </div>

            <div className="bg-surface rounded-2xl shadow-soft border border-border p-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-subtle" />
                    <input
                        type="text"
                        placeholder="Search by Order ID or Phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-background-light border border-border rounded-xl text-sm focus:outline-none focus:border-primary/50 transition-colors"
                    />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Filter className="w-4 h-4 text-subtle" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-background-light border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 cursor-pointer min-w-[150px]"
                    >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            <div className="bg-surface rounded-2xl shadow-soft border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-background-light border-b border-border text-subtle text-xs uppercase tracking-wider font-bold">
                                <th className="px-6 py-4">Order ID</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Total</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-background-light/50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-on-surface text-sm">{order.id}</td>
                                    <td className="px-6 py-4 text-sm text-subtle">
                                        {new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-bold text-on-surface">{order.customer.name}</div>
                                        <div className="text-xs text-subtle">{order.customer.phone}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border capitalize ${getStatusStyle(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-on-surface">
                                        {order.total} QAR
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <Link href={`/admin/orders/${order.id}`} className="inline-flex items-center justify-center p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors">
                                            <Eye className="w-4 h-4" />
                                        </Link>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-subtle text-sm">
                                        No orders found matching your filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Mock */}
                <div className="border-t border-border px-6 py-4 flex items-center justify-between bg-surface">
                    <div className="text-sm text-subtle">
                        Showing <span className="font-bold text-on-surface">1</span> to <span className="font-bold text-on-surface">{filteredOrders.length}</span> of <span className="font-bold text-on-surface">{filteredOrders.length}</span> results
                    </div>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 border border-border rounded-lg text-sm bg-background-light text-subtle cursor-not-allowed opacity-50">Previous</button>
                        <button className="px-3 py-1 border border-border rounded-lg text-sm bg-background-light text-subtle cursor-not-allowed opacity-50">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
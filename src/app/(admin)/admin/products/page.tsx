'use client';

import { useState } from 'react';
import { mockAdminProducts } from '@/mock/admin';
import Link from 'next/link';
import { Search, Filter, Plus, Edit3 } from 'lucide-react';
import { useAdminAuth } from '@/lib/stores/adminAuth';

export default function ProductsPage() {
    const { user } = useAdminAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredProducts = mockAdminProducts.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800 border-green-200';
            case 'draft': return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'archived': return 'bg-gray-100 text-gray-800 border-gray-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold font-display text-on-surface">Products</h1>
                {user?.role === 'admin_owner' && (
                    <Link href="/admin/products/new" className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                        <Plus className="w-4 h-4" /> Add Product
                    </Link>
                )}
            </div>

            <div className="bg-surface rounded-2xl shadow-soft border border-border p-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-subtle" />
                    <input
                        type="text"
                        placeholder="Search products..."
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
                        <option value="active">Active</option>
                        <option value="draft">Draft</option>
                        <option value="archived">Archived</option>
                    </select>
                </div>
            </div>

            <div className="bg-surface rounded-2xl shadow-soft border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-background-light border-b border-border text-subtle text-xs uppercase tracking-wider font-bold">
                                <th className="px-6 py-4">Product</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Inventory</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredProducts.length > 0 ? filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-background-light/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-background-light rounded border border-border shrink-0" />
                                            <div>
                                                <div className="font-bold text-on-surface text-sm">{product.title}</div>
                                                <div className="text-xs text-subtle">{product.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border capitalize ${getStatusStyle(product.status)}`}>
                                            {product.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-subtle capitalize">
                                        {product.type.replace('-', ' ')}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        {product.type === 'ready' ? (
                                            <span className={product.stock > 0 ? 'text-on-surface font-bold' : 'text-red-500 font-bold'}>
                                                {product.stock} in stock
                                            </span>
                                        ) : (
                                            <span className="text-subtle">Made to order ({product.leadTimeDays}d)</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-on-surface">
                                        {product.price} QAR
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <Link href={`/admin/products/${product.id}/edit`} className="inline-flex items-center justify-center p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors">
                                            <Edit3 className="w-4 h-4" />
                                        </Link>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-subtle text-sm">
                                        No products found matching your filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Mock */}
                <div className="border-t border-border px-6 py-4 flex items-center justify-between bg-surface">
                    <div className="text-sm text-subtle">
                        Showing <span className="font-bold text-on-surface">1</span> to <span className="font-bold text-on-surface">{filteredProducts.length}</span> of <span className="font-bold text-on-surface">{filteredProducts.length}</span> results
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
'use client';

import { useState } from 'react';
import { AdminProduct } from '@/types/admin';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface ProductFormProps {
    initialData?: AdminProduct;
    isEdit?: boolean;
}

export function ProductForm({ initialData, isEdit }: ProductFormProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('basic');
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState<Partial<AdminProduct>>(
        initialData || {
            title: '',
            status: 'draft',
            type: 'ready',
            price: 0,
            stock: 0,
            leadTimeDays: 0,
        }
    );

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            alert(`Product ${isEdit ? 'updated' : 'created'} successfully!`);
            router.push('/admin/products');
        }, 600);
    };

    const tabs = [
        { id: 'basic', label: 'Basic Info' },
        { id: 'pricing', label: 'Pricing & Stock' },
        { id: 'variants', label: 'Variants' },
        { id: 'attributes', label: 'Attributes & Type' },
        { id: 'seo', label: 'SEO' },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/products" className="p-2 bg-surface border border-border rounded-xl text-subtle hover:bg-background-light hover:text-on-surface transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-2xl font-bold font-display text-on-surface">
                        {isEdit ? `Edit Product: ${initialData?.title}` : 'Create New Product'}
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as AdminProduct['status'] })}
                        className="bg-surface border border-border rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-none focus:border-primary/50 cursor-pointer"
                    >
                        <option value="active">Active</option>
                        <option value="draft">Draft</option>
                        <option value="archived">Archived</option>
                    </select>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 text-sm disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        {isSaving ? 'Saving...' : 'Save Product'}
                    </button>
                </div>
            </div>

            <div className="bg-surface border border-border rounded-2xl shadow-soft overflow-hidden">
                <div className="flex border-b border-border overflow-x-auto">
                    {tabs.map(t => (
                        <button
                            key={t.id}
                            onClick={() => setActiveTab(t.id)}
                            className={`px-6 py-4 text-sm font-bold whitespace-nowrap transition-colors border-b-2 ${activeTab === t.id
                                ? 'border-primary text-primary bg-primary/5'
                                : 'border-transparent text-subtle hover:text-on-surface hover:bg-background-light/50'
                                }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                <div className="p-8">
                    {activeTab === 'basic' && (
                        <div className="space-y-6 max-w-2xl">
                            <div>
                                <label className="block text-sm font-bold text-on-surface mb-2">Product Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full bg-background-light border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50"
                                    placeholder="e.g. Luxury Black Abaya"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-on-surface mb-2">Description</label>
                                <textarea
                                    className="w-full bg-background-light border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 h-32"
                                    placeholder="Enter detailed description..."
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'attributes' && (
                        <div className="space-y-6 max-w-2xl">
                            <div>
                                <label className="block text-sm font-bold text-on-surface mb-2">Product Type Flag</label>
                                <p className="text-xs text-subtle mb-4">Determine how this product is fulfilled.</p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {(['ready', 'made-to-order', 'custom'] as const).map(type => (
                                        <div
                                            key={type}
                                            onClick={() => setFormData({ ...formData, type })}
                                            className={`p-4 border rounded-xl cursor-pointer transition-all ${formData.type === type ? 'border-primary bg-primary/5 shadow-sm' : 'border-border hover:border-primary/50 bg-background-light'
                                                }`}
                                        >
                                            <div className="font-bold text-sm text-on-surface flex items-center gap-2 capitalize">
                                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${formData.type === type ? 'border-primary' : 'border-subtle'}`}>
                                                    {formData.type === type && <div className="w-2 h-2 rounded-full bg-primary" />}
                                                </div>
                                                {type.replace('-', ' ')}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {formData.type !== 'ready' && (
                                <div className="pt-4 border-t border-border">
                                    <label className="block text-sm font-bold text-on-surface mb-2">Lead Time (Days)</label>
                                    <input
                                        type="number"
                                        value={formData.leadTimeDays}
                                        onChange={(e) => setFormData({ ...formData, leadTimeDays: parseInt(e.target.value) })}
                                        className="w-full max-w-[200px] bg-background-light border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50"
                                        min="0"
                                    />
                                    <p className="text-xs text-subtle mt-2">Expected days to manufacture before shipping.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'pricing' && (
                        <div className="space-y-6 max-w-2xl">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-on-surface mb-2">Price (QAR)</label>
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                        className="w-full bg-background-light border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50"
                                        min="0"
                                    />
                                </div>
                                {formData.type === 'ready' && (
                                    <div>
                                        <label className="block text-sm font-bold text-on-surface mb-2">Stock Level</label>
                                        <input
                                            type="number"
                                            value={formData.stock}
                                            onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                                            className="w-full bg-background-light border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50"
                                            min="0"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'variants' && (
                        <div className="py-8 text-center text-subtle">
                            <p>Variant management (Sizes, Cuts) placeholder.</p>
                        </div>
                    )}

                    {activeTab === 'seo' && (
                        <div className="py-8 text-center text-subtle">
                            <p>SEO Meta title and description placeholder.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}


'use client';

import { useState } from 'react';
import { useAdminUsers, RolePermissions } from '@/lib/stores/adminUsers';

interface RoleModalProps {
    isOpen: boolean;
    onClose: () => void;
    locale: string;
}

export default function RoleModal({ isOpen, onClose, locale }: RoleModalProps) {
    const isRtl = locale === 'ar';
    const { addRole } = useAdminUsers();

    const [roleName, setRoleName] = useState('');
    const [permissions, setPermissions] = useState<RolePermissions>({
        orders: { view: true, add: false, edit: false, delete: false },
        products: { view: true, add: true, edit: true, delete: false },
        settings: { view: false, add: false, edit: false, delete: false },
        content: { view: true, add: false, edit: false, delete: false }
    });

    if (!isOpen) return null;

    const handlePermissionChange = (module: keyof RolePermissions, action: keyof RolePermissions['orders'], checked: boolean) => {
        setPermissions(prev => ({
            ...prev,
            [module]: {
                ...prev[module],
                [action]: checked
            }
        }));
    };

    const toggleAll = () => {
        const allTrue = { view: true, add: true, edit: true, delete: true };
        setPermissions({
            orders: { ...allTrue },
            products: { ...allTrue },
            settings: { ...allTrue },
            content: { ...allTrue }
        });
    };

    const handleSave = () => {
        if (!roleName.trim()) return;
        addRole({ name: roleName, permissions });
        setRoleName('');
        onClose();
    };

    const modules = [
        { id: 'orders', icon: 'shopping_cart', labelAr: 'الطلبات', labelEn: 'Orders', descAr: 'إدارة طلبات العملاء', descEn: 'Manage customer orders', color: 'indigo' },
        { id: 'products', icon: 'checkroom', labelAr: 'المنتجات', labelEn: 'Products', descAr: 'إدارة المخزون والأصناف', descEn: 'Manage inventory and items', color: 'rose' },
        { id: 'settings', icon: 'settings', labelAr: 'الإعدادات', labelEn: 'Settings', descAr: 'تهيئة النظام والعامة', descEn: 'System configuration', color: 'emerald' },
        { id: 'content', icon: 'article', labelAr: 'المحتوى', labelEn: 'Content', descAr: 'الصفحات والمدونة', descEn: 'Pages and blogs', color: 'amber' },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div aria-hidden="true" className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

            <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl z-50 flex flex-col max-h-[90vh] overflow-hidden border border-gray-200">
                <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-white shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{isRtl ? 'إنشاء دور جديد' : 'Create New Role'}</h2>
                        <p className="text-sm text-gray-500 mt-1">{isRtl ? 'قم بتحديد صلاحيات الدور الجديد من خلال الجدول أدناه' : 'Define permissions for the new role below'}</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600">
                        <span className="material-symbols-outlined text-2xl">close</span>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8">
                    <div className="mb-8">
                        <label className="block text-sm font-medium text-gray-700 mb-2">{isRtl ? 'اسم الدور' : 'Role Name'}</label>
                        <div className="relative">
                            <input
                                value={roleName}
                                onChange={(e) => setRoleName(e.target.value)}
                                className={`w-full h-12 ${isRtl ? 'pr-12 pl-4' : 'pl-12 pr-4'} rounded-lg border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-primary/20 transition-all text-base`}
                                placeholder={isRtl ? 'مثال: مدير طلبات' : 'e.g. Order Manager'}
                                type="text"
                            />
                            <div className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -trangray-y-1/2 text-gray-400 pointer-events-none flex items-center`}>
                                <span className="material-symbols-outlined">badge</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className={`w-full ${isRtl ? 'text-right' : 'text-left'} border-collapse`}>
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-900 w-1/3">
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary text-xl">grid_view</span>
                                                {isRtl ? 'الوحدة' : 'Module'}
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-700 text-center w-1/6">{isRtl ? 'عرض' : 'View'}</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-700 text-center w-1/6">{isRtl ? 'إضافة' : 'Add'}</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-700 text-center w-1/6">{isRtl ? 'تعديل' : 'Edit'}</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-700 text-center w-1/6">{isRtl ? 'حذف' : 'Delete'}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {modules.map((mod) => (
                                        <tr key={mod.id} className="group hover:bg-gray-50/80 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-lg bg-${mod.color}-50 text-${mod.color}-600`}>
                                                        <span className="material-symbols-outlined">{mod.icon}</span>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900 text-sm">{isRtl ? mod.labelAr : mod.labelEn}</p>
                                                        <p className="text-xs text-gray-500">{isRtl ? mod.descAr : mod.descEn}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            {(['view', 'add', 'edit', 'delete'] as const).map(action => (
                                                <td key={action} className="px-6 py-4 text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={permissions[mod.id as keyof RolePermissions][action]}
                                                        onChange={(e) => handlePermissionChange(mod.id as keyof RolePermissions, action, e.target.checked)}
                                                        className="mx-auto w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary shadow-sm"
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                        <button onClick={toggleAll} className="text-sm text-primary hover:text-indigo-700 font-medium flex items-center gap-1 transition-colors">
                            <span className="material-symbols-outlined text-base">done_all</span>
                            {isRtl ? 'تحديد الكل' : 'Select All'}
                        </button>
                    </div>
                </div>

                <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3 shrink-0">
                    <button onClick={onClose} className="px-6 h-11 rounded-lg border border-gray-200 text-gray-600 font-medium hover:bg-white transition-all">
                        {isRtl ? 'إلغاء' : 'Cancel'}
                    </button>
                    <button onClick={handleSave} disabled={!roleName.trim()} className="px-6 h-11 rounded-lg bg-primary hover:bg-primary/90 text-white font-medium shadow-md transition-all flex items-center gap-2 disabled:opacity-50">
                        <span className="material-symbols-outlined text-[20px]">save</span>
                        <span>{isRtl ? 'حفظ الدور' : 'Save Role'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

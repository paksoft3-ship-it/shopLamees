'use client';

import { useState, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { useAdminUsers, UserRole } from '@/lib/stores/adminUsers';
import RoleModal from './components/RoleModal';

export default function AdminUsersPage() {
    const locale = useLocale();
    const isRtl = locale === 'ar';
    const { users, roles, updateUserStatus } = useAdminUsers();

    const [searchQuery, setSearchQuery] = useState('');
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

    const filteredUsers = useMemo(() => {
        return users.filter(user =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [users, searchQuery]);

    const getRoleName = (roleId: string) => {
        const found = roles.find(r => r.id === roleId);
        if (found) return found.name;

        switch (roleId) {
            case 'owner': return isRtl ? 'مدير النظام' : 'System Admin';
            case 'manager': return isRtl ? 'مدير منتجات' : 'Manager';
            case 'editor': return isRtl ? 'محرر محتوى' : 'Content Editor';
            case 'support': return isRtl ? 'دعم فني' : 'Technical Support';
            case 'finance': return isRtl ? 'مالية' : 'Finance';
            default: return roleId;
        }
    };

    const getRoleBadgeColor = (role: UserRole | string) => {
        switch (role) {
            case 'owner': return 'bg-primary/10 text-primary border-primary/20';
            case 'editor': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'support': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'manager': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'finance': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getAvatarFallback = (name: string, role: string) => {
        const initial = name.charAt(0);
        switch (role) {
            case 'editor': return <div className="size-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm">{initial}</div>;
            case 'manager': return <div className="size-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">{initial}</div>;
            case 'finance': return <div className="size-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm">{initial}</div>;
            default: return <div className="size-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-bold text-sm">{initial}</div>;
        }
    };

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
            <header className="flex flex-wrap items-end justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                        {isRtl ? 'إدارة الموظفين' : 'User Management'}
                    </h2>
                    <p className="text-gray-500 font-medium text-sm">
                        {isRtl ? 'قم بإدارة صلاحيات الوصول وأدوار الفريق والمتابعة' : 'Manage access permissions, team roles, and tracking'}
                    </p>
                </div>
                <div className="flex items-center gap-4 flex-wrap">
                    <div className="relative group">
                        <span className={`material-symbols-outlined absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -trangray-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors pointer-events-none`}>search</span>
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`w-full md:w-80 h-11 ${isRtl ? 'pr-12 pl-4' : 'pl-12 pr-4'} bg-white border-transparent shadow-sm rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm font-medium placeholder:text-gray-400 transition-all`}
                            placeholder={isRtl ? 'بحث بالاسم، البريد...' : 'Search name, email...'}
                            type="text"
                        />
                    </div>

                    <button onClick={() => setIsRoleModalOpen(true)} className="bg-gray-900 hover:bg-gray-800 text-white px-5 h-11 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-all">
                        <span className="material-symbols-outlined text-[20px]">badge</span>
                        <span className="hidden sm:inline">{isRtl ? 'إنشاء دور' : 'Create Role'}</span>
                    </button>

                    <button className="bg-primary hover:bg-primary/90 text-white px-5 h-11 rounded-xl text-sm font-bold flex items-center gap-2 shadow-md shadow-primary/20 transition-all">
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        <span className="hidden sm:inline">{isRtl ? 'إضافة موظف' : 'Add User'}</span>
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                <div className="xl:col-span-8 2xl:col-span-9 flex flex-col gap-4">
                    <div className="bg-transparent rounded-xl overflow-x-auto">
                        <table className={`w-full ${isRtl ? 'text-right' : 'text-left'} border-separate border-spacing-y-3 min-w-[700px]`}>
                            <thead>
                                <tr>
                                    <th className={`pb-2 ${isRtl ? 'pr-6' : 'pl-6'} text-xs font-bold text-gray-400 uppercase tracking-wider`}>{isRtl ? 'الموظف' : 'Employee'}</th>
                                    <th className="pb-2 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">{isRtl ? 'الدور' : 'Role'}</th>
                                    <th className="pb-2 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">{isRtl ? 'البريد الإلكتروني' : 'Email'}</th>
                                    <th className="pb-2 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">{isRtl ? 'الحالة' : 'Status'}</th>
                                    <th className={`pb-2 ${isRtl ? 'pl-6' : 'pr-6'} text-xs font-bold text-gray-400 uppercase tracking-wider w-10`}></th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {filteredUsers.map(user => (
                                    <tr key={user.id} className={`group transition-all duration-200 ${user.status === 'disabled' ? 'opacity-70 grayscale' : 'hover:transform hover:-trangray-y-0.5'}`}>
                                        <td className={`bg-white ${isRtl ? 'rounded-r-xl pr-6' : 'rounded-l-xl pl-6'} py-4 shadow-sm border border-transparent group-hover:border-primary/10`}>
                                            <div className="flex items-center gap-3">
                                                {user.avatar ? (
                                                    <div className="size-10 rounded-full bg-gray-100 overflow-hidden relative">
                                                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                                    </div>
                                                ) : (
                                                    getAvatarFallback(user.name, user.role)
                                                )}
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-gray-900">{user.name}</span>
                                                    <span className="text-xs text-gray-400 md:hidden">{getRoleName(user.role)}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="bg-white py-4 px-4 shadow-sm border-y border-transparent group-hover:border-primary/10">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getRoleBadgeColor(user.role)}`}>
                                                {getRoleName(user.role)}
                                            </span>
                                        </td>
                                        <td className="bg-white py-4 px-4 text-gray-500 shadow-sm border-y border-transparent group-hover:border-primary/10 font-sans dir-ltr text-right">
                                            {user.email}
                                        </td>
                                        <td className="bg-white py-4 px-4 shadow-sm border-y border-transparent group-hover:border-primary/10">
                                            <button
                                                onClick={() => updateUserStatus(user.id, user.status === 'active' ? 'disabled' : 'active')}
                                                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${user.status === 'active' ? 'bg-green-50 text-green-700 hover:bg-red-50 hover:text-red-700' : 'bg-gray-100 text-gray-500 hover:bg-green-50 hover:text-green-700'}`}
                                            >
                                                {user.status === 'active' ? (isRtl ? 'نشط' : 'Active') : (isRtl ? 'محظور' : 'Disabled')}
                                            </button>
                                        </td>
                                        <td className={`bg-white ${isRtl ? 'rounded-l-xl pl-6 text-left' : 'rounded-r-xl pr-6 text-right'} py-4 shadow-sm border border-transparent group-hover:border-primary/10`}>
                                            <button className="text-gray-400 hover:text-primary transition-colors p-1 rounded-md hover:bg-gray-50">
                                                <span className="material-symbols-outlined">more_vert</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {filteredUsers.length === 0 && (
                            <div className="text-center py-12 text-gray-500 bg-white rounded-xl shadow-sm">
                                {isRtl ? 'لا يوجد مستخدمين' : 'No users found'}
                            </div>
                        )}
                    </div>
                </div>

                <div className="xl:col-span-4 2xl:col-span-3">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-gray-900">{isRtl ? 'سجل العمليات' : 'Audit Log'}</h3>
                            <button className="text-primary text-xs font-bold hover:underline">{isRtl ? 'عرض الكل' : 'View All'}</button>
                        </div>
                        <div className="relative pl-2">
                            <div className={`absolute ${isRtl ? 'right-[19px]' : 'left-[19px]'} top-2 bottom-2 w-0.5 bg-gray-100`}></div>

                            <div className="relative flex gap-4 mb-6">
                                <div className="size-10 rounded-full bg-blue-50 border-4 border-white z-10 shrink-0 flex items-center justify-center text-blue-600">
                                    <span className="material-symbols-outlined text-lg">edit_note</span>
                                </div>
                                <div className="flex flex-col pt-1">
                                    <span className="text-sm font-medium text-gray-800">تحديث منتج #442</span>
                                    <span className="text-xs text-gray-500 mt-0.5">سارة خليل قامت بتعديل السعر</span>
                                    <span className="text-[10px] text-gray-400 mt-1">منذ 10 دقائق</span>
                                </div>
                            </div>

                            <div className="relative flex gap-4 mb-6">
                                <div className="size-10 rounded-full bg-emerald-50 border-4 border-white z-10 shrink-0 flex items-center justify-center text-emerald-600">
                                    <span className="material-symbols-outlined text-lg">person_add</span>
                                </div>
                                <div className="flex flex-col pt-1">
                                    <span className="text-sm font-medium text-gray-800">موظف جديد</span>
                                    <span className="text-xs text-gray-500 mt-0.5">أحمد الراشد أضاف &quot;فهد الحربي&quot;</span>
                                    <span className="text-[10px] text-gray-400 mt-1">منذ ساعتين</span>
                                </div>
                            </div>

                            <div className="relative flex gap-4">
                                <div className="size-10 rounded-full bg-orange-50 border-4 border-white z-10 shrink-0 flex items-center justify-center text-orange-600">
                                    <span className="material-symbols-outlined text-lg">lock_reset</span>
                                </div>
                                <div className="flex flex-col pt-1">
                                    <span className="text-sm font-medium text-gray-800">تغيير كلمة المرور</span>
                                    <span className="text-xs text-gray-500 mt-0.5">نورة سعد طلبت إعادة تعيين</span>
                                    <span className="text-[10px] text-gray-400 mt-1">منذ 5 ساعات</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <RoleModal
                isOpen={isRoleModalOpen}
                onClose={() => setIsRoleModalOpen(false)}
                locale={locale}
            />
        </div>
    );
}
'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  AdminPanelRole,
  AdminPanelUser,
  createAdminUser,
  deleteAdminUser,
  getAdminUsers,
  updateAdminUserStatus,
} from '@/lib/actions/adminUsers';
import { useLocale } from 'next-intl';

type UserForm = {
  name: string;
  email: string;
  password: string;
  role: AdminPanelRole;
};

const emptyForm: UserForm = {
  name: '',
  email: '',
  password: '',
  role: 'staff',
};

export default function AdminUsersPage() {
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const [users, setUsers] = useState<AdminPanelUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [openCreate, setOpenCreate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<UserForm>(emptyForm);

  const loadUsers = async () => {
    const data = await getAdminUsers();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  const getRoleName = (role: AdminPanelRole) => {
    if (role === 'owner') return isRtl ? 'مدير النظام' : 'Owner';
    return isRtl ? 'موظف' : 'Staff';
  };

  const getRoleBadgeColor = (role: AdminPanelRole) => {
    if (role === 'owner') return 'bg-primary/10 text-primary border-primary/20';
    return 'bg-blue-100 text-blue-700 border-blue-200';
  };

  const handleToggleStatus = async (user: AdminPanelUser) => {
    const nextStatus = user.status === 'active' ? 'disabled' : 'active';
    setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, status: nextStatus } : u)));
    await updateAdminUserStatus(user.id, nextStatus);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(isRtl ? 'هل تريد حذف هذا المستخدم؟' : 'Delete this user?')) return;
    await deleteAdminUser(id);
    await loadUsers();
  };

  const handleCreate = async () => {
    if (!form.name.trim() || !form.email.trim() || form.password.length < 6) return;

    setSaving(true);
    try {
      await createAdminUser(form);
      setOpenCreate(false);
      setForm(emptyForm);
      await loadUsers();
    } finally {
      setSaving(false);
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
            {isRtl ? 'إدارة حسابات المشرفين وصلاحيات الدخول' : 'Manage admin accounts and access status'}
          </p>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative group">
            <span className={`material-symbols-outlined absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors pointer-events-none`}>search</span>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full md:w-80 h-11 ${isRtl ? 'pr-12 pl-4' : 'pl-12 pr-4'} bg-white border-transparent shadow-sm rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm font-medium placeholder:text-gray-400 transition-all`}
              placeholder={isRtl ? 'بحث بالاسم أو البريد...' : 'Search by name or email...'}
              type="text"
            />
          </div>

          <button onClick={() => setOpenCreate(true)} className="bg-primary hover:bg-primary/90 text-white px-5 h-11 rounded-xl text-sm font-bold flex items-center gap-2 shadow-md shadow-primary/20 transition-all">
            <span className="material-symbols-outlined text-[20px]">person_add</span>
            <span>{isRtl ? 'إضافة موظف' : 'Add User'}</span>
          </button>
        </div>
      </header>

      <div className="bg-transparent rounded-xl overflow-x-auto">
        {loading ? (
          <div className="bg-white rounded-xl p-10 text-center text-gray-500">{isRtl ? 'جاري تحميل المستخدمين...' : 'Loading users...'}</div>
        ) : (
          <table className={`w-full ${isRtl ? 'text-right' : 'text-left'} border-separate border-spacing-y-3 min-w-[700px]`}>
            <thead>
              <tr>
                <th className={`pb-2 ${isRtl ? 'pr-6' : 'pl-6'} text-xs font-bold text-gray-400 uppercase tracking-wider`}>{isRtl ? 'الموظف' : 'Employee'}</th>
                <th className="pb-2 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">{isRtl ? 'الدور' : 'Role'}</th>
                <th className="pb-2 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">{isRtl ? 'البريد الإلكتروني' : 'Email'}</th>
                <th className="pb-2 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">{isRtl ? 'الحالة' : 'Status'}</th>
                <th className={`pb-2 ${isRtl ? 'pl-6' : 'pr-6'} text-xs font-bold text-gray-400 uppercase tracking-wider`}>{isRtl ? 'إجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredUsers.map((user) => (
                <tr key={user.id} className={`group transition-all duration-200 ${user.status === 'disabled' ? 'opacity-70 grayscale' : ''}`}>
                  <td className={`bg-white ${isRtl ? 'rounded-r-xl pr-6' : 'rounded-l-xl pl-6'} py-4 shadow-sm border border-transparent group-hover:border-primary/10`}>
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-bold text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
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
                  <td className="bg-white py-4 px-4 text-gray-500 shadow-sm border-y border-transparent group-hover:border-primary/10 font-sans dir-ltr text-left">
                    {user.email}
                  </td>
                  <td className="bg-white py-4 px-4 shadow-sm border-y border-transparent group-hover:border-primary/10">
                    <button
                      onClick={() => handleToggleStatus(user)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${user.status === 'active' ? 'bg-green-50 text-green-700 hover:bg-red-50 hover:text-red-700' : 'bg-gray-100 text-gray-500 hover:bg-green-50 hover:text-green-700'}`}
                    >
                      {user.status === 'active' ? (isRtl ? 'نشط' : 'Active') : (isRtl ? 'معطل' : 'Disabled')}
                    </button>
                  </td>
                  <td className={`bg-white ${isRtl ? 'rounded-l-xl pl-6 text-left' : 'rounded-r-xl pr-6 text-right'} py-4 shadow-sm border border-transparent group-hover:border-primary/10`}>
                    <button onClick={() => handleDelete(user.id)} className="text-red-400 hover:text-red-600 transition-colors p-1 rounded-md hover:bg-red-50">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && filteredUsers.length === 0 && (
          <div className="text-center py-12 text-gray-500 bg-white rounded-xl shadow-sm">
            {isRtl ? 'لا يوجد مستخدمين' : 'No users found'}
          </div>
        )}
      </div>

      {openCreate && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setOpenCreate(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-[#1b170d]">{isRtl ? 'إضافة مستخدم' : 'Create user'}</h3>
              <button onClick={() => setOpenCreate(false)} className="text-neutral-400 hover:text-neutral-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1b170d] mb-1">{isRtl ? 'الاسم' : 'Name'}</label>
                <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1b170d] mb-1">{isRtl ? 'البريد الإلكتروني' : 'Email'}</label>
                <input value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} type="email" dir="ltr" className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1b170d] mb-1">{isRtl ? 'كلمة المرور' : 'Password'}</label>
                <input value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} type="password" dir="ltr" className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1b170d] mb-1">{isRtl ? 'الدور' : 'Role'}</label>
                <select value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as AdminPanelRole }))} className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary">
                  <option value="staff">{isRtl ? 'موظف' : 'Staff'}</option>
                  <option value="owner">{isRtl ? 'مدير النظام' : 'Owner'}</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setOpenCreate(false)} className="flex-1 border border-neutral-200 text-neutral-700 py-2.5 rounded-xl text-sm font-medium hover:bg-neutral-50">{isRtl ? 'إلغاء' : 'Cancel'}</button>
              <button disabled={saving} onClick={handleCreate} className="flex-1 bg-primary hover:bg-primary/90 disabled:opacity-60 text-white py-2.5 rounded-xl text-sm font-bold">{saving ? (isRtl ? 'جاري الحفظ...' : 'Saving...') : (isRtl ? 'حفظ' : 'Save')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

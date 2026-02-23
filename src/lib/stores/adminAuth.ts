'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Role = 'admin_owner' | 'admin_staff' | null;

interface AdminAuthStore {
    user: { email: string; role: Role } | null;
    login: (email: string, role: Role) => void;
    logout: () => void;
}

export const useAdminAuth = create<AdminAuthStore>()(
    persist(
        (set) => ({
            user: null,
            login: (email, role) => set({ user: { email, role } }),
            logout: () => set({ user: null }),
        }),
        {
            name: 'admin-auth-storage',
        }
    )
);

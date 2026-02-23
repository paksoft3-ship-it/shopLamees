import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'owner' | 'manager' | 'editor' | 'support' | 'finance';
export type UserStatus = 'active' | 'disabled';

export interface AdminUser {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    lastActive: string;
    avatar?: string;
}

export interface RolePermissions {
    orders: { view: boolean; add: boolean; edit: boolean; delete: boolean };
    products: { view: boolean; add: boolean; edit: boolean; delete: boolean };
    settings: { view: boolean; add: boolean; edit: boolean; delete: boolean };
    content: { view: boolean; add: boolean; edit: boolean; delete: boolean };
}

export interface CustomRole {
    id: string;
    name: string;
    permissions: RolePermissions;
}

const mockUsers: AdminUser[] = [
    {
        id: 'u_1',
        name: 'أحمد الراشد',
        email: 'ahmed@karaz.com',
        role: 'owner',
        status: 'active',
        lastActive: 'منذ دقيقتين',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxSta5AzRHu_e7g02XLWPIi1rjHZ5GhYOJ-VVoSmP2tbnws1vmcg8r41ryH4B6PU3VDr_yH_JtOcFzHf4egII2RAfP7ts2sHXQzej1K31L2nW3THloPEZbNHtd-wYl4B6ppeXS95iV4P-n8sw5OYhYgKMzes6HO_1fH5ojFrdm55p5LMLyKwE5IhdecRTqiQNLOLhzNJbPKAArWlR7O-oKOswyB5qMY8r7OP_cnqYm75sCLXr6AMEbfekx7_sFCAt_oW7Vm2E84nY'
    },
    {
        id: 'u_2',
        name: 'سارة خليل',
        email: 'sara@karaz.com',
        role: 'editor',
        status: 'active',
        lastActive: 'منذ ساعة'
    },
    {
        id: 'u_3',
        name: 'محمد العلي',
        email: 'mohammed@karaz.com',
        role: 'support',
        status: 'active',
        lastActive: 'منذ يوم',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCs6S2ItxpboRVPCP6hivY7MvlBMHu9AwcZLmy5m-iProdqS1hO_iOroWGFbYDGXbCgvzdL4lP9a8AVRiSRmuZXH8GUKu2VkG7P_1eUR9ny6kMmcfK3hnHY2k1_BJMN0L6V6C9Kdu6IyeNVeGrWB-2gZh0nYQxRboJ7mxM50dgOV06_DhuPkqBhnQzm2UF5KVA0pQQuufDBa6UvGUEmf5pkcdW_5a40qgIRsldF_9aDu9zWzs-0A4RynWvUYAjQIaFc2BXr8gLNX6o'
    },
    {
        id: 'u_4',
        name: 'نورة سعد',
        email: 'noura@karaz.com',
        role: 'manager',
        status: 'active',
        lastActive: 'منذ 3 ساعات'
    },
    {
        id: 'u_5',
        name: 'ليلى حسن',
        email: 'layla@karaz.com',
        role: 'support',
        status: 'disabled',
        lastActive: 'منذ شهر',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAV1ljrJGyV7UroIF5UMa94kWO-Lob8eCF3WqcAgWakwNqYrl7MMfYjczke-fnnvF-6DSUH8cnhXqgKGKLtDg299mB2Sp2oS2M4jAzkQ8nfAERI8llBZMo6z1oQu4qoE5ZmAZOR-zOkNZXn51XNXTgZcwYgLgemdl7HCrPjEU6kP6nIrOOOeIH6sN47v5jjju-aVdzc_Psge5FMH8cfBDqbIS-vBtNIGBc8niypj1rXbjVdxEV0U0RKroYDvbDg1z1rMsWFcaGnGGo'
    }
];

const mockRoles: CustomRole[] = [
    {
        id: 'role_owner',
        name: 'مدير النظام',
        permissions: {
            orders: { view: true, add: true, edit: true, delete: true },
            products: { view: true, add: true, edit: true, delete: true },
            settings: { view: true, add: true, edit: true, delete: true },
            content: { view: true, add: true, edit: true, delete: true }
        }
    }
];

interface AdminUsersStore {
    users: AdminUser[];
    roles: CustomRole[];
    addUser: (user: Omit<AdminUser, 'id'>) => void;
    updateUserStatus: (id: string, status: UserStatus) => void;
    deleteUser: (id: string) => void;
    addRole: (role: Omit<CustomRole, 'id'>) => void;
}

export const useAdminUsers = create<AdminUsersStore>()(
    persist(
        (set) => ({
            users: mockUsers,
            roles: mockRoles,
            addUser: (data) => set((state) => ({
                users: [{ ...data, id: `u_${Date.now()}` }, ...state.users]
            })),
            updateUserStatus: (id, status) => set((state) => ({
                users: state.users.map(u => u.id === id ? { ...u, status } : u)
            })),
            deleteUser: (id) => set((state) => ({
                users: state.users.filter(u => u.id !== id)
            })),
            addRole: (data) => set((state) => ({
                roles: [...state.roles, { ...data, id: `role_${Date.now()}` }]
            }))
        }),
        {
            name: 'admin-users-storage'
        }
    )
);

import { Order, AdminProduct } from '@/types/admin';

export const mockOrders: Order[] = [
    {
        id: 'ORD-1001',
        date: '2026-02-23T10:00:00Z',
        customer: { name: 'Sarah Ahmed', phone: '+966501234567', email: 'sarah@example.com' },
        status: 'pending',
        total: 1250,
        items: 2,
        paymentMethod: 'Apple Pay',
    },
    {
        id: 'ORD-1002',
        date: '2026-02-22T14:30:00Z',
        customer: { name: 'Noura Salem', phone: '+97477808007', email: 'noura@example.com' },
        status: 'processing',
        total: 850,
        items: 1,
        paymentMethod: 'Credit Card',
    },
    {
        id: 'ORD-1003',
        date: '2026-02-21T09:15:00Z',
        customer: { name: 'Fatima Ali', phone: '+971509876543', email: 'fatima@example.com' },
        status: 'shipped',
        total: 2100,
        items: 4,
        paymentMethod: 'Mada',
    }
];

export const mockAdminProducts: AdminProduct[] = [
    {
        id: 'prod-1',
        title: 'Black Crepe Abaya',
        status: 'active',
        type: 'ready',
        price: 450,
        stock: 12,
        leadTimeDays: 0,
    },
    {
        id: 'prod-2',
        title: 'Embroidered Silk Abaya',
        status: 'active',
        type: 'made-to-order',
        price: 850,
        stock: 0,
        leadTimeDays: 5,
    },
    {
        id: 'prod-3',
        title: 'Daily Wear Linen Abaya',
        status: 'draft',
        type: 'ready',
        price: 320,
        stock: 50,
        leadTimeDays: 0,
    }
];

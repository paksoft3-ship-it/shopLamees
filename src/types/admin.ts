export interface Order {
    id: string;
    date: string;
    customer: { name: string; phone: string; email: string };
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    total: number;
    items: number;
    paymentMethod: string;
}

export interface AdminProduct {
    id: string;
    title: string;
    status: 'active' | 'draft' | 'archived';
    type: 'ready' | 'made-to-order' | 'custom';
    price: number;
    stock: number;
    leadTimeDays: number;
}

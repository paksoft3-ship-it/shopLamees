export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';

export interface OrderItem {
    id: string;
    name: string;
    sku: string;
    price: number;
    quantity: number;
    image: string;
    variant?: string; // e.g. "المقاس: M | اللون: أسود"
}

export interface OrderTimelineEvent {
    status: string;
    label: string;
    labelAr?: string;
    date: string;
    note?: string;
    isCurrent?: boolean;
    isFuture?: boolean;
}

export interface AdminOrder {
    id: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerAvatar?: string;
    country: string;
    countryCode: string; // Emoji flag 
    amount: number;
    paymentMethod: string;
    status: OrderStatus;
    date: string;
    shippingAddress: {
        city: string;
        zone: string;
        street: string;
        building: string;
        fullText?: string;
    };
    items: OrderItem[];
    timeline: OrderTimelineEvent[];
    customerNote?: string;
    internalNote?: string;
    discount?: number;
    discountCode?: string;
    shippingFee: number;
}

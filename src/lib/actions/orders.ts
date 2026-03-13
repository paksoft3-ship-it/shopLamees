'use server';

import prisma from '@/lib/db';

interface OrderCartItem {
    variantId: string;
    productId: string;
    name: string;
    unitPrice: number;
    quantity: number;
    image?: string;
    size?: string;
    cut?: string;
}

export interface CreateOrderInput {
    customerName: string;
    phone: string;
    email?: string;
    country: string;
    city: string;
    zone?: string;
    street: string;
    building?: string;
    unit?: string;
    shippingMethod: string;
    shippingFee: number;
    paymentMethod: string;
    currency: string;
    subtotal: number;
    vat: number;
    total: number;
    items: OrderCartItem[];
    customerNote?: string;
}

async function generateOrderNumber(): Promise<string> {
    const date = new Date();
    const yy = date.getFullYear().toString().slice(-2);
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    for (let i = 0; i < 10; i++) {
        const num = Math.floor(1000 + Math.random() * 9000);
        const orderNumber = `SL-${yy}${mm}-${num}`;
        const existing = await prisma.order.findUnique({ where: { orderNumber } });
        if (!existing) return orderNumber;
    }
    throw new Error('Failed to generate unique order number');
}

export async function createOrder(input: CreateOrderInput): Promise<{ orderNumber: string }> {
    const orderNumber = await generateOrderNumber();

    // Schema only supports QA and SA — map everything else to SA
    const country = input.country === 'QA' ? 'QA' : 'SA';
    const currency = input.currency === 'QAR' ? 'QAR' : 'SAR';

    await prisma.order.create({
        data: {
            orderNumber,
            status: 'NEW',
            currency: currency as 'QAR' | 'SAR',
            subtotal: input.subtotal,
            shippingFee: input.shippingFee,
            total: input.total,
            country: country as 'QA' | 'SA',
            customerName: input.customerName,
            phone: input.phone,
            email: input.email || null,
            paymentMethod: input.paymentMethod,
            customerNote: input.customerNote || null,
            items: {
                create: input.items.map(item => ({
                    productId: null,   // avoid FK constraint — IDs in cart are not real DB IDs
                    variantId: null,   // same reason
                    nameSnapshotAr: item.name,
                    nameSnapshotEn: item.name,
                    variantLabel: [item.size && `${item.size} cm`, item.cut].filter(Boolean).join(' / ') || null,
                    sku: item.variantId || null,  // store the cart variantId as SKU reference
                    imageSnapshot: item.image || null,
                    qty: item.quantity,
                    unitPrice: item.unitPrice,
                    lineTotal: item.unitPrice * item.quantity,
                })),
            },
            address: {
                create: {
                    country: input.country,
                    city: input.city,
                    zone: input.zone || null,
                    street: input.street,
                    building: input.building || null,
                    unit: input.unit || null,
                },
            },
        },
    });

    return { orderNumber };
}

export async function getOrderByNumber(orderNumber: string) {
    return prisma.order.findUnique({
        where: { orderNumber },
        include: { items: true, address: true },
    });
}

'use server';

import prisma from '@/lib/db';
import { AdminOrder, OrderStatus, OrderTimelineEvent } from '@/lib/stores/adminOrders';
import { revalidatePath } from 'next/cache';

export async function getAdminOrders(): Promise<AdminOrder[]> {
    const orders = await prisma.order.findMany({
        include: {
            items: {
                include: {
                    product: {
                        include: { images: { orderBy: { sortOrder: 'asc' }, take: 1 } }
                    }
                }
            },
            address: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return orders.map(order => {
        return mapOrderToAdminOrder(order);
    });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapOrderToAdminOrder(order: any): AdminOrder {
    // Build timeline
    const timeline: OrderTimelineEvent[] = [
        {
            status: 'pending',
            label: 'Order Created',
            labelAr: 'تم إنشاء الطلب',
            date: order.createdAt.toISOString(),
            isCurrent: order.status === 'NEW'
        }
    ];

    if (order.status === 'PROCESSING') {
        timeline.push({
            status: 'processing',
            label: 'Processing',
            labelAr: 'جاري التجهيز',
            date: order.updatedAt.toISOString(),
            isCurrent: true
        });
    }
    if (order.status === 'SHIPPED') {
        timeline.push({
            status: 'shipped',
            label: 'Shipped',
            labelAr: 'في الطريق',
            date: order.updatedAt.toISOString(),
            isCurrent: true
        });
    }
    if (order.status === 'COMPLETED') {
        timeline.push({
            status: 'completed',
            label: 'Completed',
            labelAr: 'مكتمل',
            date: order.updatedAt.toISOString(),
            isCurrent: true
        });
    }

    let mappedStatus: OrderStatus = 'pending';
    if (order.status === 'PROCESSING') mappedStatus = 'processing';
    else if (order.status === 'SHIPPED') mappedStatus = 'shipped';
    else if (order.status === 'COMPLETED') mappedStatus = 'completed';
    else if (order.status === 'CANCELLED') mappedStatus = 'cancelled';

    return {
        id: order.id,
        customerName: order.customerName,
        customerEmail: order.email || '',
        customerPhone: order.phone,
        country: order.address?.country || order.country,
        countryCode: order.country === 'QA' ? 'QA' : 'SA',
        amount: Number(order.total),
        paymentMethod: order.paymentMethod,
        status: mappedStatus,
        date: order.createdAt.toISOString().slice(0, 10),
        shippingAddress: {
            city: order.address?.city || '',
            zone: order.address?.zone || '',
            street: order.address?.street || '',
            building: order.address?.building || '',
            fullText: `${order.address?.city || ''}, ${order.address?.street || ''}`
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        items: order.items.map((item: any) => ({
            id: item.id,
            name: item.nameSnapshotEn || item.nameSnapshotAr,
            sku: item.sku || '',
            price: Number(item.unitPrice),
            quantity: item.qty,
            image: item.imageSnapshot || item.product?.images?.[0]?.url || '',
            variant: item.variantLabel || undefined
        })),
        timeline,
        customerNote: order.customerNote || undefined,
        internalNote: order.internalNote || undefined,
        discount: Number(order.discount),
        discountCode: order.discountCode || undefined,
        shippingFee: Number(order.shippingFee)
    };
}

export async function getAdminOrder(orderId: string): Promise<AdminOrder | null> {
    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
            items: {
                include: {
                    product: {
                        include: { images: { orderBy: { sortOrder: 'asc' }, take: 1 } }
                    }
                }
            },
            address: true
        }
    });

    if (!order) return null;
    return mapOrderToAdminOrder(order);
}


export async function updateAdminOrderStatus(orderId: string, status: OrderStatus) {
    let dbStatus: 'NEW' | 'PROCESSING' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED' = 'NEW';

    switch (status) {
        case 'pending': dbStatus = 'NEW'; break;
        case 'processing': dbStatus = 'PROCESSING'; break;
        case 'shipped': dbStatus = 'SHIPPED'; break;
        case 'completed': dbStatus = 'COMPLETED'; break;
        case 'cancelled': dbStatus = 'CANCELLED'; break;
    }

    await prisma.order.update({
        where: { id: orderId },
        data: { status: dbStatus }
    });

    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath('/admin/orders');
    revalidatePath('/admin');
}

export async function updateAdminOrderNote(orderId: string, internalNote: string) {
    await prisma.order.update({
        where: { id: orderId },
        data: { internalNote }
    });

    revalidatePath(`/admin/orders/${orderId}`);
}

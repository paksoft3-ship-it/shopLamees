'use server';

import prisma from '@/lib/db';

async function sendTelegramNotification(order: {
    orderNumber: string;
    customerName: string;
    phone: string;
    email?: string | null;
    country: string;
    city: string;
    zone?: string | null;
    street: string;
    building?: string | null;
    unit?: string | null;
    currency: string;
    subtotal: number;
    shippingFee: number;
    total: number;
    customerNote?: string | null;
    items: Array<{ name: string; qty: number; unitPrice: number; variantLabel?: string | null }>;
}) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    const chatId2 = process.env.TELEGRAM_CHAT_ID_2;
    if (!token || !chatId) return; // silently skip if not configured

    const flag = order.country === 'QA' ? '🇶🇦' : '🇸🇦';
    const itemLines = order.items.map(i =>
        `  • ${i.name}${i.variantLabel ? ` (${i.variantLabel})` : ''} × ${i.qty} = ${i.unitPrice * i.qty} ${order.currency}`
    ).join('\n');

    const address = [
        order.city,
        order.zone,
        order.street,
        order.building ? `مبنى ${order.building}` : null,
        order.unit ? `شقة ${order.unit}` : null,
    ].filter(Boolean).join('، ');

    const message = `🛍️ *طلب جديد - شوب لاميس*

📋 رقم الطلب: *${order.orderNumber}*
👤 الاسم: ${order.customerName}
📞 الهاتف: ${order.phone}${order.email ? `\n📧 البريد: ${order.email}` : ''}

🛒 *المنتجات:*
${itemLines}

💰 المجموع: ${order.subtotal} ${order.currency}
🚚 الشحن: ${order.shippingFee} ${order.currency}
✅ *الإجمالي: ${order.total} ${order.currency}*

${flag} *العنوان:*
${address}

💳 الدفع: تحويل بنكي${order.customerNote ? `\n\n📝 ملاحظة: ${order.customerNote}` : ''}`;

    const recipients = [chatId, chatId2].filter(Boolean);
    try {
        await Promise.all(recipients.map(id =>
            fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: id, text: message, parse_mode: 'Markdown' }),
            })
        ));
    } catch {
        // Don't fail the order if Telegram is down
    }
}

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
                    productId: null,
                    variantId: null,
                    nameSnapshotAr: item.name,
                    nameSnapshotEn: item.name,
                    variantLabel: [item.size && `${item.size} cm`, item.cut].filter(Boolean).join(' / ') || null,
                    sku: item.variantId || null,
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

    // Send Telegram notification to admin (fire-and-forget)
    void sendTelegramNotification({
        orderNumber,
        customerName: input.customerName,
        phone: input.phone,
        email: input.email,
        country: input.country,
        city: input.city,
        zone: input.zone,
        street: input.street,
        building: input.building,
        unit: input.unit,
        currency,
        subtotal: input.subtotal,
        shippingFee: input.shippingFee,
        total: input.total,
        customerNote: input.customerNote,
        items: input.items.map(item => ({
            name: item.name,
            qty: item.quantity,
            unitPrice: item.unitPrice,
            variantLabel: [item.size && `${item.size} cm`, item.cut].filter(Boolean).join(' / ') || null,
        })),
    });

    return { orderNumber };
}

export async function getOrderByNumber(orderNumber: string) {
    return prisma.order.findUnique({
        where: { orderNumber },
        include: { items: true, address: true },
    });
}

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { createTapCharge } from '@/lib/tap';

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

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            locale = 'ar',
            customerName, phone, email,
            country, city, zone, street, building, unit,
            shippingFee,
            currency, subtotal, total,
            customerNote, items,
        } = body;

        if (!customerName || !phone || !city || !street || !items?.length) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const orderNumber = await generateOrderNumber();
        const dbCountry = country === 'QA' ? 'QA' : 'SA';
        const dbCurrency = currency === 'QAR' ? 'QAR' : 'SAR';

        // Create order in DB with TAP payment method
        await prisma.order.create({
            data: {
                orderNumber,
                status: 'NEW',
                currency: dbCurrency,
                subtotal,
                shippingFee: shippingFee || 0,
                total,
                country: dbCountry,
                customerName,
                phone,
                email: email || null,
                paymentMethod: 'TAP',
                customerNote: customerNote || null,
                items: {
                    create: items.map((item: {
                        variantId?: string; name: string; unitPrice: number;
                        quantity: number; image?: string; size?: string; cut?: string;
                    }) => ({
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
                        country,
                        city,
                        zone: zone || null,
                        street,
                        building: building || null,
                        unit: unit || null,
                    },
                },
            },
        });

        // Create Tap charge
        const charge = await createTapCharge({
            amount: total,
            currency: dbCurrency,
            orderNumber,
            description: `Lamees Store — Order ${orderNumber}`,
            locale,
            customer: { name: customerName, email, phone, country },
        });

        // Store tap charge ID on the order
        await prisma.order.update({
            where: { orderNumber },
            data: { tapChargeId: charge.id },
        });

        return NextResponse.json({ redirectUrl: charge.transaction.url, orderNumber });
    } catch (err) {
        console.error('[tap/initiate]', err);
        return NextResponse.json(
            { error: err instanceof Error ? err.message : 'Payment initiation failed' },
            { status: 500 }
        );
    }
}

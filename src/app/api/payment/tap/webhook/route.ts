import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getTapCharge } from '@/lib/tap';
import { sendOrderConfirmationEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const chargeId: string = body?.id;
        const orderNumber: string = body?.metadata?.order_number || body?.reference?.order;

        if (!chargeId || !orderNumber) {
            return NextResponse.json({ error: 'Invalid webhook payload' }, { status: 400 });
        }

        // Verify by re-fetching from Tap API — ignores body status entirely.
        // This means a forged/replayed webhook can never manipulate order state.
        const charge = await getTapCharge(chargeId);

        // Double-check the charge belongs to this order
        const chargeOrder = charge.metadata?.order_number || charge.reference?.order;
        if (chargeOrder !== orderNumber) {
            console.warn('[tap/webhook] order mismatch', { chargeOrder, orderNumber });
            return NextResponse.json({ error: 'Order mismatch' }, { status: 400 });
        }

        if (charge.status === 'CAPTURED') {
            await prisma.order.updateMany({
                where: { orderNumber, paymentMethod: 'TAP' },
                data: { status: 'PROCESSING', tapChargeId: charge.id },
            });

            const order = await prisma.order.findUnique({
                where: { orderNumber },
                include: { items: true, address: true },
            });

            if (order?.email) {
                void sendOrderConfirmationEmail({
                    orderNumber: order.orderNumber,
                    customerName: order.customerName,
                    email: order.email,
                    paymentMethod: order.paymentMethod,
                    currency: order.currency,
                    subtotal: Number(order.subtotal),
                    shippingFee: Number(order.shippingFee),
                    total: Number(order.total),
                    city: order.address?.city || '',
                    country: order.address?.country || order.country,
                    items: order.items.map(i => ({
                        name: i.nameSnapshotEn || i.nameSnapshotAr,
                        qty: i.qty,
                        unitPrice: Number(i.unitPrice),
                        variantLabel: i.variantLabel,
                    })),
                });
            }
        } else if (['FAILED', 'DECLINED', 'CANCELLED', 'ABANDONED'].includes(charge.status)) {
            await prisma.order.updateMany({
                where: { orderNumber, paymentMethod: 'TAP', status: 'NEW' },
                data: { status: 'CANCELLED' },
            });
        }

        return NextResponse.json({ received: true });
    } catch (err) {
        console.error('[tap/webhook]', err);
        return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
    }
}

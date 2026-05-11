import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getTapCharge } from '@/lib/tap';
import { sendOrderConfirmationEmail } from '@/lib/email';

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;
    const tapId = searchParams.get('tap_id');
    const orderNumber = searchParams.get('order');
    const locale = searchParams.get('locale') || 'ar';

    if (!tapId || !orderNumber) {
        const dest = orderNumber
            ? `/${locale}/checkout/confirmation?order=${orderNumber}&status=failed`
            : `/${locale}`;
        return NextResponse.redirect(new URL(dest, req.url));
    }

    try {
        const charge = await getTapCharge(tapId);


        if (charge.status === 'CAPTURED') {
            await prisma.order.updateMany({
                where: { orderNumber, paymentMethod: 'TAP' },
                data: { status: 'PROCESSING', tapChargeId: charge.id },
            });

            // Send customer email receipt (fire-and-forget)
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
                }, locale as 'ar' | 'en');
            }

            return NextResponse.redirect(
                new URL(`/${locale}/checkout/confirmation?order=${orderNumber}`, req.url)
            );
        }

        // Payment failed / declined / abandoned / cancelled
        await prisma.order.updateMany({
            where: { orderNumber, paymentMethod: 'TAP' },
            data: { status: 'CANCELLED' },
        });

        return NextResponse.redirect(
            new URL(`/${locale}/checkout/confirmation?order=${orderNumber}&status=failed`, req.url)
        );
    } catch (err) {
        console.error('[tap/callback]', err);
        return NextResponse.redirect(
            new URL(`/${locale}/checkout/confirmation?order=${orderNumber}&status=failed`, req.url)
        );
    }
}

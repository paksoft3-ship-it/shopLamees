import { Resend } from 'resend';

interface OrderEmailData {
    orderNumber: string;
    customerName: string;
    email: string;
    paymentMethod: string;
    currency: string;
    subtotal: number;
    shippingFee: number;
    total: number;
    items: { name: string; qty: number; unitPrice: number; variantLabel?: string | null }[];
    city: string;
    country: string;
}

function buildEmailHtml(order: OrderEmailData, locale: 'ar' | 'en'): string {
    const isAr = locale === 'ar';
    const isPaid = order.paymentMethod === 'TAP';
    const curr = order.currency;

    const itemsHtml = order.items.map(item => `
        <tr>
            <td style="padding:10px 16px;border-bottom:1px solid #f0ede8;text-align:${isAr ? 'right' : 'left'}">
                <div style="font-weight:600;color:#1a1a1a">${item.name}</div>
                ${item.variantLabel ? `<div style="font-size:12px;color:#888;margin-top:2px">${item.variantLabel}</div>` : ''}
            </td>
            <td style="padding:10px 16px;border-bottom:1px solid #f0ede8;text-align:center;color:#555">×${item.qty}</td>
            <td style="padding:10px 16px;border-bottom:1px solid #f0ede8;text-align:${isAr ? 'left' : 'right'};font-weight:600;color:#1a1a1a">
                ${(item.unitPrice * item.qty).toFixed(0)} ${curr}
            </td>
        </tr>
    `).join('');

    return `<!DOCTYPE html>
<html dir="${isAr ? 'rtl' : 'ltr'}" lang="${isAr ? 'ar' : 'en'}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${isAr ? 'تأكيد طلبك' : 'Order Confirmation'} — Shop Lamees</title>
</head>
<body style="margin:0;padding:0;background:#f6f4f0;font-family:${isAr ? 'Tahoma,Arial' : 'Arial'},sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f6f4f0;padding:32px 16px">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.07)">

        <!-- Header -->
        <tr>
          <td style="background:#edab1d;padding:28px 32px;text-align:center">
            <div style="font-size:22px;font-weight:800;color:#1a1a1a;letter-spacing:1px">SHOP LAMEES</div>
            <div style="font-size:13px;color:#5a3e00;margin-top:4px">
              ${isAr ? 'شوب لاميس' : 'شوب لاميس'}
            </div>
          </td>
        </tr>

        <!-- Status banner -->
        <tr>
          <td style="padding:24px 32px;text-align:center;border-bottom:1px solid #f0ede8">
            <div style="display:inline-block;background:${isPaid ? '#f0fdf4' : '#fffbeb'};border:1.5px solid ${isPaid ? '#bbf7d0' : '#fde68a'};border-radius:50px;padding:8px 20px;margin-bottom:12px">
              <span style="font-size:13px;font-weight:700;color:${isPaid ? '#166534' : '#92400e'}">
                ${isPaid ? (isAr ? '✅ تم الدفع بنجاح' : '✅ Payment Confirmed') : (isAr ? '⏳ في انتظار التحويل البنكي' : '⏳ Awaiting Bank Transfer')}
              </span>
            </div>
            <h1 style="margin:0;font-size:20px;font-weight:800;color:#1a1a1a">
              ${isAr ? `مرحباً ${order.customerName}` : `Hello, ${order.customerName}`}
            </h1>
            <p style="margin:8px 0 0;color:#666;font-size:14px">
              ${isAr ? 'تم استلام طلبك بنجاح' : 'Your order has been received successfully'}
            </p>
          </td>
        </tr>

        <!-- Order number -->
        <tr>
          <td style="padding:20px 32px;background:#fdf9f3;border-bottom:1px solid #f0ede8">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font-size:13px;color:#888">${isAr ? 'رقم الطلب' : 'Order Number'}</td>
                <td style="text-align:${isAr ? 'left' : 'right'};font-weight:800;color:#edab1d;font-size:15px;direction:ltr">${order.orderNumber}</td>
              </tr>
              <tr>
                <td style="font-size:13px;color:#888;padding-top:8px">${isAr ? 'طريقة الدفع' : 'Payment'}</td>
                <td style="text-align:${isAr ? 'left' : 'right'};font-weight:600;color:#1a1a1a;font-size:13px;padding-top:8px">
                  ${isPaid ? (isAr ? 'بطاقة إلكترونية (Tap)' : 'Card Payment (Tap)') : (isAr ? 'تحويل بنكي' : 'Bank Transfer')}
                </td>
              </tr>
              <tr>
                <td style="font-size:13px;color:#888;padding-top:8px">${isAr ? 'التوصيل إلى' : 'Delivering to'}</td>
                <td style="text-align:${isAr ? 'left' : 'right'};font-weight:600;color:#1a1a1a;font-size:13px;padding-top:8px">${order.city}, ${order.country}</td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Items -->
        <tr>
          <td style="padding:20px 32px 0">
            <div style="font-weight:700;font-size:14px;color:#1a1a1a;margin-bottom:12px">${isAr ? 'المنتجات' : 'Items'}</div>
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f0ede8;border-radius:10px;overflow:hidden">
              ${itemsHtml}
            </table>
          </td>
        </tr>

        <!-- Totals -->
        <tr>
          <td style="padding:16px 32px 24px">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font-size:13px;color:#888;padding:4px 0">${isAr ? 'المجموع الفرعي' : 'Subtotal'}</td>
                <td style="text-align:${isAr ? 'left' : 'right'};font-size:13px;color:#555;padding:4px 0">${order.subtotal.toFixed(0)} ${curr}</td>
              </tr>
              <tr>
                <td style="font-size:13px;color:#888;padding:4px 0">${isAr ? 'الشحن' : 'Shipping'}</td>
                <td style="text-align:${isAr ? 'left' : 'right'};font-size:13px;color:#555;padding:4px 0">
                  ${order.shippingFee === 0 ? (isAr ? 'مجاني' : 'Free') : `${order.shippingFee.toFixed(0)} ${curr}`}
                </td>
              </tr>
              <tr>
                <td colspan="2" style="border-top:1px solid #f0ede8;padding-top:10px;margin-top:6px"></td>
              </tr>
              <tr>
                <td style="font-weight:800;font-size:15px;color:#1a1a1a;padding-top:4px">${isAr ? 'الإجمالي' : 'Total'}</td>
                <td style="text-align:${isAr ? 'left' : 'right'};font-weight:800;font-size:16px;color:#edab1d;padding-top:4px">${order.total.toFixed(0)} ${curr}</td>
              </tr>
            </table>
          </td>
        </tr>

        ${!isPaid ? `
        <!-- Bank transfer instructions -->
        <tr>
          <td style="padding:0 32px 24px">
            <div style="background:#fffbeb;border:1.5px solid #fde68a;border-radius:12px;padding:16px">
              <div style="font-weight:700;font-size:13px;color:#92400e;margin-bottom:8px">
                ${isAr ? '⚠️ تعليمات الدفع' : '⚠️ Payment Instructions'}
              </div>
              <div style="font-size:12px;color:#92400e;line-height:1.7">
                ${isAr
                    ? 'يرجى تحويل المبلغ الكامل إلى الحساب البنكي وإرسال إيصال التحويل عبر واتساب على الرقم +974 3311 4232 مع ذكر رقم الطلب.'
                    : 'Please transfer the full amount to our bank account and send the receipt via WhatsApp to +974 3311 4232 with your order number.'
                }
              </div>
            </div>
          </td>
        </tr>
        ` : ''}

        <!-- Footer -->
        <tr>
          <td style="background:#f9f7f4;padding:20px 32px;text-align:center;border-top:1px solid #f0ede8">
            <p style="margin:0;font-size:12px;color:#aaa">
              ${isAr ? 'شكراً لثقتك بشوب لاميس' : 'Thank you for shopping with Lamees'} 💛
            </p>
            <p style="margin:6px 0 0;font-size:12px;color:#bbb">
              ${isAr ? 'للاستفسار تواصل معنا عبر واتساب' : 'For support, contact us on WhatsApp'}: +974 3311 4232
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function sendOrderConfirmationEmail(order: OrderEmailData, locale: 'ar' | 'en' = 'ar') {
    if (!process.env.RESEND_API_KEY || !order.email) return;

    const resend = new Resend(process.env.RESEND_API_KEY);
    const isAr = locale === 'ar';
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'orders@shop-lamees.com';
    const subject = isAr
        ? `تأكيد طلبك #${order.orderNumber} — شوب لاميس`
        : `Order Confirmation #${order.orderNumber} — Shop Lamees`;

    try {
        await resend.emails.send({
            from: `Shop Lamees <${fromEmail}>`,
            to: order.email,
            subject,
            html: buildEmailHtml(order, locale),
        });
    } catch (err) {
        // Don't fail the order if email fails
        console.error('[email] Failed to send confirmation:', err);
    }
}

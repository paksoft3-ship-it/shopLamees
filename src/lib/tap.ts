const TAP_BASE = 'https://api.tap.company/v2';

function getBaseUrl() {
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
}

function parsePhone(phone: string, country: string): { countryCode: string; number: string } {
    const ccMap: Record<string, string> = { QA: '974', SA: '966', AE: '971', KW: '965', BH: '973', OM: '968' };
    const cc = ccMap[country] || '974';
    const digits = phone.replace(/\D/g, '');
    let number = digits;
    if (digits.startsWith('00' + cc)) {
        number = digits.slice(2 + cc.length);
    } else if (digits.startsWith(cc)) {
        number = digits.slice(cc.length);
    }
    return { countryCode: cc, number: number || digits };
}

export interface TapChargeInput {
    amount: number;
    currency: string;
    orderNumber: string;
    description: string;
    locale: string;
    customer: {
        name: string;
        email?: string;
        phone: string;
        country: string;
    };
}

export interface TapCharge {
    id: string;
    status: 'INITIATED' | 'ABANDONED' | 'CANCELLED' | 'FAILED' | 'DECLINED' | 'RESTRICTED' | 'CAPTURED' | 'VOID' | 'TIMEDOUT' | string;
    transaction: { url: string };
    reference: { order: string };
    metadata: { order_number: string };
    amount: number;
    currency: string;
}

export async function createTapCharge(input: TapChargeInput): Promise<TapCharge> {
    const secret = process.env.TAP_SECRET_KEY;
    if (!secret) throw new Error('TAP_SECRET_KEY is not configured');

    const baseUrl = getBaseUrl();
    const { countryCode, number } = parsePhone(input.customer.phone, input.customer.country);
    const nameParts = input.customer.name.trim().split(/\s+/);
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || firstName;

    const body = {
        amount: input.amount,
        currency: input.currency.toUpperCase(),
        customer_initiated: true,
        threeDSecure: true,
        save_card: false,
        description: input.description,
        metadata: { order_number: input.orderNumber },
        reference: { transaction: input.orderNumber, order: input.orderNumber },
        receipt: { email: !!input.customer.email, sms: true },
        customer: {
            first_name: firstName,
            last_name: lastName,
            ...(input.customer.email ? { email: input.customer.email } : {}),
            phone: { country_code: countryCode, number },
        },
        source: { id: 'src_all' },
        post: { url: `${baseUrl}/api/payment/tap/webhook` },
        redirect: {
            url: `${baseUrl}/api/payment/tap/callback?order=${input.orderNumber}&locale=${input.locale}`,
        },
    };

    const res = await fetch(`${TAP_BASE}/charges`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${secret}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(`Tap API error ${res.status}: ${JSON.stringify(err)}`);
    }

    return res.json();
}

export async function getTapCharge(chargeId: string): Promise<TapCharge> {
    const secret = process.env.TAP_SECRET_KEY;
    if (!secret) throw new Error('TAP_SECRET_KEY is not configured');

    const res = await fetch(`${TAP_BASE}/charges/${chargeId}`, {
        headers: { Authorization: `Bearer ${secret}` },
        cache: 'no-store',
    });

    if (!res.ok) throw new Error(`Failed to fetch Tap charge ${chargeId}`);
    return res.json();
}

import { NextRequest, NextResponse } from 'next/server';

type WebVitalPayload = {
    id: string;
    name: string;
    value: number;
    rating: 'good' | 'needs-improvement' | 'poor';
    delta: number;
    navigationType?: string;
    path?: string;
};

export async function POST(request: NextRequest) {
    try {
        const data = (await request.json()) as WebVitalPayload;

        // Replace console with your analytics sink (Datadog, GA4, PostHog, etc.)
        if (process.env.NODE_ENV === 'production') {
            console.info('[web-vitals]', data.name, data.rating, data.value, data.path ?? '/');
        }
    } catch {
        return NextResponse.json({ ok: false }, { status: 400 });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
}

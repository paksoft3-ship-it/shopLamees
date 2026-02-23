/* eslint-disable @typescript-eslint/no-explicit-any */
type EventPayload = {
    event: string;
    [key: string]: any;
};

export const trackEvent = (eventName: string, payload?: Record<string, any>) => {
    const data: EventPayload = {
        event: eventName,
        ...payload,
    };

    if (typeof window !== 'undefined') {
        const win = window as any;
        win.dataLayer = win.dataLayer || [];
        win.dataLayer.push(data);

        // Optional pixels if enabled via window mapping here
        if (process.env.NEXT_PUBLIC_ENABLE_META_PIXEL === 'true') {
            // fbq('track', eventName, payload);
        }
    }
};

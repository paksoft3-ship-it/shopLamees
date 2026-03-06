'use client';

import { useReportWebVitals } from 'next/web-vitals';

export function WebVitalsReporter() {
    useReportWebVitals((metric) => {
        if (process.env.NODE_ENV !== 'production') return;

        const payload = JSON.stringify({
            id: metric.id,
            name: metric.name,
            value: metric.value,
            rating: metric.rating,
            delta: metric.delta,
            navigationType: metric.navigationType,
            path: window.location.pathname,
        });

        navigator.sendBeacon('/api/vitals', payload);
    });

    return null;
}

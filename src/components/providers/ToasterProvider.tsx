'use client';

import { Toaster } from 'react-hot-toast';

export function ToasterProvider() {
    return (
        <Toaster
            position="top-center"
            toastOptions={{
                className: 'font-body rounded-xl shadow-lg border border-border text-sm py-3 px-5',
                duration: 3000,
            }}
        />
    );
}

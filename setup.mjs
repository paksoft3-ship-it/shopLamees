import fs from 'fs';
import path from 'path';

const siteRoutes = [
    'category/[slug]', 'latest', 'search', 'product/[slug]', 'cart', 'checkout',
    'account/login', 'account', 'account/orders', 'account/orders/[id]',
    'pages/[slug]', 'lp/[slug]'
];

const adminRoutes = [
    'admin/login', 'admin', 'admin/orders', 'admin/orders/[id]',
    'admin/products', 'admin/products/new', 'admin/products/[id]/edit',
    'admin/categories', 'admin/customers', 'admin/customers/[id]',
    'admin/coupons', 'admin/pages', 'admin/pages/[id]/edit',
    'admin/media', 'admin/shipping', 'admin/payments', 'admin/reports',
    'admin/marketing', 'admin/users', 'admin/audit'
];

// Clean up old [locale]
if (fs.existsSync('src/app/[locale]')) {
    fs.rmSync('src/app/[locale]', { recursive: true, force: true });
}

// Scaffold Site Routes
siteRoutes.forEach(route => {
    const dir = `src/app/(site)/[locale]/${route}`;
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(`${dir}/page.tsx`, `export default function Page() { return <div className="p-8 text-center text-xl font-heading flex flex-col items-center justify-center flex-1 h-full min-h-[50vh]">Coming soon: ${route}</div>; }`);
});

// Scaffold Admin Routes
adminRoutes.forEach(route => {
    const dir = `src/app/(admin)/${route}`;
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(`${dir}/page.tsx`, `export default function Page() { return <div className="p-8 text-xl font-heading flex flex-col items-center justify-center flex-1 h-full min-h-[50vh]">Admin Placeholder: ${route}</div>; }`);
});

const mocks = ['products', 'categories', 'pages', 'settings', 'users'];
fs.mkdirSync('src/mock', { recursive: true });
mocks.forEach(m => {
    fs.writeFileSync(`src/mock/${m}.ts`, `export const ${m} = [];`);
});

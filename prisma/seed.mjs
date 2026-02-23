// prisma/seed.mjs — Native ESM seed for Prisma
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { config } from 'dotenv';

// Load env vars
config({ path: '.env.local' });
config({ path: '.env' });

// Force library engine for Node execution
process.env.PRISMA_CLIENT_ENGINE_TYPE = 'library';

const prisma = new PrismaClient({
    log: ['info', 'warn', 'error'],
});

async function main() {
    console.log('🌱 Seeding database...');

    // ── 1. Store Settings ────────────────────────────────────
    await prisma.storeSettings.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1,
            storeName: 'Lamees',
            whatsappNumber: '+966501234567',
            shippingQarQA: 0,
            shippingSarSA: 0,
            freeShipAbove: 500,
            defaultCurrency: 'SAR',
            vatPercent: 15,
        },
    });
    console.log('  ✅ Store settings (id=1)');

    // ── 2. Admin User ────────────────────────────────────────
    const adminEmail = process.env.ADMIN_SEED_EMAIL || 'admin@lamees.qa';
    const adminPassword = process.env.ADMIN_SEED_PASSWORD || 'Lamees2024!';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const admin = await prisma.adminUser.upsert({
        where: { email: adminEmail },
        update: {
            passwordHash: hashedPassword,
        },
        create: {
            name: 'مدير المتجر',
            email: adminEmail,
            passwordHash: hashedPassword,
            role: 'OWNER',
            isActive: true,
        },
    });
    console.log(`  ✅ Admin user: ${admin.email} (OWNER)`);

    // ── 3. Categories ────────────────────────────────────────
    const categories = [
        { slug: 'abayas', nameAr: 'عبايات', nameEn: 'Abayas', sortOrder: 1 },
        { slug: 'niqab', nameAr: 'نقاب', nameEn: 'Niqab', sortOrder: 2 },
    ];

    for (const cat of categories) {
        await prisma.category.upsert({
            where: { slug: cat.slug },
            update: {},
            create: cat,
        });
    }
    console.log(`  ✅ ${categories.length} categories`);

    // ── 4. Products + Variants ──────────────────────────────
    const product = await prisma.product.upsert({
        where: { slug: 'classic-black-abaya' },
        update: {},
        create: {
            slug: 'classic-black-abaya',
            titleAr: 'عباية سوداء كلاسيك',
            titleEn: 'Classic Black Abaya',
            descAr: 'تصميم كلاسيكي أنيق',
            descEn: 'Elegant classic design',
            fabric: 'crepe',
            color: 'black',
            isPublished: true,
            variants: {
                create: [
                    { size: '52', sku: 'CBA-52', stock: 10, priceSar: 450, priceQar: 465 },
                    { size: '54', sku: 'CBA-54', stock: 10, priceSar: 450, priceQar: 465 },
                ]
            }
        },
    });
    console.log(`  ✅ Sample product: ${product.slug}`);

    console.log('🎉 Seed complete!');
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

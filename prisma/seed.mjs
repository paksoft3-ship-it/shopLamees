// prisma/seed.mjs — Native ESM seed for Prisma 6
import { config } from 'dotenv';
config({ path: '.env.local' });
config({ path: '.env' });

import { createHash } from 'crypto';

// Dynamic import for Prisma 6 generated ESM client
const clientModule = await import('../src/generated/prisma/client.js');
const PrismaClient = clientModule.PrismaClient || clientModule.default?.PrismaClient;

if (!PrismaClient) {
    console.error('❌ Could not import PrismaClient. Available exports:', Object.keys(clientModule));
    process.exit(1);
}

const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
});

function hashPassword(password) {
    return createHash('sha256').update(password).digest('hex');
}

async function main() {
    console.log('🌱 Seeding database...');

    // ── 1. Permissions ───────────────────────────────────────
    const permKeys = [
        'products.read', 'products.write', 'products.delete',
        'orders.read', 'orders.write', 'orders.status',
        'users.read', 'users.write',
        'settings.read', 'settings.write',
        'media.upload',
    ];

    for (const key of permKeys) {
        await prisma.permission.upsert({
            where: { key },
            update: {},
            create: { key, description: key },
        });
    }
    console.log(`  ✅ ${permKeys.length} permissions`);

    // ── 2. Admin User ────────────────────────────────────────
    const adminEmail = process.env.ADMIN_SEED_EMAIL || process.env.ADMIN_EMAIL || 'admin@lamees.qa';
    const adminPassword = process.env.ADMIN_SEED_PASSWORD || process.env.ADMIN_PASSWORD || 'Lamees2024!';

    const admin = await prisma.adminUser.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            name: 'مدير المتجر',
            email: adminEmail,
            passwordHash: hashPassword(adminPassword),
            role: 'OWNER',
            isActive: true,
        },
    });

    // Grant all permissions to OWNER
    const allPerms = await prisma.permission.findMany();
    for (const perm of allPerms) {
        await prisma.rolePermission.upsert({
            where: {
                adminUserId_permissionId: {
                    adminUserId: admin.id,
                    permissionId: perm.id,
                },
            },
            update: {},
            create: {
                adminUserId: admin.id,
                permissionId: perm.id,
            },
        });
    }
    console.log(`  ✅ Admin user: ${admin.email} (OWNER, all permissions)`);

    // ── 3. Store Settings ────────────────────────────────────
    await prisma.storeSettings.upsert({
        where: { id: 1 },
        update: {},
        create: {
            storeName: 'Lamees',
            whatsappNumber: '+966501234567',
            shippingQarQA: 0,
            shippingSarSA: 0,
            freeShipAbove: 500,
            defaultCurrency: 'SAR',
            vatPercent: 15,
        },
    });
    console.log('  ✅ Store settings');

    // ── 4. Categories ────────────────────────────────────────
    const catData = [
        { slug: 'niqab', nameAr: 'نقاب', nameEn: 'Niqab', image: 'https://cdn.salla.sa/DGwjPD/2206b6b7-cda1-48ab-bfc5-3d8d2e8c0a71-378.26086956522x500-e4Xo1FC6x4d3lZaCcuH3XjUg2gBvhHbU2U7PNmh0.jpg', sortOrder: 1 },
        { slug: 'abayas', nameAr: 'عبايات', nameEn: 'Abayas', image: 'https://cdn.salla.sa/DGwjPD/fc75a3df-82b5-4e5b-85fe-35f80ea75e67-738.5428907168x1000-wytsxECY4TpiZ8jeB370gBy32lswuxn9IQeHTScr.jpg', sortOrder: 2 },
        { slug: 'velvet', nameAr: 'مخمل', nameEn: 'Velvet', image: 'https://cdn.salla.sa/DGwjPD/5038b39b-482b-4eeb-9213-51f4996de68f-834.95145631068x1000-J0zuVPtQ2UdnANsKSJHtIdBLo7seX7uzEi8I4NpP.jpg', sortOrder: 3 },
    ];

    const categories = {};
    for (const cat of catData) {
        const c = await prisma.category.upsert({ where: { slug: cat.slug }, update: {}, create: cat });
        categories[cat.slug] = c.id;
    }
    console.log(`  ✅ ${catData.length} categories`);

    // ── 5. Products + Images + Variants ──────────────────────
    const productData = [
        {
            slug: 'black-crepe-abaya', titleAr: 'عباية كريب سوداء', titleEn: 'Black Crepe Abaya',
            descAr: 'كريب ياباني فاخر', descEn: 'Luxury Japanese Crepe',
            badgeAr: 'جديد', badgeEn: 'New', fabric: 'crepe', color: 'black',
            rating: 4.5, isBestSeller: true, price: 450, cats: ['abayas'],
            images: [
                'https://cdn.salla.sa/DGwjPD/fc75a3df-82b5-4e5b-85fe-35f80ea75e67-738.5428907168x1000-wytsxECY4TpiZ8jeB370gBy32lswuxn9IQeHTScr.jpg',
                'https://cdn.salla.sa/DGwjPD/7663593e-68b8-4d17-b5bc-4d61bfab3f85-832.79836591771x1000-0Y13RBibw21qkCiIf7MwSA6sNFZ0I58NpWjVPxVp.jpg',
            ],
            sizes: ['S', 'M', 'L', 'XL'],
        },
        {
            slug: 'royal-niqab', titleAr: 'نقاب ملكي فاخر', titleEn: 'Luxury Royal Niqab',
            descAr: 'قماش كوري أصلي', descEn: 'Original Korean Fabric',
            fabric: 'silk', color: 'black', rating: 5.0, price: 120, cats: ['niqab'],
            images: [
                'https://cdn.salla.sa/DGwjPD/2206b6b7-cda1-48ab-bfc5-3d8d2e8c0a71-378.26086956522x500-e4Xo1FC6x4d3lZaCcuH3XjUg2gBvhHbU2U7PNmh0.jpg',
                'https://cdn.salla.sa/DGwjPD/cd2dbf1c-e62c-4223-9a4c-c7dfce6aaa9c-416.12903225806x500-WJtfCRYn85TDrb0p1ynN2ILVVkHnffdsXc9WoOLJ.jpg',
            ],
            sizes: ['OS'],
        },
        {
            slug: 'velvet-occasion-abaya', titleAr: 'عباية مخمل للمناسبات', titleEn: 'Velvet Occasion Abaya',
            descAr: 'تطريز يدوي خاص', descEn: 'Special Hand Embroidery',
            badgeAr: 'خصم 20%', badgeEn: '20% OFF', fabric: 'velvet', color: 'black',
            rating: 5.0, price: 680, cats: ['abayas', 'velvet'],
            images: [
                'https://cdn.salla.sa/DGwjPD/5038b39b-482b-4eeb-9213-51f4996de68f-834.95145631068x1000-J0zuVPtQ2UdnANsKSJHtIdBLo7seX7uzEi8I4NpP.jpg',
                'https://cdn.salla.sa/DGwjPD/1af79f9b-5259-412d-9508-a2e284afe45b-733.46560846561x1000-PXvV1S1cCSWxVeswIEuTDQG11FMLnlVo1dU7yOcd.jpg',
            ],
            sizes: ['M', 'L'],
        },
        {
            slug: 'mars-black-abaya', titleAr: 'عباية مارس أسود', titleEn: 'Mars Black Abaya',
            descAr: 'تصميم عصري أنيق', descEn: 'Modern Elegant Design',
            badgeAr: 'الأكثر مبيعاً', badgeEn: 'Best Seller', fabric: 'crepe', color: 'black',
            rating: 4.8, isBestSeller: true, price: 520, cats: ['abayas'],
            images: [
                'https://cdn.salla.sa/DGwjPD/dbc353f9-d830-4840-aa70-82b16efac223-379.85865724382x500-xL5rU56nae4GpvtKXEzqGdvPzh9MDTdRO0AdtrS0.jpg',
                'https://cdn.salla.sa/DGwjPD/9ff27cbd-adad-443c-b653-ba8393c9de36-687.63326226013x1000-OydGQFa82WAschWXyQLT2whVAt1ky0EeJ08mxy2H.jpg',
            ],
            sizes: ['S', 'M', 'L', 'XL'],
        },
        {
            slug: 'ward-embroidered-abaya', titleAr: 'عباية ورد مطرزة', titleEn: 'Ward Embroidered Abaya',
            descAr: 'تطريز ورد يدوي', descEn: 'Hand Embroidered Roses',
            badgeAr: 'خصم 15%', badgeEn: '15% OFF', fabric: 'velvet', color: 'black',
            rating: 4.9, price: 750, cats: ['abayas', 'velvet'],
            images: [
                'https://cdn.salla.sa/DGwjPD/d6a4c76d-c7b5-40b0-aec3-9313297847bd-392.57455873402x500-Wh3S3FUrL5viaU29xEMtO4vyXDk0x2wZEhHjoXgM.jpg',
                'https://cdn.salla.sa/DGwjPD/1914f5e6-a4c6-411e-9d7c-ad997a314c21-832.25806451613x1000-mz77TRapT2t2F6wgruMUOB7YcDp9gXyuO7Ygw8K6.jpg',
            ],
            sizes: ['M', 'L', 'XL'],
        },
        {
            slug: 'luxury-silk-abaya', titleAr: 'عباية حرير فاخرة', titleEn: 'Luxury Silk Abaya',
            descAr: 'حرير طبيعي ١٠٠٪', descEn: '100% Natural Silk',
            badgeAr: 'حصري', badgeEn: 'Exclusive', fabric: 'silk', color: 'black',
            rating: 5.0, price: 950, cats: ['abayas'],
            images: [
                'https://cdn.salla.sa/DGwjPD/fc062275-0066-42e3-b03d-1fdea458ee15-749.12891986063x1000-E8gNt5aySSYGou67jxYFq02LwyOlCcc7MZQ5ctTS.jpg',
                'https://cdn.salla.sa/DGwjPD/eee80252-de89-44f2-a927-d56118cb8626-809.61663417804x1000-WiQNRV5aa1pXtPF5EU8vD5gZzCOwz4XxSghkdJgo.jpg',
            ],
            sizes: ['M', 'L'],
        },
    ];

    let productCount = 0;
    for (const p of productData) {
        const exists = await prisma.product.findUnique({ where: { slug: p.slug } });
        if (exists) { productCount++; continue; }

        await prisma.product.create({
            data: {
                slug: p.slug, titleAr: p.titleAr, titleEn: p.titleEn,
                descAr: p.descAr, descEn: p.descEn,
                badgeAr: p.badgeAr || null, badgeEn: p.badgeEn || null,
                fabric: p.fabric, color: p.color, rating: p.rating,
                isBestSeller: p.isBestSeller || false, isPublished: true,
                images: {
                    create: p.images.map((url, i) => ({ url, altAr: p.titleAr, altEn: p.titleEn, sortOrder: i })),
                },
                variants: {
                    create: p.sizes.map((size) => ({
                        size,
                        sku: `${p.slug}-${size}`.toUpperCase(),
                        stock: Math.floor(Math.random() * 50) + 10,
                        priceQar: Math.round(p.price * 1.03),
                        priceSar: p.price,
                    })),
                },
                categories: {
                    create: p.cats.filter((s) => categories[s]).map((s) => ({ categoryId: categories[s] })),
                },
            },
        });
        productCount++;
    }
    console.log(`  ✅ ${productCount} products + images + variants`);
    console.log('🎉 Seed complete!');
}

main()
    .catch((e) => { console.error('❌ Seed failed:', e); process.exit(1); })
    .finally(() => prisma.$disconnect());

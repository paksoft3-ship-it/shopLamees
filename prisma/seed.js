"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = require("dotenv");
// Load .env.local first (Neon URL), then .env
(0, dotenv_1.config)({ path: '.env.local' });
(0, dotenv_1.config)({ path: '.env' });
var client_1 = require("@prisma/client");
var crypto_1 = require("crypto");
var prisma = new client_1.PrismaClient({});
// Simple password hash using Node crypto (no bcrypt dependency needed for seed)
function hashPassword(password) {
    return (0, crypto_1.createHash)('sha256').update(password).digest('hex');
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var permKeys, _i, permKeys_1, key, adminEmail, adminPassword, admin, allPerms, _a, allPerms_1, perm, catData, categories, _b, catData_1, cat, c, productData, productCount, _loop_1, _c, productData_1, p;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    console.log('🌱 Seeding database...');
                    permKeys = [
                        'products.read', 'products.write', 'products.delete',
                        'orders.read', 'orders.write', 'orders.status',
                        'users.read', 'users.write',
                        'settings.read', 'settings.write',
                        'media.upload',
                    ];
                    _i = 0, permKeys_1 = permKeys;
                    _d.label = 1;
                case 1:
                    if (!(_i < permKeys_1.length)) return [3 /*break*/, 4];
                    key = permKeys_1[_i];
                    return [4 /*yield*/, prisma.permission.upsert({
                            where: { key: key },
                            update: {},
                            create: { key: key, description: key },
                        })];
                case 2:
                    _d.sent();
                    _d.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    console.log("  \u2705 ".concat(permKeys.length, " permissions"));
                    adminEmail = process.env.ADMIN_SEED_EMAIL || process.env.ADMIN_EMAIL || 'admin@lamees.qa';
                    adminPassword = process.env.ADMIN_SEED_PASSWORD || process.env.ADMIN_PASSWORD || 'Lamees2024!';
                    return [4 /*yield*/, prisma.adminUser.upsert({
                            where: { email: adminEmail },
                            update: {},
                            create: {
                                name: 'مدير المتجر',
                                email: adminEmail,
                                passwordHash: hashPassword(adminPassword),
                                role: 'OWNER',
                                isActive: true,
                            },
                        })];
                case 5:
                    admin = _d.sent();
                    return [4 /*yield*/, prisma.permission.findMany()];
                case 6:
                    allPerms = _d.sent();
                    _a = 0, allPerms_1 = allPerms;
                    _d.label = 7;
                case 7:
                    if (!(_a < allPerms_1.length)) return [3 /*break*/, 10];
                    perm = allPerms_1[_a];
                    return [4 /*yield*/, prisma.rolePermission.upsert({
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
                        })];
                case 8:
                    _d.sent();
                    _d.label = 9;
                case 9:
                    _a++;
                    return [3 /*break*/, 7];
                case 10:
                    console.log("  \u2705 Admin user: ".concat(admin.email, " (OWNER, all permissions)"));
                    // ── 3. Store Settings ────────────────────────────────────
                    return [4 /*yield*/, prisma.storeSettings.upsert({
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
                        })];
                case 11:
                    // ── 3. Store Settings ────────────────────────────────────
                    _d.sent();
                    console.log('  ✅ Store settings');
                    catData = [
                        {
                            slug: 'niqab',
                            nameAr: 'نقاب',
                            nameEn: 'Niqab',
                            image: 'https://cdn.salla.sa/DGwjPD/2206b6b7-cda1-48ab-bfc5-3d8d2e8c0a71-378.26086956522x500-e4Xo1FC6x4d3lZaCcuH3XjUg2gBvhHbU2U7PNmh0.jpg',
                            sortOrder: 1,
                        },
                        {
                            slug: 'abayas',
                            nameAr: 'عبايات',
                            nameEn: 'Abayas',
                            image: 'https://cdn.salla.sa/DGwjPD/fc75a3df-82b5-4e5b-85fe-35f80ea75e67-738.5428907168x1000-wytsxECY4TpiZ8jeB370gBy32lswuxn9IQeHTScr.jpg',
                            sortOrder: 2,
                        },
                        {
                            slug: 'velvet',
                            nameAr: 'مخمل',
                            nameEn: 'Velvet',
                            image: 'https://cdn.salla.sa/DGwjPD/5038b39b-482b-4eeb-9213-51f4996de68f-834.95145631068x1000-J0zuVPtQ2UdnANsKSJHtIdBLo7seX7uzEi8I4NpP.jpg',
                            sortOrder: 3,
                        },
                    ];
                    categories = {};
                    _b = 0, catData_1 = catData;
                    _d.label = 12;
                case 12:
                    if (!(_b < catData_1.length)) return [3 /*break*/, 15];
                    cat = catData_1[_b];
                    return [4 /*yield*/, prisma.category.upsert({
                            where: { slug: cat.slug },
                            update: {},
                            create: cat,
                        })];
                case 13:
                    c = _d.sent();
                    categories[cat.slug] = c.id;
                    _d.label = 14;
                case 14:
                    _b++;
                    return [3 /*break*/, 12];
                case 15:
                    console.log("  \u2705 ".concat(catData.length, " categories"));
                    productData = [
                        {
                            slug: 'black-crepe-abaya',
                            titleAr: 'عباية كريب سوداء',
                            titleEn: 'Black Crepe Abaya',
                            descAr: 'كريب ياباني فاخر',
                            descEn: 'Luxury Japanese Crepe',
                            badgeAr: 'جديد',
                            badgeEn: 'New',
                            fabric: 'crepe',
                            color: 'black',
                            rating: 4.5,
                            isBestSeller: true,
                            price: 450,
                            categories: ['abayas'],
                            images: [
                                'https://cdn.salla.sa/DGwjPD/fc75a3df-82b5-4e5b-85fe-35f80ea75e67-738.5428907168x1000-wytsxECY4TpiZ8jeB370gBy32lswuxn9IQeHTScr.jpg',
                                'https://cdn.salla.sa/DGwjPD/7663593e-68b8-4d17-b5bc-4d61bfab3f85-832.79836591771x1000-0Y13RBibw21qkCiIf7MwSA6sNFZ0I58NpWjVPxVp.jpg',
                            ],
                            sizes: ['S', 'M', 'L', 'XL'],
                        },
                        {
                            slug: 'royal-niqab',
                            titleAr: 'نقاب ملكي فاخر',
                            titleEn: 'Luxury Royal Niqab',
                            descAr: 'قماش كوري أصلي',
                            descEn: 'Original Korean Fabric',
                            fabric: 'silk',
                            color: 'black',
                            rating: 5.0,
                            price: 120,
                            categories: ['niqab'],
                            images: [
                                'https://cdn.salla.sa/DGwjPD/2206b6b7-cda1-48ab-bfc5-3d8d2e8c0a71-378.26086956522x500-e4Xo1FC6x4d3lZaCcuH3XjUg2gBvhHbU2U7PNmh0.jpg',
                                'https://cdn.salla.sa/DGwjPD/cd2dbf1c-e62c-4223-9a4c-c7dfce6aaa9c-416.12903225806x500-WJtfCRYn85TDrb0p1ynN2ILVVkHnffdsXc9WoOLJ.jpg',
                            ],
                            sizes: ['OS'],
                        },
                        {
                            slug: 'velvet-occasion-abaya',
                            titleAr: 'عباية مخمل للمناسبات',
                            titleEn: 'Velvet Occasion Abaya',
                            descAr: 'تطريز يدوي خاص',
                            descEn: 'Special Hand Embroidery',
                            badgeAr: 'خصم 20%',
                            badgeEn: '20% OFF',
                            fabric: 'velvet',
                            color: 'black',
                            rating: 5.0,
                            price: 680,
                            categories: ['abayas', 'velvet'],
                            images: [
                                'https://cdn.salla.sa/DGwjPD/5038b39b-482b-4eeb-9213-51f4996de68f-834.95145631068x1000-J0zuVPtQ2UdnANsKSJHtIdBLo7seX7uzEi8I4NpP.jpg',
                                'https://cdn.salla.sa/DGwjPD/1af79f9b-5259-412d-9508-a2e284afe45b-733.46560846561x1000-PXvV1S1cCSWxVeswIEuTDQG11FMLnlVo1dU7yOcd.jpg',
                            ],
                            sizes: ['M', 'L'],
                        },
                        {
                            slug: 'mars-black-abaya',
                            titleAr: 'عباية مارس أسود',
                            titleEn: 'Mars Black Abaya',
                            descAr: 'تصميم عصري أنيق',
                            descEn: 'Modern Elegant Design',
                            badgeAr: 'الأكثر مبيعاً',
                            badgeEn: 'Best Seller',
                            fabric: 'crepe',
                            color: 'black',
                            rating: 4.8,
                            isBestSeller: true,
                            price: 520,
                            categories: ['abayas'],
                            images: [
                                'https://cdn.salla.sa/DGwjPD/dbc353f9-d830-4840-aa70-82b16efac223-379.85865724382x500-xL5rU56nae4GpvtKXEzqGdvPzh9MDTdRO0AdtrS0.jpg',
                                'https://cdn.salla.sa/DGwjPD/9ff27cbd-adad-443c-b653-ba8393c9de36-687.63326226013x1000-OydGQFa82WAschWXyQLT2whVAt1ky0EeJ08mxy2H.jpg',
                            ],
                            sizes: ['S', 'M', 'L', 'XL'],
                        },
                        {
                            slug: 'ward-embroidered-abaya',
                            titleAr: 'عباية ورد مطرزة',
                            titleEn: 'Ward Embroidered Abaya',
                            descAr: 'تطريز ورد يدوي',
                            descEn: 'Hand Embroidered Roses',
                            badgeAr: 'خصم 15%',
                            badgeEn: '15% OFF',
                            fabric: 'velvet',
                            color: 'black',
                            rating: 4.9,
                            price: 750,
                            categories: ['abayas', 'velvet'],
                            images: [
                                'https://cdn.salla.sa/DGwjPD/d6a4c76d-c7b5-40b0-aec3-9313297847bd-392.57455873402x500-Wh3S3FUrL5viaU29xEMtO4vyXDk0x2wZEhHjoXgM.jpg',
                                'https://cdn.salla.sa/DGwjPD/1914f5e6-a4c6-411e-9d7c-ad997a314c21-832.25806451613x1000-mz77TRapT2t2F6wgruMUOB7YcDp9gXyuO7Ygw8K6.jpg',
                            ],
                            sizes: ['M', 'L', 'XL'],
                        },
                        {
                            slug: 'luxury-silk-abaya',
                            titleAr: 'عباية حرير فاخرة',
                            titleEn: 'Luxury Silk Abaya',
                            descAr: 'حرير طبيعي ١٠٠٪',
                            descEn: '100% Natural Silk',
                            badgeAr: 'حصري',
                            badgeEn: 'Exclusive',
                            fabric: 'silk',
                            color: 'black',
                            rating: 5.0,
                            price: 950,
                            categories: ['abayas'],
                            images: [
                                'https://cdn.salla.sa/DGwjPD/fc062275-0066-42e3-b03d-1fdea458ee15-749.12891986063x1000-E8gNt5aySSYGou67jxYFq02LwyOlCcc7MZQ5ctTS.jpg',
                                'https://cdn.salla.sa/DGwjPD/eee80252-de89-44f2-a927-d56118cb8626-809.61663417804x1000-WiQNRV5aa1pXtPF5EU8vD5gZzCOwz4XxSghkdJgo.jpg',
                            ],
                            sizes: ['M', 'L'],
                        },
                    ];
                    productCount = 0;
                    _loop_1 = function (p) {
                        var exists;
                        return __generator(this, function (_e) {
                            switch (_e.label) {
                                case 0: return [4 /*yield*/, prisma.product.findUnique({ where: { slug: p.slug } })];
                                case 1:
                                    exists = _e.sent();
                                    if (exists) {
                                        productCount++;
                                        return [2 /*return*/, "continue"];
                                    }
                                    return [4 /*yield*/, prisma.product.create({
                                            data: {
                                                slug: p.slug,
                                                titleAr: p.titleAr,
                                                titleEn: p.titleEn,
                                                descAr: p.descAr,
                                                descEn: p.descEn,
                                                badgeAr: p.badgeAr || null,
                                                badgeEn: p.badgeEn || null,
                                                fabric: p.fabric,
                                                color: p.color,
                                                rating: p.rating,
                                                isBestSeller: p.isBestSeller || false,
                                                isPublished: true,
                                                images: {
                                                    create: p.images.map(function (url, i) { return ({
                                                        url: url,
                                                        altAr: p.titleAr,
                                                        altEn: p.titleEn,
                                                        sortOrder: i,
                                                    }); }),
                                                },
                                                variants: {
                                                    create: p.sizes.map(function (size) { return ({
                                                        size: size,
                                                        sku: "".concat(p.slug, "-").concat(size).toUpperCase(),
                                                        stock: Math.floor(Math.random() * 50) + 10,
                                                        priceQar: Math.round(p.price * 1.03),
                                                        priceSar: p.price,
                                                    }); }),
                                                },
                                                categories: {
                                                    create: p.categories
                                                        .filter(function (slug) { return categories[slug]; })
                                                        .map(function (slug) { return ({
                                                        categoryId: categories[slug],
                                                    }); }),
                                                },
                                            },
                                        })];
                                case 2:
                                    _e.sent();
                                    productCount++;
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _c = 0, productData_1 = productData;
                    _d.label = 16;
                case 16:
                    if (!(_c < productData_1.length)) return [3 /*break*/, 19];
                    p = productData_1[_c];
                    return [5 /*yield**/, _loop_1(p)];
                case 17:
                    _d.sent();
                    _d.label = 18;
                case 18:
                    _c++;
                    return [3 /*break*/, 16];
                case 19:
                    console.log("  \u2705 ".concat(productCount, " products + images + variants"));
                    console.log('🎉 Seed complete!');
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error('❌ Seed failed:', e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });

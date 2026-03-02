import { config } from 'dotenv';
config({ path: '.env.local' });
config({ path: '.env' });

import { PrismaClient } from '@prisma/client';
import { createHash } from 'crypto';

const prisma = new PrismaClient({ datasourceUrl: process.env.DATABASE_URL });

function hashPassword(p: string) {
    return createHash('sha256').update(p).digest('hex');
}

// Arabic-Indic numerals → Number
function ar2n(s: string): number {
    return Number(s.replace(/[٠١٢٣٤٥٦٧٨٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d))));
}
function qar(sar: number) { return Math.round(sar * 1.03); }

const CDN = 'https://cdn.salla.sa/DGwjPD/';

// ─── Categories (from karazs.com navigation) ────────────────────────
const CATEGORIES = [
    {
        slug: 'all-abayas',
        nameAr: 'عبايات',
        nameEn: 'Abayas',
        image: `${CDN}f9057b49-ec06-40fe-ae59-4b0ae02c1c19-369.2714453584x500-wytsxECY4TpiZ8jeB370gBy32lswuxn9IQeHTScr.jpg`,
        sortOrder: 1,
    },
    {
        slug: 'kraz-abaya',
        nameAr: 'عباية كرز',
        nameEn: 'Kraz Abaya',
        image: `${CDN}ec99a87b-4b28-4082-8188-3230a57684ce-406.94006309148x500-gTVdE0Za8jl4ibuGLhTyEeloMG6QfXSXXV11sQY2.jpg`,
        sortOrder: 2,
    },
    {
        slug: 'dantel',
        nameAr: 'دانتيل',
        nameEn: 'Lace',
        image: `${CDN}a50cb699-82cb-401b-a755-b5d1de0e8c22-381.77940280317x500-gqZJcsKvQcHhrqEknzBolbiwp6uWQOvOx0HsMPwW.jpg`,
        sortOrder: 3,
    },
    {
        slug: 'eid-collection',
        nameAr: 'كولكشن العيد',
        nameEn: 'Eid Collection',
        image: `${CDN}1daf73a9-a212-4d0f-b053-e4d10927bdb1-367.82354849173x500-12O5eHt28G5YMZ1xjUg0Nwu73oxVlszq7D9liEVP.jpg`,
        sortOrder: 4,
    },
    {
        slug: 'winter',
        nameAr: 'تشكيلة الشتاء',
        nameEn: 'Winter Collection',
        image: `${CDN}8133fab2-d10f-49e5-aaa8-531a4ed19db4-500x500-YU29F4BTqmWRWz1YgLtkClmBMUCF1rgR8haFauRW.jpg`,
        sortOrder: 5,
    },
    {
        slug: 'niqab',
        nameAr: 'نقاب',
        nameEn: 'Niqab',
        image: `${CDN}d2a76b00-4964-4afd-92cb-7bfe9c084e0f-379.57446808511x500-Q9Ak4IvksjLAJk5aXmK7xkKw3qhfAzonzT1yVbPq.jpg`,
        sortOrder: 6,
    },
];

// ─── Products (all 33 unique items from the 5 CSV files) ─────────────
const PRODUCTS = [
    {
        slug: 'abaya-aleid',
        titleAr: 'عباية العيد',
        titleEn: 'Eid Abaya',
        descAr: 'عباية فاخرة مصممة خصيصًا لمناسبة العيد بقماش راقٍ وتفاصيل أنيقة.',
        descEn: 'A luxurious abaya designed especially for Eid with premium fabric and elegant details.',
        badgeAr: 'عرض محدود', badgeEn: 'Limited Offer',
        fabric: 'crepe', color: 'black', rating: 5, isBestSeller: false,
        saleSar: ar2n('١٧٩'), origSar: ar2n('٣٨٩'),
        sizes: ['S', 'M', 'L', 'XL'],
        categories: ['all-abayas', 'eid-collection'],
        images: [`${CDN}a43d8450-672f-4d35-add3-5fd6a515a80c-370.47673750718x500-pmgpl4cmV6AxrNcrSurd2dzTJCrfT5XvRbnjL1hV.jpg`],
    },
    {
        slug: 'abaya-roz',
        titleAr: 'عباية روز',
        titleEn: 'Rose Abaya',
        descAr: 'عباية من كولكشن العيد بتصميم ورد أنيق ولمسات رقيقة.',
        descEn: 'Eid collection abaya with an elegant rose design and delicate touches.',
        badgeAr: 'كولكشن العيد', badgeEn: 'Eid Collection',
        fabric: 'crepe', color: 'black', rating: 4.5, isBestSeller: false,
        saleSar: ar2n('١٧٩'), origSar: ar2n('٣٩٩'),
        sizes: ['S', 'M', 'L', 'XL'],
        categories: ['all-abayas', 'eid-collection'],
        images: [`${CDN}76514640-fdf8-4d03-8afd-4b00cb05c6f1-382.46205733558x500-Ei5Iq4Z2tn9xpu4zKPAsDN3BfcYBuxxeH5eOlxjJ.jpg`],
    },
    {
        slug: 'abaya-february',
        titleAr: 'عباية فبراير',
        titleEn: 'February Abaya',
        descAr: 'إصدار فبراير من كولكشن العيد، تصميم راقٍ يجمع الأصالة والعصرية.',
        descEn: 'February Eid collection edition — a refined design blending heritage and modernity.',
        badgeAr: 'كولكشن العيد', badgeEn: 'Eid Collection',
        fabric: 'crepe', color: 'black', rating: 5, isBestSeller: false,
        saleSar: ar2n('١٨٩'), origSar: ar2n('٤٥٠'),
        sizes: ['S', 'M', 'L', 'XL'],
        categories: ['all-abayas', 'eid-collection'],
        images: [`${CDN}1daf73a9-a212-4d0f-b053-e4d10927bdb1-367.82354849173x500-12O5eHt28G5YMZ1xjUg0Nwu73oxVlszq7D9liEVP.jpg`],
    },
    {
        slug: 'abaya-mira',
        titleAr: 'عباية ميرا',
        titleEn: 'Mira Abaya',
        descAr: 'عباية ميرا الكلاسيكية بقصة أنيقة ومريحة.',
        descEn: 'Classic Mira abaya with an elegant and comfortable cut.',
        fabric: 'crepe', color: 'black', rating: 4.5, isBestSeller: false,
        saleSar: ar2n('١٥٩'), origSar: ar2n('٣٥٠'),
        sizes: ['S', 'M', 'L', 'XL'],
        categories: ['all-abayas'],
        images: [`${CDN}44275502-3ac1-4dd7-9881-168458ab6dd5-379.13741223671x500-l5XaClLEQmwxdLpF9PrKX3po1BDs87MTBOcJJjps.jpg`],
    },
    {
        slug: 'niqab-family-bundle',
        titleAr: 'بكج العائلة - 5 نقابات',
        titleEn: 'Family Bundle - 5 Niqabs',
        descAr: 'بكج اقتصادي يحتوي على 5 نقابات عالية الجودة للعائلة.',
        descEn: 'Value pack with 5 high-quality niqabs for the whole family.',
        fabric: 'crepe', color: 'black', rating: 4.5, isBestSeller: false,
        saleSar: ar2n('٥٩'), origSar: ar2n('٩٥'),
        sizes: ['OS'],
        categories: ['niqab'],
        images: [`${CDN}295a0256-9d01-4e36-a1d5-a491abd1a413-338.03986710963x500-Q0p44Jk55KPTN3kIhYO7amxXGuY8TPFrzSBA4QVn.jpg`],
    },
    {
        slug: 'abaya-kraz-dantel',
        titleAr: 'عباية كرز دانتيل',
        titleEn: 'Kraz Lace Abaya',
        descAr: 'عباية كرز مع تطريز دانتيل فاخر على الأكمام والطوق، من أكثر العبايات مبيعًا.',
        descEn: 'Kraz abaya with luxurious lace embroidery on sleeves and collar — our best seller.',
        badgeAr: 'الأكثر مبيعاً', badgeEn: 'Best Seller',
        fabric: 'crepe', color: 'black', rating: 5, isBestSeller: true,
        saleSar: ar2n('١٦٩'), origSar: ar2n('٢٩٩'),
        sizes: ['S', 'M', 'L', 'XL'],
        categories: ['all-abayas', 'kraz-abaya', 'dantel'],
        images: [`${CDN}ec99a87b-4b28-4082-8188-3230a57684ce-406.94006309148x500-gTVdE0Za8jl4ibuGLhTyEeloMG6QfXSXXV11sQY2.jpg`],
    },
    {
        slug: 'abaya-kraz-ward',
        titleAr: 'عباية كرز ورد',
        titleEn: 'Kraz Rose Abaya',
        descAr: 'عباية كرز بنقشة ورد رقيقة، إصدار كولكشن العيد.',
        descEn: 'Kraz abaya with a delicate rose pattern from the Eid collection.',
        badgeAr: 'كولكشن العيد', badgeEn: 'Eid Collection',
        fabric: 'crepe', color: 'black', rating: 4.5, isBestSeller: false,
        saleSar: ar2n('١٥٩'), origSar: ar2n('٢٩٠'),
        sizes: ['S', 'M', 'L', 'XL'],
        categories: ['all-abayas', 'kraz-abaya', 'eid-collection'],
        images: [`${CDN}362e1531-582c-4aff-81ad-e2f414d8eace-387.38738738739x500-1ZKmxvkaduArxse7WgU7c0afEbHCBqnJiwIzFPHt.jpg`],
    },
    {
        slug: 'abaya-aneqa-dantel',
        titleAr: 'عباية الأنيقة - دانتيل',
        titleEn: 'Al-Aneqa Lace Abaya',
        descAr: 'عباية الأنيقة بتفاصيل دانتيل فاخرة، من أكثر التصاميم مبيعًا.',
        descEn: 'Al-Aneqa abaya with exquisite lace detailing — a top-selling design.',
        badgeAr: 'الأكثر مبيعاً', badgeEn: 'Best Seller',
        fabric: 'crepe', color: 'black', rating: 5, isBestSeller: true,
        saleSar: ar2n('١٧٩'), origSar: ar2n('٣٢٠'),
        sizes: ['S', 'M', 'L', 'XL'],
        categories: ['all-abayas', 'dantel'],
        images: [`${CDN}a50cb699-82cb-401b-a755-b5d1de0e8c22-381.77940280317x500-gqZJcsKvQcHhrqEknzBolbiwp6uWQOvOx0HsMPwW.jpg`],
    },
    {
        slug: 'abaya-july-dantel',
        titleAr: 'عباية يوليو - دانتيل',
        titleEn: 'July Lace Abaya',
        descAr: 'عباية يوليو بتطريز دانتيل أنيق على الأكمام والطوق.',
        descEn: 'July abaya with elegant lace embroidery on sleeves and collar.',
        fabric: 'crepe', color: 'black', rating: 5, isBestSeller: false,
        saleSar: ar2n('١٧٩'), origSar: ar2n('٣٥٠'),
        sizes: ['S', 'M', 'L', 'XL'],
        categories: ['all-abayas', 'dantel'],
        images: [`${CDN}cd2dbf1c-e62c-4223-9a4c-c7dfce6aaa9c-416.12903225806x500-WJtfCRYn85TDrb0p1ynN2ILVVkHnffdsXc9WoOLJ.jpg`],
    },
    {
        slug: 'abaya-ward',
        titleAr: 'عباية ورد',
        titleEn: 'Ward Abaya',
        descAr: 'عباية ورد من كولكشن العيد بتصميم رومانسي راقٍ.',
        descEn: 'Ward Abaya from the Eid collection with a romantic, refined design.',
        badgeAr: 'كولكشن العيد', badgeEn: 'Eid Collection',
        fabric: 'crepe', color: 'black', rating: 5, isBestSeller: false,
        saleSar: ar2n('١٦٩'), origSar: ar2n('٣٧٠'),
        sizes: ['S', 'M', 'L', 'XL'],
        categories: ['all-abayas', 'eid-collection'],
        images: [`${CDN}b9e7de98-e044-4a0e-9d42-117e1af5d1e2-343.53226295062x500-Lg8AJCRWbv6BU5WEPpq8rRvtzDY082iDuJGVeKNe.jpg`],
    },
    {
        slug: 'abaya-mars-ward',
        titleAr: 'عباية مارس ورد',
        titleEn: 'Mars Rose Abaya',
        descAr: 'إصدار مارس من تصميم ورد الأنيق، ضمن كولكشن العيد.',
        descEn: 'March edition of the elegant rose design from the Eid collection.',
        badgeAr: 'كولكشن العيد', badgeEn: 'Eid Collection',
        fabric: 'crepe', color: 'black', rating: 4.5, isBestSeller: false,
        saleSar: ar2n('١٥٩'), origSar: ar2n('٢٩٠'),
        sizes: ['S', 'M', 'L', 'XL'],
        categories: ['all-abayas', 'eid-collection'],
        images: [`${CDN}92bbf780-0f21-42e9-86b6-aa65526a50d8-390.32655576094x500-s2PmHapIBPh4Dfl9v7R8NjIntiIxuCnHxRvsS5RT.jpg`],
    },
    {
        slug: 'niqab',
        titleAr: 'نقاب',
        titleEn: 'Niqab',
        descAr: 'نقاب فاخر من قماش ناعم عالي الجودة، مريح للارتداء اليومي.',
        descEn: 'Premium niqab from soft, high-quality fabric — comfortable for daily wear.',
        fabric: 'crepe', color: 'black', rating: 5, isBestSeller: false,
        saleSar: ar2n('١٩'), origSar: ar2n('٣٠'),
        sizes: ['OS'],
        categories: ['niqab'],
        images: [`${CDN}d2a76b00-4964-4afd-92cb-7bfe9c084e0f-379.57446808511x500-Q9Ak4IvksjLAJk5aXmK7xkKw3qhfAzonzT1yVbPq.jpg`],
    },
    {
        slug: 'abaya-kraz-black',
        titleAr: 'عباية كرز أسود',
        titleEn: 'Kraz Black Abaya',
        descAr: 'عباية كرز الكلاسيكية باللون الأسود، الأكثر مبيعًا في المتجر.',
        descEn: "Classic black Kraz abaya — the store's all-time best seller.",
        badgeAr: 'الأكثر مبيعاً', badgeEn: 'Best Seller',
        fabric: 'crepe', color: 'black', rating: 4.9, isBestSeller: true,
        saleSar: ar2n('١٥٩'), origSar: ar2n('٢٨٠'),
        sizes: ['S', 'M', 'L', 'XL'],
        categories: ['all-abayas', 'kraz-abaya'],
        images: [`${CDN}a1ba197c-5a0b-463f-b801-3463a3b1906e-410x500-HN5TuleeuqGuLerFC34JzItYDxQ8saaA7sUiIthY.jpg`],
    },
    {
        slug: 'abaya-kraz-brown',
        titleAr: 'عباية كرز بني',
        titleEn: 'Kraz Brown Abaya',
        descAr: 'عباية كرز باللون البني الراقي، خيار مميز لكل المناسبات.',
        descEn: 'Kraz abaya in elegant brown — a distinguished choice for all occasions.',
        badgeAr: 'الأكثر مبيعاً', badgeEn: 'Best Seller',
        fabric: 'crepe', color: 'brown', rating: 4.8, isBestSeller: true,
        saleSar: ar2n('١٥٩'), origSar: ar2n('٢٨٠'),
        sizes: ['S', 'M', 'L', 'XL'],
        categories: ['all-abayas', 'kraz-abaya'],
        images: [`${CDN}aa312f46-3dbb-463f-a6a4-24af98cb827d-417.47572815534x500-J0zuVPtQ2UdnANsKSJHtIdBLo7seX7uzEi8I4NpP.jpg`],
    },
    {
        slug: 'abaya-rahaf-jokh',
        titleAr: 'عباية رهف جوخ',
        titleEn: 'Rahaf Wool Abaya',
        descAr: 'عباية رهف من قماش الجوخ الشتوي الفاخر، دافئة وأنيقة.',
        descEn: 'Rahaf abaya in luxurious winter wool — warm and elegant.',
        badgeAr: 'جديد', badgeEn: 'New',
        fabric: 'wool', color: 'black', rating: 5, isBestSeller: false,
        saleSar: ar2n('١٥٩'), origSar: ar2n('٣٩٠'),
        sizes: ['S', 'M', 'L', 'XL'],
        categories: ['all-abayas', 'winter'],
        images: [`${CDN}8133fab2-d10f-49e5-aaa8-531a4ed19db4-500x500-YU29F4BTqmWRWz1YgLtkClmBMUCF1rgR8haFauRW.jpg`],
    },
    {
        slug: 'abaya-december',
        titleAr: 'عباية ديسمبر',
        titleEn: 'December Abaya',
        descAr: 'إصدار ديسمبر الحصري، تصميم شتوي أنيق من الأكثر مبيعًا.',
        descEn: 'Exclusive December edition — an elegant winter design and a bestseller.',
        badgeAr: 'الأكثر مبيعاً', badgeEn: 'Best Seller',
        fabric: 'crepe', color: 'black', rating: 5, isBestSeller: true,
        saleSar: ar2n('١٥٩'), origSar: ar2n('٣٣٠'),
        sizes: ['S', 'M', 'L', 'XL'],
        categories: ['all-abayas'],
        images: [`${CDN}50cea685-dfe8-42f1-9f40-3cd7f830afb4-389.85148514851x500-UI9yc17H9oPbJxvoCajAzF0TfAcAhzf2h16JoXbV.jpg`],
    },
    {
        slug: 'abaya-mars-jokh-sleeves',
        titleAr: 'عباية مارس أكمام جوخ',
        titleEn: 'Mars Wool Sleeves Abaya',
        descAr: 'عباية مارس بأكمام من الجوخ الشتوي الفاخر، عرض خاص لفترة محدودة.',
        descEn: 'Mars abaya with luxurious winter wool sleeves — special limited offer.',
        badgeAr: 'عرض محدود', badgeEn: 'Limited Offer',
        fabric: 'wool', color: 'black', rating: 4.5, isBestSeller: false,
        saleSar: ar2n('١٥٩'), origSar: ar2n('٢٩٠'),
        sizes: ['S', 'M', 'L', 'XL'],
        categories: ['all-abayas', 'winter'],
        images: [`${CDN}43b14af9-f7b3-427b-8df1-38247a39a2bb-365.85365853659x500-nU8MyCl7PkNWoWpUdSthd61wUZUTRNYhnVCaFHHc.jpg`],
    },
    {
        slug: 'kraz-black-jokh',
        titleAr: 'كرز أسود جوخ',
        titleEn: 'Kraz Black Wool',
        descAr: 'عباية كرز باللون الأسود من قماش الجوخ الشتوي، عرض ٢٤ ساعة فقط.',
        descEn: 'Kraz abaya in black wool fabric — 24-hour flash offer.',
        badgeAr: 'عرض ٢٤ ساعة', badgeEn: '24h Flash Deal',
        fabric: 'wool', color: 'black', rating: 5, isBestSeller: false,
        saleSar: ar2n('١٥٩'), origSar: ar2n('٣٠٠'),
        sizes: ['S', 'M', 'L', 'XL'],
        categories: ['all-abayas', 'kraz-abaya', 'winter'],
        images: [`${CDN}dbc353f9-d830-4840-aa70-82b16efac223-379.85865724382x500-xL5rU56nae4GpvtKXEzqGdvPzh9MDTdRO0AdtrS0.jpg`],
    },
    {
        slug: 'abaya-mars-black',
        titleAr: 'عباية مارس أسود',
        titleEn: 'Mars Black Abaya',
        descAr: 'عباية مارس الأسود الكلاسيكية، من الأكثر مبيعًا بتصميم عصري أنيق.',
        descEn: 'Classic Mars black abaya — a bestseller with a modern elegant design.',
        badgeAr: 'الأكثر مبيعاً', badgeEn: 'Best Seller',
        fabric: 'crepe', color: 'black', rating: 5, isBestSeller: true,
        saleSar: ar2n('١٥٩'), origSar: ar2n('٢٨٠'),
        sizes: ['S', 'M', 'L', 'XL'],
        categories: ['all-abayas'],
        images: [`${CDN}f9057b49-ec06-40fe-ae59-4b0ae02c1c19-369.2714453584x500-wytsxECY4TpiZ8jeB370gBy32lswuxn9IQeHTScr.jpg`],
    },
    {
        slug: 'abaya-k10',
        titleAr: 'عباية K10',
        titleEn: 'K10 Abaya',
        descAr: 'التصميم K10 الحصري بقصة فريدة وتفاصيل دقيقة.',
        descEn: 'Exclusive K10 design with a unique cut and fine details.',
        fabric: 'crepe', color: 'black', rating: 5, isBestSeller: false,
        saleSar: ar2n('١٦٩'), origSar: ar2n('٢٨٠'),
        sizes: ['S', 'M', 'L', 'XL'],
        categories: ['all-abayas'],
        images: [`${CDN}7d824307-6039-4edb-8458-97ff429b4a3d-396.19164619165x500-V91dvTtQxIdxkmwoMsgCc2WLzOcyhvBfYypwuNPg.jpg`],
    },
    {
        slug: 'abaya-shahd',
        titleAr: 'عباية شهد',
        titleEn: 'Shahd Abaya',
        descAr: 'عباية شهد الجديدة بتصميم معاصر وقماش فاخر.',
        descEn: 'New Shahd abaya with a contemporary design and luxurious fabric.',
        badgeAr: 'جديد', badgeEn: 'New',
        fabric: 'crepe', color: 'black', rating: 4.5, isBestSeller: false,
        saleSar: ar2n('١٧٩'), origSar: ar2n('٣٥٩'),
        sizes: ['S', 'M', 'L', 'XL'],
        categories: ['all-abayas'],
        images: [`${CDN}05d71b26-275e-4320-9947-b3fb3c73e74c-444.05286343612x500-PGXlWjkGmUx1LoEJFGDrzkoVF5KFmwydBKRLwRCX.jpg`],
    },
    {
        slug: 'abaya-kraz-navy',
        titleAr: 'عباية كرز كحلي',
        titleEn: 'Kraz Navy Abaya',
        descAr: 'عباية كرز باللون الكحلي الراقي، تناسب جميع المناسبات.',
        descEn: 'Kraz abaya in elegant navy — suitable for all occasions.',
        fabric: 'crepe', color: 'navy', rating: 5, isBestSeller: false,
        saleSar: ar2n('١٥٩'), origSar: ar2n('٢٨٠'),
        sizes: ['S', 'M', 'L', 'XL'],
        categories: ['all-abayas', 'kraz-abaya'],
        images: [`${CDN}d711204c-e629-4e0d-8d21-b970ec705dca-407.99739921977x500-AiCNtIydM93qkXuKYTgzIU5uOjS8Jjht6oC9NEp2.jpg`],
    },
    {
        slug: 'abaya-november',
        titleAr: 'عباية نوفمبر',
        titleEn: 'November Abaya',
        descAr: 'إصدار نوفمبر الشتوي، تصميم جديد بقماش دافئ وأنيق.',
        descEn: 'New November winter edition — warm and elegant fabric.',
        badgeAr: 'شتوي جديد', badgeEn: 'New Winter',
        fabric: 'crepe', color: 'black', rating: 4.5, isBestSeller: false,
        saleSar: ar2n('١٥٩'), origSar: ar2n('٣٢٠'),
        sizes: ['S', 'M', 'L', 'XL'],
        categories: ['all-abayas', 'winter'],
        images: [`${CDN}2206b6b7-cda1-48ab-bfc5-3d8d2e8c0a71-378.26086956522x500-e4Xo1FC6x4d3lZaCcuH3XjUg2gBvhHbU2U7PNmh0.jpg`],
    },
    {
        slug: 'abaya-kraz-beige',
        titleAr: 'عباية كرز بيج',
        titleEn: 'Kraz Beige Abaya',
        descAr: 'عباية كرز باللون البيج العصري، أناقة تناسب كل يوم.',
        descEn: 'Kraz abaya in modern beige — everyday elegance.',
        fabric: 'crepe', color: 'beige', rating: 5, isBestSeller: false,
        saleSar: ar2n('١٥٩'), origSar: ar2n('٢٨٠'),
        sizes: ['S', 'M', 'L', 'XL'],
        categories: ['all-abayas', 'kraz-abaya'],
        images: [`${CDN}576402a1-740a-4799-8df8-b5568af4c99f-375.87412587413x500-nmIJSN9UlZrALJ7OTpxWy937KktGtDpTLZQxDcag.jpg`],
    },
    {
        slug: 'abaya-ruf',
        titleAr: 'عباية روف',
        titleEn: 'Ruf Abaya',
        descAr: 'عباية روف بقصة مميزة وتفاصيل راقية.',
        descEn: 'Ruf abaya with a distinctive cut and refined details.',
        fabric: 'crepe', color: 'black', rating: 4.5, isBestSeller: false,
        saleSar: ar2n('١٦٩'), origSar: ar2n('٢٨٠'),
        sizes: ['S', 'M', 'L', 'XL'],
        categories: ['all-abayas'],
        images: [`${CDN}2cdb7738-c9d7-4065-9500-91dfaf326503-382.33550681683x500-eZY1b9ytLMawMByHzGOZQpSVlr4wuikImeYcL6o7.jpg`],
    },
    {
        slug: 'abaya-kraz-burgundy',
        titleAr: 'عباية كرز عنابي',
        titleEn: 'Kraz Burgundy Abaya',
        descAr: 'عباية كرز باللون العنابي الجذاب، تصميم راقٍ لكل المناسبات.',
        descEn: 'Kraz abaya in rich burgundy — an elegant design for all occasions.',
        fabric: 'crepe', color: 'burgundy', rating: 5, isBestSeller: false,
        saleSar: ar2n('١٥٩'), origSar: ar2n('٢٨٠'),
        sizes: ['S', 'M', 'L', 'XL'],
        categories: ['all-abayas', 'kraz-abaya'],
        images: [`${CDN}e0f87d0e-ad50-4128-b64e-17da459202ca-380.08249852681x500-UiJL4MTNv9lyndxFAvFVMrutI9FoGygTB8Jv53oE.jpg`],
    },
    {
        slug: 'aneqa-navy',
        titleAr: 'الأنيقة - كحلي',
        titleEn: 'Al-Aneqa Navy',
        descAr: 'عباية الأنيقة باللون الكحلي الراقي، تصميم عصري مميز.',
        descEn: 'Al-Aneqa abaya in elegant navy — a distinctive modern design.',
        fabric: 'crepe', color: 'navy', rating: 5, isBestSeller: false,
        saleSar: ar2n('١٥٩'), origSar: ar2n('٢٨٠'),
        sizes: ['S', 'M', 'L', 'XL'],
        categories: ['all-abayas'],
        images: [`${CDN}d6a4c76d-c7b5-40b0-aec3-9313297847bd-392.57455873402x500-Wh3S3FUrL5viaU29xEMtO4vyXDk0x2wZEhHjoXgM.jpg`],
    },
    {
        slug: 'aneqa-black',
        titleAr: 'الأنيقة - أسود',
        titleEn: 'Al-Aneqa Black',
        descAr: 'عباية الأنيقة باللون الأسود الكلاسيكي، أناقة لا تخطئها العين.',
        descEn: 'Al-Aneqa abaya in classic black — timeless elegance.',
        fabric: 'crepe', color: 'black', rating: 5, isBestSeller: false,
        saleSar: ar2n('١٥٩'), origSar: ar2n('٢٨٠'),
        sizes: ['S', 'M', 'L', 'XL'],
        categories: ['all-abayas'],
        images: [`${CDN}9d7036a8-248c-4b0c-b67a-8d4c69f2b4e7-372.40184757506x500-QAId8HLURT0yVhjDbOLwTmpc3i6CAQ9EPcRt00lR.jpg`],
    },
    {
        slug: 'aneqa-grey',
        titleAr: 'الأنيقة - رمادي',
        titleEn: 'Al-Aneqa Grey',
        descAr: 'عباية الأنيقة باللون الرمادي العصري، من الأكثر مبيعًا.',
        descEn: 'Al-Aneqa abaya in modern grey — a bestselling shade.',
        badgeAr: 'الأكثر مبيعاً', badgeEn: 'Best Seller',
        fabric: 'crepe', color: 'grey', rating: 5, isBestSeller: true,
        saleSar: ar2n('١٥٩'), origSar: ar2n('٢٨٠'),
        sizes: ['S', 'M', 'L', 'XL'],
        categories: ['all-abayas'],
        images: [`${CDN}6fe9b4e3-e0a6-4470-8d43-544c4c67bd28-379.85865724382x500-Z6usENffs3723gIoYSl9FvUald7WMqxVL0FjJgVD.jpg`],
    },
    {
        slug: 'abaya-kraz-dantel-velvet-winter',
        titleAr: 'عباية كرز دانتيل شتوية مخمل',
        titleEn: 'Kraz Lace Velvet Winter Abaya',
        descAr: 'عباية كرز شتوية بتطريز دانتيل فاخر وقماش مخمل دافئ، إصدار شتوي حصري.',
        descEn: 'Kraz winter abaya with luxurious lace embroidery and warm velvet fabric — exclusive winter edition.',
        badgeAr: 'شتوي جديد', badgeEn: 'New Winter',
        fabric: 'velvet', color: 'black', rating: 5, isBestSeller: false,
        saleSar: ar2n('١٧٩'), origSar: ar2n('٣٢٠'),
        sizes: ['S', 'M', 'L', 'XL'],
        categories: ['all-abayas', 'kraz-abaya', 'dantel', 'winter'],
        images: [`${CDN}b7f566e4-5829-4fc8-973b-af831195ccba-375x500-YGsUKDLvXYTg9HcSzOdwbylVWv97sfUVOIQL8l5b.jpg`],
    },
    {
        slug: 'abaya-velvet-sleeves',
        titleAr: 'عباية أكمام مخمل',
        titleEn: 'Velvet Sleeves Abaya',
        descAr: 'عباية شتوية بأكمام مخمل ناعمة، دفء وأناقة في آنٍ واحد.',
        descEn: 'Winter abaya with soft velvet sleeves — warmth and elegance combined.',
        badgeAr: 'شتوي', badgeEn: 'Winter',
        fabric: 'velvet', color: 'black', rating: 5, isBestSeller: false,
        saleSar: ar2n('١٦٥'), origSar: ar2n('٢٨٠'),
        sizes: ['S', 'M', 'L', 'XL'],
        categories: ['all-abayas', 'winter'],
        images: [`${CDN}7a850e39-e117-44b3-8cde-d41f47f097d9-394.9785670545x500-Cre4MlYmew5ssN1gMbliaPGsZoHn6dMRbbdJuFJ7.jpg`],
    },
    {
        slug: 'chamois-navy-k6',
        titleAr: 'شامواه كحلي K6',
        titleEn: 'Chamois Navy K6',
        descAr: 'عباية شامواه K6 باللون الكحلي من تشكيلة الشتاء، ناعمة ودافئة.',
        descEn: 'Chamois K6 in navy from the winter collection — soft and warm.',
        badgeAr: 'تشكيلة الشتاء', badgeEn: 'Winter Collection',
        fabric: 'chamois', color: 'navy', rating: 4.5, isBestSeller: false,
        saleSar: ar2n('١٥٩'), origSar: ar2n('٢٩٠'),
        sizes: ['S', 'M', 'L', 'XL'],
        categories: ['all-abayas', 'winter'],
        images: [`${CDN}74c4035e-0761-4c58-8632-e09cf04b0e1c-365.60693641619x500-2zoly4F9c4MRNyeOOy8IoPo4LkW8gGYRMrv0gbxy.jpg`],
    },
    {
        slug: 'abaya-mars-brown',
        titleAr: 'عباية مارس بني',
        titleEn: 'Mars Brown Abaya',
        descAr: 'عباية مارس باللون البني الراقي، تصميم أنيق مناسب لكل المناسبات.',
        descEn: 'Mars abaya in elegant brown — suitable for all occasions.',
        fabric: 'crepe', color: 'brown', rating: 5, isBestSeller: false,
        saleSar: ar2n('١٥٩'), origSar: ar2n('٢٨٠'),
        sizes: ['S', 'M', 'L', 'XL'],
        categories: ['all-abayas'],
        images: [`${CDN}ca124ba5-391e-4c6b-9567-9bf253bcd095-413.54372123603x500-ROqU7Zu1ighhyPLuPgRlcIsy7mCpxN7Z3i5uI57A.jpg`],
    },
];

// ─── Main ────────────────────────────────────────────────────────────
async function main() {
    console.log('🌱 Seeding database...\n');

    // 1. Permissions
    const permKeys = [
        'products.read', 'products.write', 'products.delete',
        'orders.read', 'orders.write', 'orders.status',
        'users.read', 'users.write',
        'settings.read', 'settings.write',
        'media.upload',
    ];
    for (const key of permKeys) {
        await prisma.permission.upsert({ where: { key }, update: {}, create: { key, description: key } });
    }
    console.log(`  ✅ ${permKeys.length} permissions`);

    // 2. Admin user
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
    const allPerms = await prisma.permission.findMany();
    for (const perm of allPerms) {
        await prisma.rolePermission.upsert({
            where: { adminUserId_permissionId: { adminUserId: admin.id, permissionId: perm.id } },
            update: {},
            create: { adminUserId: admin.id, permissionId: perm.id },
        });
    }
    console.log(`  ✅ Admin: ${admin.email}`);

    // 3. Store settings
    await prisma.storeSettings.upsert({
        where: { id: 1 },
        update: {},
        create: {
            storeName: 'لميس',
            whatsappNumber: '+97455555555',
            shippingQarQA: 0,
            shippingSarSA: 0,
            freeShipAbove: 300,
            defaultCurrency: 'QAR',
            vatPercent: 0,
        },
    });
    console.log('  ✅ Store settings');

    // 4. Clear old catalog
    console.log('\n  🗑  Clearing old catalog...');
    await prisma.productCategory.deleteMany({});
    await prisma.productImage.deleteMany({});
    await prisma.productVariant.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.category.deleteMany({});

    // 5. Categories
    const catMap: Record<string, string> = {};
    for (const cat of CATEGORIES) {
        const c = await prisma.category.create({ data: cat });
        catMap[cat.slug] = c.id;
    }
    console.log(`  ✅ ${CATEGORIES.length} categories`);

    // 6. Products
    let count = 0;
    for (const p of PRODUCTS) {
        await prisma.product.create({
            data: {
                slug: p.slug,
                titleAr: p.titleAr,
                titleEn: p.titleEn,
                descAr: p.descAr,
                descEn: p.descEn,
                badgeAr: (p as { badgeAr?: string }).badgeAr ?? null,
                badgeEn: (p as { badgeEn?: string }).badgeEn ?? null,
                fabric: p.fabric,
                color: p.color,
                rating: p.rating,
                isBestSeller: p.isBestSeller,
                isPublished: true,
                images: {
                    create: p.images.map((url, i) => ({
                        url, altAr: p.titleAr, altEn: p.titleEn, sortOrder: i,
                    })),
                },
                variants: {
                    create: p.sizes.map((size) => ({
                        size,
                        sku: `${p.slug}-${size}`.toUpperCase(),
                        stock: 30,
                        priceQar: qar(p.saleSar),
                        priceSar: p.saleSar,
                    })),
                },
                categories: {
                    create: p.categories
                        .filter((slug) => catMap[slug])
                        .map((slug) => ({ categoryId: catMap[slug] })),
                },
            },
        });
        count++;
    }
    console.log(`  ✅ ${count} products with images, variants & categories`);

    console.log('\n🎉 Seed complete!');
    console.log(`   Categories : ${CATEGORIES.length}`);
    console.log(`   Products   : ${count}`);
    console.log(`   Best sellers: ${PRODUCTS.filter(p => p.isBestSeller).length}`);
}

main()
    .catch((e) => { console.error('❌ Seed failed:', e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });

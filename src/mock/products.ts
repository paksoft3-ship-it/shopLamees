export type Product = {
    id: string;
    slug: string;
    name: { ar: string; en: string };
    description: { ar: string; en: string };
    price: number;
    compareAtPrice?: number;
    image: string;
    images?: string[];
    badge?: { ar: string; en: string };
    rating: number;
    isBestSeller?: boolean;
    categoryIds?: string[];
    availability?: boolean;
    fabric?: string;
    color?: string;
    sizes?: string[];
};

export const products: Product[] = [
    {
        id: "prod_1",
        slug: "black-crepe-abaya",
        name: { ar: "عباية كريب سوداء", en: "Black Crepe Abaya" },
        description: { ar: "كريب ياباني فاخر", en: "Luxury Japanese Crepe" },
        price: 450,
        image: "https://cdn.salla.sa/DGwjPD/fc75a3df-82b5-4e5b-85fe-35f80ea75e67-738.5428907168x1000-wytsxECY4TpiZ8jeB370gBy32lswuxn9IQeHTScr.jpg",
        images: [
            "https://cdn.salla.sa/DGwjPD/fc75a3df-82b5-4e5b-85fe-35f80ea75e67-738.5428907168x1000-wytsxECY4TpiZ8jeB370gBy32lswuxn9IQeHTScr.jpg",
            "https://cdn.salla.sa/DGwjPD/7663593e-68b8-4d17-b5bc-4d61bfab3f85-832.79836591771x1000-0Y13RBibw21qkCiIf7MwSA6sNFZ0I58NpWjVPxVp.jpg"
        ],
        badge: { ar: "جديد", en: "New" },
        rating: 4.5,
        isBestSeller: true,
        categoryIds: ["abayas"],
        availability: true,
        fabric: "crepe",
        color: "black",
        sizes: ["S", "M", "L", "XL"]
    },
    {
        id: "prod_2",
        slug: "royal-niqab",
        name: { ar: "نقاب ملكي فاخر", en: "Luxury Royal Niqab" },
        description: { ar: "قماش كوري أصلي", en: "Original Korean Fabric" },
        price: 120,
        image: "https://cdn.salla.sa/DGwjPD/2206b6b7-cda1-48ab-bfc5-3d8d2e8c0a71-378.26086956522x500-e4Xo1FC6x4d3lZaCcuH3XjUg2gBvhHbU2U7PNmh0.jpg",
        images: [
            "https://cdn.salla.sa/DGwjPD/2206b6b7-cda1-48ab-bfc5-3d8d2e8c0a71-378.26086956522x500-e4Xo1FC6x4d3lZaCcuH3XjUg2gBvhHbU2U7PNmh0.jpg",
            "https://cdn.salla.sa/DGwjPD/cd2dbf1c-e62c-4223-9a4c-c7dfce6aaa9c-416.12903225806x500-WJtfCRYn85TDrb0p1ynN2ILVVkHnffdsXc9WoOLJ.jpg"
        ],
        rating: 5.0,
        categoryIds: ["niqab"],
        availability: true,
        fabric: "silk",
        color: "black",
        sizes: ["OS"]
    },
    {
        id: "prod_3",
        slug: "velvet-occasion-abaya",
        name: { ar: "عباية مخمل للمناسبات", en: "Velvet Occasion Abaya" },
        description: { ar: "تطريز يدوي خاص", en: "Special Hand Embroidery" },
        price: 680,
        compareAtPrice: 850,
        image: "https://cdn.salla.sa/DGwjPD/5038b39b-482b-4eeb-9213-51f4996de68f-834.95145631068x1000-J0zuVPtQ2UdnANsKSJHtIdBLo7seX7uzEi8I4NpP.jpg",
        images: [
            "https://cdn.salla.sa/DGwjPD/5038b39b-482b-4eeb-9213-51f4996de68f-834.95145631068x1000-J0zuVPtQ2UdnANsKSJHtIdBLo7seX7uzEi8I4NpP.jpg",
            "https://cdn.salla.sa/DGwjPD/1af79f9b-5259-412d-9508-a2e284afe45b-733.46560846561x1000-PXvV1S1cCSWxVeswIEuTDQG11FMLnlVo1dU7yOcd.jpg"
        ],
        badge: { ar: "خصم 20%", en: "20% OFF" },
        rating: 5.0,
        categoryIds: ["abayas", "velvet"],
        availability: true,
        fabric: "velvet",
        color: "black",
        sizes: ["M", "L"]
    },
    {
        id: "prod_4",
        slug: "daily-practical-abaya",
        name: { ar: "عباية يومية عملية", en: "Practical Daily Abaya" },
        description: { ar: "قماش خفيف وبارد", en: "Light and Cool Fabric" },
        price: 320,
        image: "https://cdn.salla.sa/DGwjPD/7a850e39-e117-44b3-8cde-d41f47f097d9-394.9785670545x500-Cre4MlYmew5ssN1gMbliaPGsZoHn6dMRbbdJuFJ7.jpg",
        images: [
            "https://cdn.salla.sa/DGwjPD/7a850e39-e117-44b3-8cde-d41f47f097d9-394.9785670545x500-Cre4MlYmew5ssN1gMbliaPGsZoHn6dMRbbdJuFJ7.jpg",
            "https://cdn.salla.sa/DGwjPD/b9e7de98-e044-4a0e-9d42-117e1af5d1e2-343.53226295062x500-Lg8AJCRWbv6BU5WEPpq8rRvtzDY082iDuJGVeKNe.jpg"
        ],
        rating: 4.0,
        categoryIds: ["abayas", "crepe"],
        availability: false,
        fabric: "chiffon",
        color: "black",
        sizes: ["S", "M", "L"]
    },
    {
        id: "prod_5",
        slug: "mars-black-abaya",
        name: { ar: "عباية مارس أسود", en: "Mars Black Abaya" },
        description: { ar: "تصميم عصري أنيق", en: "Modern Elegant Design" },
        price: 520,
        image: "https://cdn.salla.sa/DGwjPD/dbc353f9-d830-4840-aa70-82b16efac223-379.85865724382x500-xL5rU56nae4GpvtKXEzqGdvPzh9MDTdRO0AdtrS0.jpg",
        images: [
            "https://cdn.salla.sa/DGwjPD/dbc353f9-d830-4840-aa70-82b16efac223-379.85865724382x500-xL5rU56nae4GpvtKXEzqGdvPzh9MDTdRO0AdtrS0.jpg",
            "https://cdn.salla.sa/DGwjPD/9ff27cbd-adad-443c-b653-ba8393c9de36-687.63326226013x1000-OydGQFa82WAschWXyQLT2whVAt1ky0EeJ08mxy2H.jpg"
        ],
        badge: { ar: "الأكثر مبيعاً", en: "Best Seller" },
        rating: 4.8,
        isBestSeller: true,
        categoryIds: ["abayas"],
        availability: true,
        fabric: "crepe",
        color: "black",
        sizes: ["S", "M", "L", "XL"]
    },
    {
        id: "prod_6",
        slug: "ward-embroidered-abaya",
        name: { ar: "عباية ورد مطرزة", en: "Ward Embroidered Abaya" },
        description: { ar: "تطريز ورد يدوي", en: "Hand Embroidered Roses" },
        price: 750,
        compareAtPrice: 890,
        image: "https://cdn.salla.sa/DGwjPD/d6a4c76d-c7b5-40b0-aec3-9313297847bd-392.57455873402x500-Wh3S3FUrL5viaU29xEMtO4vyXDk0x2wZEhHjoXgM.jpg",
        images: [
            "https://cdn.salla.sa/DGwjPD/d6a4c76d-c7b5-40b0-aec3-9313297847bd-392.57455873402x500-Wh3S3FUrL5viaU29xEMtO4vyXDk0x2wZEhHjoXgM.jpg",
            "https://cdn.salla.sa/DGwjPD/1914f5e6-a4c6-411e-9d7c-ad997a314c21-832.25806451613x1000-mz77TRapT2t2F6wgruMUOB7YcDp9gXyuO7Ygw8K6.jpg"
        ],
        badge: { ar: "خصم 15%", en: "15% OFF" },
        rating: 4.9,
        categoryIds: ["abayas", "velvet"],
        availability: true,
        fabric: "velvet",
        color: "black",
        sizes: ["M", "L", "XL"]
    },
    {
        id: "prod_7",
        slug: "roof-classic-abaya",
        name: { ar: "عباية روف كلاسيك", en: "Roof Classic Abaya" },
        description: { ar: "قصة كلاسيكية فضفاضة", en: "Classic Loose Cut" },
        price: 380,
        image: "https://cdn.salla.sa/DGwjPD/2cdb7738-c9d7-4065-9500-91dfaf326503-382.33550681683x500-eZY1b9ytLMawMByHzGOZQpSVlr4wuikImeYcL6o7.jpg",
        images: [
            "https://cdn.salla.sa/DGwjPD/2cdb7738-c9d7-4065-9500-91dfaf326503-382.33550681683x500-eZY1b9ytLMawMByHzGOZQpSVlr4wuikImeYcL6o7.jpg",
            "https://cdn.salla.sa/DGwjPD/dd08f0e7-3a32-4fa2-83a5-d63432cd5fdd-739.45489941596x1000-6NGt0H5Kx51dgB8f46QD0Pase7JcYLlrMCsHc7Xv.jpg"
        ],
        rating: 4.3,
        categoryIds: ["abayas", "crepe"],
        availability: true,
        fabric: "crepe",
        color: "black",
        sizes: ["S", "M", "L"]
    },
    {
        id: "prod_8",
        slug: "luxury-silk-abaya",
        name: { ar: "عباية حرير فاخرة", en: "Luxury Silk Abaya" },
        description: { ar: "حرير طبيعي ١٠٠٪", en: "100% Natural Silk" },
        price: 950,
        image: "https://cdn.salla.sa/DGwjPD/fc062275-0066-42e3-b03d-1fdea458ee15-749.12891986063x1000-E8gNt5aySSYGou67jxYFq02LwyOlCcc7MZQ5ctTS.jpg",
        images: [
            "https://cdn.salla.sa/DGwjPD/fc062275-0066-42e3-b03d-1fdea458ee15-749.12891986063x1000-E8gNt5aySSYGou67jxYFq02LwyOlCcc7MZQ5ctTS.jpg",
            "https://cdn.salla.sa/DGwjPD/eee80252-de89-44f2-a927-d56118cb8626-809.61663417804x1000-WiQNRV5aa1pXtPF5EU8vD5gZzCOwz4XxSghkdJgo.jpg"
        ],
        badge: { ar: "حصري", en: "Exclusive" },
        rating: 5.0,
        categoryIds: ["abayas"],
        availability: true,
        fabric: "silk",
        color: "black",
        sizes: ["M", "L"]
    },
    {
        id: "prod_9",
        slug: "bell-sleeve-abaya",
        name: { ar: "عباية أكمام جرس", en: "Bell Sleeve Abaya" },
        description: { ar: "تصميم أكمام واسعة", en: "Wide Sleeve Design" },
        price: 420,
        image: "https://cdn.salla.sa/DGwjPD/3755f2d7-6af3-4dac-a2c4-c3c7d12877a9-750x1000-YGsUKDLvXYTg9HcSzOdwbylVWv97sfUVOIQL8l5b.jpg",
        images: [
            "https://cdn.salla.sa/DGwjPD/3755f2d7-6af3-4dac-a2c4-c3c7d12877a9-750x1000-YGsUKDLvXYTg9HcSzOdwbylVWv97sfUVOIQL8l5b.jpg",
            "https://cdn.salla.sa/DGwjPD/fcb27741-3ce6-4983-b466-b69d4fca5b3e-810.30150753769x1000-GK2hxwq1lZyEvMOC29yflDVmA5ZVIe68fk3cWENQ.jpg"
        ],
        rating: 4.6,
        categoryIds: ["abayas", "crepe"],
        availability: true,
        fabric: "crepe",
        color: "black",
        sizes: ["S", "M", "L", "XL"]
    },
    {
        id: "prod_10",
        slug: "premium-chiffon-abaya",
        name: { ar: "عباية شيفون ممتازة", en: "Premium Chiffon Abaya" },
        description: { ar: "شيفون فرنسي فاخر", en: "Luxury French Chiffon" },
        price: 580,
        image: "https://cdn.salla.sa/DGwjPD/7a42e30d-3f38-4bca-9476-bb91c17c46b6-691.25266686986x1000-J4ikmXefYRJTSbhDyFWxS8lBh3fTjbsdL1mfP6Jw.jpg",
        images: [
            "https://cdn.salla.sa/DGwjPD/7a42e30d-3f38-4bca-9476-bb91c17c46b6-691.25266686986x1000-J4ikmXefYRJTSbhDyFWxS8lBh3fTjbsdL1mfP6Jw.jpg",
            "https://cdn.salla.sa/DGwjPD/9384bfb4-8b04-4863-aec9-0058fafa581a-759.14893617021x1000-Q9Ak4IvksjLAJk5aXmK7xkKw3qhfAzonzT1yVbPq.jpg"
        ],
        badge: { ar: "جديد", en: "New" },
        rating: 4.7,
        isBestSeller: true,
        categoryIds: ["abayas"],
        availability: true,
        fabric: "chiffon",
        color: "black",
        sizes: ["S", "M", "L", "XL"]
    }
];
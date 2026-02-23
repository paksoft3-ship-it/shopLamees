import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ProductStatus = 'published' | 'draft' | 'archived';

export interface ProductVariant {
    id: string;
    size?: string;
    cut?: string;
    color?: string;
    sku: string;
    price?: number;
    stock: number;
}

export interface AdminProduct {
    id: string;
    titleEn: string;
    titleAr: string;
    slug: string;
    descriptionEn?: string;
    descriptionAr?: string;
    price: number;
    compareAtPrice?: number;
    category: string;
    images: string[];
    status: ProductStatus;
    variants: ProductVariant[];
    isCustom: boolean;
    isMadeToOrder: boolean;
    leadTimeDays?: number;
    createdAt: string;
    updatedAt: string;
}

const mockProducts: AdminProduct[] = [
    {
        id: 'prod_1',
        titleAr: 'عباية كلاسيك سوداء',
        titleEn: 'Classic Black Abaya',
        slug: 'classic-black-abaya',
        price: 450,
        category: 'يومي',
        images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBRZ7lvE5wpEq2MmDjGReDZ0JEvWxsI4BBMMzuMv03gCwXJJAbRjR_XftYxPiaFTL30AXYMK4QwQfFup2Mm3A9mJdFwsIP-1ZIlwqK18soPf60GhqsCOfAXxp9KePy79Ttbl1dt61WDyjtGsea1JaBCwRtCO5eHSmZGEXKBYhQ9FXkmf7J6Jy8OEUy1ATXphiMYI-IZZORwfZ5cCy8LzQGFC54zfgPVJNJNE9BsypVxhka0uq_7tZZgnQ_JYJU-tOgUbxOUv8T2Ycw'],
        status: 'published',
        variants: [
            { id: 'v1', size: 'S', color: 'أسود', sku: 'SKU-89201-S', stock: 20 },
            { id: 'v2', size: 'M', color: 'أسود', sku: 'SKU-89201-M', stock: 35 },
            { id: 'v3', size: 'L', color: 'أسود', sku: 'SKU-89201-L', stock: 30 }
        ],
        isCustom: false,
        isMadeToOrder: false,
        createdAt: '2023-10-20T10:00:00Z',
        updatedAt: '2023-10-20T10:00:00Z'
    },
    {
        id: 'prod_2',
        titleAr: 'عباية مطرزة فاخرة',
        titleEn: 'Luxury Embroidered Abaya',
        slug: 'luxury-embroidered-abaya',
        price: 1200,
        compareAtPrice: 1500,
        category: 'سهرة',
        images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuA9jtpuhWjz_EggqOsYUfHkSqqTlfp5FIp9mHS0LyHHLKkqaVzuwoap1TXG4l0gs1AuQrh7ltJ1Q72VUGpZBkNnHWp-qyUykqymJsG0QbjqOp-6lpMtA-ymkaZ39HUAW-J4UbdgXeSTdqGUQmNF0hWN4Ki97JhBKJlQxgkCL4H-VcobJxhT7oSaJoFTuLJ1hsmBODZfz66fkQMuyxnbf9kMmiO73qSyCP4OllWYRA_sGVjbllPZCIVTanLddoNEZjxifB40v0bk5Sc'],
        status: 'published',
        variants: [
            { id: 'v4', size: 'M', color: 'كحلي', sku: 'SKU-99102-M', stock: 5 },
            { id: 'v5', size: 'L', color: 'كحلي', sku: 'SKU-99102-L', stock: 7 }
        ],
        isCustom: true,
        isMadeToOrder: true,
        leadTimeDays: 7,
        createdAt: '2023-10-18T14:30:00Z',
        updatedAt: '2023-10-18T14:30:00Z'
    },
    {
        id: 'prod_3',
        titleAr: 'عباية مخمل شتوي',
        titleEn: 'Winter Velvet Abaya',
        slug: 'winter-velvet-abaya',
        price: 580,
        category: 'مجموعة الشتاء',
        images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBVkOxtHsO7EhMURQzkWj2naR0yoKeg_3X8hhPTpuhFqpkcZrf6nfgCxw2XNRPPE6vHKoRPb6vQ5FbLII4N119otciOSge-IksFSrNdZa05v0wP5ciYV8lwUUT2IJyodb4Mrq5OEHobZOAjcdPC3c31AWGLnd7zFY7tZXDJCUw3xLCeQVP95uVBxN126na9Rym7HrdnjHT4IUL9I0NUDJgC7KB0QRkuYJxpt6y2O9ln_OJmYO8raT3Wofwe8V1uulxaPEoAy4O-tgA'],
        status: 'draft',
        variants: [
            { id: 'v6', size: 'M', color: 'عنابي', sku: 'W500-M', stock: 50 }
        ],
        isCustom: false,
        isMadeToOrder: false,
        createdAt: '2023-10-01T09:15:00Z',
        updatedAt: '2023-10-01T09:15:00Z'
    }
];

interface AdminProductsStore {
    products: AdminProduct[];
    addProduct: (product: Omit<AdminProduct, 'id' | 'createdAt' | 'updatedAt'>) => void;
    updateProduct: (id: string, product: Partial<Omit<AdminProduct, 'id'>>) => void;
    deleteProduct: (id: string) => void;
    updateProductStatus: (id: string, status: ProductStatus) => void;
}

export const useAdminProducts = create<AdminProductsStore>()(
    persist(
        (set) => ({
            products: mockProducts,
            addProduct: (data) => set((state) => {
                const newProduct: AdminProduct = {
                    ...data,
                    id: `prod_${Date.now()}`,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                return { products: [newProduct, ...state.products] };
            }),
            updateProduct: (id, data) => set((state) => ({
                products: state.products.map(p =>
                    p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p
                )
            })),
            deleteProduct: (id) => set((state) => ({
                products: state.products.filter(p => p.id !== id)
            })),
            updateProductStatus: (id, status) => set((state) => ({
                products: state.products.map(p =>
                    p.id === id ? { ...p, status, updatedAt: new Date().toISOString() } : p
                )
            }))
        }),
        {
            name: 'admin-products-storage'
        }
    )
);

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';

export interface OrderItem {
    id: string;
    name: string;
    sku: string;
    price: number;
    quantity: number;
    image: string;
    variant?: string; // e.g. "المقاس: M | اللون: أسود"
}

export interface OrderTimelineEvent {
    status: string;
    label: string;
    date: string;
    note?: string;
    isCurrent?: boolean;
    isFuture?: boolean;
}

export interface AdminOrder {
    id: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerAvatar?: string;
    country: string;
    countryCode: string; // Emoji flag 
    amount: number;
    paymentMethod: string;
    status: OrderStatus;
    date: string;
    shippingAddress: {
        city: string;
        zone: string;
        street: string;
        building: string;
        fullText?: string;
    };
    items: OrderItem[];
    timeline: OrderTimelineEvent[];
    customerNote?: string;
    internalNote?: string;
    discount?: number;
    discountCode?: string;
    shippingFee: number;
}

const mockOrders: AdminOrder[] = [
    {
        id: '10234',
        customerName: 'سارة محمد',
        customerEmail: 'sara.m@gmail.com',
        customerPhone: '+966 50 123 4567',
        country: 'السعودية',
        countryCode: '🇸🇦',
        amount: 450,
        paymentMethod: 'فيزا',
        status: 'processing',
        date: '12 أكتوبر 2023',
        shippingAddress: {
            city: 'الرياض',
            zone: '61',
            street: 'شارع التحلية',
            building: 'مبنى 12',
            fullText: 'الرياض، حي العليا، شارع التحلية...'
        },
        items: [
            {
                id: '1',
                name: 'عباية حرير أسود فاخر',
                sku: 'AB-001-BLK-M',
                price: 450,
                quantity: 1,
                image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmX7G7BeRlHiVJ15_EvDT_2NNHfMxs6yjUUMs_XQaUE_TOCQuqH_sDeQwr4sB5OIfl9SnzdtbPF6UO8wVpFhj1ZD0QGyNmPj_-qYHvjKCNfBpVYIHVfTDhzj1jcvq8breoLjVxdoZKikilMS3YbBaFMkpsjHnIL1lH6X_Z2oBxxRMdcABnDyoydq4uuqTYt1rsOO3DbhsNQYoxnSEqbMXFfeAZqacZqFBWER_lVlT5HpzCanXHy_PC8H3hhxMGkUpCtRMs-oo2CBc',
                variant: 'المقاس: M | اللون: أسود'
            }
        ],
        timeline: [
            { status: 'pending', label: 'تم إنشاء الطلب', date: '24 أكتوبر، 10:30 صباحاً' },
            { status: 'paid', label: 'تم تأكيد الدفع', date: '24 أكتوبر، 10:35 صباحاً' },
            { status: 'processing', label: 'جاري التجهيز', date: '25 أكتوبر، 09:15 صباحاً', isCurrent: true, note: 'بواسطة سارة (المخزون)' },
            { status: 'shipped', label: 'في الطريق', date: '--', isFuture: true }
        ],
        customerNote: 'الرجاء تغليف الطلب كهدية، وإزالة الفاتورة من الداخل. شكراً لكم!',
        internalNote: '',
        discount: 0,
        shippingFee: 30
    },
    {
        id: '10233',
        customerName: 'فاطمة علي',
        customerEmail: 'fatima.ali@outlook.com',
        customerPhone: '+974 5555 1234',
        customerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtTesmQ501UbqEOeEm38hx5Av9fE_oUx92U_gqbUQ6h90xnHpeCi-FUjp_ds5TGwcogfn-g2AElWuqsu6KY-7261XxDcA_wv42Ffi2De9IB3IEd0blrt-zksC5Y3_zUd-xUD_ZnZDeTY8ICebFmw-s5wnsW9koMZLjU21yD8RJM2BQjEJ3J26IejFGtC8OHx6opAr3TAG1Mv3B-CmZIGv7Ym2udgkKS3AQ5_Eky9axudOTNmGIC8FmbJxpZwaz_lw-G8M0W_GAL0k',
        country: 'قطر',
        countryCode: '🇶🇦',
        amount: 1200,
        paymentMethod: 'أبل باي',
        status: 'shipped',
        date: '11 أكتوبر 2023',
        shippingAddress: {
            city: 'الدوحة',
            zone: '61',
            street: 'شارع 850',
            building: 'مبنى 4',
        },
        items: [
            {
                id: '2',
                name: 'عباية كتان بيج صيفي',
                sku: 'AB-005-BGE-L',
                price: 380,
                quantity: 1,
                image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA8yId3hu9GA5qx4Ib27lKeLpSttOgDT5JUT-qQ8sefI6LNJuihqdmxjWdTANVxf2cnplwYR5ARU1nFntEoR-n26lYDMKCuXQfCJoK_-V09a2Yux83w03c99cAejrBkan7hhszSr3t2wPb9HH_AHjjvwbZuK9ooFgJpgNlB2Q5QAwH9t42huMUSTiJJodOr9gTVGjX2g2W_mstnWMjE3OqIYYHbf_Pv6ra8rAHMrC59E6DL9UsrOtqVrghAQCcCslTsfLPaZRBR2js',
                variant: 'المقاس: L | اللون: بيج'
            },
            {
                id: '3',
                name: 'شيلة مطابقة',
                sku: 'ACC-SH-001',
                price: 80,
                quantity: 1,
                image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnqn0IgIWac2y71__ctos30L0KlSqoAGXU9HQMW10v5x8_JbOCIB_nNYwB-YIQEDcF3u6px_EPbXS_FJUJ2hePUCzfW6nSlQr9erXNM6dtMZ9WTEgUk_3ud_VwpsM6LD42ICmfjsFggsYCsLGio2a_GCSRTAp2pZtVXuyYUZwnuUG_fl8vusG5iKWD6JvhVsAp3N6Mq-OheJSEjTRBZF4trO8dAX-4rQssdA4gatWS2VzfEDRCUOLcl687pOtbZXgSmLLbfE3oT3Q',
                variant: 'المقاس: One Size | اللون: أسود'
            }
        ],
        timeline: [
            { status: 'pending', label: 'تم إنشاء الطلب', date: '10 أكتوبر' },
            { status: 'processing', label: 'تم التجهيز', date: '11 أكتوبر' },
            { status: 'shipped', label: 'تم الشحن', date: '11 أكتوبر 2023', isCurrent: true }
        ],
        discount: 45,
        discountCode: 'SUMMER23',
        shippingFee: 30
    },
    {
        id: '10232',
        customerName: 'نورة عبدالله',
        customerEmail: 'noura.ab@gmail.com',
        customerPhone: '+971 50 123 4567',
        country: 'الإمارات',
        countryCode: '🇦🇪',
        amount: 320,
        paymentMethod: 'تحويل بنكي',
        status: 'pending',
        date: '10 أكتوبر 2023',
        shippingAddress: {
            city: 'دبي',
            zone: '1',
            street: 'شارع الشيخ زايد',
            building: 'مبنى 1',
        },
        items: [],
        timeline: [
            { status: 'pending', label: 'تم إنشاء الطلب', date: '10 أكتوبر', isCurrent: true },
        ],
        shippingFee: 30
    },
    {
        id: '10231',
        customerName: 'مريم يوسف',
        customerEmail: 'maryam.y@yahoo.com',
        customerPhone: '+965 99 123 456',
        country: 'الكويت',
        countryCode: '🇰🇼',
        amount: 890,
        paymentMethod: 'مدى',
        status: 'completed',
        date: '09 أكتوبر 2023',
        shippingAddress: {
            city: 'مدينة الكويت',
            zone: '1',
            street: 'شارع فهد السالم',
            building: 'مبنى 10',
        },
        items: [],
        timeline: [
            { status: 'completed', label: 'مكتمل', date: '09 أكتوبر 2023', isCurrent: true },
        ],
        shippingFee: 0
    }
];

interface AdminOrdersState {
    orders: AdminOrder[];
    updateOrderStatus: (orderId: string, status: OrderStatus) => void;
    updateInternalNote: (orderId: string, note: string) => void;
}

export const useAdminOrders = create<AdminOrdersState>()(
    persist(
        (set) => ({
            orders: mockOrders,
            updateOrderStatus: (orderId, status) => set((state) => ({
                orders: state.orders.map((o) =>
                    o.id === orderId
                        ? {
                            ...o,
                            status,
                            timeline: o.timeline.map((t) => ({ ...t, isCurrent: false })).concat({
                                status,
                                label: status === 'pending' ? 'بانتظار الدفع' : status === 'processing' ? 'جاري التجهيز' : status === 'shipped' ? 'تم الشحن' : status === 'completed' ? 'مكتمل' : 'ملغي',
                                date: new Date().toLocaleString('ar-SA'),
                                isCurrent: true
                            })
                        }
                        : o
                ),
            })),
            updateInternalNote: (orderId, note) => set((state) => ({
                orders: state.orders.map((o) => o.id === orderId ? { ...o, internalNote: note } : o)
            }))
        }),
        {
            name: 'admin-orders-storage',
        }
    )
);

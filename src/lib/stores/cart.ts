import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartItem = {
    id: string;
    variantId: string;
    productId: string;
    slug: string;
    name: string;
    unitPrice: number;
    currency: string;
    quantity: number;
    image?: string;
    size?: string;
    cut?: string;
    color?: string;
    note?: string;
};

type CartStore = {
    items: CartItem[];
    isDrawerOpen: boolean;
    hasHydrated: boolean;
    addItem: (item: CartItem) => void;
    removeItem: (variantId: string) => void;
    updateQuantity: (variantId: string, quantity: number) => void;
    updateNote: (variantId: string, note: string) => void;
    clearCart: () => void;
    openDrawer: () => void;
    closeDrawer: () => void;
};

export const useCartStore = create<CartStore>()(
    persist(
        (set) => ({
            items: [],
            isDrawerOpen: false,
            hasHydrated: false,
            addItem: (item) =>
                set((state) => {
                    const existing = state.items.find((i) => i.variantId === item.variantId);
                    if (existing) {
                        return {
                            items: state.items.map((i) =>
                                i.variantId === item.variantId
                                    ? { ...i, quantity: i.quantity + item.quantity }
                                    : i
                            ),
                            isDrawerOpen: true,
                        };
                    }
                    return { items: [...state.items, item], isDrawerOpen: true };
                }),
            removeItem: (variantId) =>
                set((state) => ({ items: state.items.filter((i) => i.variantId !== variantId) })),
            updateQuantity: (variantId, quantity) =>
                set((state) => ({
                    items: quantity < 1
                        ? state.items.filter((i) => i.variantId !== variantId)
                        : state.items.map((i) => (i.variantId === variantId ? { ...i, quantity } : i)),
                })),
            updateNote: (variantId, note) =>
                set((state) => ({
                    items: state.items.map((i) => (i.variantId === variantId ? { ...i, note } : i)),
                })),
            clearCart: () => set({ items: [] }),
            openDrawer: () => set({ isDrawerOpen: true }),
            closeDrawer: () => set({ isDrawerOpen: false }),
        }),
        {
            name: 'lamees-cart',
            version: 2,
            partialize: (state) => ({ items: state.items }),
            migrate: (persistedState: unknown) => {
                const state = (persistedState || {}) as { items?: unknown };
                const rawItems = Array.isArray(state.items) ? state.items : [];
                const items = rawItems
                    .map((raw) => raw as Partial<CartItem>)
                    .filter((raw) => typeof raw.productId === 'string' && typeof raw.slug === 'string' && typeof raw.name === 'string')
                    .map((raw) => ({
                        id: String(raw.id || raw.productId || ''),
                        variantId: String(raw.variantId || `${raw.productId}-default`),
                        productId: String(raw.productId),
                        slug: String(raw.slug),
                        name: String(raw.name),
                        unitPrice: Number(raw.unitPrice || 0),
                        currency: String(raw.currency || 'SAR'),
                        quantity: Number(raw.quantity || 1),
                        image: typeof raw.image === 'string' ? raw.image : undefined,
                        size: typeof raw.size === 'string' ? raw.size : undefined,
                        cut: typeof raw.cut === 'string' ? raw.cut : undefined,
                        color: typeof raw.color === 'string' ? raw.color : undefined,
                        note: typeof raw.note === 'string' ? raw.note : undefined,
                    }));
                return { items };
            },
            onRehydrateStorage: () => () => {
                useCartStore.setState({ hasHydrated: true });
            },
        }
    )
);

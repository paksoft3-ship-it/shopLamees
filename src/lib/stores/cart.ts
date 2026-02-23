import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartItem = {
    id: string;
    variantId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    size?: string;
    cut?: string;
    note?: string;
};

type CartStore = {
    items: CartItem[];
    isDrawerOpen: boolean;
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
        { name: 'lamees-cart', partialize: (state) => ({ items: state.items }) }
    )
);

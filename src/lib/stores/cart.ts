import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type CartItem = {
    id: string;
    variantId: string;
    name: string;
    price: number;
    quantity: number;
};

type CartStore = {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    clearCart: () => void;
};

export const useCartStore = create<CartStore>()(
    persist(
        (set) => ({
            items: [],
            addItem: (item) => set((state) => ({ items: [...state.items, item] })),
            removeItem: (id) =>
                set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
            clearCart: () => set({ items: [] }),
        }),
        { name: 'lamees-cart' }
    )
);

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  ecoScore: string;
  img: string;
  qty: number;
}

interface CartStore {
  items: CartItem[];
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  selectedProductId: string | null;
  setCartOpen: (open: boolean) => void;
  setCheckoutOpen: (open: boolean) => void;
  setSelectedProductId: (id: string | null) => void;
  addItem: (item: Omit<CartItem, 'qty'>) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  getCo2Offset: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,
      isCheckoutOpen: false,
      selectedProductId: null,
      setCartOpen: (open) => set({ isCartOpen: open }),
      setCheckoutOpen: (open) => set({ isCheckoutOpen: open }),
      setSelectedProductId: (id) => set({ selectedProductId: id }),
      addItem: (item) => {
        const items = [...get().items];
        const existing = items.find((i) => i.id === item.id);
        if (existing) {
          existing.qty += 1;
        } else {
          items.push({ ...item, qty: 1 });
        }
        set({ items });
      },
      removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      updateQty: (id, qty) => {
        if (qty <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((i) => (i.id === id ? { ...i, qty } : i)),
        });
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
      getItemCount: () => get().items.reduce((sum, i) => sum + i.qty, 0),
      getCo2Offset: () => {
        const total = get().getTotal();
        return Math.round(total * 0.5);
      },
    }),
    {
      name: 'solterra-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);

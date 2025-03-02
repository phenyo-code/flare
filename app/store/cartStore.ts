import { create } from "zustand";

interface CartItem {
  id: string;
  quantity: number;
  pricePerItem: number;
}

interface CartState {
  pendingUpdates: number;
  cartItems: CartItem[];
  setPending: (isPending: boolean) => void;
  isUpdating: () => boolean;
  updateItemQuantity: (cartItemId: string, quantity: number, pricePerItem: number) => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  pendingUpdates: 0,
  cartItems: [], // Initialize empty, populated by CartQuantityUpdater
  setPending: (isPending) =>
    set((state) => ({
      pendingUpdates: isPending ? state.pendingUpdates + 1 : Math.max(0, state.pendingUpdates - 1),
    })),
  isUpdating: () => get().pendingUpdates > 0,
  updateItemQuantity: (cartItemId, quantity, pricePerItem) =>
    set((state) => {
      const existingItem = state.cartItems.find((item) => item.id === cartItemId);
      if (existingItem) {
        return {
          cartItems: state.cartItems.map((item) =>
            item.id === cartItemId ? { ...item, quantity } : item
          ),
        };
      }
      return {
        cartItems: [...state.cartItems, { id: cartItemId, quantity, pricePerItem }],
      };
    }),
}));
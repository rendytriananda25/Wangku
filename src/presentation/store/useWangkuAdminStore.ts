import { create } from 'zustand';
import { CartItemEntity } from '../../domain/entities/TransactionEntity';
import { createTransactionUseCase } from '../../core/di/container';

/**
 * useWangkuAdminStore — Zustand store untuk state kasir admin.
 * Mengelola keranjang (in-memory) dan proses checkout.
 * HANYA memanggil Use Cases, TIDAK tahu database.
 */

// Re-export CartItemEntity sebagai CartItem agar komponen UI tidak perlu import dari domain
export type CartItem = CartItemEntity;

interface AdminState {
    cart: CartItem[];
    totalPrice: number;
    isLoading: boolean;

    addToCart: (menu: { id: string; name: string; price: number; qty?: number }) => void;
    decreaseQty: (menuId: string) => void;
    removeFromCart: (menuId: string) => void;
    clearCart: () => void;
    checkout: (paymentMethod: 'CASH' | 'QRIS') => Promise<void>;
}

export const useWangkuAdminStore = create<AdminState>((set, get) => ({
    cart: [],
    totalPrice: 0,
    isLoading: false,

    addToCart: (menu) => {
        const currentCart = get().cart;
        const existingItem = currentCart.find((item) => item.menuId === menu.id);
        const qtyToAdd = menu.qty || 1;

        let updatedCart;
        if (existingItem) {
            updatedCart = currentCart.map((item) =>
                item.menuId === menu.id ? { ...item, qty: item.qty + qtyToAdd } : item
            );
        } else {
            updatedCart = [...currentCart, { menuId: menu.id, name: menu.name, price: menu.price, qty: qtyToAdd }];
        }

        const newTotal = updatedCart.reduce((sum, item) => sum + item.price * item.qty, 0);
        set({ cart: updatedCart, totalPrice: newTotal });
    },

    decreaseQty: (menuId) => {
        const currentCart = get().cart;
        const existingItem = currentCart.find((item) => item.menuId === menuId);
        if (!existingItem) return;

        let updatedCart;
        if (existingItem.qty > 1) {
            updatedCart = currentCart.map((item) =>
                item.menuId === menuId ? { ...item, qty: item.qty - 1 } : item
            );
        } else {
            updatedCart = currentCart.filter((item) => item.menuId !== menuId);
        }

        const newTotal = updatedCart.reduce((sum, item) => sum + item.price * item.qty, 0);
        set({ cart: updatedCart, totalPrice: newTotal });
    },

    removeFromCart: (menuId) => {
        const updatedCart = get().cart.filter((item) => item.menuId !== menuId);
        const newTotal = updatedCart.reduce((sum, item) => sum + item.price * item.qty, 0);
        set({ cart: updatedCart, totalPrice: newTotal });
    },

    clearCart: () => set({ cart: [], totalPrice: 0 }),

    checkout: async (paymentMethod) => {
        const { cart, totalPrice } = get();
        if (cart.length === 0) return;

        set({ isLoading: true });
        try {
            // Panggil Use Case — store tidak tahu database apa yang dipakai
            await createTransactionUseCase.execute(totalPrice, paymentMethod, cart);
            console.log('✅ Checkout berhasil! Total: Rp', totalPrice);
            get().clearCart();
        } catch (error) {
            console.error('❌ Gagal checkout:', error);
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },
}));
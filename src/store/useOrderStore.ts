// src/store/useOrderStore.ts
// Zustand Store quản lý Lịch sử Đơn hàng & Hóa đơn (Chương 6.10 & Sprint 6 Step 9.6)
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem } from './useCartStore';

export type PaymentStatus = 'PENDING' | 'PAID';

export interface OrderRecord {
  id: string;
  items: CartItem[];
  total: number;
  status: PaymentStatus;
  createdAt: string; // Chuỗi định dạng ISO
}

export interface OrderState {
  orders: OrderRecord[];
  addOrder: (order: OrderRecord) => void;
  markPaid: (orderId: string) => void;
  getById: (orderId: string) => OrderRecord | undefined;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],

      addOrder: (order: OrderRecord) => {
        set((state) => ({ orders: [order, ...state.orders] }));
      },

      markPaid: (orderId: string) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId ? { ...order, status: 'PAID' as const } : order
          ),
        }));
      },

      getById: (orderId: string) => {
        return get().orders.find((order) => order.id === orderId);
      },
    }),
    {
      name: 'shopai-orders',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ orders: state.orders }) as OrderState,
    }
  )
);

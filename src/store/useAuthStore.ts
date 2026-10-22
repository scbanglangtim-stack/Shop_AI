// src/store/useAuthStore.ts
// Zustand Client State cho Xác thực người dùng & Lưu trữ bảo mật Hardware-backed Keystore (Chương 8)
import { create } from 'zustand';
import * as SecureStore from '@services/secureStore';

export interface AuthState {
  token: string | null;
  isLoading: boolean;
  isUnlocked: boolean;
  login: (newToken: string) => Promise<void>;
  logout: () => Promise<void>;
  checkLocalToken: () => Promise<void>;
  setIsUnlocked: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isLoading: false, // Mở lên là lên luôn tức thì, không bị chặn bởi màn hình loading
  isUnlocked: true, // Vào thẳng app mà không cần qua gate loading

  setIsUnlocked: (value: boolean) => set({ isUnlocked: value }),

  // Lưu token vào RAM VÀ lưu xuống Ổ cứng mã hóa (Keystore / Keychain)
  login: async (newToken: string) => {
    try {
      await SecureStore.setItemAsync('SHOP_ACCESS_TOKEN', newToken);
    } catch (e) {
      console.log('Lỗi ghi SecureStore:', e);
    }
    set({ token: newToken, isUnlocked: true, isLoading: false });
  },

  // Hủy Token trên cả 2 nơi và khóa lại
  logout: async () => {
    try {
      await SecureStore.deleteItemAsync('SHOP_ACCESS_TOKEN');
    } catch (e) {
      console.log('Lỗi xóa SecureStore:', e);
    }
    set({ token: null, isUnlocked: true, isLoading: false });
  },

  // Hàm móc dữ liệu từ Keystore lên khi người dùng vừa khởi động lại điện thoại
  checkLocalToken: async () => {
    try {
      const storedToken = await SecureStore.getItemAsync('SHOP_ACCESS_TOKEN');
      if (storedToken) {
        set({ token: storedToken, isUnlocked: true, isLoading: false });
      } else {
        set({ token: null, isUnlocked: true, isLoading: false });
      }
    } catch (e) {
      console.log('Lỗi Keystore:', e);
      set({ token: null, isUnlocked: true, isLoading: false });
    } finally {
      set({ isLoading: false });
    }
  },
}));

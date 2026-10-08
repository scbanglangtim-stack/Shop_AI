// src/store/useAuthStore.ts
// Zustand Client State cho Xác thực người dùng & Lưu trữ bảo mật Hardware-backed Keystore (Chương 8)
import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

export interface AuthState {
  token: string | null;
  isLoading: boolean; // Trạng thái đang kiểm tra ổ cứng lúc khởi động
  isUnlocked: boolean; // Cổng sinh trắc học: true = đã mở khóa, false = đang khóa
  login: (newToken: string) => Promise<void>;
  logout: () => Promise<void>;
  checkLocalToken: () => Promise<void>; // Hàm chạy lúc mở app
  setIsUnlocked: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isLoading: true, // Mặc định vừa vào app là Loading để kiểm tra Keystore
  isUnlocked: false,

  setIsUnlocked: (value: boolean) => set({ isUnlocked: value }),

  // Lưu token vào RAM VÀ lưu xuống Ổ cứng mã hóa (Keystore / Keychain)
  // Khi người dùng vừa đăng nhập bằng mật khẩu thành công -> mở khóa luôn (isUnlocked = true)
  login: async (newToken: string) => {
    try {
      await SecureStore.setItemAsync('SHOP_ACCESS_TOKEN', newToken);
    } catch (e) {
      console.log('Lỗi ghi SecureStore:', e);
    }
    set({ token: newToken, isUnlocked: true });
  },

  // Hủy Token trên cả 2 nơi và khóa lại
  logout: async () => {
    try {
      await SecureStore.deleteItemAsync('SHOP_ACCESS_TOKEN');
    } catch (e) {
      console.log('Lỗi xóa SecureStore:', e);
    }
    set({ token: null, isUnlocked: false });
  },

  // Hàm móc dữ liệu từ Keystore lên khi người dùng vừa khởi động lại điện thoại
  checkLocalToken: async () => {
    try {
      const storedToken = await SecureStore.getItemAsync('SHOP_ACCESS_TOKEN');
      if (storedToken) {
        // Tìm thấy Token cũ trong Keystore -> nạp vào state nhưng giữ isUnlocked = false để bắt xác thực sinh trắc
        set({ token: storedToken, isUnlocked: false });
      } else {
        set({ token: null, isUnlocked: false });
      }
    } catch (e) {
      console.log('Lỗi Keystore:', e);
      set({ token: null, isUnlocked: false });
    } finally {
      set({ isLoading: false }); // Kiểm tra xong, tắt loading
    }
  },
}));

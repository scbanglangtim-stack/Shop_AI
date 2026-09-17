// src/store/useAuthStore.ts
// Zustand Client State cho Xác thực người dùng (Chương 6.3 & Sprint 6)
import { create } from 'zustand';

interface AuthState {
  token: string | null;
  login: (newToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null, // Khởi tạo chưa đăng nhập (Chương 8 sẽ nâng cấp lưu vào SecureStore)
  login: (newToken: string) => {
    set({ token: newToken });
  },
  logout: () => set({ token: null }),
}));

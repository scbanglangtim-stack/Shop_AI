// src/api/axiosClient.ts
// Axios Instance & Interceptors chuyên nghiệp (Chương 6.6 & Sprint 6)
import axios from 'axios';
import { useAuthStore } from '@store/useAuthStore';

const axiosClient = axios.create({
  baseURL: 'https://api.shopai.com', // Domain gốc (Chương 9 sẽ đổi thành URL NestJS thật)
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 1. REQUEST INTERCEPTOR: Tự động lấy Token từ Zustand và gắn vào Header mọi Request
axiosClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 2. RESPONSE INTERCEPTOR: Bắt lỗi 401 (Token hết hạn / không hợp lệ) tập trung một chỗ
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('⚠️ Token hết hạn hoặc không hợp lệ — tự động đăng xuất!');
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default axiosClient;

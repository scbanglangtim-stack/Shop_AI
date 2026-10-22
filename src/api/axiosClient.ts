// src/api/axiosClient.ts
// Axios Instance & Interceptors chuyên nghiệp (Chương 6.6 & Sprint 6)
import axios from 'axios';
import { useAuthStore } from '@store/useAuthStore';
import { API_BASE_URL } from '@constants/api';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
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

// 2. RESPONSE INTERCEPTOR: Xử lý 401 và tự động chuyển đổi giữa USB localhost và Wi-Fi IP
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    if (error.response?.status === 401) {
      console.warn('⚠️ Token hết hạn hoặc không hợp lệ — tự động đăng xuất!');
      useAuthStore.getState().logout();
      return Promise.reject(error);
    }

    // Nếu lỗi mất kết nối mạng và chưa thử host dự phòng
    if (!error.response && config && !config._isRetryLAN) {
      config._isRetryLAN = true;
      if (config.baseURL?.includes('10.82.144.78')) {
        config.baseURL = 'http://localhost:3000';
        return axiosClient(config);
      } else if (config.baseURL?.includes('localhost')) {
        config.baseURL = 'http://10.82.144.78:3000';
        return axiosClient(config);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;

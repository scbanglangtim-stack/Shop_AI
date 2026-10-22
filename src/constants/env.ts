// src/constants/env.ts
// Cấu hình môi trường đa tầng (Chương 10 - Bước 0)
export type AppEnv = 'development' | 'staging' | 'production';

// __DEV__ là biến toàn cục của React Native: true khi chạy qua Metro, false ở bản build Release.
// Nhờ nó, chỉ một dòng này đã tự phân biệt được máy dev với máy người dùng thật.
export const APP_ENV: AppEnv = __DEV__ ? 'development' : 'production';

// Bảng địa chỉ Server — kết nối trực tiếp đến NestJS Backend của ShopAI
const API_URLS: Record<AppEnv, string> = {
  development: 'http://localhost:3000',
  staging: 'http://10.10.42.115:3000',
  production: 'http://localhost:3000',
};

export const API_BASE_URL = API_URLS[APP_ENV];

// Cờ bật/tắt tính năng theo môi trường — tránh làm nhiễu dữ liệu thật bằng log lúc đang code
export const ENABLE_CRASHLYTICS = APP_ENV !== 'development';
export const ENABLE_OTA_UPDATE = APP_ENV !== 'development';

// Hiển thị ở màn hình Giới thiệu / góc dưới HomeScreen (xem Phần 10.10)
export const APP_VERSION = '1.0.0';

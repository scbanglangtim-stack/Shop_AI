// src/constants/env.ts
// Cấu hình môi trường đa tầng (Chương 10 - Bước 0)
export type AppEnv = 'development' | 'staging' | 'production';

// __DEV__ là biến toàn cục của React Native: true khi chạy qua Metro, false ở bản build Release.
// Nhờ nó, chỉ một dòng này đã tự phân biệt được máy dev với máy người dùng thật.
export const APP_ENV: AppEnv = __DEV__ ? 'development' : 'production';

// Bảng địa chỉ Server — kết nối trực tiếp đến NestJS Backend của ShopAI
// IP Wi-Fi LAN hiện tại của máy tính: 10.82.144.78
export const LAN_SERVER_URL = 'http://10.82.144.78:3000';

const API_URLS: Record<AppEnv, string> = {
  development: LAN_SERVER_URL,
  staging: LAN_SERVER_URL,
  production: LAN_SERVER_URL,
};

export const API_BASE_URL = API_URLS[APP_ENV];

// Cờ bật/tắt tính năng theo môi trường — tránh làm nhiễu dữ liệu thật bằng log lúc đang code
export const ENABLE_CRASHLYTICS = APP_ENV !== 'development';
export const ENABLE_OTA_UPDATE = APP_ENV !== 'development';

// Hiển thị ở màn hình Giới thiệu / góc dưới HomeScreen (xem Phần 10.10)
export const APP_VERSION = '1.0.0';

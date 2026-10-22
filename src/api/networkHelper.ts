// src/api/networkHelper.ts
// Bộ điều phối kết nối mạng thông minh ShopAI: Tự động chuyển đổi giữa USB adb reverse và Wi-Fi LAN
import axios from 'axios';
import { useAuthStore } from '@store/useAuthStore';

export const SERVER_HOSTS = [
  'http://localhost:3000',
  'http://10.10.42.115:3000',
];

let currentHost = SERVER_HOSTS[0];

export const getActiveBaseUrl = () => currentHost;

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  data?: any;
  params?: any;
  timeout?: number;
  headers?: Record<string, string>;
}

export const requestWithFallback = async <T = any>(
  path: string,
  options: RequestOptions = {}
): Promise<{ data: T; status: number }> => {
  const method = options.method || 'GET';
  const timeout = options.timeout || 3500;
  const token = useAuthStore.getState().token;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const hostsToTry = [currentHost, ...SERVER_HOSTS.filter((h) => h !== currentHost)];
  let lastError: any = null;

  for (const host of hostsToTry) {
    try {
      const cleanPath = path.startsWith('/') ? path : `/${path}`;
      const url = `${host}${cleanPath}`;
      const response = await axios({
        url,
        method,
        data: options.data,
        params: options.params,
        timeout,
        headers,
      });

      // Thành công -> ghi nhớ host này cho các lượt gọi tiếp theo
      currentHost = host;
      return { data: response.data, status: response.status };
    } catch (err: any) {
      lastError = err;
      // Nếu server đã phản hồi mã lỗi HTTP (400, 401, 404, 500...),
      // chứng tỏ mạng và server VẪN HOẠT ĐỘNG, không phải mất mạng!
      if (err?.response && typeof err?.response?.status === 'number') {
        if (err.response.status === 401) {
          console.warn('⚠️ Token không hợp lệ hoặc đã hết hạn!');
          useAuthStore.getState().logout();
        }
        throw err;
      }
      // Nếu là lỗi Network Error / ECONNREFUSED / Timeout -> thử tiếp host kế tiếp
    }
  }

  // Toàn bộ host đều không thể kết nối -> Thực sự mất kết nối mạng!
  const networkError = new Error('NETWORK_DISCONNECTED: Không thể kết nối tới cơ sở dữ liệu máy chủ ShopAI');
  (networkError as any).isNetworkError = true;
  throw networkError;
};

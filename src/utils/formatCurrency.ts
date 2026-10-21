// src/utils/formatCurrency.ts
// Hàm định dạng tiền tệ Việt Nam Đồng (VND) dùng chung toàn App (Chương 11 - Bước 5)
export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

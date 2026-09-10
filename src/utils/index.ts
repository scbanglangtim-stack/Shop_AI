// src/utils/index.ts
// Các hàm tiện ích dùng chung (Chương 2 & 3)

export const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('vi-VN') + ' đ';
};

export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

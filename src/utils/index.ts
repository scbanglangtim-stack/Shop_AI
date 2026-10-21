// src/utils/index.ts
// Các hàm tiện ích dùng chung (Chương 2, 3 & 11)

export * from './formatCurrency';

export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

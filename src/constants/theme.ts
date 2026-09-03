// src/constants/theme.ts
// Hệ thống Hằng số Design Tokens tiêu chuẩn của ShopAI (Chương 3.1)

export const COLORS = {
  primary: '#FF4D4F', // Đỏ cam đặc trưng thương hiệu ShopAI
  secondary: '#34495E', // Xanh than thanh lịch
  background: '#F5F5F5', // Nền sáng
  surface: '#FFFFFF', // Nền thẻ / card
  text: '#2C3E50', // Màu chữ chính
  textLight: '#7F8C8D', // Màu chữ phụ
  danger: '#E74C3C', // Màu cảnh báo lỗi
  success: '#2ECC71', // Màu thành công
  border: '#E8E8E8', // Màu viền nhẹ
  cardDark: '#1E1E1E', // Nền thẻ Dark Mode
  bgDark: '#121212', // Nền Dark Mode
};

export const SIZES = {
  base: 8,
  font: 14,
  radius: 12,
  padding: 16,

  // Typography
  h1: 24,
  h2: 20,
  h3: 18,
  body: 14,
  body1: 16,
  body2: 14,
  small: 12,
  caption: 12,
};

export const FONTS = {
  h1: { fontSize: SIZES.h1, fontWeight: '700' as const },
  h2: { fontSize: SIZES.h2, fontWeight: '700' as const },
  h3: { fontSize: SIZES.h3, fontWeight: '600' as const },
  body1: { fontSize: SIZES.body1, fontWeight: '400' as const },
  body2: { fontSize: SIZES.body2, fontWeight: '400' as const },
  small: { fontSize: SIZES.small, fontWeight: '400' as const },
};

export const SHADOWS = {
  light: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
};

// src/constants/theme.ts
// Hệ thống Hằng số Design Tokens tiêu chuẩn của ShopAI (Chương 3)

export const COLORS = {
  primary: '#FF4D4F', // Đỏ cam thương hiệu ShopAI
  secondary: '#1890FF', // Xanh dương thứ cấp
  secondaryDark: '#34495E', // Xanh than thanh lịch
  background: '#F5F5F5', // Nền sáng
  surface: '#FFFFFF', // Nền thẻ / card
  text: '#2C3E50', // Màu chữ chính
  textLight: '#7F8C8D', // Màu chữ phụ
  border: '#E8E8E8', // Màu viền
  danger: '#E74C3C', // Màu cảnh báo lỗi
  error: '#FF4D4F', // Màu lỗi
  success: '#52C41A', // Màu thành công
  warning: '#FAAD14', // Màu cảnh báo
};

export const SIZES = {
  base: 8,
  font: 14,
  radius: 12,
  padding: 16,

  // Typography Scale
  h1: 28,
  h2: 22,
  h3: 18,
  body1: 16,
  body2: 14,
  body: 14,
  small: 12,
  caption: 12,
};

export const FONTS = {
  h1: { fontSize: SIZES.h1, fontWeight: '800' as const, lineHeight: 34 },
  h2: { fontSize: SIZES.h2, fontWeight: '700' as const, lineHeight: 28 },
  h3: { fontSize: SIZES.h3, fontWeight: '700' as const, lineHeight: 24 },
  body1: { fontSize: SIZES.body1, fontWeight: '400' as const, lineHeight: 22 },
  body2: { fontSize: SIZES.body2, fontWeight: '400' as const, lineHeight: 20 },
  body: { fontSize: SIZES.body, fontWeight: '400' as const, lineHeight: 20 },
  small: { fontSize: SIZES.small, fontWeight: '400' as const, lineHeight: 16 },
  caption: { fontSize: SIZES.caption, fontWeight: '400' as const, lineHeight: 16 },
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

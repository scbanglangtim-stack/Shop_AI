import { Vibration, Platform } from 'react-native';

/**
 * Trung tâm điều phối rung phản hồi của ShopAI.
 * Tối ưu thời lượng mạnh mẽ (400ms) đặc biệt cho motor tuyến tính trục X (X-axis linear motor)
 * trên các dòng máy cao cấp như Redmi K80 / Xiaomi HyperOS / Android 15.
 */

let hapticsEnabled = true;

export const setHapticsEnabled = (value: boolean) => {
  hapticsEnabled = value;
};

/** Hàm rung lõi */
const safeVibrate = (pattern: number | number[]) => {
  if (!hapticsEnabled) return;
  try {
    Vibration.vibrate(pattern);
  } catch (e) {
    console.log('[haptics] Lỗi rung:', e);
  }
};

/** Chạm nhẹ — dùng cho nút +/- số lượng (150ms rung rõ). */
export const hapticLight = () => safeVibrate(150);

/** Chạm vừa — dùng cho nút Mua ngay, chuyển tab (300ms). */
export const hapticMedium = () => safeVibrate(300);

/**
 * Rung "THÀNH CÔNG" — Quét trúng mã vạch, thêm giỏ hàng.
 * Tăng lên 400ms rung mạnh mẽ dứt khoát trên Redmi K80.
 */
export const hapticSuccess = () => {
  if (Platform.OS === 'ios') {
    safeVibrate(1);
  } else {
    // 400ms: Rung mạnh, chắc tay, không thể bỏ lỡ trên motor Redmi K80
    safeVibrate(400);
  }
};

/** Rung "LỖI" — Hai nhịp dài mạnh (300ms, nghỉ 150ms, 300ms). */
export const hapticError = () => safeVibrate([0, 300, 150, 300]);

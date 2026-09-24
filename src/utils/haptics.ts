import { Vibration, Platform } from 'react-native';

/**
 * Trung tâm điều phối rung phản hồi của ShopAI.
 * Sử dụng thời lượng chuẩn (ms) để tương thích tối đa với mọi motor rung Android & iOS.
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

/** Chạm nhẹ — dùng cho nút +/- số lượng (50ms). */
export const hapticLight = () => safeVibrate(50);

/** Chạm vừa — dùng cho nút Mua ngay, bấm chuyển tab (100ms). */
export const hapticMedium = () => safeVibrate(100);

/**
 * Rung "THÀNH CÔNG" — Quét trúng mã vạch, thêm giỏ hàng thành công.
 * Dùng thời lượng 150ms để motor rung kích hoạt dứt khoát, rõ rệt trên tay.
 */
export const hapticSuccess = () => {
  if (Platform.OS === 'ios') {
    safeVibrate(1);
  } else {
    // 150ms: Độ dài chuẩn vàng để motor rung Android rung chắc tay, không bị ngắt
    safeVibrate(150);
  }
};

/** Rung "LỖI" — Hai nhịp dài (120ms, nghỉ 80ms, 120ms). */
export const hapticError = () => safeVibrate([0, 120, 80, 120]);

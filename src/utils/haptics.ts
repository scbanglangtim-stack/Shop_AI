import { Vibration, Platform } from 'react-native';

/**
 * Trung tâm điều phối rung phản hồi của ShopAI.
 *
 * Vì sao phải bọc lại thay vì gọi thẳng Vibration?
 *  1. Sau này đổi sang expo-haptics chỉ cần sửa ĐÚNG file này.
 *  2. Có thể tắt toàn bộ rung bằng 1 công tắc (phục vụ Cài đặt của user).
 *  3. Mọi lỗi rung đều bị nuốt gọn — tính năng phụ KHÔNG được làm sập app.
 */

// Công tắc tổng. Sau này có thể nối vào Zustand để user tự bật/tắt trong Cài đặt.
let hapticsEnabled = true;

export const setHapticsEnabled = (value: boolean) => {
  hapticsEnabled = value;
};

/** Hàm rung lõi — mọi hàm bên dưới đều đi qua đây. */
const safeVibrate = (pattern: number | number[]) => {
  if (!hapticsEnabled) return;
  try {
    Vibration.vibrate(pattern);
  } catch (e) {
    // Nuốt lỗi im lặng nếu thiết bị không hỗ trợ motor rung
    console.log('[haptics] Thiết bị không hỗ trợ rung:', e);
  }
};

/** Chạm nhẹ — dùng cho các nút bấm phụ (40ms). */
export const hapticLight = () => safeVibrate(40);

/** Chạm vừa — dùng cho nút hành động chính (Thêm vào giỏ, Thanh toán - 70ms). */
export const hapticMedium = () => safeVibrate(70);

/**
 * Rung "THÀNH CÔNG" — nhịp rõ ràng, cảm giác "tích-tắc".
 * Mảng đọc là: [đợi 0ms, rung 80ms, nghỉ 60ms, rung 80ms]
 * Đủ độ dài (80ms) để mọi motor rung trên Android/iOS đều kích hoạt rõ nét.
 */
export const hapticSuccess = () => {
  if (Platform.OS === 'ios') {
    safeVibrate(1);
  } else {
    safeVibrate([0, 80, 60, 80]);
  }
};

/** Rung "LỖI" — ba nhịp dài dứt khoát. */
export const hapticError = () => safeVibrate([0, 80, 80, 80, 80, 80]);

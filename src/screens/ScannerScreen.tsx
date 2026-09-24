import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, Alert, Linking, StyleSheet, Text, View } from 'react-native';
import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';
import { useIsFocused } from '@react-navigation/native';
import ShopButton from '@components/ShopButton';
import { COLORS } from '@constants/theme';
import { hapticSuccess } from '@utils/haptics';

// Ba trạng thái của quyền Camera
type PermissionState = 'checking' | 'granted' | 'denied';

const ScannerScreen = ({ navigation }: any) => {
  const [permission, setPermission] = useState<PermissionState>('checking');
  const device = useCameraDevice('back'); // Chọn ống kính mặt sau
  const isFocused = useIsFocused(); // true nếu màn hình này đang hiển thị

  // "CÁI KHÓA" chống quét lặp — dùng useRef vì đổi giá trị tức thời không re-render
  const isScanning = useRef(false);

  // 1. Hàm xin/kiểm tra quyền
  const requestPermission = useCallback(async () => {
    try {
      const current = Camera.getCameraPermissionStatus();
      if (current === 'granted') {
        setPermission('granted');
        return;
      }

      const status = await Camera.requestCameraPermission();
      setPermission(status === 'granted' ? 'granted' : 'denied');
    } catch (e) {
      console.log('[Scanner] Lỗi kiểm tra quyền:', e);
      setPermission('denied');
    }
  }, []);

  // 2. Xin quyền ở Runtime khi màn hình mount
  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  // 3. Khi user từ Settings quay lại app -> tự động dò lại quyền
  useEffect(() => {
    const sub = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        requestPermission();
      }
    });
    return () => sub.remove();
  }, [requestPermission]);

  // 4. Mở Cài đặt hệ thống
  const openAppSettings = () => {
    Alert.alert(
      'Cần quyền Camera',
      'Bạn đã từ chối quyền Camera nên ShopAI không thể quét mã vạch. Hãy vào Cài đặt > ShopAI và bật lại quyền Camera nhé.',
      [
        { text: 'Để sau', style: 'cancel' },
        { text: 'Mở Cài đặt', onPress: () => Linking.openSettings() },
      ],
    );
  };

  // 5. Logic máy quét mã vạch qua JSI CodeScanner
  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13', 'code-128'],
    onCodeScanned: (codes) => {
      if (isScanning.current) return;
      if (!codes || codes.length === 0) return;

      const value = codes[0].value;
      if (!value) return;

      isScanning.current = true; // Đóng khóa ngay lập tức
      console.log('[Scanner] Phát hiện mã:', value);

      // Rung phản hồi thành công
      hapticSuccess();

      // Trả kết quả về HomeScreen
      navigation.navigate('Home', { scannedCode: value });
    },
  });

  // A. Trạng thái đang kiểm tra quyền
  if (permission === 'checking') {
    return (
      <View style={styles.center}>
        <Text style={styles.stateText}>Đang kiểm tra quyền Camera...</Text>
      </View>
    );
  }

  // B. Bị từ chối quyền
  if (permission === 'denied') {
    return (
      <View style={styles.center}>
        <Text style={styles.deniedTitle}>Chưa có quyền Camera</Text>
        <Text style={styles.deniedDesc}>
          ShopAI cần Camera để quét mã vạch sản phẩm. Ảnh chỉ được xử lý ngay trên máy
          của bạn và không bao giờ được gửi đi đâu cả.
        </Text>
        <ShopButton
          title="Mở Cài đặt"
          onPress={openAppSettings}
          style={{ width: 200, marginBottom: 12 }}
        />
        <ShopButton
          title="Quay lại"
          variant="outline"
          onPress={() => navigation.goBack()}
          style={{ width: 200 }}
        />
      </View>
    );
  }

  // C. Thiết bị không có camera sau
  if (device == null) {
    return (
      <View style={styles.center}>
        <Text style={styles.deniedTitle}>Không tìm thấy Camera</Text>
        <Text style={styles.deniedDesc}>
          Thiết bị không có Camera sau hoặc đang chạy trên máy ảo (Simulator/Emulator).
          Vui lòng thử nghiệm trên điện thoại thật!
        </Text>
        <ShopButton title="Quay lại" onPress={() => navigation.goBack()} style={{ width: 200 }} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 6. Luồng Camera C++ 60FPS */}
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isFocused}
        codeScanner={codeScanner}
      />

      {/* 7. Khung ngắm quét mã */}
      <View style={styles.frameWrapper} pointerEvents="none">
        <View style={styles.frame} />
      </View>

      <View style={styles.overlay}>
        <Text style={styles.instruction}>Đưa mã vạch hoặc mã QR vào khung hình</Text>
        <ShopButton
          title="Hủy bỏ"
          onPress={() => navigation.goBack()}
          style={{ width: 140, backgroundColor: COLORS.danger }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: COLORS.background,
  },
  stateText: { fontSize: 16, marginBottom: 12, textAlign: 'center', color: COLORS.text },
  deniedTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: COLORS.danger },
  deniedDesc: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
    color: COLORS.textLight,
  },
  frameWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  frame: {
    width: 250,
    height: 250,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.85)',
    borderRadius: 16,
  },
  overlay: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    alignItems: 'center',
  },
  instruction: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    overflow: 'hidden',
  },
});

export default ScannerScreen;

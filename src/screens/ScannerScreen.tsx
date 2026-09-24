import React, { useRef } from 'react';
import { Alert, Linking, StyleSheet, Text, View } from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
  useCameraPermission,
} from 'react-native-vision-camera';
import { useIsFocused } from '@react-navigation/native';
import ShopButton from '@components/ShopButton';
import { COLORS } from '@constants/theme';
import { hapticSuccess } from '@utils/haptics';

const ScannerScreen = ({ navigation }: any) => {
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');
  const isFocused = useIsFocused();

  // "CÁI KHÓA" chống quét lặp — dùng useRef đổi giá trị tức thời không re-render
  const isScanning = useRef(false);

  // Xử lý khi user bấm nút cấp quyền
  const handleRequestPermission = async () => {
    try {
      const granted = await requestPermission();
      if (!granted) {
        Alert.alert(
          'Cần quyền Camera',
          'Bạn đã từ chối quyền Camera nên ShopAI không thể quét mã vạch. Hãy vào Cài đặt > ShopAI và bật lại quyền Camera nhé.',
          [
            { text: 'Để sau', style: 'cancel' },
            { text: 'Mở Cài đặt', onPress: () => Linking.openSettings() },
          ],
        );
      }
    } catch (e) {
      console.log('[Scanner] Lỗi xin quyền:', e);
      Linking.openSettings();
    }
  };

  // Logic máy quét mã vạch qua JSI CodeScanner
  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13', 'code-128'],
    onCodeScanned: (codes) => {
      if (isScanning.current) return;
      if (!codes || codes.length === 0) return;

      const value = codes[0].value;
      if (!value) return;

      isScanning.current = true; // Đóng khóa ngay lập tức
      console.log('[Scanner] Phát hiện mã:', value);

      // 📳 RUNG PHẢN HỒI: Kích hoạt nhịp rung thành công
      hapticSuccess();

      // Trả kết quả về HomeScreen
      navigation.navigate('Home', { scannedCode: value });
    },
  });

  // 1. Trạng thái chưa có quyền Camera (Tự động hiển thị giao diện này, không bao giờ bị màn đen)
  if (!hasPermission) {
    return (
      <View style={styles.center}>
        <Text style={styles.deniedEmoji}>📷</Text>
        <Text style={styles.deniedTitle}>Cần quyền truy cập Camera</Text>
        <Text style={styles.deniedDesc}>
          ShopAI cần Camera để quét mã vạch sản phẩm. Ảnh chỉ được xử lý ngay trên máy
          của bạn và không bao giờ được gửi đi đâu cả.
        </Text>
        <ShopButton
          title="Cấp quyền / Mở Cài đặt"
          onPress={handleRequestPermission}
          style={{ width: 220, marginBottom: 12, backgroundColor: COLORS.primary }}
        />
        <ShopButton
          title="Quay lại"
          variant="outline"
          onPress={() => navigation.goBack()}
          style={{ width: 220 }}
        />
      </View>
    );
  }

  // 2. Thiết bị không có camera sau (hoặc chạy trên Simulator)
  if (device == null) {
    return (
      <View style={styles.center}>
        <Text style={styles.deniedEmoji}>🔍</Text>
        <Text style={styles.deniedTitle}>Không tìm thấy Camera</Text>
        <Text style={styles.deniedDesc}>
          Thiết bị không có Camera sau hoặc đang chạy trên máy ảo (Simulator/Emulator).
          Vui lòng thử nghiệm trên điện thoại thật!
        </Text>
        <ShopButton title="Quay lại" onPress={() => navigation.goBack()} style={{ width: 200 }} />
      </View>
    );
  }

  // 3. Đã có quyền đầy đủ -> Bật Camera View 60FPS
  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isFocused}
        codeScanner={codeScanner}
      />

      {/* Khung ngắm quét mã */}
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
    backgroundColor: '#FFFFFF',
  },
  deniedEmoji: { fontSize: 54, marginBottom: 14 },
  deniedTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#1F2937' },
  deniedDesc: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
    color: '#4B5563',
    maxWidth: 320,
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

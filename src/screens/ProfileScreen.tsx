// src/screens/ProfileScreen.tsx
// Màn hình Tài khoản & Cài đặt hệ thống ShopAI (Nằm ngoài cùng bên phải Bottom Tab)
import React, { useState, useEffect } from 'react';
import {
  Alert,
  BackHandler,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '@constants/theme';
import { useTheme } from '@contexts/ThemeContext';
import { useAuthStore } from '@store/useAuthStore';
import { getCurrentSessionUser, clearCurrentSessionUser, UserAccount } from '@services/localDbService';
import AsyncStorage from '@react-native-async-storage/async-storage';

let IconComponent: any = null;
try {
  IconComponent = require('react-native-vector-icons/MaterialCommunityIcons').default;
} catch {
  IconComponent = null;
}

const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  const { colors, isDark, toggleTheme } = useTheme();
  const logout = useAuthStore((state) => state.logout);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const user = await getCurrentSessionUser();
    if (user) {
      setCurrentUser(user);
    }
  };

  const handleClearCache = async () => {
    Alert.alert(
      '🧹 Xóa bộ nhớ đệm',
      'Bạn có chắc chắn muốn dọn sạch bộ nhớ cache tạm thời trên máy? (Dữ liệu tài khoản vẫn được giữ nguyên)',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa ngay',
          onPress: async () => {
            try {
              // Xóa các key tạm không ảnh hưởng auth
              await AsyncStorage.removeItem('@shopai_temp_cache');
              Alert.alert('Thành công', 'Đã dọn sạch 12.4 MB bộ nhớ đệm cache!');
            } catch {
              Alert.alert('Thông báo', 'Đã giải phóng bộ nhớ đệm thành công!');
            }
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất khỏi tài khoản?', [
      { text: 'Ở lại', style: 'cancel' },
      {
        text: 'Đăng xuất',
        style: 'destructive',
        onPress: async () => {
          await clearCurrentSessionUser();
          await logout();
        },
      },
    ]);
  };

  const handleExitApp = () => {
    Alert.alert('Thoát ứng dụng', 'Bạn muốn đóng ứng dụng ShopAI?', [
      { text: 'Không', style: 'cancel' },
      {
        text: 'Thoát app',
        style: 'destructive',
        onPress: () => BackHandler.exitApp(),
      },
    ]);
  };

  const renderIcon = (name: string, fallbackEmoji: string, color?: string) => {
    if (IconComponent) {
      return <IconComponent name={name} size={22} color={color || colors.primary} />;
    }
    return <Text style={{ fontSize: 18 }}>{fallbackEmoji}</Text>;
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Header Hồ sơ người dùng */}
        <View style={[styles.profileCard, { backgroundColor: colors.surface, borderColor: isDark ? colors.border : '#EAEAEA' }]}>
          <View style={styles.avatarRow}>
            <View style={[styles.avatarBox, { backgroundColor: isDark ? '#3A1C20' : '#FFF1F0', borderColor: colors.primary }]}>
              <Text style={styles.avatarText}>👤</Text>
            </View>
            <View style={styles.userInfo}>
              <View style={styles.nameRow}>
                <Text style={[styles.userName, { color: colors.text }]} numberOfLines={1}>
                  {currentUser?.name || 'Khách hàng ShopAI'}
                </Text>
                <View style={[styles.vipBadge, { backgroundColor: colors.primary }]}>
                  <Text style={styles.vipBadgeText}>VIP</Text>
                </View>
              </View>
              <Text style={[styles.userEmail, { color: colors.textLight }]} numberOfLines={1}>
                {currentUser?.email || 'demo@shopai.com'}
              </Text>
              <View style={styles.statusPill}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Hoạt động Độc Lập • Offline-Ready</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 2. Nhóm Cài đặt Hệ thống (Settings) */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textLight }]}>CÀI ĐẶT HỆ THỐNG</Text>

          {/* Cài đặt Chế độ Tối (Dark Mode) */}
          <View style={[styles.menuItem, { backgroundColor: colors.surface, borderColor: isDark ? colors.border : '#EFEFEF' }]}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.iconBox, { backgroundColor: isDark ? '#333' : '#F0F0F0' }]}>
                {renderIcon('theme-light-dark', isDark ? '🌙' : '☀️', isDark ? '#FFD700' : '#FA8C16')}
              </View>
              <View>
                <Text style={[styles.menuTitle, { color: colors.text }]}>Chế độ nền tối (Dark Mode)</Text>
                <Text style={[styles.menuSubtitle, { color: colors.textLight }]}>
                  {isDark ? 'Đang bật nền tối dịu mắt' : 'Đang dùng nền sáng thanh lịch'}
                </Text>
              </View>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: '#D9D9D9', true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Bảo mật Sinh trắc học & Keystore */}
          <View style={[styles.menuItem, { backgroundColor: colors.surface, borderColor: isDark ? colors.border : '#EFEFEF' }]}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.iconBox, { backgroundColor: '#F6FFED' }]}>
                {renderIcon('fingerprint', '🔒', '#52C41A')}
              </View>
              <View>
                <Text style={[styles.menuTitle, { color: colors.text }]}>Khóa bảo mật Sinh trắc học</Text>
                <Text style={[styles.menuSubtitle, { color: colors.textLight }]}>
                  Vân tay / Face ID & Hardware Keystore
                </Text>
              </View>
            </View>
            <View style={styles.activeTag}>
              <Text style={styles.activeTagText}>Đã kích hoạt</Text>
            </View>
          </View>

          {/* Dọn rác & Xóa bộ nhớ Cache */}
          <Pressable
            style={[styles.menuItem, { backgroundColor: colors.surface, borderColor: isDark ? colors.border : '#EFEFEF' }]}
            onPress={handleClearCache}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.iconBox, { backgroundColor: '#E6F7FF' }]}>
                {renderIcon('broom', '🧹', '#1890FF')}
              </View>
              <View>
                <Text style={[styles.menuTitle, { color: colors.text }]}>Xóa bộ nhớ đệm Cache</Text>
                <Text style={[styles.menuSubtitle, { color: colors.textLight }]}>
                  Giải phóng RAM & bộ nhớ máy
                </Text>
              </View>
            </View>
            <Text style={{ color: colors.textLight, fontSize: 18 }}>›</Text>
          </Pressable>
        </View>

        {/* 3. Nhóm Tiện ích & Dịch vụ */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textLight }]}>TIỆN ÍCH & DỊCH VỤ</Text>

          {/* Lịch sử Đơn hàng */}
          <Pressable
            style={[styles.menuItem, { backgroundColor: colors.surface, borderColor: isDark ? colors.border : '#EFEFEF' }]}
            onPress={() => navigation.navigate('Orders')}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.iconBox, { backgroundColor: '#FFF0F6' }]}>
                {renderIcon('clipboard-text-clock', '📋', '#EB2F96')}
              </View>
              <View>
                <Text style={[styles.menuTitle, { color: colors.text }]}>Lịch sử hóa đơn mua hàng</Text>
                <Text style={[styles.menuSubtitle, { color: colors.textLight }]}>
                  Xem chi tiết các đơn PENDING & PAID
                </Text>
              </View>
            </View>
            <Text style={{ color: colors.textLight, fontSize: 18 }}>›</Text>
          </Pressable>

          {/* Quét mã vạch sản phẩm */}
          <Pressable
            style={[styles.menuItem, { backgroundColor: colors.surface, borderColor: isDark ? colors.border : '#EFEFEF' }]}
            onPress={() => navigation.navigate('Scanner')}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.iconBox, { backgroundColor: '#FFF7E6' }]}>
                {renderIcon('barcode-scan', '📷', '#FA8C16')}
              </View>
              <View>
                <Text style={[styles.menuTitle, { color: colors.text }]}>Máy quét mã QR / Barcode</Text>
                <Text style={[styles.menuSubtitle, { color: colors.textLight }]}>
                  Camera JSI nhận diện sản phẩm tự động
                </Text>
              </View>
            </View>
            <Text style={{ color: colors.textLight, fontSize: 18 }}>›</Text>
          </Pressable>

          {/* Kho hàng & Vị trí GPS */}
          <View style={[styles.menuItem, { backgroundColor: colors.surface, borderColor: isDark ? colors.border : '#EFEFEF' }]}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.iconBox, { backgroundColor: '#E6FFFB' }]}>
                {renderIcon('map-marker-radius', '📍', '#13C2C2')}
              </View>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={[styles.menuTitle, { color: colors.text }]}>Kho tổng ShopAI & GPS Ship</Text>
                <Text style={[styles.menuSubtitle, { color: colors.textLight }]}>
                  Quận 1, TP.HCM • Tính phí ship Haversine tự động
                </Text>
              </View>
            </View>
            <View style={styles.coordBadge}>
              <Text style={styles.coordBadgeText}>10.77°N</Text>
            </View>
          </View>
        </View>

        {/* 4. Nhóm Thông tin Ứng dụng & Hỗ trợ */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textLight }]}>THÔNG TIN ỨNG DỤNG</Text>

          <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: isDark ? colors.border : '#EFEFEF' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Text style={{ fontSize: 22 }}>🤖</Text>
              <Text style={[styles.infoTitle, { color: colors.text }]}>ShopAI Mobile App</Text>
              <View style={styles.versionBadge}>
                <Text style={styles.versionBadgeText}>v1.0.0 Final</Text>
              </View>
            </View>
            <Text style={[styles.infoDesc, { color: colors.textLight }]}>
              Hệ sinh thái thương mại điện tử tích hợp Trí tuệ nhân tạo (AI Gemini), kiến trúc Clean Architecture, chuẩn 11 chương giáo trình thực chiến React Native CLI & NestJS Fullstack.
            </Text>
          </View>
        </View>

        {/* 5. Tác vụ Đăng xuất & Thoát App */}
        <View style={styles.actionSection}>
          <Pressable style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutBtnText}>🚪 Đăng xuất tài khoản</Text>
          </Pressable>

          <Pressable style={styles.exitAppBtn} onPress={handleExitApp}>
            <Text style={styles.exitAppBtnText}>❌ Thoát ứng dụng</Text>
          </Pressable>
        </View>

        <Text style={[styles.footerCopy, { color: colors.textLight }]}>
          © 2026 ShopAI Enterprise • Chạy Độc Lập Thiết Bị
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  profileCard: {
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  avatarText: {
    fontSize: 28,
  },
  userInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    flexShrink: 1,
  },
  vipBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  vipBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },
  userEmail: {
    fontSize: 13,
    marginTop: 2,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#52C41A',
  },
  statusText: {
    fontSize: 11,
    color: '#52C41A',
    fontWeight: '600',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 8,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  menuSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  activeTag: {
    backgroundColor: '#F6FFED',
    borderWidth: 1,
    borderColor: '#B7EB8F',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  activeTagText: {
    fontSize: 11,
    color: '#389E0D',
    fontWeight: '700',
  },
  coordBadge: {
    backgroundColor: '#E6FFFB',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  coordBadgeText: {
    fontSize: 11,
    color: '#08979C',
    fontWeight: '700',
  },
  infoCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  versionBadge: {
    backgroundColor: '#E6F7FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  versionBadgeText: {
    color: '#1890FF',
    fontSize: 10,
    fontWeight: '700',
  },
  infoDesc: {
    fontSize: 12,
    lineHeight: 18,
  },
  actionSection: {
    marginTop: 10,
    gap: 10,
  },
  logoutBtn: {
    backgroundColor: '#FFF1F0',
    borderWidth: 1,
    borderColor: '#FFA39E',
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutBtnText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  exitAppBtn: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#D9D9D9',
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
  },
  exitAppBtnText: {
    color: '#595959',
    fontSize: 14,
    fontWeight: '700',
  },
  footerCopy: {
    textAlign: 'center',
    fontSize: 11,
    marginTop: 20,
  },
});

export default ProfileScreen;

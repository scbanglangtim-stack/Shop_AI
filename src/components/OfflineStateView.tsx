// src/components/OfflineStateView.tsx
// Giao diện chuyên dụng hiển thị khi ứng dụng mất kết nối mạng hoặc không thể liên lạc với Database
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { useTheme } from '@contexts/ThemeContext';
import { COLORS, SHADOWS } from '@constants/theme';

interface OfflineStateViewProps {
  onRetry: () => Promise<any> | void;
  message?: string;
}

export const OfflineStateView: React.FC<OfflineStateViewProps> = ({
  onRetry,
  message,
}) => {
  const { colors, isDark } = useTheme();
  const [retrying, setRetrying] = useState(false);

  const handlePressRetry = async () => {
    setRetrying(true);
    try {
      await onRetry();
    } finally {
      setTimeout(() => setRetrying(false), 500);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Thẻ minh họa trạng thái Mất mạng */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: isDark ? '#333333' : '#E5E7EB',
          },
        ]}
      >
        <View style={styles.iconCircle}>
          <Text style={styles.iconText}>📡</Text>
          <View style={styles.crossBadge}>
            <Text style={styles.crossText}>✕</Text>
          </View>
        </View>

        {/* Badge trạng thái */}
        <View style={styles.badge}>
          <View style={styles.dot} />
          <Text style={styles.badgeText}>NGOẠI TUYẾN (OFFLINE)</Text>
        </View>

        <Text style={[styles.title, { color: colors.text }]}>
          Mất kết nối mạng
        </Text>

        <Text style={[styles.desc, { color: colors.textLight }]}>
          {message ||
            'Không thể tải danh sách sản phẩm. Ứng dụng yêu cầu kết nối mạng để đồng bộ dữ liệu thời gian thực từ cơ sở dữ liệu hệ thống.'}
        </Text>

        {/* Khung hướng dẫn khắc phục */}
        <View
          style={[
            styles.guidanceBox,
            {
              backgroundColor: isDark ? '#1F2937' : '#F9FAFB',
              borderColor: isDark ? '#374151' : '#E5E7EB',
            },
          ]}
        >
          <Text style={[styles.guideTitle, { color: colors.text }]}>
            💡 Hướng dẫn kiểm tra:
          </Text>
          <Text style={[styles.guideItem, { color: colors.textLight }]}>
            • Bật Wi-Fi hoặc Dữ liệu di động (4G/5G) trên điện thoại
          </Text>
          <Text style={[styles.guideItem, { color: colors.textLight }]}>
            • Kết nối cùng mạng Wi-Fi với máy tính hoặc cắm cáp USB
          </Text>
          <Text style={[styles.guideItem, { color: colors.textLight }]}>
            • Đảm bảo Backend Server ShopAI đang chạy
          </Text>
        </View>

        {/* Nút Thử lại kết nối */}
        <Pressable
          style={[
            styles.retryButton,
            { backgroundColor: colors.primary },
            retrying && { opacity: 0.7 },
          ]}
          onPress={handlePressRetry}
          disabled={retrying}
        >
          {retrying ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.retryIcon}>🔄</Text>
              <Text style={styles.retryText}>Thử lại kết nối</Text>
            </>
          )}
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 24,
    borderWidth: 1.5,
    padding: 24,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  iconText: {
    fontSize: 40,
  },
  crossBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  crossText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    marginBottom: 12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
    marginRight: 6,
  },
  badgeText: {
    color: '#DC2626',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  desc: {
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  guidanceBox: {
    width: '100%',
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    marginBottom: 20,
  },
  guideTitle: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },
  guideItem: {
    fontSize: 12,
    lineHeight: 18,
    marginVertical: 2,
  },
  retryButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: 14,
    ...SHADOWS.light,
  },
  retryIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default OfflineStateView;

import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useCurrentLocation } from '@hooks/useCurrentLocation';
import {
  DEFAULT_SHIPPING_FEE,
  WAREHOUSE_COORDS,
  getDistanceKm,
  getShippingTier,
} from '@constants/shipping';
import { COLORS, SIZES, SHADOWS } from '@constants/theme';
import { useTheme } from '@contexts/ThemeContext';

const formatVnd = (value: number) => `${value.toLocaleString('vi-VN')}đ`;

const LocationBadge = () => {
  const { coords, loading, error, refresh } = useCurrentLocation();
  const { colors, isDark } = useTheme();

  // --- Trạng thái 1: Đang dò GPS ---
  if (loading) {
    return (
      <View
        style={[
          styles.badge,
          {
            backgroundColor: isDark ? colors.surface : '#F8F9FA',
            borderColor: colors.border,
          },
        ]}
      >
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={[styles.textMuted, { color: colors.textLight }]}>
          {' '}Đang xác định vị trí của bạn...
        </Text>
      </View>
    );
  }

  // --- Trạng thái 2: Lỗi / bị từ chối -> Hạ cấp an toàn (Graceful degradation) ---
  if (error || !coords) {
    return (
      <Pressable
        style={[
          styles.badge,
          {
            backgroundColor: isDark ? colors.surface : '#FFF8E1',
            borderColor: isDark ? colors.border : '#FFE082',
          },
        ]}
        onPress={refresh}
      >
        <Text style={[styles.textMuted, { color: isDark ? colors.text : '#5D4037' }]}>
          📍 {error ?? 'Chưa rõ vị trí'} — tạm tính ship {formatVnd(DEFAULT_SHIPPING_FEE)}
        </Text>
        <Text style={[styles.retry, { color: colors.primary }]}>Thử lại</Text>
      </Pressable>
    );
  }

  // --- Trạng thái 3: Thành công -> tính khoảng cách & bảng giá ship ---
  const distanceKm = getDistanceKm(
    coords.latitude,
    coords.longitude,
    WAREHOUSE_COORDS.latitude,
    WAREHOUSE_COORDS.longitude,
  );
  const tier = getShippingTier(distanceKm);

  return (
    <Pressable
      style={[
        styles.badge,
        styles.badgeSuccess,
        {
          backgroundColor: isDark ? '#1B2E1E' : '#E8F5E9',
          borderColor: isDark ? '#2E7D32' : '#C8E6C9',
        },
      ]}
      onPress={refresh}
    >
      <View style={{ flex: 1 }}>
        <Text style={[styles.title, { color: isDark ? '#A5D6A7' : '#1B5E20' }]}>
          📍 Cách kho {distanceKm.toFixed(1)} km · Ship {formatVnd(tier.fee)}
        </Text>
        <Text style={[styles.subtitle, { color: isDark ? '#C8E6C9' : '#388E3C' }]}>
          {tier.label}
        </Text>
        <Text style={[styles.coords, { color: isDark ? '#81C784' : '#66BB6A' }]}>
          ({coords.latitude.toFixed(4)}, {coords.longitude.toFixed(4)})
        </Text>
      </View>
      <Text style={[styles.retry, { color: isDark ? '#81C784' : '#2E7D32' }]}>Làm mới</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: SIZES.padding,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    ...SHADOWS.light,
  },
  badgeSuccess: {},
  title: { fontSize: 13, fontWeight: '700' },
  subtitle: { fontSize: 12, marginTop: 2 },
  coords: { fontSize: 11, marginTop: 2 },
  textMuted: { fontSize: 13, flex: 1 },
  retry: { fontSize: 12, fontWeight: '700', marginLeft: 8 },
});

export default LocationBadge;

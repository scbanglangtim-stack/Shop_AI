// src/screens/sprint3/HomeScreenSprint3.tsx
// Màn hình nghiệm thu hoàn chỉnh Sprint 3 (Chương 3 - Design System & Hooks)
import React, { useState, useReducer, useCallback } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@contexts/ThemeContext';
import Typography from '@components/ui/Typography';
import ShopInput from '@components/ui/ShopInput';
import ShopButton from '@components/ui/ShopButton';
import { useCountdown } from '@hooks/useCountdown';
import { SIZES } from '@constants/theme';

// Reducer quản lý số lượng giỏ hàng (Chương 3.3 mục 2 & Sprint 3 Step 6.5)
type CartAction = { type: 'ADD' } | { type: 'REMOVE' } | { type: 'RESET' };

const cartReducer = (state: number, action: CartAction): number => {
  switch (action.type) {
    case 'ADD':
      return state + 1;
    case 'REMOVE':
      return Math.max(1, state - 1);
    case 'RESET':
      return 1;
    default:
      return state;
  }
};

const HomeScreenSprint3 = () => {
  const { colors, isDark, toggleTheme } = useTheme();
  const [coupon, setCoupon] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [quantity, dispatchQty] = useReducer(cartReducer, 1);

  // Hook đếm ngược Flash Sale 3 phút (180 giây)
  const { formattedTime, isFinished, reset } = useCountdown(180);

  const handleApplyCoupon = useCallback(() => {
    if (!coupon.trim()) {
      setCouponError('Vui lòng nhập mã giảm giá trước khi áp dụng');
      return;
    }
    setCouponError('');
    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
      if (coupon.toUpperCase() === 'SHOPAI50') {
        Alert.alert('Thành công', 'Đã áp dụng mã giảm giá 50%!');
      } else {
        setCouponError('Mã giảm giá không hợp lệ (Thử: SHOPAI50)');
      }
    }, 1000);
  }, [coupon]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header với Theme Switcher */}
        <View style={styles.headerRow}>
          <View>
            <Typography variant="h1" color={colors.primary}>
              ShopAI UI Kit
            </Typography>
            <Typography variant="caption" color={colors.textLight}>
              Design System & Hooks (Sprint 3)
            </Typography>
          </View>

          <ShopButton
            title={isDark ? '☀️ Sáng' : '🌙 Tối'}
            variant="outline"
            onPress={toggleTheme}
            style={styles.themeBtn}
          />
        </View>

        {/* 1. Flash Sale Banner với Custom Hook useCountdown */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.flashHeader}>
            <Typography variant="h2" color={colors.primary}>
              ⚡ FLASH SALE HÔM NAY
            </Typography>
            <Typography variant="h3" color={isFinished ? colors.textLight : '#E67E22'}>
              {isFinished ? 'ĐÃ HẾT GIỜ' : `⏳ ${formattedTime}`}
            </Typography>
          </View>

          <Typography variant="body" color={colors.text} style={styles.cardDesc}>
            Tai nghe không dây Bluetooth Pro chống ồn cao cấp
          </Typography>

          <View style={styles.priceRow}>
            <Typography variant="h2" color={colors.primary}>
              1.490.000 đ
            </Typography>
            <Typography variant="body" color={colors.textLight} style={styles.oldPrice}>
              2.990.000 đ
            </Typography>
          </View>

          {/* Bộ đếm số lượng bằng useReducer */}
          <View style={styles.qtyContainer}>
            <Typography variant="body" color={colors.text}>
              Số lượng:
            </Typography>
            <View style={styles.qtyRow}>
              <ShopButton
                title="−"
                variant="secondary"
                onPress={() => dispatchQty({ type: 'REMOVE' })}
                style={styles.qtyBtn}
              />
              <Typography variant="h3" color={colors.text} style={styles.qtyText}>
                {quantity}
              </Typography>
              <ShopButton
                title="+"
                variant="secondary"
                onPress={() => dispatchQty({ type: 'ADD' })}
                style={styles.qtyBtn}
              />
            </View>
          </View>

          <ShopButton
            title={
              isFinished
                ? 'Hết thời gian Flash Sale'
                : `Mua ngay • ${(1490000 * quantity).toLocaleString('vi-VN')} đ`
            }
            disabled={isFinished}
            onPress={() => Alert.alert('Thành công', `Đã đặt mua ${quantity} sản phẩm!`)}
            style={styles.buyBtn}
          />

          {isFinished && (
            <ShopButton
              title="Khởi động lại Flash Sale"
              variant="outline"
              onPress={reset}
              style={{ marginTop: 8 }}
            />
          )}
        </View>

        {/* 2. Áp dụng Voucher với Atom ShopInput */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Typography variant="h3" color={colors.text} style={{ marginBottom: 12 }}>
            🎁 Mã khuyến mãi Voucher
          </Typography>
          <ShopInput
            label="Nhập mã ưu đãi"
            placeholder="Ví dụ: SHOPAI50"
            value={coupon}
            onChangeText={setCoupon}
            error={couponError}
          />
          <ShopButton
            title="Áp dụng mã giảm giá"
            variant="secondary"
            loading={isApplying}
            onPress={handleApplyCoupon}
          />
        </View>

        {/* 3. Bảng minh chứng Typography Design System */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Typography variant="h3" color={colors.text} style={{ marginBottom: 8 }}>
            📐 Bảng Typography Tokens
          </Typography>
          <Typography variant="h1" color={colors.text}>
            Heading 1 (28px Bold)
          </Typography>
          <Typography variant="h2" color={colors.text}>
            Heading 2 (22px Bold)
          </Typography>
          <Typography variant="h3" color={colors.text}>
            Heading 3 (18px Bold)
          </Typography>
          <Typography variant="body" color={colors.text}>
            Body Text (14px Regular)
          </Typography>
          <Typography variant="caption" color={colors.textLight}>
            Caption Text (12px Muted)
          </Typography>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: SIZES.padding, paddingBottom: 40 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  themeBtn: {
    height: 40,
    paddingHorizontal: 16,
  },
  card: {
    borderRadius: SIZES.radius,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    elevation: 3,
  },
  flashHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardDesc: {
    marginVertical: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 8,
  },
  oldPrice: {
    textDecorationLine: 'line-through',
  },
  qtyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F0F0F0',
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyBtn: {
    width: 38,
    height: 38,
    paddingHorizontal: 0,
    borderRadius: 8,
  },
  qtyText: {
    marginHorizontal: 16,
    minWidth: 20,
    textAlign: 'center',
  },
  buyBtn: {
    marginTop: 6,
  },
});

export default HomeScreenSprint3;

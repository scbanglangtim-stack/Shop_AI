// src/screens/CheckoutScreen.tsx
// Màn hình Thanh toán hoàn thiện vòng lặp mua sắm bằng useMutation (Chương 6.5 & Sprint 6 Step 9.5)
import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ShopButton from '@components/ShopButton';
import { useCartStore, CartItem } from '@store/useCartStore';
import { useOrderStore } from '@store/useOrderStore';
import { COLORS, SIZES } from '@constants/theme';
import { logCrashlytics, recordCrashlyticsError, setCrashlyticsAttributes } from '@services/crashlyticsService';
import { APP_ENV, API_BASE_URL } from '@constants/env';

import axiosClient from '@api/axiosClient';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

interface CreateOrderResponse {
  id: string;
  status: string;
  total: number;
  createdAt: string;
}

const placeOrderAPI = async (items: CartItem[], total: number): Promise<CreateOrderResponse> => {
  const response = await axiosClient.post('/api/orders', {
    items: items.map((item) => ({ productId: item.id, quantity: item.quantity })),
    total,
  });
  return response.data;
};

const CheckoutScreen = () => {
  const navigation = useNavigation<any>();
  const queryClient = useQueryClient();
  const items = useCartStore((state) => state.items);
  const totalQuantity = useCartStore((state) => state.totalQuantity());
  const totalPrice = useCartStore((state) => state.totalPrice());
  const clearCart = useCartStore((state) => state.clearCart);
  const addOrder = useOrderStore((state) => state.addOrder);

  // useMutation: Hành động GHI dữ liệu — gọi API NestJS /api/orders
  const { mutate, isPending, isError, isSuccess, data, error } = useMutation({
    mutationFn: () => placeOrderAPI(items, totalPrice),
    onSuccess: (res) => {
      // 1. Thêm vào Lịch sử đơn hàng với trạng thái PENDING
      addOrder({
        id: res.id,
        items: [...items],
        total: res.total,
        status: res.status as any,
        createdAt: res.createdAt,
      });

      // 2. Làm rỗng giỏ hàng CHỈ KHI Server xác nhận thành công (Bước 9c)
      clearCart();

      // 3. Invalidate cache đơn hàng và sản phẩm
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['productsList'] });

      // Ghi nhận log thành công
      logCrashlytics(`Checkout: đặt hàng THÀNH CÔNG, orderId = ${res.id}`);

      // 4. Tự động đóng modal và điều hướng về sau 1.5s
      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    },
    onError: (err: any) => {
      console.error('❌ Đặt hàng thất bại:', err?.response?.data || err?.message);
      // Ghi nhận Non-Fatal cho đội DevOps (Chương 10 - Bước 4b)
      const errorMsg = err?.response?.data?.message || err?.message || 'Checkout failed';
      logCrashlytics(`Checkout: đặt hàng THẤT BẠI - ${errorMsg}`);
      recordCrashlyticsError(err instanceof Error ? err : new Error(errorMsg), 'CheckoutOrderFailed');
    },
  });

  const handleConfirmOrder = () => {
    // Breadcrumb: rắc vụn bánh mì TRƯỚC khi gọi API
    logCrashlytics(`Checkout: bắt đầu đặt hàng, ${items.length} loại sản phẩm`);
    // Custom Keys: gắn bối cảnh môi trường và giỏ hàng
    setCrashlyticsAttributes({
      screen: 'CheckoutScreen',
      cart_item_count: String(items.length),
      cart_total: String(totalPrice),
      app_env: APP_ENV,
      api_base_url: API_BASE_URL,
    });
    mutate();
  };

  if (isSuccess) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerBox}>
          <Text style={styles.successIcon}>🎉</Text>
          <Text style={styles.successTitle}>Đặt hàng thành công!</Text>
          <Text style={styles.successCode}>Mã đơn hàng: {data?.id}</Text>
          <Text style={styles.successStatus}>Trạng thái: PENDING (Chờ thanh toán)</Text>
          <Text style={styles.successHint}>Đơn hàng đã được lưu vào Lịch sử đơn hàng.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Xác nhận Đơn hàng</Text>
        <Text style={styles.subtitle}>Kiểm tra thông tin trước khi hoàn tất đặt hàng</Text>

        {/* Bảng tóm tắt sản phẩm */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Danh sách món hàng ({totalQuantity})</Text>
          {items.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <Text style={styles.itemName} numberOfLines={1}>
                {item.name} x {item.quantity}
              </Text>
              <Text style={styles.itemPrice}>
                {formatCurrency(item.price * item.quantity)}
              </Text>
            </View>
          ))}
        </View>

        {/* Bảng tổng kết chi phí */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Chi tiết thanh toán</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tạm tính</Text>
            <Text style={styles.summaryVal}>{formatCurrency(totalPrice)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Phí giao hàng</Text>
            <Text style={[styles.summaryVal, { color: COLORS.success }]}>Miễn phí</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Tổng thanh toán</Text>
            <Text style={styles.totalVal}>{formatCurrency(totalPrice)}</Text>
          </View>
        </View>

        {isError && (
          <Text style={styles.errorText}>
            {(error as any)?.response?.data?.message
              ? (Array.isArray((error as any).response.data.message)
                  ? (error as any).response.data.message.join(', ')
                  : (error as any).response.data.message)
              : 'Đặt hàng thất bại — vui lòng kiểm tra kết nối mạng và thử lại!'}
          </Text>
        )}

        {isPending ? (
          <View style={{ marginTop: 24, alignItems: 'center' }}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={{ marginTop: 8, color: COLORS.textLight }}>Đang tạo đơn hàng...</Text>
          </View>
        ) : (
          <ShopButton
            title="Xác nhận đặt hàng"
            onPress={handleConfirmOrder}
            disabled={totalQuantity === 0}
            style={styles.confirmBtn}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: SIZES.padding, paddingBottom: 40 },
  title: { fontSize: SIZES.h1, fontWeight: 'bold', color: COLORS.text },
  subtitle: { fontSize: SIZES.body2, color: COLORS.textLight, marginTop: 4, marginBottom: 20 },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ECECEC',
  },
  cardTitle: { fontSize: SIZES.h3, fontWeight: '700', color: COLORS.text, marginBottom: 12 },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  itemName: { flex: 1, fontSize: 14, color: COLORS.text, paddingRight: 8 },
  itemPrice: { fontSize: 14, fontWeight: '600', color: COLORS.primary },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  summaryLabel: { fontSize: 14, color: COLORS.textLight },
  summaryVal: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  totalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#ECECEC',
  },
  totalLabel: { fontSize: SIZES.body1, fontWeight: 'bold', color: COLORS.text },
  totalVal: { fontSize: SIZES.h2, fontWeight: 'bold', color: COLORS.primary },
  confirmBtn: { marginTop: 16 },
  errorText: { color: COLORS.error, textAlign: 'center', marginTop: 16, fontSize: 14 },
  centerBox: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SIZES.padding },
  successIcon: { fontSize: 64, marginBottom: 16 },
  successTitle: { fontSize: SIZES.h1, fontWeight: 'bold', color: COLORS.success, textAlign: 'center' },
  successCode: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginTop: 8 },
  successStatus: { fontSize: 14, color: '#E67E22', fontWeight: '600', marginTop: 4 },
  successHint: { fontSize: 13, color: COLORS.textLight, marginTop: 12, textAlign: 'center' },
});

export default CheckoutScreen;

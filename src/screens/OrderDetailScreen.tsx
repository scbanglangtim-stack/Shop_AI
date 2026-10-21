// src/screens/OrderDetailScreen.tsx
// Màn hình Chi tiết Hóa đơn & Thanh toán giả lập kết nối NestJS Backend (Chương 9 - Bước 9f.2)
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient from '@api/axiosClient';
import ShopButton from '@components/ShopButton';
import { COLORS, SIZES, SHADOWS } from '@constants/theme';
import { formatCurrency } from '@utils/formatCurrency';

interface BackendOrderDetail {
  id: string;
  userId: string;
  total: number;
  status: string;
  createdAt: string;
  items: Array<{
    id?: string;
    productId: string;
    quantity: number;
    price: number;
    name?: string;
  }>;
}

const OrderDetailScreen = () => {
  const route = useRoute<any>();
  const { orderId } = route.params;
  const queryClient = useQueryClient();

  // 1. Fetch chi tiết đơn hàng từ Server NestJS
  const { data: order, isLoading, isError } = useQuery<BackendOrderDetail>({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const res = await axiosClient.get(`/api/orders/${orderId}`);
      return res.data;
    },
  });

  // 2. Mutation thanh toán đơn hàng (Chuyển PENDING -> PAID trên SQLite qua Prisma)
  const payMutation = useMutation({
    mutationFn: async () => {
      const res = await axiosClient.post(`/api/orders/${orderId}/pay`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', orderId] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      Alert.alert('✅ Thành công', 'Đơn hàng đã được thanh toán thành công (Chuyển sang PAID)!');
    },
    onError: (err: any) => {
      Alert.alert('❌ Lỗi', err?.response?.data?.message || 'Thanh toán thất bại');
    },
  });

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Đang tải chi tiết đơn hàng từ NestJS...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !order) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.missing}>Không tìm thấy đơn hàng: {orderId}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isPaid = order.status === 'PAID';

  return (
    <SafeAreaView style={styles.safe} edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Thẻ thông tin chung */}
        <View style={styles.card}>
          <View style={styles.badgeRow}>
            <Text style={styles.heading}>HÓA ĐƠN ĐƠN HÀNG</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: isPaid ? '#E8F8F5' : '#FEF9E7' },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  { color: isPaid ? COLORS.success : '#D68910' },
                ]}
              >
                {isPaid ? '✓ ĐÃ THANH TOÁN' : '⏳ PENDING (CHỜ THANH TOÁN)'}
              </Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Mã đơn hàng:</Text>
            <Text style={styles.metaVal}>{order.id}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Thời gian tạo:</Text>
            <Text style={styles.metaVal}>{new Date(order.createdAt).toLocaleString('vi-VN')}</Text>
          </View>
        </View>

        {/* Danh sách các món trong hóa đơn */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Chi tiết các sản phẩm</Text>
          {order.items?.map((it, idx) => (
            <View key={it.id || `${it.productId}_${idx}`} style={styles.itemRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>{it.name || it.productId}</Text>
                <Text style={styles.itemQuantity}>
                  {formatCurrency(it.price)} x {it.quantity}
                </Text>
              </View>
              <Text style={styles.itemTotal}>
                {formatCurrency(it.price * it.quantity)}
              </Text>
            </View>
          ))}

          <View style={styles.totalBlock}>
            <Text style={styles.totalLabel}>Tổng tiền hóa đơn:</Text>
            <Text style={styles.totalValue}>{formatCurrency(order.total)}</Text>
          </View>
        </View>

        {/* Nút hành động thanh toán giả lập */}
        <View style={styles.actionBlock}>
          {!isPaid ? (
            <ShopButton
              title="💳 Thanh toán giả lập (→ PAID)"
              onPress={() => payMutation.mutate()}
              isLoading={payMutation.isPending}
              style={styles.payBtn}
            />
          ) : (
            <View style={styles.paidNotice}>
              <Text style={styles.paidNoticeText}>
                🎉 Đơn hàng đã được thanh toán hoàn tất. Cảm ơn bạn đã mua hàng tại ShopAI!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: SIZES.padding, paddingBottom: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SIZES.padding },
  missing: { fontSize: SIZES.body1, color: COLORS.danger, fontWeight: '600' },
  loadingText: { marginTop: 12, fontSize: SIZES.body2, color: COLORS.textLight },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ECECEC',
    ...SHADOWS.light,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    paddingBottom: 12,
  },
  heading: { fontSize: 16, fontWeight: '800', color: COLORS.text },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 11, fontWeight: '800' },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  metaLabel: { fontSize: 13, color: COLORS.textLight },
  metaVal: { fontSize: 13, fontWeight: '600', color: COLORS.text },
  sectionTitle: {
    fontSize: SIZES.h3,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F9F9',
  },
  itemName: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 2 },
  itemQuantity: { fontSize: 12, color: COLORS.textLight },
  itemTotal: { fontSize: 14, fontWeight: '700', color: COLORS.primary },
  totalBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1.5,
    borderTopColor: '#ECECEC',
  },
  totalLabel: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  totalValue: { fontSize: 18, fontWeight: '800', color: COLORS.primary },
  actionBlock: { marginTop: 8 },
  payBtn: { backgroundColor: COLORS.primary, height: 48 },
  paidNotice: {
    backgroundColor: '#E8F8F5',
    padding: 16,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: '#A3E4D7',
  },
  paidNoticeText: {
    color: '#0E6655',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default OrderDetailScreen;

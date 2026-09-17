// src/screens/OrderDetailScreen.tsx
// Màn hình Chi tiết Hóa đơn & Thanh toán giả lập (Chương 6.10 & Sprint 6 Step 9.6)
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import ShopButton from '@components/ShopButton';
import { useOrderStore } from '@store/useOrderStore';
import { COLORS, SIZES, SHADOWS } from '@constants/theme';

const formatCurrency = (v: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

const OrderDetailScreen = () => {
  const route = useRoute<any>();
  const { orderId } = route.params;
  const order = useOrderStore((state) => state.getById(orderId));
  const markPaid = useOrderStore((state) => state.markPaid);

  if (!order) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.missing}>Không tìm thấy đơn hàng: {orderId}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isPaid = order.status === 'PAID';

  const handlePayNow = () => {
    markPaid(order.id);
    Alert.alert('✅ Thành công', 'Đơn hàng đã được thanh toán thành công (Chuyển sang PAID)!');
  };

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
          {order.items.map((it) => (
            <View key={it.id} style={styles.itemRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>{it.name}</Text>
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
              onPress={handlePayNow}
              style={styles.payBtn}
            />
          ) : (
            <View style={styles.paidNotice}>
              <Text style={styles.paidText}>🎉 Đơn hàng này đã thanh toán đầy đủ!</Text>
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
  card: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: SIZES.radius,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ECECEC',
    ...SHADOWS.light,
  },
  heading: { fontSize: 16, fontWeight: '800', color: COLORS.primary },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 11, fontWeight: '700' },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  metaLabel: { fontSize: 13, color: COLORS.textLight },
  metaVal: { fontSize: 13, fontWeight: '600', color: COLORS.text },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 12 },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  itemName: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  itemQuantity: { fontSize: 12, color: COLORS.textLight, marginTop: 2 },
  itemTotal: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  totalBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#ECECEC',
  },
  totalLabel: { fontSize: SIZES.body1, fontWeight: 'bold', color: COLORS.text },
  totalValue: { fontSize: SIZES.h2, fontWeight: 'bold', color: COLORS.primary },
  actionBlock: { marginTop: 8 },
  payBtn: { height: 48 },
  paidNotice: {
    backgroundColor: '#E8F8F5',
    padding: 16,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.success,
  },
  paidText: { color: COLORS.success, fontWeight: '700', fontSize: 14 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  missing: { color: COLORS.error, fontSize: 16, fontWeight: '600' },
});

export default OrderDetailScreen;

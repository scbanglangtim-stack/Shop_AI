// src/screens/OrdersScreen.tsx
// Màn hình Lịch sử Đơn hàng (Chương 6.10 & Sprint 6 Step 9.6)
import React from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useOrderStore, OrderRecord } from '@store/useOrderStore';
import { COLORS, SIZES, SHADOWS } from '@constants/theme';
import ShopButton from '@components/ShopButton';

const formatCurrency = (v: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

const OrdersScreen = () => {
  const navigation = useNavigation<any>();
  const orders = useOrderStore((state) => state.orders);

  const renderOrderItem = ({ item }: { item: OrderRecord }) => {
    const isPaid = item.status === 'PAID';
    return (
      <Pressable
        style={styles.orderCard}
        onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.orderId}>📦 {item.id}</Text>
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
              {isPaid ? '✓ ĐÃ THANH TOÁN' : '⏳ CHỜ THANH TOÁN'}
            </Text>
          </View>
        </View>

        <Text style={styles.itemCount}>
          Gồm {item.items.reduce((s, i) => s + i.quantity, 0)} sản phẩm ({item.items.map(i => i.name).slice(0, 2).join(', ')}{item.items.length > 2 ? '...' : ''})
        </Text>

        <View style={styles.cardFooter}>
          <Text style={styles.orderDate}>
            {new Date(item.createdAt).toLocaleString('vi-VN')}
          </Text>
          <Text style={styles.orderTotal}>{formatCurrency(item.total)}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Đơn hàng của tôi</Text>
      </View>

      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyTitle}>Chưa có đơn hàng nào</Text>
          <Text style={styles.emptySubtitle}>
            Các đơn hàng bạn đặt từ giỏ hàng sẽ xuất hiện đầy đủ tại đây!
          </Text>
          <ShopButton
            title="Mua sắm ngay"
            onPress={() => navigation.navigate('HomeTab')}
            style={{ marginTop: 20, width: 180 }}
          />
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: 14,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: { fontSize: SIZES.h2, fontWeight: 'bold', color: COLORS.text },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding * 2,
  },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: SIZES.h2, fontWeight: 'bold', color: COLORS.text },
  emptySubtitle: {
    fontSize: SIZES.body2,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  list: { padding: SIZES.padding, paddingBottom: 32 },
  orderCard: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: SIZES.radius,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ECECEC',
    ...SHADOWS.light,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderId: { fontSize: SIZES.body1, fontWeight: 'bold', color: COLORS.text },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: { fontSize: 11, fontWeight: '700' },
  itemCount: { fontSize: 13, color: COLORS.textLight, marginBottom: 12 },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
    paddingTop: 10,
  },
  orderDate: { fontSize: 12, color: COLORS.textLight },
  orderTotal: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary },
});

export default OrdersScreen;

// src/screens/OrdersScreen.tsx
// Màn hình Lịch sử Đơn hàng kết nối NestJS Backend thật (Chương 9 - Bước 9f)
import React from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import axiosClient from '@api/axiosClient';
import { COLORS, SIZES, SHADOWS } from '@constants/theme';
import ShopButton from '@components/ShopButton';
import { formatCurrency } from '@utils/formatCurrency';

interface BackendOrderItem {
  productId: string;
  quantity: number;
  price: number;
}

interface BackendOrder {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  items: BackendOrderItem[];
}

const OrdersScreen = () => {
  const navigation = useNavigation<any>();

  // Fetch danh sách đơn hàng của User đang đăng nhập qua API NestJS
  const {
    data: orders = [],
    isLoading,
    isRefetching,
    refetch,
  } = useQuery<BackendOrder[]>({
    queryKey: ['orders'],
    queryFn: async () => {
      const res = await axiosClient.get('/api/orders');
      return res.data;
    },
  });

  const renderOrderItem = ({ item }: { item: BackendOrder }) => {
    const isPaid = item.status === 'PAID';
    const totalItems = item.items?.reduce((s, i) => s + i.quantity, 0) || 0;

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
          Gồm {totalItems} sản phẩm ({item.items?.map((i) => i.productId).slice(0, 2).join(', ') || ''}
          {item.items && item.items.length > 2 ? '...' : ''})
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

      {isLoading && !isRefetching ? (
        <View style={styles.centerLoading}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Đang tải đơn hàng từ NestJS...</Text>
        </View>
      ) : orders.length === 0 ? (
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
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={() => {
                refetch();
              }}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
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
  centerLoading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: SIZES.body2, color: COLORS.textLight },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding * 2,
  },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: SIZES.h2, fontWeight: 'bold', color: COLORS.text, textAlign: 'center' },
  emptySubtitle: {
    fontSize: SIZES.body2,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  list: { padding: SIZES.padding },
  orderCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: 14,
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
  orderId: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: { fontSize: 11, fontWeight: '800' },
  itemCount: { fontSize: 13, color: COLORS.textLight, marginBottom: 10 },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
    paddingTop: 8,
  },
  orderDate: { fontSize: 12, color: COLORS.textLight },
  orderTotal: { fontSize: 15, fontWeight: '800', color: COLORS.primary },
});

export default OrdersScreen;

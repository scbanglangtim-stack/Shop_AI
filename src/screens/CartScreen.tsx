// src/screens/CartScreen.tsx
// Màn hình Giỏ hàng hoàn thiện kết nối Zustand Store & Persist (Chương 6.3 & 6.9)
import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useCartStore } from '@store/useCartStore';
import ShopButton from '@components/ShopButton';
import { COLORS, SIZES } from '@constants/theme';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

const CartScreen = () => {
  const navigation = useNavigation<any>();
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const totalPrice = useCartStore((state) => state.totalPrice());

  // TRẠNG THÁI TRỐNG (Empty State)
  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>Giỏ hàng của bạn đang trống</Text>
          <Text style={styles.emptySubtitle}>
            Hãy khám phá các sản phẩm công nghệ tuyệt vời và thêm vào giỏ ngay nhé!
          </Text>
          <ShopButton
            title="Khám phá ngay"
            onPress={() => navigation.navigate('HomeTab')}
            style={{ marginTop: 24, width: 200 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Giỏ hàng ({items.length})</Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: SIZES.padding }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.itemPrice}>
                {formatCurrency(item.price)}
              </Text>
              {/* Nút tăng/giảm số lượng */}
              <View style={styles.qtyRow}>
                <ShopButton
                  title="−"
                  variant="outline"
                  onPress={() => updateQuantity(item.id, item.quantity - 1)}
                  style={styles.qtyBtn}
                  textStyle={{ fontSize: 14 }}
                />
                <Text style={styles.qtyText}>{item.quantity}</Text>
                <ShopButton
                  title="+"
                  variant="outline"
                  onPress={() => updateQuantity(item.id, item.quantity + 1)}
                  style={styles.qtyBtn}
                  textStyle={{ fontSize: 14 }}
                />
              </View>
            </View>

            <View style={styles.itemRight}>
              <Text style={styles.itemSubtotal}>
                {formatCurrency(item.price * item.quantity)}
              </Text>
              <ShopButton
                title="Xóa"
                onPress={() => removeItem(item.id)}
                style={styles.deleteBtn}
                textStyle={{ fontSize: 11 }}
              />
            </View>
          </View>
        )}
      />

      {/* Footer Thanh toán */}
      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Tổng thanh toán:</Text>
          <Text style={styles.totalValue}>{formatCurrency(totalPrice)}</Text>
        </View>
        <ShopButton
          title="Tiến hành Thanh toán"
          onPress={() => navigation.navigate('Checkout')}
          style={styles.checkoutBtn}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
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
  emptyTitle: { fontSize: SIZES.h2, fontWeight: 'bold', color: COLORS.text, textAlign: 'center' },
  emptySubtitle: {
    fontSize: SIZES.body2,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ECECEC',
  },
  itemName: { fontSize: SIZES.body1, color: COLORS.text, fontWeight: '600' },
  itemPrice: { fontSize: SIZES.body2, color: COLORS.textLight, marginTop: 2 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 8 },
  qtyBtn: { width: 32, height: 32, paddingHorizontal: 0, borderRadius: 6 },
  qtyText: { fontSize: 14, fontWeight: '700', minWidth: 24, textAlign: 'center', color: COLORS.text },
  itemRight: { alignItems: 'flex-end', marginLeft: 12 },
  itemSubtotal: { fontSize: SIZES.body1, fontWeight: '700', color: COLORS.primary, marginBottom: 8 },
  deleteBtn: { width: 56, height: 28, backgroundColor: COLORS.error, paddingHorizontal: 0, borderRadius: 6 },
  footer: {
    padding: SIZES.padding,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: '#ECECEC',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  totalLabel: { fontSize: SIZES.body1, color: COLORS.text },
  totalValue: { fontSize: SIZES.h2, fontWeight: 'bold', color: COLORS.primary },
  checkoutBtn: { height: 48 },
});

export default CartScreen;

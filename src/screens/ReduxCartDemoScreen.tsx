// src/screens/ReduxCartDemoScreen.tsx
// Màn hình Demo bắt buộc đề cương: Redux Toolkit Cart (Chương 6.4 & Đề cương 5.2.3 - 5.2.4)
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { addItem, removeItem, clearCart } from '@store/redux/cartSlice';
import type { ReduxRootState } from '@store/redux/store';
import ShopButton from '@components/ShopButton';
import { COLORS, SIZES } from '@constants/theme';

const formatCurrency = (v: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

const ReduxCartDemoScreen = () => {
  const items = useSelector((state: ReduxRootState) => state.cartRedux.items);
  const dispatch = useDispatch();

  const handleAddSample = () => {
    dispatch(
      addItem({
        id: `sample_${Date.now()}`,
        name: 'Sản phẩm Test Redux Toolkit',
        price: 299000,
        image: 'https://picsum.photos/400/400',
      })
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>[Đề Cương 5.2] Redux Toolkit Demo</Text>
        <Text style={styles.subtitle}>
          Mô hình useSelector & useDispatch song song với Zustand Production
        </Text>

        <View style={styles.btnRow}>
          <ShopButton
            title="➕ Thêm SP mẫu vào Redux"
            onPress={handleAddSample}
            style={styles.addBtn}
          />
          {items.length > 0 && (
            <ShopButton
              title="Xóa hết"
              variant="outline"
              onPress={() => dispatch(clearCart())}
              style={styles.clearBtn}
            />
          )}
        </View>

        {items.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Chưa có sản phẩm trong Redux Store.</Text>
          </View>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.price}>
                    {formatCurrency(item.price)} x {item.quantity}
                  </Text>
                </View>
                <ShopButton
                  title="Xóa"
                  onPress={() => dispatch(removeItem(item.id))}
                  style={styles.deleteBtn}
                  textStyle={{ fontSize: 12 }}
                />
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, padding: SIZES.padding },
  title: { fontSize: SIZES.h2, fontWeight: 'bold', color: COLORS.primary },
  subtitle: { fontSize: SIZES.body2, color: COLORS.textLight, marginTop: 4, marginBottom: 16 },
  btnRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  addBtn: { flex: 1, height: 40 },
  clearBtn: { width: 100, height: 40 },
  emptyBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: COLORS.textLight, fontSize: SIZES.body1 },
  list: { paddingBottom: 24 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: SIZES.radius,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  name: { fontSize: SIZES.body2, fontWeight: '600', color: COLORS.text },
  price: { fontSize: SIZES.body2, color: COLORS.primary, marginTop: 4 },
  deleteBtn: { width: 64, height: 32, backgroundColor: COLORS.error },
});

export default ReduxCartDemoScreen;

// src/screens/CartScreen.tsx
// Màn hình Giỏ hàng Placeholder (sẽ hoàn thiện toàn diện với Zustand ở Chương 6)
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '@constants/theme';
import ShopButton from '@components/ShopButton';

const CartScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.emoji}>🛒</Text>
        <Text style={styles.title}>Giỏ hàng của bạn</Text>
        <Text style={styles.subtitle}>
          Tính năng Giỏ hàng thật & Zustand Global State sẽ được hoàn thiện ở Chương 6.
        </Text>
        <ShopButton
          title="Tiếp tục mua sắm"
          variant="outline"
          onPress={() => {}}
          style={styles.continueBtn}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding * 2,
  },
  emoji: {
    fontSize: 56,
    marginBottom: 16,
  },
  title: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: SIZES.body2,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
    lineHeight: 20,
  },
  continueBtn: {
    width: 200,
  },
});

export default CartScreen;

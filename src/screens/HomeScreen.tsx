// src/screens/HomeScreen.tsx
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import ProductCard from '@components/ProductCard';
import { MOCK_PRODUCTS } from '@data/mockProducts';

const HomeScreen = () => {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      // Giả lập làm mới dữ liệu
      setProducts([...MOCK_PRODUCTS].sort(() => Math.random() - 0.5));
      setRefreshing(false);
    }, 1200);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        {/* Header AppBar chuẩn ảnh minh chứng: Có nút Back và Tiêu đề "Khám phá" */}
        <View style={styles.header}>
          <Pressable style={styles.backBtn} hitSlop={12}>
            <Text style={styles.backIcon}>‹</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Khám phá</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Lưới sản phẩm FlashList 2 cột */}
        <FlashList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ProductCard product={item} />}
          numColumns={2}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  backBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  backIcon: {
    fontSize: 32,
    color: '#333333',
    fontWeight: '300',
    marginTop: -4,
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  headerRight: {
    width: 36,
  },
  listContent: {
    paddingHorizontal: 6,
    paddingTop: 10,
    paddingBottom: 24,
  },
});

export default HomeScreen;

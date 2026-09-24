// src/screens/HomeScreen.tsx
// Màn hình Trang Chủ ShopAI - Phân trang useInfiniteQuery, Zod Schema & Zustand (Chương 6)
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  RefreshControl,
  Pressable,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useInfiniteQuery } from '@tanstack/react-query';
import { FlashList } from '@shopify/flash-list';
import { useTheme } from '@contexts/ThemeContext';
import Typography from '@components/ui/Typography';
import ShopButton from '@components/ShopButton';
import ProductCard from '@components/ProductCard';
import LocationBadge from '@components/LocationBadge';
import { useCountdown } from '@hooks/useCountdown';
import { COLORS, SIZES, SHADOWS } from '@constants/theme';
import { useAuthStore } from '@store/useAuthStore';
import { useCartStore } from '@store/useCartStore';
import { Product, ProductListSchema } from '../types/product.schema';

import { MOCK_PRODUCTS } from '@data/mockProducts';

const CATEGORIES = ['Tất cả', 'Điện thoại', 'Tai nghe', 'Đồng hồ', 'Phụ kiện'];
const PAGE_SIZE = 10;
const TOTAL_MOCK_PRODUCTS = 47;

interface ProductPage {
  items: Product[];
  nextPage: number | null;
}

class ZodValidationError extends Error { }
class NetworkError extends Error { }

const fetchProductsPage = async ({ pageParam = 1 }: { pageParam?: number }): Promise<ProductPage> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Giả lập ngẫu nhiên ~5% khả năng mất kết nối mạng để kiểm thử UI lỗi
      if (Math.random() < 0.05) {
        reject(new NetworkError('Mất kết nối mạng, vui lòng thử lại!'));
        return;
      }

      const start = (pageParam - 1) * PAGE_SIZE;
      const rawItems = Array.from({ length: PAGE_SIZE })
        .map((_, i) => {
          const index = start + i;
          if (index >= TOTAL_MOCK_PRODUCTS) return null;
          const sample = MOCK_PRODUCTS[index % MOCK_PRODUCTS.length];
          const verSuffix = index >= MOCK_PRODUCTS.length ? ` (Bản Gen ${Math.floor(index / MOCK_PRODUCTS.length) + 1})` : '';
          return {
            id: `prod_${index + 1}`,
            name: `${sample.name}${verSuffix}`,
            price: sample.price + (Math.floor(index / MOCK_PRODUCTS.length) * 50000),
            image: sample.image,
            category: sample.category,
            rating: sample.rating,
            discount: index % 2 === 0,
          };
        })
        .filter((item): item is NonNullable<typeof item> => item !== null);

      // TRẠM KIỂM SOÁT ZOD SCHEMA
      const result = ProductListSchema.safeParse(rawItems);
      if (!result.success) {
        console.error('❌ Zod chặn dữ liệu bẩn từ API:', result.error.format());
        reject(new ZodValidationError('Dữ liệu sản phẩm không hợp lệ (Zod validation failed)!'));
        return;
      }

      const hasMore = start + PAGE_SIZE < TOTAL_MOCK_PRODUCTS;
      resolve({
        items: result.data,
        nextPage: hasMore ? pageParam + 1 : null,
      });
    }, 600);
  });
};

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { colors, isDark, toggleTheme } = useTheme();
  const logout = useAuthStore((state) => state.logout);
  const totalQuantity = useCartStore((state) => state.totalQuantity());

  // Nhận mã vạch trả về từ ScannerScreen (Sprint 7)
  const scannedCode = route.params?.scannedCode;

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');

  // Flash Sale đếm ngược 5 phút
  const { formattedTime, isFinished } = useCountdown(300);

  // TanStack useInfiniteQuery - Vũ khí phân trang & Caching tối thượng
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['productsInfinite'],
    queryFn: fetchProductsPage,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  const allProducts = useMemo(() => {
    return data?.pages.flatMap((page) => page.items) ?? [];
  }, [data]);

  // Lọc sản phẩm theo danh mục và từ khóa tìm kiếm
  const filteredProducts = useMemo(() => {
    return allProducts.filter((p) => {
      const matchCat = selectedCategory === 'Tất cả' || p.category === selectedCategory;
      const matchSearch = p.name.toLowerCase().includes(search.trim().toLowerCase());
      return matchCat && matchSearch;
    });
  }, [allProducts, selectedCategory, search]);

  const handleOpenDetail = (productId: string) => {
    navigation.navigate('ProductDetail', { productId });
  };

  const errorMessage =
    error instanceof ZodValidationError
      ? '⚠️ Dữ liệu sản phẩm không hợp lệ (Lỗi Zod Validation) — vui lòng báo kỹ thuật viên!'
      : '📡 Lỗi kết nối mạng — vui lòng kéo xuống để thử lại!';

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* 1. Thanh tiêu đề & nút chuyển theme & nút Đăng xuất */}
      <View style={styles.topBar}>
        <View style={styles.brandBox}>
          <Typography variant="h1" color={colors.primary}>
            ShopAI Store
          </Typography>
          <Typography variant="caption" color={colors.textLight}>
            Thế giới công nghệ AI & Hardware Native
          </Typography>
        </View>

        <View style={styles.headerActions}>
          <Pressable
            style={[
              styles.themePill,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
            onPress={toggleTheme}
          >
            <Text style={styles.themePillText}>{isDark ? '☀️ Light' : '🌙 Dark'}</Text>
          </Pressable>

          <Pressable
            style={[
              styles.logoutPill,
              { backgroundColor: colors.surface, borderColor: COLORS.danger },
            ]}
            onPress={logout}
          >
            <Text style={styles.logoutPillText}>🚪 Thoát</Text>
          </Pressable>
        </View>
      </View>

      {/* 2. Thẻ vị trí GPS & Phí giao hàng ước tính (Sprint 7) */}
      <LocationBadge />

      {/* 3. Thanh nút Giỏ hàng, Quét Mã Vạch (Sprint 7) & Đơn hàng */}
      <View style={styles.cartActionRow}>
        <ShopButton
          title={`🛒 Giỏ (${totalQuantity})`}
          onPress={() => navigation.navigate('Cart')}
          style={styles.cartBtn}
          textStyle={{ fontSize: 13 }}
        />
        <ShopButton
          title="📷 Quét Mã"
          variant="outline"
          onPress={() => navigation.navigate('Scanner')}
          style={styles.scanBtn}
          textStyle={{ fontSize: 13 }}
        />
        <ShopButton
          title="Đơn hàng"
          variant="outline"
          onPress={() => navigation.navigate('Orders')}
          style={styles.ordersBtn}
          textStyle={{ fontSize: 13 }}
        />
      </View>

      {/* 4. Banner hiển thị mã Barcode/QR vừa quét được (Sprint 7) */}
      {scannedCode && (
        <View
          style={[
            styles.scannedBox,
            {
              backgroundColor: isDark ? '#2D2808' : '#FFFDE7',
              borderColor: isDark ? '#FBC02D' : '#FDD835',
            },
          ]}
        >
          <View style={{ flex: 1 }}>
            <Text style={[styles.scannedTitle, { color: isDark ? '#FFF59D' : '#F57F17' }]}>
              🔍 Mã vừa quét thành công:
            </Text>
            <Text style={[styles.scannedValue, { color: isDark ? '#FFFDE7' : '#E65100' }]}>
              {scannedCode}
            </Text>
          </View>
          <ShopButton
            title="Tìm kiếm"
            onPress={() => setSearch(scannedCode)}
            style={{ width: 85, height: 34, backgroundColor: COLORS.primary }}
            textStyle={{ fontSize: 12 }}
          />
        </View>
      )}

      {/* 5. Thanh tìm kiếm */}
      <View
        style={[styles.searchBox, { backgroundColor: colors.surface, borderColor: colors.border }]}
      >
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Tìm kiếm điện thoại, tai nghe, đồng hồ..."
          placeholderTextColor={colors.textLight}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <Pressable onPress={() => setSearch('')}>
            <Text style={styles.clearIcon}>✕</Text>
          </Pressable>
        )}
      </View>

      {/* 6. Banner Flash Sale */}
      <View style={[styles.flashBanner, { backgroundColor: colors.primary }]}>
        <View style={styles.flashLeft}>
          <Text style={styles.flashTitle}>⚡ FLASH SALE HÔM NAY</Text>
          <Text style={styles.flashSubtitle}>Giảm đến 50% khi thanh toán qua ShopAI</Text>
        </View>
        <View style={styles.flashTimerBox}>
          <Text style={styles.timerLabel}>Kết thúc trong</Text>
          <Text style={styles.timerValue}>{isFinished ? '00:00' : formattedTime}</Text>
        </View>
      </View>

      {/* 5. Bộ lọc danh mục */}
      <View style={styles.categorySection}>
        <Typography variant="h3" color={colors.text} style={styles.sectionTitle}>
          Danh mục nổi bật
        </Typography>
        <View style={styles.categoryList}>
          {CATEGORIES.map((item) => {
            const isActive = item === selectedCategory;
            return (
              <Pressable
                key={item}
                onPress={() => setSelectedCategory(item)}
                style={[
                  styles.catPill,
                  {
                    backgroundColor: isActive ? colors.primary : colors.surface,
                    borderColor: isActive ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.catText,
                    {
                      color: isActive ? '#FFFFFF' : colors.text,
                      fontWeight: isActive ? '700' : '500',
                    },
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* 6. Tiêu đề danh sách */}
      <View style={styles.listHeaderRow}>
        <Typography variant="h3" color={colors.text}>
          Gợi ý cho bạn ({filteredProducts.length} sản phẩm)
        </Typography>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: colors.background }]}
      edges={['top', 'left', 'right']}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {isLoading && (
        <View style={styles.centerLoading}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Typography variant="body2" color={colors.textLight} style={{ marginTop: 12 }}>
            Đang tải dữ liệu sản phẩm từ TanStack Query Cloud...
          </Typography>
        </View>
      )}

      {isError && (
        <View style={styles.errorBox}>
          <Text style={styles.errorEmoji}>⚠️</Text>
          <Text style={styles.errorText}>{errorMessage}</Text>
          <ShopButton title="Thử lại" onPress={() => refetch()} style={{ marginTop: 16, width: 140 }} />
        </View>
      )}

      {!isLoading && !isError && (
        <FlashList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={renderHeader}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={() => {
                refetch();
              }}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>🔎</Text>
              <Typography variant="h3" color={colors.text}>
                Không tìm thấy sản phẩm
              </Typography>
              <Typography variant="body2" color={colors.textLight} style={{ marginTop: 6 }}>
                Thử tìm kiếm với từ khóa khác hoặc đổi danh mục.
              </Typography>
            </View>
          }
          renderItem={({ item }) => (
            <Pressable onPress={() => handleOpenDetail(item.id)}>
              <ProductCard
                product={item}
                cardBackground={colors.surface}
                textColor={colors.text}
              />
            </Pressable>
          )}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextPage ? (
              <View style={styles.footerLoading}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={[styles.footerLoadingText, { color: colors.textLight }]}>
                  Đang tải thêm trang tiếp theo...
                </Text>
              </View>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  headerContainer: { paddingHorizontal: 12, paddingTop: 8 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  brandBox: { flex: 1, paddingRight: 8 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  themePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    ...SHADOWS.light,
  },
  themePillText: { fontWeight: '700', fontSize: 12, color: COLORS.primary },
  logoutPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    ...SHADOWS.light,
  },
  logoutPillText: { fontWeight: '700', fontSize: 12, color: COLORS.danger },
  cartActionRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  cartBtn: { flex: 1, height: 42, backgroundColor: COLORS.primary },
  scanBtn: { width: 105, height: 42 },
  ordersBtn: { width: 95, height: 42 },
  scannedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    marginBottom: 12,
    ...SHADOWS.light,
  },
  scannedTitle: { fontSize: 12, fontWeight: '700' },
  scannedValue: { fontSize: 14, fontWeight: 'bold', marginTop: 2 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    marginBottom: 14,
    ...SHADOWS.light,
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, paddingVertical: 0 },
  clearIcon: { fontSize: 16, color: '#999', padding: 4 },
  flashBanner: {
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    ...SHADOWS.medium,
  },
  flashLeft: { flex: 1 },
  flashTitle: { color: '#FFF', fontSize: 16, fontWeight: '900' },
  flashSubtitle: { color: 'rgba(255,255,255,0.9)', fontSize: 12, marginTop: 4 },
  flashTimerBox: {
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  timerLabel: { fontSize: 10, color: '#E67E22', fontWeight: '700' },
  timerValue: { fontSize: 15, color: '#E67E22', fontWeight: '900', marginTop: 2 },
  categorySection: { marginBottom: 14 },
  sectionTitle: { marginBottom: 10 },
  categoryList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  catPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    borderWidth: 1,
  },
  catText: { fontSize: 13 },
  listHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  listContent: { paddingBottom: 40 },
  centerLoading: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  errorBox: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  errorEmoji: { fontSize: 48, marginBottom: 12 },
  errorText: { color: COLORS.danger, textAlign: 'center', fontSize: 15, fontWeight: '600' },
  emptyContainer: { padding: 40, alignItems: 'center', justifyContent: 'center' },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  footerLoading: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  footerLoadingText: { fontSize: 12 },
});

export default HomeScreen;

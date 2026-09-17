// src/screens/sprint6/HomeScreenSprint6.tsx
// Màn hình nghiệm thu hoàn chỉnh Sprint 6 (Chương 6 - State Management & Server State)
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  RefreshControl,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useInfiniteQuery } from '@tanstack/react-query';
import { FlashList } from '@shopify/flash-list';
import { useTheme } from '@contexts/ThemeContext';
import Typography from '@components/ui/Typography';
import ShopButton from '@components/ShopButton';
import ProductCard from '@components/ProductCard';
import { useCountdown } from '@hooks/useCountdown';
import { COLORS, SIZES, SHADOWS } from '@constants/theme';
import { useAuthStore } from '@store/useAuthStore';
import { useCartStore } from '@store/useCartStore';
import { Product, ProductListSchema } from '../../types/product.schema';

const CATEGORIES = ['Tất cả', 'Điện thoại', 'Tai nghe', 'Đồng hồ', 'Phụ kiện'];
const PAGE_SIZE = 10;
const TOTAL_MOCK_PRODUCTS = 47;

interface ProductPage {
  items: Product[];
  nextPage: number | null;
}

class ZodValidationError extends Error {}
class NetworkError extends Error {}

const MOCK_IMAGE_LIST = [
  'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600',
  'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600',
  'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600',
  'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=600',
  'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
];

const fetchProductsPage = async ({ pageParam = 1 }: { pageParam?: number }): Promise<ProductPage> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const start = (pageParam - 1) * PAGE_SIZE;
      const rawItems = Array.from({ length: PAGE_SIZE })
        .map((_, i) => {
          const index = start + i;
          if (index >= TOTAL_MOCK_PRODUCTS) return null;
          const cat = CATEGORIES[1 + (index % (CATEGORIES.length - 1))];
          const img = MOCK_IMAGE_LIST[index % MOCK_IMAGE_LIST.length];
          return {
            id: `prod_${index + 1}`,
            name: `${cat} ShopAI Pro Max ${index + 1}`,
            price: 500000 + (index + 1) * 350000,
            image: img,
            category: cat,
            rating: 4.5 + ((index % 5) * 0.1),
            discount: index % 2 === 0,
          };
        })
        .filter((item): item is NonNullable<typeof item> => item !== null);

      const result = ProductListSchema.safeParse(rawItems);
      if (!result.success) {
        reject(new ZodValidationError('Dữ liệu sản phẩm không hợp lệ (Zod validation failed)!'));
        return;
      }

      const hasMore = start + PAGE_SIZE < TOTAL_MOCK_PRODUCTS;
      resolve({
        items: result.data,
        nextPage: hasMore ? pageParam + 1 : null,
      });
    }, 800);
  });
};

const HomeScreenSprint6 = () => {
  const navigation = useNavigation<any>();
  const { colors, isDark, toggleTheme } = useTheme();
  const logout = useAuthStore((state) => state.logout);
  const totalQuantity = useCartStore((state) => state.totalQuantity());

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');

  const { formattedTime, isFinished } = useCountdown(300);

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
      ? '⚠️ Dữ liệu sản phẩm không hợp lệ (Zod Validation Error)!'
      : '📡 Lỗi kết nối mạng — vui lòng thử lại!';

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.topBar}>
        <View style={styles.brandBox}>
          <Typography variant="h1" color={colors.primary}>
            ShopAI Store
          </Typography>
          <Typography variant="caption" color={colors.textLight}>
            Sprint 6: Zustand, Query, Zod, Persist & Redux
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

      <View style={styles.cartActionRow}>
        <ShopButton
          title={`🛒 Giỏ hàng (${totalQuantity})`}
          onPress={() => navigation.navigate('Cart')}
          style={styles.cartBtn}
        />
        <ShopButton
          title="Đơn hàng"
          variant="outline"
          onPress={() => navigation.navigate('Orders')}
          style={styles.ordersBtn}
          textStyle={{ fontSize: 13 }}
        />
      </View>

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
  cartActionRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  cartBtn: { flex: 1, height: 42, backgroundColor: COLORS.primary },
  ordersBtn: { width: 110, height: 42 },
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

export default HomeScreenSprint6;

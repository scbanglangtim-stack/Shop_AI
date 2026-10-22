// src/screens/HomeScreen.tsx
// Màn hình Trang Chủ ShopAI - Phân trang useInfiniteQuery, Zod Schema & Zustand (Chương 6)
import React, { useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  RefreshControl,
  Pressable,
  ScrollView,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  BackHandler,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { FlashList } from '@shopify/flash-list';
import { useTheme } from '@contexts/ThemeContext';
import Typography from '@components/ui/Typography';
import ShopButton from '@components/ShopButton';
import ProductCard from '@components/ProductCard';
import LocationBadge from '@components/LocationBadge';
import QuickBuyModal from '@components/QuickBuyModal';
import OfflineStateView from '@components/OfflineStateView';
import { useCountdown } from '@hooks/useCountdown';
import { COLORS, SIZES, SHADOWS } from '@constants/theme';
import { useAuthStore } from '@store/useAuthStore';
import { useCartStore } from '@store/useCartStore';
import { Product, ProductListSchema } from '../types/product.schema';
import { requestWithFallback } from '@api/networkHelper';

import { recordCrashlyticsError, triggerTestCrash } from '@services/crashlyticsService';
import { APP_VERSION } from '@constants/env';

const CATEGORIES = ['Tất cả', 'Điện thoại', 'Laptop', 'Tai nghe', 'Đồng hồ', 'Phụ kiện'];
const PRICE_RANGES = [
  { id: 'all', label: 'Tất cả mức giá', min: 0, max: Infinity },
  { id: 'under_1m', label: 'Dưới 1 triệu', min: 0, max: 1_000_000 },
  { id: '1m_5m', label: '1 - 5 triệu', min: 1_000_000, max: 5_000_000 },
  { id: '5m_15m', label: '5 - 15 triệu', min: 5_000_000, max: 15_000_000 },
  { id: 'above_15m', label: 'Trên 15 triệu', min: 15_000_000, max: Infinity },
];
const PAGE_SIZE = 10;
const TOTAL_MOCK_PRODUCTS = 47;

interface ProductPage {
  items: Product[];
  nextPage: number | null;
}

const fetchProductsAPI = async (): Promise<Product[]> => {
  // Bắt buộc lấy dữ liệu từ cơ sở dữ liệu thật trên máy chủ NestJS
  const { data } = await requestWithFallback<Product[]>('/api/products', {
    method: 'GET',
    timeout: 3500,
  });

  const result = ProductListSchema.safeParse(data);
  if (result.success && result.data && result.data.length > 0) {
    return result.data;
  }
  throw new Error('Dữ liệu sản phẩm từ máy chủ không hợp lệ');
};

// Component FlashSale riêng biệt để chỉ có nó đếm ngược 1s/lần, không làm cả HomeScreen re-render
const FlashSaleBanner = React.memo(() => {
  const { colors } = useTheme();
  const { formattedTime, isFinished } = useCountdown(300);

  return (
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
  );
});

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { colors, isDark, toggleTheme } = useTheme();
  const logout = useAuthStore((state) => state.logout);
  const totalQuantity = useCartStore((state) => state.totalQuantity());
  const addItem = useCartStore((state) => state.addItem);

  // Nhận mã vạch trả về từ ScannerScreen (Sprint 7)
  const scannedCode = route.params?.scannedCode;

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  // Quản lý sản phẩm đang được chọn để mở QuickBuyModal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Giữ vị trí cuộn khi đổi bộ lọc để không bị giật / đẩy trang lên đầu
  const listRef = useRef<any>(null);
  const currentScrollY = useRef(0);

  const handleSelectCategory = (cat: string) => {
    const savedY = currentScrollY.current;
    setSelectedCategory(cat);
    setTimeout(() => {
      if (listRef.current && savedY > 0) {
        listRef.current.scrollToOffset({ offset: savedY, animated: false });
      }
    }, 40);
  };

  const handleSelectPriceRange = (rangeId: string) => {
    const savedY = currentScrollY.current;
    setSelectedPriceRange(rangeId);
    setTimeout(() => {
      if (listRef.current && savedY > 0) {
        listRef.current.scrollToOffset({ offset: savedY, animated: false });
      }
    }, 40);
  };

  // TanStack useQuery nạp dữ liệu từ Database thực tế qua mạng
  const {
    data: allProducts,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['productsList'],
    queryFn: fetchProductsAPI,
    retry: 1,
    retryDelay: 1000,
    staleTime: 3000,
    refetchInterval: 5000, // Tự động thăm dò kết nối Backend mỗi 5s để ngắt ngay khi Backend tắt
    refetchIntervalInBackground: false,
  });

  const productList = allProducts || [];

  // Lọc sản phẩm theo danh mục, từ khóa tìm kiếm và mức giá tiền
  const filteredProducts = useMemo(() => {
    const currentPriceRange = PRICE_RANGES.find((r) => r.id === selectedPriceRange);
    return productList.filter((p) => {
      const matchCat = selectedCategory === 'Tất cả' || p.category === selectedCategory;
      const matchSearch = p.name.toLowerCase().includes(search.trim().toLowerCase());
      const matchPrice =
        !currentPriceRange ||
        (p.price >= currentPriceRange.min && p.price <= currentPriceRange.max);
      return matchCat && matchSearch && matchPrice;
    });
  }, [productList, selectedCategory, search, selectedPriceRange]);

  const handleOpenDetail = (productId: string) => {
    navigation.navigate('ProductDetail', { productId });
  };

  const errorMessage =
    (error as Error)?.message || '📡 Lỗi kết nối mạng — vui lòng kiểm tra lại kết nối!';

  const headerElement = useMemo(
    () => (
      <View style={styles.headerContainer}>
        {/* 1. Thanh tiêu đề & nút chuyển theme & nút Đăng xuất */}
        <View style={styles.topBar}>
          <View style={styles.brandBox}>
            <Typography variant="h1" color={colors.primary}>
              ShopAI Store
            </Typography>
            <Typography variant="caption" color={colors.textLight} numberOfLines={1}>
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
              <Text
                style={[
                  styles.themePillText,
                  { color: isDark ? '#FFA940' : colors.text },
                ]}
                numberOfLines={1}
              >
                {isDark ? '☀️ Sáng' : '🌙 Tối'}
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.logoutPill,
                { backgroundColor: colors.surface, borderColor: COLORS.danger },
              ]}
              onPress={logout}
            >
              <Text style={styles.logoutPillText} numberOfLines={1}>
                🚪 Thoát
              </Text>
            </Pressable>
          </View>
        </View>

        {/* 2. Thẻ vị trí GPS & Phí giao hàng ước tính (Sprint 7) */}
        <LocationBadge />

        {/* 3. Thanh tác vụ: Hỏi Trợ Lý Mua Sắm AI (Chuyển sang Tab Hỏi AI dưới thanh đáy để tiết kiệm tài nguyên) & Quét Mã */}
        <View style={styles.topActionRow}>
          <Pressable
            style={[
              styles.heroAiBtn,
              {
                backgroundColor: isDark ? '#2A1828' : '#FFF2F0',
                borderColor: colors.primary,
              },
            ]}
            onPress={() => {
              const parent = navigation.getParent();
              if (parent) {
                parent.navigate('AIChat');
              } else {
                navigation.navigate('AIChat');
              }
            }}
          >
            <View style={styles.heroAiIconBox}>
              <Text style={{ fontSize: 20 }}>🤖</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={[styles.heroAiTitle, { color: colors.primary }]}>
                Trợ Lý Mua Sắm AI
              </Text>
              <Text style={[styles.heroAiSub, { color: colors.textLight }]} numberOfLines={1}>
                Tư vấn chọn mua sản phẩm & ưu đãi
              </Text>
            </View>
            <View style={[styles.chatNowBtn, { backgroundColor: colors.primary }]}>
              <Text style={styles.chatNowBtnText}>Hỏi ngay</Text>
            </View>
          </Pressable>

          <Pressable
            style={[
              styles.scanActionBtn,
              {
                backgroundColor: colors.surface,
                borderColor: isDark ? colors.border : '#E0E0E0',
              },
            ]}
            onPress={() => navigation.navigate('Scanner')}
          >
            <Text style={{ fontSize: 18 }}>📷</Text>
            <Text style={[styles.scanActionText, { color: colors.text }]}>Quét mã</Text>
          </Pressable>
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
          style={[
            styles.searchBox,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
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

        {/* 6. Banner Flash Sale (tự cô lập logic đếm ngược) */}
        <FlashSaleBanner />

        {/* 7. Bộ lọc danh mục */}
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
                  onPress={() => handleSelectCategory(item)}
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

        {/* 7b. Bộ lọc khoảng giá tiền */}
        <View style={styles.priceSection}>
          <Typography variant="h3" color={colors.text} style={styles.sectionTitle}>
            💰 Lọc theo khoảng giá
          </Typography>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.priceList}
          >
            {PRICE_RANGES.map((item) => {
              const isActive = item.id === selectedPriceRange;
              return (
                <Pressable
                  key={item.id}
                  onPress={() => handleSelectPriceRange(item.id)}
                  style={[
                    styles.pricePill,
                    {
                      backgroundColor: isActive ? colors.primary : colors.surface,
                      borderColor: isActive ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.priceText,
                      {
                        color: isActive ? '#FFFFFF' : colors.text,
                        fontWeight: isActive ? '700' : '500',
                      },
                    ]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* 8. Tiêu đề danh sách */}
        <View style={styles.listHeaderRow}>
          <Typography variant="h3" color={colors.text}>
            Gợi ý cho bạn ({filteredProducts.length} sản phẩm)
          </Typography>
        </View>
      </View>
    ),
    [
      colors,
      isDark,
      toggleTheme,
      logout,
      totalQuantity,
      navigation,
      scannedCode,
      search,
      selectedCategory,
      selectedPriceRange,
      filteredProducts.length,
    ],
  );

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: colors.background }]}
      edges={['top', 'left', 'right']}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {isError ? (
        <OfflineStateView
          onRetry={async () => {
            await refetch();
          }}
          message="Không thể kết nối đến máy chủ cơ sở dữ liệu ShopAI. Máy chủ Backend đang tắt hoặc mất kết nối mạng. Toàn bộ dữ liệu hiển thị đã bị ngắt để đảm bảo an toàn và tính đồng nhất."
        />
      ) : isLoading && (!allProducts || allProducts.length === 0) ? (
        <View style={styles.centerLoading}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Typography variant="body2" color={colors.textLight} style={{ marginTop: 12 }}>
            Đang kết nối cơ sở dữ liệu máy chủ ShopAI...
          </Typography>
        </View>
      ) : allProducts && allProducts.length > 0 ? (
        <FlashList
          ref={listRef}
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          numColumns={2}
          estimatedItemSize={280}
          extraData={[selectedCategory, selectedPriceRange]}
          onScroll={(e) => {
            currentScrollY.current = e.nativeEvent.contentOffset.y;
          }}
          scrollEventThrottle={16}
          contentContainerStyle={[
            styles.listContent,
            { minHeight: SIZES.height * 1.3 },
          ]}
          ListHeaderComponent={headerElement}
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
            <ProductCard
              product={item}
              cardBackground={colors.surface}
              textColor={colors.text}
              onPress={() => setSelectedProduct(item)}
              onPressBuy={() => setSelectedProduct(item)}
            />
          )}
        />
      ) : null}

      {/* Bảng Thêm giỏ hàng / Mua ngay / Chọn số lượng siêu mượt */}
      <QuickBuyModal
        visible={selectedProduct !== null}
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onViewDetail={(productId) => handleOpenDetail(productId)}
        onBuyNow={(prod, qty) => {
          for (let i = 0; i < qty; i++) {
            addItem(prod);
          }
          setSelectedProduct(null);
          navigation.navigate('Cart');
        }}
      />

      {/* Nút thoát App Dev (Nhấn giữ 2 giây để Out App ngay lập tức) */}
      <Pressable
        delayLongPress={2000}
        onLongPress={() => {
          console.log('[Dev] Nhấn giữ 2s -> Thoát ứng dụng (Out app)');
          try {
            triggerTestCrash();
          } catch {}
          BackHandler.exitApp();
        }}
        style={{ paddingVertical: 12, paddingHorizontal: 16, alignItems: 'center' }}
      >
        <Text style={{ textAlign: 'center', fontSize: 11, color: colors.textLight || '#ccc' }}>
          ShopAI v{APP_VERSION} (Dev: Nhấn giữ 2s để thoát app ngay)
        </Text>
      </Pressable>

      {/* Nút FAB AI nổi tiện lợi — Chuyển thẳng sang Tab Hỏi AI ở thanh đáy */}
      <Pressable
        style={[styles.floatingAiFab, { backgroundColor: colors.primary }]}
        onPress={() => {
          const parent = navigation.getParent();
          if (parent) {
            parent.navigate('AIChat');
          } else {
            navigation.navigate('AIChat');
          }
        }}
      >
        <Text style={styles.floatingAiIcon}>🤖</Text>
        <Text style={styles.floatingAiLabel}>Hỏi AI</Text>
      </Pressable>
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
  brandBox: { flex: 1, paddingRight: 6 },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 0,
  },
  themePill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.light,
  },
  themePillText: { fontWeight: '700', fontSize: 12 },
  logoutPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.light,
  },
  logoutPillText: { fontWeight: '700', fontSize: 12, color: COLORS.danger },
  topActionRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  heroAiBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1.2,
    ...SHADOWS.light,
  },
  heroAiIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroAiTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  aiPillBadge: {
    backgroundColor: '#722ED1',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 6,
  },
  aiPillBadgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '800',
  },
  heroAiSub: {
    fontSize: 11,
    marginTop: 2,
  },
  chatNowBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  chatNowBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  scanActionBtn: {
    width: 82,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 8,
    ...SHADOWS.light,
  },
  scanActionText: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  floatingAiFab: {
    position: 'absolute',
    bottom: 20,
    right: 18,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    zIndex: 999,
  },
  floatingAiIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  floatingAiLabel: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
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
  priceSection: { marginBottom: 14 },
  priceList: { flexDirection: 'row', gap: 8, paddingVertical: 2 },
  pricePill: {
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  priceText: { fontSize: 12 },
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

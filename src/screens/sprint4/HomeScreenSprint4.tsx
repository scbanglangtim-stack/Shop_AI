// src/screens/sprint4/HomeScreenSprint4.tsx
// Màn hình Trang Chủ ShopAI Flagship hoàn thiện Sprint 4 (Chương 4: Lưới 2 cột, Search, Filter, Theme, Animation)
import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  RefreshControl,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@contexts/ThemeContext';
import Typography from '@components/ui/Typography';
import ProductCard from '@components/ProductCard';
import { MOCK_PRODUCTS, Product } from '@data/mockProducts';
import { useCountdown } from '@hooks/useCountdown';
import { COLORS } from '@constants/theme';

const CATEGORIES = ['Tất cả', 'Điện thoại', 'Tai nghe', 'Đồng hồ', 'Phụ kiện', 'Laptop'];

const HomeScreenSprint4 = () => {
  const { colors, isDark, toggleTheme } = useTheme();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [refreshing, setRefreshing] = useState(false);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);

  // Countdown cho Flash Sale
  const { formattedTime, isFinished } = useCountdown(300);

  // Kéo xuống để làm mới danh sách (Pull-to-refresh)
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      // Giả lập làm mới dữ liệu
      setProducts([...MOCK_PRODUCTS].reverse());
      setRefreshing(false);
    }, 1200);
  }, []);

  // Lọc sản phẩm theo Category và từ khóa tìm kiếm
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCat = selectedCategory === 'Tất cả' || p.category === selectedCategory;
      const matchSearch = p.name.toLowerCase().includes(search.trim().toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, selectedCategory, search]);

  const handleBuy = (product: Product) => {
    Alert.alert(
      '🛒 Thêm giỏ hàng',
      `Đã chọn: ${product.name}\nGiá: ${product.price.toLocaleString('vi-VN')} đ`,
    );
  };

  // Header của danh sách FlatList (Bao gồm Brand, Dark mode toggle, Flash Sale, Category filter)
  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* 1. Thanh tiêu đề & Nút chuyển theme */}
      <View style={styles.topBar}>
        <View>
          <Typography variant="h1" color={colors.primary}>
            ShopAI Store
          </Typography>
          <Typography variant="caption" color={colors.textLight}>
            Thế giới công nghệ AI đỉnh cao
          </Typography>
        </View>

        <Pressable
          style={[
            styles.themePill,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
          onPress={toggleTheme}
        >
          <Text style={styles.themePillText}>{isDark ? '☀️ Light' : '🌙 Dark'}</Text>
        </Pressable>
      </View>

      {/* 2. Thanh tìm kiếm hiện đại */}
      <View
        style={[styles.searchBox, { backgroundColor: colors.surface, borderColor: colors.border }]}
      >
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Tìm kiếm điện thoại, tai nghe, laptop..."
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

      {/* 3. Banner Flash Sale */}
      <View style={[styles.flashBanner, { backgroundColor: colors.primary }]}>
        <View style={styles.flashLeft}>
          <Text style={styles.flashTitle}>⚡ FLASH SALE HÔM NAY</Text>
          <Text style={styles.flashSubtitle}>Giảm đến 50% toàn bộ phụ kiện</Text>
        </View>
        <View style={styles.flashTimerBox}>
          <Text style={styles.timerLabel}>Kết thúc trong</Text>
          <Text style={styles.timerValue}>{isFinished ? '00:00' : formattedTime}</Text>
        </View>
      </View>

      {/* 4. Bộ lọc danh mục (Pills ngang) */}
      <View style={styles.categorySection}>
        <Typography variant="h3" color={colors.text} style={styles.sectionTitle}>
          Danh mục sản phẩm
        </Typography>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={CATEGORIES}
          keyExtractor={item => item}
          contentContainerStyle={styles.categoryList}
          renderItem={({ item }) => {
            const isActive = item === selectedCategory;
            return (
              <Pressable
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
          }}
        />
      </View>

      {/* 5. Tiêu đề lưới sản phẩm */}
      <View style={styles.listHeaderRow}>
        <Typography variant="h3" color={colors.text}>
          Gợi ý cho bạn ({filteredProducts.length})
        </Typography>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <FlatList
        data={filteredProducts}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
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
            <Typography variant="body" color={colors.textLight} style={{ marginTop: 4 }}>
              Thử tìm với từ khóa khác hoặc chuyển danh mục
            </Typography>
          </View>
        }
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPressBuy={handleBuy}
            cardBackground={colors.card}
            textColor={colors.text}
          />
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  headerContainer: {
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  themePill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    elevation: 2,
  },
  themePillText: {
    fontWeight: '700',
    fontSize: 13,
    color: COLORS.primary,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    marginBottom: 14,
    elevation: 2,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 0,
  },
  clearIcon: {
    fontSize: 16,
    color: '#999',
    padding: 4,
  },
  flashBanner: {
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 4,
  },
  flashLeft: {
    flex: 1,
  },
  flashTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '900',
  },
  flashSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    marginTop: 4,
  },
  flashTimerBox: {
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  timerLabel: {
    fontSize: 10,
    color: '#E67E22',
    fontWeight: '700',
  },
  timerValue: {
    fontSize: 15,
    color: '#E67E22',
    fontWeight: '900',
    marginTop: 2,
  },
  categorySection: {
    marginBottom: 14,
  },
  sectionTitle: {
    marginBottom: 10,
  },
  categoryList: {
    gap: 8,
    paddingVertical: 2,
  },
  catPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  catText: {
    fontSize: 13,
  },
  listHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  listContent: {
    paddingBottom: 40,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
});

export default HomeScreenSprint4;

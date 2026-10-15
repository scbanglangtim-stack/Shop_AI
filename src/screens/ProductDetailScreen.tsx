// src/screens/ProductDetailScreen.tsx
// Màn hình Chi tiết sản phẩm nhận Route Params & Cache TanStack Query (Chương 5.3 & 6.8)
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  ImageSourcePropType,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import ShopButton from '@components/ShopButton';
import { useCartStore } from '@store/useCartStore';
import { API_BASE_URL } from '@constants/api';
import { Product, ProductSchema } from '../types/product.schema';
import { COLORS, SIZES } from '@constants/theme';
import type { HomeStackParamList } from '@navigation/HomeStackNavigator';

type ProductDetailRouteProp = RouteProp<HomeStackParamList, 'ProductDetail'>;

const fetchProductById = async (id: string): Promise<Product> => {
  const response = await fetch(`${API_BASE_URL}/api/products/${id}`);

  // Bắt đúng mã 404 mà NestJS ném ra ở Bước 7c — hai đầu ăn khớp nhau
  if (response.status === 404) {
    throw new Error('Sản phẩm này không còn tồn tại trên hệ thống');
  }
  if (!response.ok) {
    throw new Error('Lỗi mạng khi tải chi tiết sản phẩm');
  }

  const raw = await response.json();
  const result = ProductSchema.safeParse(raw); // Vẫn giữ trạm kiểm soát Zod từ Chương 6
  if (!result.success) {
    throw new Error('Dữ liệu chi tiết sản phẩm không hợp lệ (Zod)');
  }
  return result.data;
};

const ProductDetailScreen = () => {
  const route = useRoute<ProductDetailRouteProp>();
  const { productId } = route.params;
  const queryClient = useQueryClient();
  const addItem = useCartStore((state) => state.addItem);

  const { data: product, isLoading, isError, error } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => fetchProductById(productId),
    placeholderData: () =>
      queryClient
        .getQueryData<Product[]>(['productsList'])
        ?.find((p) => p.id === productId),
  });

  if (isLoading && !product) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFound}>Đang tải chi tiết sản phẩm...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !product) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundEmoji}>⚠️</Text>
          <Text style={styles.notFound}>
            {(error as Error)?.message ?? `Không tìm thấy sản phẩm với ID: ${productId}`}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleAddToCart = () => {
    addItem(product);
    Alert.alert('🛒 Giỏ hàng', `Đã thêm ${product.name} vào giỏ hàng thành công!`);
  };

  const imageSource: ImageSourcePropType =
    typeof product.image === 'string' ? { uri: product.image } : product.image;

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Image source={imageSource} style={styles.image} resizeMode="cover" />

        <View style={styles.infoCard}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{product.category || 'Công nghệ'}</Text>
            <Text style={styles.ratingText}>⭐ {product.rating || 4.8}</Text>
          </View>

          <Text style={styles.name}>{product.name}</Text>

          <Text style={styles.price}>{product.price.toLocaleString('vi-VN')} đ</Text>

          <Text style={styles.idNote}>Mã sản phẩm: {product.id}</Text>

          <View style={styles.descBlock}>
            <Text style={styles.descTitle}>Mô tả chi tiết:</Text>
            <Text style={styles.descText}>
              Sản phẩm chính hãng chất lượng cao tại ShopAI Store. Bảo hành 12 tháng, đổi trả 1-1
              trong 30 ngày nếu có lỗi từ nhà sản xuất.
            </Text>
          </View>

          <ShopButton
            title="Thêm vào giỏ hàng"
            onPress={handleAddToCart}
            style={styles.buyBtn}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    padding: SIZES.padding,
    paddingBottom: 32,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.padding,
    backgroundColor: '#EAEAEA',
  },
  infoCard: {
    backgroundColor: COLORS.surface,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  categoryBadge: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '700',
    backgroundColor: '#FFF0F0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  ratingText: {
    fontSize: 13,
    color: '#F39C12',
    fontWeight: '700',
  },
  name: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  price: {
    fontSize: SIZES.h1,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  idNote: {
    fontSize: SIZES.body2,
    color: COLORS.textLight,
    marginBottom: 16,
  },
  descBlock: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    marginBottom: 20,
  },
  descTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 6,
  },
  descText: {
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 20,
  },
  buyBtn: {
    marginTop: 4,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  notFoundEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  notFound: {
    fontSize: SIZES.body1,
    color: COLORS.danger,
    textAlign: 'center',
    fontWeight: '600',
  },
  notFoundHint: {
    fontSize: SIZES.body2,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 8,
  },
});

export default ProductDetailScreen;

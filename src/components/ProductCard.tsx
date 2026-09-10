// src/components/ProductCard.tsx
import React, { memo, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Animated,
  Alert,
  Pressable,
  ImageSourcePropType,
} from 'react-native';
import { COLORS, SIZES } from '@constants/theme';
import ShopButton from '@components/ShopButton';
import { Product } from '@data/mockProducts';

const { width } = Dimensions.get('window');
// Chia 2 cột đều nhau (khoảng cách viền và giữa là 12)
const CARD_WIDTH = (width - 36) / 2;

interface Props {
  product: Product;
  onPress?: (product: Product) => void;
  onPressBuy?: (product: Product) => void;
  cardBackground?: string;
  textColor?: string;
}

const ProductCard = ({
  product,
  onPress,
  onPressBuy,
  cardBackground = '#FFFFFF',
  textColor = '#2C3E50',
}: Props) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, [opacity]);

  const handleCardPress = () => {
    if (onPress) {
      onPress(product);
    } else if (onPressBuy) {
      onPressBuy(product);
    }
  };

  const handleBuy = () => {
    if (onPressBuy) {
      onPressBuy(product);
    } else {
      Alert.alert(
        '🛒 Đã chọn sản phẩm',
        `${product.name}\nGiá: ${product.price.toLocaleString('vi-VN')} đ`,
      );
    }
  };

  const imageSource: ImageSourcePropType =
    typeof product.image === 'string' ? { uri: product.image } : product.image;

  return (
    <Animated.View style={[styles.card, { backgroundColor: cardBackground, opacity }]}>
      <Pressable onPress={handleCardPress}>
        {/* Vùng hiển thị hình ảnh sản phẩm với kích thước chuẩn */}
        <View style={styles.imageContainer}>
          <Image source={imageSource} style={styles.image} resizeMode="cover" />
        </View>

        {/* Thông tin sản phẩm */}
        <View style={styles.infoContainer}>
          <Text style={[styles.name, { color: textColor }]} numberOfLines={2}>
            {product.name}
          </Text>

          <Text style={styles.price}>{product.price.toLocaleString('vi-VN')} đ</Text>

          {/* Nút bấm Mua ngay */}
          <ShopButton
            title="Mua ngay"
            onPress={handleBuy}
            style={styles.buyBtn}
            textStyle={styles.buyBtnText}
          />
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    marginHorizontal: 6,
    marginBottom: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ECECEC',
    padding: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  imageContainer: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    backgroundColor: '#F0F2F5',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 10,
  },
  infoContainer: {
    paddingTop: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    lineHeight: 18,
    height: 38,
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FF4D4F',
    marginVertical: 6,
  },
  buyBtn: {
    height: 36,
    borderRadius: 8,
    backgroundColor: '#FF4D4F',
    paddingHorizontal: 0,
    width: '100%',
  },
  buyBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default memo(ProductCard);

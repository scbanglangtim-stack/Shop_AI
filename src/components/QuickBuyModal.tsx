// src/components/QuickBuyModal.tsx
// Bảng thao tác nhanh Thêm giỏ hàng / Mua ngay khi bấm vào sản phẩm
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  ImageSourcePropType,
  Alert,
} from 'react-native';
import { Product } from '../types/product.schema';
import { useTheme } from '@contexts/ThemeContext';
import { useCartStore } from '@store/useCartStore';
import ShopButton from '@components/ShopButton';
import { COLORS, SIZES, SHADOWS } from '@constants/theme';
import { hapticLight, hapticSuccess, hapticMedium } from '@utils/haptics';

interface QuickBuyModalProps {
  visible: boolean;
  product: Product | null;
  onClose: () => void;
  onViewDetail?: (productId: string) => void;
  onBuyNow?: (product: Product, quantity: number) => void;
}

const QuickBuyModal: React.FC<QuickBuyModalProps> = ({
  visible,
  product,
  onClose,
  onViewDetail,
  onBuyNow,
}) => {
  const { colors, isDark } = useTheme();
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);

  // Reset lại số lượng về 1 mỗi khi mở sản phẩm mới
  useEffect(() => {
    if (visible) {
      setQuantity(1);
    }
  }, [visible, product?.id]);

  if (!product) return null;

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
    hapticLight();
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
      hapticLight();
    }
  };

  const handleAddToCart = () => {
    addItem(product, quantity);
    hapticSuccess();
    onClose();
    Alert.alert(
      '🛒 Đã thêm vào giỏ hàng',
      `Đã thêm ${quantity}x "${product.name}" vào giỏ hàng thành công!`,
    );
  };

  const handleBuyNowPress = () => {
    addItem(product, quantity);
    hapticMedium();
    onClose();
    if (onBuyNow) {
      onBuyNow(product, quantity);
    }
  };

  const handleDetailPress = () => {
    onClose();
    if (onViewDetail) {
      onViewDetail(product.id);
    }
  };

  const imageSource: ImageSourcePropType =
    typeof product.image === 'string' ? { uri: product.image } : product.image;

  const subtotal = product.price * quantity;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        {/* Bấm vào vùng nền đen mờ để đóng */}
        <Pressable style={styles.backdropPressable} onPress={onClose} />

        <View
          style={[
            styles.sheetContainer,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          {/* Thanh gạt trên cùng */}
          <View style={styles.dragHandle} />

          {/* Nút đóng góc phải */}
          <Pressable style={styles.closeBtn} onPress={onClose}>
            <Text style={[styles.closeBtnText, { color: colors.textLight }]}>✕</Text>
          </Pressable>

          {/* 1. Thông tin tóm tắt sản phẩm */}
          <View style={styles.productRow}>
            <Image source={imageSource} style={styles.thumbnail} resizeMode="cover" />
            <View style={styles.productMeta}>
              {product.category && (
                <View
                  style={[
                    styles.categoryTag,
                    { backgroundColor: isDark ? '#33261D' : '#FFF2E8' },
                  ]}
                >
                  <Text style={styles.categoryText}>{product.category}</Text>
                </View>
              )}
              <Text
                style={[styles.productName, { color: colors.text }]}
                numberOfLines={2}
              >
                {product.name}
              </Text>
              <Text style={styles.productPrice}>
                {product.price.toLocaleString('vi-VN')} đ
              </Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* 2. Bộ chọn số lượng */}
          <View style={styles.quantitySection}>
            <View>
              <Text style={[styles.quantityLabel, { color: colors.text }]}>
                Số lượng đặt mua
              </Text>
              <Text style={[styles.subtotalText, { color: colors.textLight }]}>
                Tạm tính: <Text style={styles.subtotalHighlight}>{subtotal.toLocaleString('vi-VN')} đ</Text>
              </Text>
            </View>

            <View style={[styles.counterBox, { borderColor: colors.border }]}>
              <Pressable
                style={[
                  styles.counterBtn,
                  quantity <= 1 && styles.counterBtnDisabled,
                ]}
                onPress={handleDecrement}
                disabled={quantity <= 1}
              >
                <Text
                  style={[
                    styles.counterBtnText,
                    { color: quantity <= 1 ? colors.textLight : colors.text },
                  ]}
                >
                  -
                </Text>
              </Pressable>

              <View style={styles.counterValueBox}>
                <Text style={[styles.counterValue, { color: colors.text }]}>
                  {quantity}
                </Text>
              </View>

              <Pressable style={styles.counterBtn} onPress={handleIncrement}>
                <Text style={[styles.counterBtnText, { color: colors.text }]}>
                  +
                </Text>
              </Pressable>
            </View>
          </View>

          {/* 3. Các nút hành động: Thêm vào giỏ & Mua ngay */}
          <View style={styles.actionButtonsRow}>
            <ShopButton
              title="🛒 Thêm vào giỏ"
              variant="outline"
              onPress={handleAddToCart}
              style={styles.cartButton}
              textStyle={{ fontSize: 14 }}
            />
            <ShopButton
              title="⚡ Mua ngay"
              onPress={handleBuyNowPress}
              style={styles.buyButton}
              textStyle={{ fontSize: 14 }}
            />
          </View>

          {/* 4. Đường dẫn xem chi tiết */}
          <Pressable style={styles.detailLink} onPress={handleDetailPress}>
            <Text style={[styles.detailLinkText, { color: colors.primary }]}>
              Xem chi tiết đầy đủ sản phẩm ➔
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  backdropPressable: {
    flex: 1,
  },
  sheetContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 28,
    ...SHADOWS.medium,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 12,
  },
  closeBtn: {
    position: 'absolute',
    top: 14,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeBtnText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 24,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  productMeta: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  categoryTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 11,
    color: '#FA541C',
    fontWeight: '700',
  },
  productName: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.primary,
  },
  divider: {
    height: 1,
    marginVertical: 14,
  },
  quantitySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  quantityLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  subtotalText: {
    fontSize: 12,
    marginTop: 2,
  },
  subtotalHighlight: {
    fontWeight: '700',
    color: COLORS.primary,
  },
  counterBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  counterBtn: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  counterBtnDisabled: {
    opacity: 0.4,
  },
  counterBtnText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  counterValueBox: {
    minWidth: 40,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  counterValue: {
    fontSize: 15,
    fontWeight: '700',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  cartButton: {
    flex: 1,
    height: 46,
    borderRadius: 12,
  },
  buyButton: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
  },
  detailLink: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  detailLinkText: {
    fontSize: 13,
    fontWeight: '600',
  },
});

export default QuickBuyModal;

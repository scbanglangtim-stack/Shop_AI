// src/components/ui/ShopButton.tsx
// Atom ShopButton - Nút bấm đa năng với 3 biến thể: Primary, Secondary, Outline (Chương 3.1 & Sprint 3)
import React, { memo } from 'react';
import {
  Pressable,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import Typography from './Typography';
import { COLORS, SIZES, SHADOWS } from '@constants/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline';

export interface ShopButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  isLoading?: boolean;
  loading?: boolean; // Hỗ trợ cả 2 cách đặt tên prop
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  accessibilityLabel?: string;
}

const ShopButton = ({
  title,
  onPress,
  variant = 'primary',
  isLoading = false,
  loading = false,
  disabled = false,
  style,
  textStyle,
  accessibilityLabel,
}: ShopButtonProps) => {
  const isPending = isLoading || loading;
  const isOutline = variant === 'outline';
  const isSecondary = variant === 'secondary';

  const getTextColor = () => {
    if (disabled) return COLORS.textLight;
    if (isOutline) return COLORS.primary;
    return COLORS.surface;
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || isPending}
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.button,
        isSecondary && styles.secondary,
        isOutline && styles.outline,
        disabled && styles.disabledButton,
        pressed && !disabled && !isPending && styles.pressed,
        style,
      ]}
    >
      {isPending ? (
        <ActivityIndicator size="small" color={isOutline ? COLORS.primary : COLORS.surface} />
      ) : (
        <Typography
          variant="body1"
          color={getTextColor()}
          style={[{ fontWeight: '700', textAlign: 'center' }, textStyle]}
        >
          {title}
        </Typography>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary,
    height: 48,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    width: '100%',
    ...SHADOWS.light,
  },
  secondary: {
    backgroundColor: COLORS.secondary,
    elevation: 2,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    elevation: 0,
    shadowOpacity: 0,
  },
  disabledButton: {
    backgroundColor: '#E0E0E0',
    borderColor: '#E0E0E0',
    elevation: 0,
    shadowOpacity: 0,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.985 }],
  },
});

export default memo(ShopButton);

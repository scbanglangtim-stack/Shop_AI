// src/components/ui/ShopButton.tsx
import React, { memo } from 'react';
import {
  Pressable,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { COLORS, SIZES } from '@constants/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline';

interface ShopButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
}

const ShopButton = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
}: ShopButtonProps) => {
  const isOutline = variant === 'outline';
  const isSecondary = variant === 'secondary';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        isSecondary && styles.secondary,
        isOutline && styles.outline,
        disabled && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={isOutline ? COLORS.primary : COLORS.surface}
          size="small"
        />
      ) : (
        <Text
          style={[
            styles.text,
            isOutline && styles.outlineText,
            disabled && styles.disabledText,
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    height: 48,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    elevation: 2,
  },
  secondary: {
    backgroundColor: COLORS.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    elevation: 0,
  },
  disabled: {
    backgroundColor: '#BDC3C7',
    borderColor: '#BDC3C7',
    elevation: 0,
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },
  text: {
    color: COLORS.surface,
    fontSize: SIZES.font,
    fontWeight: '700',
  },
  outlineText: {
    color: COLORS.primary,
  },
  disabledText: {
    color: '#7F8C8D',
  },
});

export default memo(ShopButton);

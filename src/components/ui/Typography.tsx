// src/components/ui/Typography.tsx
// Atom Typography - Hiển thị văn bản theo chuẩn Design Tokens (Chương 3.1 & Sprint 3)
import React, { memo } from 'react';
import { Text, TextStyle, StyleProp, TextProps } from 'react-native';
import { COLORS, FONTS } from '@constants/theme';

export type TypographyVariant = keyof typeof FONTS;

interface TypographyProps extends TextProps {
  variant?: TypographyVariant;
  color?: string;
  style?: StyleProp<TextStyle>;
  children: React.ReactNode;
}

const Typography = ({
  variant = 'body1',
  color = COLORS.text,
  style,
  children,
  numberOfLines,
  ...props
}: TypographyProps) => {
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[FONTS[variant] || FONTS.body1, { color }, style]}
      {...props}
    >
      {children}
    </Text>
  );
};

export default memo(Typography);

// src/components/ui/Typography.tsx
import React, { memo } from 'react';
import { Text, TextStyle, StyleSheet, TextProps } from 'react-native';
import { COLORS, SIZES } from '@constants/theme';

export type TypographyVariant = 'h1' | 'h2' | 'h3' | 'body' | 'caption';

interface TypographyProps extends TextProps {
  variant?: TypographyVariant;
  color?: string;
  style?: TextStyle | TextStyle[];
  children: React.ReactNode;
}

const Typography = ({
  variant = 'body',
  color = COLORS.text,
  style,
  children,
  ...props
}: TypographyProps) => {
  return (
    <Text
      style={[
        styles.base,
        styles[variant],
        { color },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    color: COLORS.text,
  },
  h1: {
    fontSize: SIZES.h1,
    fontWeight: '800',
    lineHeight: 34,
  },
  h2: {
    fontSize: SIZES.h2,
    fontWeight: '700',
    lineHeight: 28,
  },
  h3: {
    fontSize: SIZES.h3,
    fontWeight: '700',
    lineHeight: 24,
  },
  body: {
    fontSize: SIZES.body,
    fontWeight: '400',
    lineHeight: 20,
  },
  caption: {
    fontSize: SIZES.caption,
    fontWeight: '400',
    lineHeight: 16,
  },
});

export default memo(Typography);

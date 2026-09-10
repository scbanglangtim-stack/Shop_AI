// src/components/ui/ShopInput.tsx
// Atom ShopInput - Ô nhập liệu chuẩn hóa Controlled Component (Chương 2.6.4, 3.1 & Sprint 3)
import React, { memo } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  StyleProp,
  TextStyle,
} from 'react-native';
import Typography from './Typography';
import { COLORS, SIZES } from '@constants/theme';

interface ShopInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
}

const ShopInput = ({
  label,
  error,
  containerStyle,
  inputStyle,
  style,
  ...props
}: ShopInputProps) => {
  return (
    <View style={[styles.wrap, containerStyle]}>
      {label ? (
        <Typography variant="body2" style={styles.label}>
          {label}
        </Typography>
      ) : null}
      <TextInput
        placeholderTextColor={COLORS.textLight}
        style={[styles.input, error ? styles.inputError : null, inputStyle, style]}
        {...props}
      />
      {error ? (
        <Typography variant="small" color={COLORS.error} style={styles.errorText}>
          {error}
        </Typography>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    marginBottom: SIZES.padding,
    width: '100%',
  },
  label: {
    marginBottom: 6,
    fontWeight: '600',
    color: COLORS.text,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.padding,
    backgroundColor: COLORS.surface,
    fontSize: SIZES.body1,
    color: COLORS.text,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    marginTop: 4,
    color: COLORS.error,
  },
});

export default memo(ShopInput);

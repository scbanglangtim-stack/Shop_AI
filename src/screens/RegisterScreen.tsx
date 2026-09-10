// src/screens/RegisterScreen.tsx
// Màn hình Đăng ký tài khoản trong AuthStack (Chương 5 Sprint 5)
import React, { useState } from 'react';
import { Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import ShopButton from '@components/ShopButton';
import ShopInput from '@components/ui/ShopInput';
import { COLORS, SIZES } from '@constants/theme';

interface RegisterScreenProps {
  onRegistered: (token: string) => void;
  onGoLogin: () => void;
}

const RegisterScreen = ({ onRegistered, onGoLogin }: RegisterScreenProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirm?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next: typeof errors = {};
    if (name.trim().length < 2) {
      next.name = 'Họ tên tối thiểu 2 ký tự';
    }
    if (!email.includes('@')) {
      next.email = 'Email không hợp lệ (phải chứa ký tự @)';
    }
    if (password.length < 6) {
      next.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    if (confirm !== password) {
      next.confirm = 'Xác nhận mật khẩu không khớp';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleRegister = () => {
    if (!validate()) return;
    setLoading(true);
    // Ch.5: Giả lập đăng ký thành công -> cấp token
    setTimeout(() => {
      setLoading(false);
      onRegistered('mock_token_123');
    }, 1000);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Tạo tài khoản</Text>
      <Text style={styles.subtitle}>Đăng ký để mua sắm trên ShopAI</Text>

      <ShopInput
        label="Họ tên"
        placeholder="Nguyễn Văn A"
        value={name}
        onChangeText={setName}
        error={errors.name}
      />

      <ShopInput
        label="Email"
        placeholder="you@example.com"
        value={email}
        onChangeText={setEmail}
        error={errors.email}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <ShopInput
        label="Mật khẩu"
        placeholder="Ít nhất 6 ký tự"
        value={password}
        onChangeText={setPassword}
        error={errors.password}
        secureTextEntry
      />

      <ShopInput
        label="Xác nhận mật khẩu"
        placeholder="Nhập lại mật khẩu"
        value={confirm}
        onChangeText={setConfirm}
        error={errors.confirm}
        secureTextEntry
      />

      <ShopButton
        title="Đăng ký ngay"
        onPress={handleRegister}
        isLoading={loading}
        style={styles.submitBtn}
      />

      <Pressable onPress={onGoLogin} style={styles.loginLink}>
        <Text style={styles.loginLinkText}>
          Đã có tài khoản? <Text style={styles.loginLinkBold}>Đăng nhập</Text>
        </Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    padding: SIZES.padding,
    paddingVertical: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: SIZES.body1,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: 24,
  },
  submitBtn: {
    marginTop: 8,
  },
  loginLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginLinkText: {
    fontSize: SIZES.body2,
    color: COLORS.textLight,
  },
  loginLinkBold: {
    color: COLORS.primary,
    fontWeight: '700',
  },
});

export default RegisterScreen;

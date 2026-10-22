// src/screens/RegisterScreen.tsx
// Màn hình Đăng ký tài khoản trong AuthStack & Zustand (Chương 5.2 & 6.3)
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import ShopButton from '@components/ShopButton';
import ShopInput from '@components/ui/ShopInput';
import { COLORS, SIZES } from '@constants/theme';
import axiosClient from '@api/axiosClient';
import { registerLocalUser } from '@services/localDbService';

const RegisterScreen = () => {
  const navigation = useNavigation<any>();
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
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next: typeof errors = {};
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (trimmedName.length < 2) {
      next.name = 'Họ tên tối thiểu 2 ký tự';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      next.email = 'Email không hợp lệ (ví dụ: user@example.com)';
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

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    setServerError(null);

    const normalizedEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    try {
      try {
        await axiosClient.post(
          '/api/auth/register',
          {
            email: normalizedEmail,
            password,
            name: cleanName,
          },
          { timeout: 1500 }
        );
      } catch (backendErr: any) {
        if (backendErr?.response?.data?.message) {
          const msg = backendErr.response.data.message;
          throw new Error(Array.isArray(msg) ? msg.join(', ') : msg);
        }
        // Khi không có backend mạng LAN -> Đăng ký vào Local Database Engine
        await registerLocalUser({
          email: normalizedEmail,
          password,
          name: cleanName,
        });
      }

      // Theo yêu cầu: Đăng ký xong KHÔNG auto-login mà hiển thị thông báo và chuyển sang màn hình Đăng nhập
      Alert.alert(
        '🎉 Đăng ký thành công',
        'Tài khoản của bạn đã được tạo thành công! Vui lòng nhập đúng tài khoản vừa tạo để đăng nhập vào ShopAI.',
        [
          {
            text: 'Đăng nhập ngay',
            onPress: () => navigation.navigate('Login', { prefillEmail: normalizedEmail }),
          },
        ],
        { cancelable: false }
      );
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message;
      setServerError(
        Array.isArray(msg)
          ? msg.join(', ')
          : msg ?? 'Không thể đăng ký tài khoản. Vui lòng thử lại.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
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

          {serverError && <Text style={styles.errorText}>⚠️ {serverError}</Text>}

          <ShopButton
            title="Đăng ký ngay"
            onPress={handleRegister}
            isLoading={loading}
            style={styles.submitBtn}
          />

          <Pressable onPress={() => navigation.navigate('Login')} style={styles.loginLink}>
            <Text style={styles.loginLinkText}>
              Đã có tài khoản? <Text style={styles.loginLinkBold}>Đăng nhập</Text>
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    padding: SIZES.padding,
    paddingVertical: 24,
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
  errorText: {
    color: COLORS.danger,
    fontSize: SIZES.body2,
    textAlign: 'center',
    marginBottom: 12,
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

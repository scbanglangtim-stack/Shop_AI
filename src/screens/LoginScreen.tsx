// src/screens/LoginScreen.tsx
// Màn hình Đăng nhập chuẩn Auth Flow & Zustand (Chương 5.2 & 6.3)
import React, { useState, useEffect } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import ShopButton from '@components/ShopButton';
import ShopInput from '@components/ui/ShopInput';
import { COLORS, SIZES } from '@constants/theme';
import { useAuthStore } from '@store/useAuthStore';
import axiosClient from '@api/axiosClient';
import { loginLocalUser, saveCurrentSessionUser } from '@services/localDbService';

const LoginScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const login = useAuthStore((state) => state.login);

  // Tự động điền email nếu vừa đăng ký thành công chuyển sang
  useEffect(() => {
    if (route.params?.prefillEmail) {
      setEmail(route.params.prefillEmail);
    }
  }, [route.params?.prefillEmail]);

  const validate = () => {
    const next: { email?: string; password?: string } = {};
    const trimmedEmail = email.trim();
    if (!trimmedEmail.includes('@')) {
      next.email = 'Email không hợp lệ (phải chứa ký tự @)';
    }
    if (password.length < 6) {
      next.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    setServerError(null);

    const normalizedEmail = email.trim().toLowerCase();

    try {
      let token: string | null = null;
      let loggedUser: any = null;

      try {
        const response = await axiosClient.post(
          '/api/auth/login',
          { email: normalizedEmail, password },
          { timeout: 1500 }
        );
        token = response.data.accessToken;
        loggedUser = response.data.user || {
          email: normalizedEmail,
          name: normalizedEmail.split('@')[0],
        };
      } catch (backendErr: any) {
        if (backendErr?.response?.status === 401) {
          throw new Error('Email hoặc mật khẩu không chính xác!');
        }
        // Khi offline / không cắm máy tính -> Chạy bộ xác thực Local Database Engine
        const localRes = await loginLocalUser({ email: normalizedEmail, password });
        token = localRes.accessToken;
        loggedUser = localRes.user;
      }

      if (token) {
        await saveCurrentSessionUser(loggedUser);
        await login(token);
      }
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message;
      setServerError(
        Array.isArray(msg)
          ? msg.join(', ')
          : msg ?? 'Tài khoản chưa tồn tại hoặc sai mật khẩu. Vui lòng kiểm tra lại!'
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
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerBox}>
            <Text style={styles.brandIcon}>🛍️</Text>
            <Text style={styles.title}>ShopAI</Text>
            <Text style={styles.subtitle}>Đăng nhập để mua sắm & trải nghiệm công nghệ AI</Text>
          </View>

          <View style={styles.formCard}>
            <ShopInput
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                if (serverError) setServerError(null);
              }}
              error={errors.email}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <ShopInput
              label="Mật khẩu"
              placeholder="Ít nhất 6 ký tự"
              value={password}
              onChangeText={(p) => {
                setPassword(p);
                if (serverError) setServerError(null);
              }}
              error={errors.password}
              secureTextEntry
            />

            {serverError && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>⚠️ {serverError}</Text>
              </View>
            )}

            <ShopButton
              title="Đăng nhập ngay"
              onPress={handleLogin}
              isLoading={loading}
              style={styles.loginBtn}
            />

            <View style={styles.demoAccountBox}>
              <Text style={styles.demoTitle}>💡 Tài khoản mặc định có sẵn trên máy:</Text>
              <Text style={styles.demoText}>• Email: demo@shopai.com</Text>
              <Text style={styles.demoText}>• Mật khẩu: 123456</Text>
              <Text style={styles.demoHint}>
                (Hoặc bạn có thể bấm Đăng ký tài khoản mới bên dưới)
              </Text>
            </View>

            <Pressable onPress={() => navigation.navigate('Register')} style={styles.registerLink}>
              <Text style={styles.registerLinkText}>
                Chưa có tài khoản? <Text style={styles.registerLinkBold}>Đăng ký ngay</Text>
              </Text>
            </Pressable>
          </View>
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: SIZES.padding,
    paddingVertical: 20,
  },
  headerBox: {
    alignItems: 'center',
    marginBottom: 24,
  },
  brandIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: COLORS.primary,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: SIZES.body2,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 16,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  errorContainer: {
    backgroundColor: '#FFF1F0',
    borderColor: '#FFA39E',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 14,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '500',
  },
  loginBtn: {
    marginTop: 6,
  },
  demoAccountBox: {
    marginTop: 18,
    padding: 12,
    backgroundColor: '#F6FFED',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#B7EB8F',
  },
  demoTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#389E0D',
    marginBottom: 4,
  },
  demoText: {
    fontSize: 12,
    color: '#237804',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  demoHint: {
    fontSize: 11,
    color: '#52C41A',
    fontStyle: 'italic',
    marginTop: 4,
  },
  registerLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  registerLinkText: {
    fontSize: SIZES.body2,
    color: COLORS.textLight,
  },
  registerLinkBold: {
    color: COLORS.primary,
    fontWeight: '700',
  },
});

export default LoginScreen;

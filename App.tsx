// App.tsx
// Cấu hình Toàn diện: Hardware Keystore, Biometric Lock, App Lock, React Query, Redux Toolkit, Zustand & Navigation (Chương 8)
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider as ReduxProvider } from 'react-redux';
import { ThemeProvider } from '@contexts/ThemeContext';
import LoginScreen from '@screens/LoginScreen';
import RegisterScreen from '@screens/RegisterScreen';
import BiometricGateScreen from '@screens/BiometricGateScreen';
import RootStackNavigator from '@navigation/RootStackNavigator';
import { useAuthStore } from '@store/useAuthStore';
import { reduxStore } from '@store/redux/store';
import { useAppLock } from '@hooks/useAppLock';
import { COLORS } from '@constants/theme';

// 1. Cấu hình TanStack Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Dữ liệu được coi là "Tươi" trong 5 phút
      retry: 2, // Thử lại tối đa 2 lần khi gặp lỗi mạng
    },
  },
});

// 2. AuthStack cho luồng chưa đăng nhập (Login & Register)
const AuthStack = createNativeStackNavigator();

// 3. Cấu hình Deep Linking
const linking: LinkingOptions<any> = {
  prefixes: ['shopai://'],
  config: {
    screens: {
      MainTabs: {
        screens: {
          HomeTab: {
            screens: {
              ProductDetail: 'product/:productId',
            },
          },
          Cart: 'cart',
          Orders: 'orders',
        },
      },
      Checkout: 'checkout',
      OrderDetail: 'order/:orderId',
    },
  },
};

function App(): React.JSX.Element {
  // Lấy trạng thái xác thực từ Hardware-backed Keystore Zustand Store
  const token = useAuthStore((state) => state.token);
  const isLoading = useAuthStore((state) => state.isLoading);
  const isUnlocked = useAuthStore((state) => state.isUnlocked);
  const checkLocalToken = useAuthStore((state) => state.checkLocalToken);
  const setIsUnlocked = useAuthStore((state) => state.setIsUnlocked);

  // Móc vào ổ cứng SecureStore (Keystore/Keychain) ngay khi App khởi chạy
  useEffect(() => {
    checkLocalToken();
  }, [checkLocalToken]);

  // Canh gác App Lock: tự động khóa lại nếu app ở nền quá 2 phút (Phần 8.12)
  useAppLock({ isUnlocked, setIsUnlocked });

  // 1. Nếu đang kiểm tra SecureStore Keystore -> hiện màn hình Loading
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // 2. Đã có Token nhưng chưa vượt qua cổng Sinh trắc học -> Hiện BiometricGateScreen
  if (token != null && !isUnlocked) {
    return <BiometricGateScreen onUnlock={() => setIsUnlocked(true)} />;
  }

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ReduxProvider store={reduxStore}>
          <ThemeProvider>
            <NavigationContainer linking={linking}>
              {token == null ? (
                // ==================== LUỒNG 1: CHƯA ĐĂNG NHẬP (AuthStack) ====================
                <AuthStack.Navigator screenOptions={{ headerShown: false }}>
                  <AuthStack.Screen name="Login" component={LoginScreen} />
                  <AuthStack.Screen name="Register" component={RegisterScreen} />
                </AuthStack.Navigator>
              ) : (
                // ==================== LUỒNG 2: ĐÃ ĐĂNG NHẬP (RootStackNavigator) =============
                // Chứa MainTabs, Checkout Modal và OrderDetail
                <RootStackNavigator />
              )}
            </NavigationContainer>
          </ThemeProvider>
        </ReduxProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

export default App;

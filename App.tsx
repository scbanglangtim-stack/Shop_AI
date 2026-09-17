// App.tsx
// Cấu hình Toàn diện: React Query, Redux Toolkit, Zustand Auth/Cart/Orders, ThemeContext & React Navigation
import React from 'react';
import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider as ReduxProvider } from 'react-redux';
import { ThemeProvider } from '@contexts/ThemeContext';
import LoginScreen from '@screens/LoginScreen';
import RegisterScreen from '@screens/RegisterScreen';
import RootStackNavigator from '@navigation/RootStackNavigator';
import { useAuthStore } from '@store/useAuthStore';
import { reduxStore } from '@store/redux/store';

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
  // Lấy Token xác thực trực tiếp từ Zustand Store
  const token = useAuthStore((state) => state.token);

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

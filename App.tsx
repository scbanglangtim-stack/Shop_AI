// App.tsx - Cấu hình Tối Thượng: Auth Flow State Machine, React Navigation V7 & Deep Linking
import React, { useState } from 'react';
import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '@contexts/ThemeContext';
import LoginScreen from '@screens/LoginScreen';
import RegisterScreen from '@screens/RegisterScreen';
import MainTabNavigator from '@navigation/MainTabNavigator';

// 1. AuthStack cho luồng Chưa xác thực (Login & Register)
const AuthStack = createNativeStackNavigator();

// 2. Cấu hình Deep Linking: shopai://product/:productId mở thẳng vào ProductDetail
const linking: LinkingOptions<any> = {
  prefixes: ['shopai://'],
  config: {
    screens: {
      HomeTab: {
        screens: {
          ProductDetail: 'product/:productId',
        },
      },
      Cart: 'cart',
    },
  },
};

function App(): React.JSX.Element {
  // State Machine quản lý Token người dùng (Chương 6 sẽ chuyển vào Zustand Store)
  const [userToken, setUserToken] = useState<string | null>(null);

  return (
    <SafeAreaProvider>
      {/* ThemeProvider bọc toàn app để cả luồng Auth lẫn Main đều truy cập được useTheme */}
      <ThemeProvider>
        <NavigationContainer linking={linking}>
          {userToken == null ? (
            // ==================== LUỒNG 1: CHƯA ĐĂNG NHẬP (AuthStack) ====================
            // Không thể bấm Back lách luật vào MainTabs vì cây MainTabs chưa hề tồn tại trong bộ nhớ
            <AuthStack.Navigator screenOptions={{ headerShown: false }}>
              <AuthStack.Screen name="Login">
                {({ navigation }) => (
                  <LoginScreen
                    onLogin={(token: string) => setUserToken(token)}
                    onGoRegister={() => navigation.navigate('Register')}
                  />
                )}
              </AuthStack.Screen>

              <AuthStack.Screen name="Register">
                {({ navigation }) => (
                  <RegisterScreen
                    onRegistered={(token: string) => setUserToken(token)}
                    onGoLogin={() => navigation.navigate('Login')}
                  />
                )}
              </AuthStack.Screen>
            </AuthStack.Navigator>
          ) : (
            // ==================== LUỒNG 2: ĐÃ ĐĂNG NHẬP (MainTabNavigator) ====================
            // Cấp quyền truy cập toàn bộ Bottom Tab (HomeTab + Cart)
            <MainTabNavigator onLogout={() => setUserToken(null)} cartBadgeCount={2} />
          )}
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default App;

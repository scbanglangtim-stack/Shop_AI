// src/navigation/MainTabNavigator.tsx
// Thanh điều hướng đáy Bottom Tab Navigator mở rộng cho Chương 6
import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStackNavigator from '@navigation/HomeStackNavigator';
import CartScreen from '@screens/CartScreen';
import OrdersScreen from '@screens/OrdersScreen';
import ReduxCartDemoScreen from '@screens/ReduxCartDemoScreen';
import { COLORS } from '@constants/theme';
import { useCartStore } from '@store/useCartStore';

let IconComponent: any = null;
try {
  IconComponent = require('react-native-vector-icons/MaterialCommunityIcons').default;
} catch {
  IconComponent = null;
}

export type MainTabParamList = {
  HomeTab: undefined;
  Cart: undefined;
  Orders: undefined;
  ReduxDemo: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator = () => {
  const totalQuantity = useCartStore((state) => state.totalQuantity());

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#F0F0F0',
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      {/* 1. Tab Trang chủ */}
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ color, size }) => {
            if (IconComponent) {
              return <IconComponent name="home-variant-outline" color={color} size={size} />;
            }
            return <Text style={{ fontSize: size - 4, color }}>🏠</Text>;
          },
        }}
      />

      {/* 2. Tab Giỏ hàng với Badge số lượng động từ useCartStore */}
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          title: 'Giỏ hàng',
          tabBarIcon: ({ color, size }) => {
            if (IconComponent) {
              return <IconComponent name="cart-outline" color={color} size={size} />;
            }
            return <Text style={{ fontSize: size - 4, color }}>🛒</Text>;
          },
          tabBarBadge: totalQuantity > 0 ? totalQuantity : undefined,
          tabBarBadgeStyle: {
            backgroundColor: COLORS.primary,
            color: '#FFFFFF',
            fontSize: 10,
            fontWeight: '700',
          },
        }}
      />

      {/* 3. Tab Đơn hàng (Lịch sử hóa đơn PENDING/PAID) */}
      <Tab.Screen
        name="Orders"
        component={OrdersScreen}
        options={{
          title: 'Đơn hàng',
          tabBarIcon: ({ color, size }) => {
            if (IconComponent) {
              return <IconComponent name="receipt-text-outline" color={color} size={size} />;
            }
            return <Text style={{ fontSize: size - 4, color }}>📋</Text>;
          },
        }}
      />

      {/* 4. Tab Redux Toolkit Demo (Chuẩn Đề Cương) */}
      <Tab.Screen
        name="ReduxDemo"
        component={ReduxCartDemoScreen}
        options={{
          title: 'Redux RTK',
          tabBarIcon: ({ color, size }) => {
            if (IconComponent) {
              return <IconComponent name="cube-outline" color={color} size={size} />;
            }
            return <Text style={{ fontSize: size - 4, color }}>⚛️</Text>;
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;

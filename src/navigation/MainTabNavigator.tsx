// src/navigation/MainTabNavigator.tsx
// Thanh điều hướng đáy Bottom Tab Navigator (Chương 5.1 & Sprint 5)
import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStackNavigator from '@navigation/HomeStackNavigator';
import CartScreen from '@screens/CartScreen';
import { COLORS } from '@constants/theme';

let IconComponent: any = null;
try {
  IconComponent = require('react-native-vector-icons/MaterialCommunityIcons').default;
} catch {
  IconComponent = null;
}

const Tab = createBottomTabNavigator();

interface Props {
  onLogout: () => void;
  cartBadgeCount?: number;
}

const MainTabNavigator = ({ onLogout, cartBadgeCount = 2 }: Props) => {
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
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ color, size }) => {
            if (IconComponent) {
              return <IconComponent name="home-variant-outline" color={color} size={size} />;
            }
            return <Text style={{ fontSize: size - 4, color }}>🏠</Text>;
          },
        }}
      >
        {() => <HomeStackNavigator onLogout={onLogout} />}
      </Tab.Screen>

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
          tabBarBadge: cartBadgeCount > 0 ? cartBadgeCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: COLORS.primary,
            color: '#FFFFFF',
            fontSize: 10,
            fontWeight: '700',
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;

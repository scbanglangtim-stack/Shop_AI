// src/navigation/MainTabNavigator.tsx
// Thanh điều hướng đáy Bottom Tab Navigator cao cấp: Trang chủ, Hỏi AI, Giỏ hàng, Đơn hàng
import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeStackNavigator from '@navigation/HomeStackNavigator';
import AIChatScreen from '@screens/AIChatScreen';
import CartScreen from '@screens/CartScreen';
import OrdersScreen from '@screens/OrdersScreen';
import ProfileScreen from '@screens/ProfileScreen';
import { COLORS } from '@constants/theme';
import { useCartStore } from '@store/useCartStore';
import { useTheme } from '@contexts/ThemeContext';

let IconComponent: any = null;
try {
  IconComponent = require('react-native-vector-icons/MaterialCommunityIcons').default;
} catch {
  IconComponent = null;
}

export type MainTabParamList = {
  HomeTab: undefined;
  AIChat: undefined;
  Cart: undefined;
  Orders: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

interface TabIconProps {
  focused: boolean;
  color: string;
  size: number;
  iconName: string;
  outlineName: string;
  emoji: string;
  labelBadge?: string;
}

const TabIconItem: React.FC<TabIconProps> = ({
  focused,
  color,
  size,
  iconName,
  outlineName,
  emoji,
  labelBadge,
}) => {
  return (
    <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
      {IconComponent ? (
        <IconComponent
          name={focused ? iconName : outlineName}
          size={24}
          color={color}
        />
      ) : (
        <Text style={[styles.emojiIcon, { color }]}>
          {emoji}
        </Text>
      )}
      {labelBadge ? (
        <View style={styles.tabMiniBadge}>
          <Text style={styles.tabMiniBadgeText}>{labelBadge}</Text>
        </View>
      ) : null}
    </View>
  );
};

const MainTabNavigator = () => {
  const insets = useSafeAreaInsets();
  const totalQuantity = useCartStore((state) => state.totalQuantity());
  const { colors, isDark } = useTheme();

  // Đảm bảo chiều cao thanh Tab bar tính cả tai thỏ/thanh điều hướng Android, không bao giờ bị cắt icon
  const bottomInset = Math.max(insets.bottom, Platform.OS === 'android' ? 10 : 8);
  const tabHeight = 64 + bottomInset;

  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: isDark ? '#A0A0A0' : '#8C8C8C',
        tabBarStyle: {
          height: tabHeight,
          paddingTop: 8,
          paddingBottom: bottomInset,
          backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: isDark ? '#2C2C2E' : '#E8E8E8',
          elevation: 10,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: isDark ? 0.35 : 0.08,
          shadowRadius: 5,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginTop: 2,
          marginBottom: 0,
        },
      }}
    >
      {/* 1. Tab Trang chủ */}
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ focused, color, size }) => (
            <TabIconItem
              focused={focused}
              color={color}
              size={size}
              iconName="home-variant"
              outlineName="home-variant-outline"
              emoji="🏠"
            />
          ),
        }}
      />

      {/* 2. Tab Hỏi AI - Tính năng Trọng Tâm của ShopAI */}
      <Tab.Screen
        name="AIChat"
        component={AIChatScreen}
        options={{
          title: 'Hỏi AI',
          tabBarIcon: ({ focused, color, size }) => (
            <TabIconItem
              focused={focused}
              color={color}
              size={size}
              iconName="robot-happy"
              outlineName="robot-happy-outline"
              emoji="🤖"
              labelBadge="AI"
            />
          ),
        }}
      />

      {/* 3. Tab Giỏ hàng với Badge số lượng động từ useCartStore */}
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          title: 'Giỏ hàng',
          tabBarIcon: ({ focused, color, size }) => (
            <TabIconItem
              focused={focused}
              color={color}
              size={size}
              iconName="cart"
              outlineName="cart-outline"
              emoji="🛒"
            />
          ),
          tabBarBadge: totalQuantity > 0 ? totalQuantity : undefined,
          tabBarBadgeStyle: {
            backgroundColor: COLORS.primary,
            color: '#FFFFFF',
            fontSize: 10,
            fontWeight: '700',
            minWidth: 18,
            height: 18,
            borderRadius: 9,
            lineHeight: 18,
            alignSelf: 'center',
          },
        }}
      />

      {/* 4. Tab Đơn hàng (Lịch sử hóa đơn PENDING/PAID) */}
      <Tab.Screen
        name="Orders"
        component={OrdersScreen}
        options={{
          title: 'Đơn hàng',
          tabBarIcon: ({ focused, color, size }) => (
            <TabIconItem
              focused={focused}
              color={color}
              size={size}
              iconName="clipboard-text"
              outlineName="clipboard-text-outline"
              emoji="📋"
            />
          ),
        }}
      />

      {/* 5. Tab Tài khoản (Thông tin cá nhân, cài đặt hệ thống) - Ngoài cùng bên phải */}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Tài khoản',
          tabBarIcon: ({ focused, color, size }) => (
            <TabIconItem
              focused={focused}
              color={color}
              size={size}
              iconName="account-circle"
              outlineName="account-circle-outline"
              emoji="👤"
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconWrapper: {
    width: 48,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    overflow: 'visible',
  },
  iconWrapperActive: {
    backgroundColor: 'rgba(255, 77, 79, 0.14)',
  },
  emojiIcon: {
    fontSize: 20,
    lineHeight: 24,
    includeFontPadding: false,
    textAlign: 'center',
  },
  tabMiniBadge: {
    position: 'absolute',
    top: -2,
    right: -4,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 6,
  },
  tabMiniBadgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '800',
  },
});

export default MainTabNavigator;


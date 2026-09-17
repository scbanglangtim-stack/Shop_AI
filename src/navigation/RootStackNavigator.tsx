// src/navigation/RootStackNavigator.tsx
// Root Stack Navigator bọc ngoài MainTabs, Checkout Modal và OrderDetail (Chương 6.10 & Sprint 6)
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabNavigator from '@navigation/MainTabNavigator';
import CheckoutScreen from '@screens/CheckoutScreen';
import OrderDetailScreen from '@screens/OrderDetailScreen';

export type RootStackParamList = {
  MainTabs: undefined;
  Checkout: undefined;
  OrderDetail: { orderId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* 1. Nhánh chính: Toàn bộ MainTabNavigator */}
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />

      {/* 2. Modal Checkout: Trượt từ dưới lên, che toàn bộ Tab bar */}
      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{
          presentation: 'modal',
          headerShown: true,
          title: 'Thanh toán đơn hàng',
          headerTitleAlign: 'center',
        }}
      />

      {/* 3. Chi tiết hóa đơn */}
      <Stack.Screen
        name="OrderDetail"
        component={OrderDetailScreen}
        options={{
          headerShown: true,
          title: 'Chi tiết hóa đơn',
          headerTitleAlign: 'center',
          headerBackTitle: 'Quay lại',
        }}
      />
    </Stack.Navigator>
  );
};

export default RootStackNavigator;

// src/navigation/HomeStackNavigator.tsx
// Stack điều hướng nội bộ của Tab Trang chủ (Home -> ProductDetail)
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '@screens/HomeScreen';
import ProductDetailScreen from '@screens/ProductDetailScreen';
import ScannerScreen from '@screens/ScannerScreen';

export type HomeStackParamList = {
  Home: { scannedCode?: string } | undefined;
  ProductDetail: { productId: string };
  Scanner: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitle: 'Quay lại',
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{
          title: 'Chi tiết sản phẩm',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Scanner"
        component={ScannerScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default HomeStackNavigator;

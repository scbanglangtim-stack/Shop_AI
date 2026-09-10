// src/navigation/HomeStackNavigator.tsx
// Stack điều hướng nội bộ của Tab Trang chủ (Home -> ProductDetail)
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '@screens/HomeScreen';
import ProductDetailScreen from '@screens/ProductDetailScreen';

export type HomeStackParamList = {
  Home: undefined;
  ProductDetail: { productId: string };
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

interface Props {
  onLogout: () => void;
}

const HomeStackNavigator = ({ onLogout }: Props) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitle: 'Quay lại',
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen name="Home" options={{ headerShown: false }}>
        {() => <HomeScreen onLogout={onLogout} />}
      </Stack.Screen>
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{
          title: 'Chi tiết sản phẩm',
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
};

export default HomeStackNavigator;

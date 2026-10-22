// src/data/mockProducts.ts
// Dữ liệu sản phẩm mẫu và kho hàng từ Database
import { ImageSourcePropType } from 'react-native';
import { DEFAULT_DATABASE_PRODUCTS } from '@services/localDbService';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: ImageSourcePropType | string;
  category: string;
  rating: number;
  discount?: boolean;
}

export const MOCK_PRODUCTS: Product[] = DEFAULT_DATABASE_PRODUCTS;

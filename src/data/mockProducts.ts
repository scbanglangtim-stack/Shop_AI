// src/data/mockProducts.ts
// Dữ liệu sản phẩm mẫu cho Chương 4 Sprint 4 sử dụng local assets đảm bảo hiện ảnh 100% trên máy ảo
import { ImageSourcePropType } from 'react-native';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: ImageSourcePropType | string;
  category: string;
  rating: number;
  discount?: boolean;
}

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod_1',
    name: 'Tai nghe Bluetooth',
    price: 1500000,
    image: require('../assets/products/airpods.jpg'),
    category: 'Tai nghe',
    rating: 4.8,
  },
  {
    id: 'prod_2',
    name: 'Đồng hồ thông minh SE',
    price: 2300000,
    image: require('../assets/products/watch.jpg'),
    category: 'Đồng hồ',
    rating: 4.8,
  },
  {
    id: 'prod_3',
    name: 'Galaxy S21 Điện thoại Galaxy',
    price: 15990000,
    image: require('../assets/products/phone.jpg'),
    category: 'Điện thoại',
    rating: 4.8,
  },
  {
    id: 'prod_4',
    name: 'GaN Sạc nhanh 65W GaN',
    price: 850000,
    image: require('../assets/products/charger.jpg'),
    category: 'Phụ kiện',
    rating: 4.8,
  },
  {
    id: 'prod_5',
    name: 'MX Master Chuột không dây',
    price: 1100000,
    image: require('../assets/products/mouse.jpg'),
    category: 'Phụ kiện',
    rating: 4.8,
  },
  {
    id: 'prod_6',
    name: 'Anker Pin sạc dự phòng',
    price: 790000,
    image: require('../assets/products/powerbank.jpg'),
    category: 'Phụ kiện',
    rating: 4.8,
  },
  {
    id: 'prod_7',
    name: 'Logitech Webcam 4K Ultra',
    price: 1990000,
    image: require('../assets/products/webcam.jpg'),
    category: 'Phụ kiện',
    rating: 4.8,
  },
  {
    id: 'prod_8',
    name: 'Mechanical Bàn phím cơ K8',
    price: 2100000,
    image: require('../assets/products/keyboard.jpg'),
    category: 'Phụ kiện',
    rating: 4.8,
  },
  {
    id: 'prod_9',
    name: 'AirPods Pro 2 MagSafe',
    price: 4990000,
    image: require('../assets/products/airpods.jpg'),
    category: 'Tai nghe',
    rating: 4.9,
  },
  {
    id: 'prod_10',
    name: 'iPhone 15 Pro Max 256GB',
    price: 29990000,
    image: require('../assets/products/phone.jpg'),
    category: 'Điện thoại',
    rating: 5.0,
  },
];

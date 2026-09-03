// src/data/mockProducts.ts
// Dữ liệu sản phẩm mẫu cho Chương 4 Sprint 4 chuẩn xác theo giao diện minh chứng

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  discount?: boolean;
}

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod_1',
    name: 'Tai nghe Bluetooth',
    price: 1500000,
    image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400',
    category: 'Tai nghe',
    rating: 4.8,
  },
  {
    id: 'prod_2',
    name: 'Đồng hồ thông minh SE',
    price: 2300000,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    category: 'Đồng hồ',
    rating: 4.8,
  },
  {
    id: 'prod_3',
    name: 'Galaxy S21 Điện thoại Galaxy',
    price: 15990000,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400',
    category: 'Điện thoại',
    rating: 4.8,
  },
  {
    id: 'prod_4',
    name: 'GaN Sạc nhanh 65W GaN',
    price: 850000,
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400',
    category: 'Phụ kiện',
    rating: 4.8,
  },
  {
    id: 'prod_5',
    name: 'MX Master Chuột không dây',
    price: 1100000,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400',
    category: 'Phụ kiện',
    rating: 4.8,
  },
  {
    id: 'prod_6',
    name: 'Anker Pin sạc dự phòng',
    price: 790000,
    image: 'https://images.unsplash.com/photo-1609592424368-232a514d7a8a?w=400',
    category: 'Phụ kiện',
    rating: 4.8,
  },
  {
    id: 'prod_7',
    name: 'Logitech Webcam 4K Ultra',
    price: 1990000,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400',
    category: 'Phụ kiện',
    rating: 4.8,
  },
  {
    id: 'prod_8',
    name: 'Mechanical Bàn phím cơ K8',
    price: 2100000,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400',
    category: 'Phụ kiện',
    rating: 4.8,
  },
  {
    id: 'prod_9',
    name: 'AirPods Pro 2 MagSafe',
    price: 4990000,
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400',
    category: 'Tai nghe',
    rating: 4.9,
  },
  {
    id: 'prod_10',
    name: 'iPhone 15 Pro Max 256GB',
    price: 29990000,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
    category: 'Điện thoại',
    rating: 5.0,
  },
];

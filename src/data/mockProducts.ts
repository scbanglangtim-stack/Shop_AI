// src/data/mockProducts.ts
// Dữ liệu 50 sản phẩm mẫu cho Sprint 4 và các chương tiếp theo (Chương 4.3 & Sprint 4)

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  discount?: boolean;
}

const CATEGORIES = ['Điện thoại', 'Tai nghe', 'Đồng hồ', 'Phụ kiện', 'Laptop'];

const PRODUCT_NAMES = [
  'Tai nghe không dây AirPods Pro 2 MagSafe',
  'iPhone 15 Pro Max 256GB Titan Tự Nhiên',
  'Đồng hồ thông minh Apple Watch Ultra 2',
  'Củ sạc nhanh 65W GaN Type-C 3 cổng',
  'Cáp sạc bọc dù chống đứt Type-C to Lightning',
  'Pin sạc dự phòng không dây Magsafe 10000mAh',
  'Ốp lưng từ tính chống va đập chuẩn quân đội',
  'Bàn phím cơ Bluetooth RGB 3 chế độ kết nối',
  'Chuột công thái học không dây Silent Click',
  'Loa Bluetooth chống nước chuẩn IPX7 công suất lớn',
];

const IMAGES = [
  'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400',
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
  'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
  'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400',
  'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400',
  'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400',
];

export const MOCK_PRODUCTS: Product[] = Array.from({ length: 50 }).map((_, index) => {
  const nameBase = PRODUCT_NAMES[index % PRODUCT_NAMES.length];
  const category = CATEGORIES[index % CATEGORIES.length];
  const image = IMAGES[index % IMAGES.length];
  const price = 250000 + (index + 1) * 320000;
  const rating = 4.0 + Number(((index % 10) * 0.1).toFixed(1));

  return {
    id: `prod_${index + 1}`,
    name: `${nameBase} (Ver ${index + 1})`,
    price,
    image,
    category,
    rating: Math.min(5.0, rating),
    discount: index % 3 === 0,
  };
});

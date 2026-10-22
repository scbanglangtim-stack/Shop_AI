// src/services/localDbService.ts
// Hệ thống Cơ sở dữ liệu Nội bộ (Offline-First Local Database Engine)
// Cho phép ShopAI hoạt động 100% độc lập, không cần kết nối máy tính / NestJS backend
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setItemAsync, getItemAsync } from './secureStore';

export interface UserAccount {
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: string;
}

export interface LocalProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  discount?: boolean;
}

const LOCAL_USERS_KEY = '@shopai_local_users_db';
const CURRENT_USER_SESSION_KEY = '@shopai_current_user_session';
const LOCAL_PRODUCTS_KEY = '@shopai_local_products_db';

const DEFAULT_DEMO_USER: UserAccount = {
  id: 'usr_demo_001',
  email: 'demo@shopai.com',
  password: '123456',
  name: 'Khách hàng Demo',
  createdAt: new Date().toISOString(),
};

/** 27 sản phẩm thực tế từ Database bao gồm đủ 5 danh mục */
export const DEFAULT_DATABASE_PRODUCTS: LocalProduct[] = [
  // 1. Điện thoại
  {
    id: 'prod_1',
    name: 'iPhone 15 Pro Max 256GB Titan Tự Nhiên',
    price: 29990000,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80',
    category: 'Điện thoại',
    rating: 5.0,
    discount: true,
  },
  {
    id: 'prod_2',
    name: 'Samsung Galaxy S24 Ultra 512GB AI Phone',
    price: 28500000,
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&auto=format&fit=crop&q=80',
    category: 'Điện thoại',
    rating: 4.9,
    discount: true,
  },
  {
    id: 'prod_3',
    name: 'Xiaomi 14 Pro 5G Leica Snapdragon 8 Gen 3',
    price: 17990000,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80',
    category: 'Điện thoại',
    rating: 4.8,
  },
  {
    id: 'prod_4',
    name: 'Google Pixel 8 Pro AI Camera 128GB',
    price: 19500000,
    image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&auto=format&fit=crop&q=80',
    category: 'Điện thoại',
    rating: 4.8,
  },
  {
    id: 'prod_5',
    name: 'Samsung Galaxy S21 5G Chính Hãng',
    price: 12990000,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02560?w=600&auto=format&fit=crop&q=80',
    category: 'Điện thoại',
    rating: 4.7,
  },

  // 2. Laptop
  {
    id: 'prod_6',
    name: 'MacBook Air M2 13.6 inch 8GB/256GB Silver',
    price: 24490000,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
    category: 'Laptop',
    rating: 4.9,
    discount: true,
  },
  {
    id: 'prod_7',
    name: 'MacBook Pro 14 inch M3 Pro 18GB/512GB',
    price: 48990000,
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&auto=format&fit=crop&q=80',
    category: 'Laptop',
    rating: 5.0,
  },
  {
    id: 'prod_8',
    name: 'Dell XPS 13 Plus 9320 Core i7-1360P',
    price: 35900000,
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop&q=80',
    category: 'Laptop',
    rating: 4.8,
  },
  {
    id: 'prod_9',
    name: 'ASUS ROG Zephyrus G14 Gaming OLED RTX 4060',
    price: 39990000,
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80',
    category: 'Laptop',
    rating: 4.9,
  },
  {
    id: 'prod_10',
    name: 'Lenovo ThinkPad X1 Carbon Gen 11 Siêu Bền',
    price: 32500000,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop&q=80',
    category: 'Laptop',
    rating: 4.8,
  },

  // 3. Tai nghe
  {
    id: 'prod_11',
    name: 'Apple AirPods Pro 2 MagSafe USB-C',
    price: 5690000,
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80',
    category: 'Tai nghe',
    rating: 4.9,
    discount: true,
  },
  {
    id: 'prod_12',
    name: 'Tai nghe chụp tai Sony WH-1000XM5 Chống Ồn',
    price: 7990000,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    category: 'Tai nghe',
    rating: 5.0,
  },
  {
    id: 'prod_13',
    name: 'Tai nghe Marshall Major IV Wireless 80h Pin',
    price: 3290000,
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop&q=80',
    category: 'Tai nghe',
    rating: 4.7,
  },
  {
    id: 'prod_14',
    name: 'Samsung Galaxy Buds2 Pro 24-bit Hi-Fi',
    price: 2890000,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
    category: 'Tai nghe',
    rating: 4.8,
  },
  {
    id: 'prod_15',
    name: 'Tai nghe thể thao chống nước JBL Tune 230NC',
    price: 1490000,
    image: 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=600&auto=format&fit=crop&q=80',
    category: 'Tai nghe',
    rating: 4.6,
  },

  // 4. Đồng hồ
  {
    id: 'prod_16',
    name: 'Apple Watch Series 9 GPS 45mm Midnight',
    price: 9890000,
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80',
    category: 'Đồng hồ',
    rating: 4.9,
  },
  {
    id: 'prod_17',
    name: 'Đồng hồ thông minh Apple Watch SE Nhôm GPS',
    price: 5990000,
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80',
    category: 'Đồng hồ',
    rating: 4.8,
  },
  {
    id: 'prod_18',
    name: 'Samsung Galaxy Watch 6 LTE 44mm Graphite',
    price: 6490000,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    category: 'Đồng hồ',
    rating: 4.7,
  },
  {
    id: 'prod_19',
    name: 'Đồng hồ thể thao Garmin Venu 3 GPS AMOLED',
    price: 11290000,
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80',
    category: 'Đồng hồ',
    rating: 4.9,
  },
  {
    id: 'prod_20',
    name: 'Vòng đeo tay thông minh Xiaomi Band 8 Pro',
    price: 1290000,
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&auto=format&fit=crop&q=80',
    category: 'Đồng hồ',
    rating: 4.6,
  },

  // 5. Phụ kiện
  {
    id: 'prod_21',
    name: 'Củ sạc nhanh Baseus GaN 65W 3 cổng Type-C',
    price: 690000,
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80',
    category: 'Phụ kiện',
    rating: 4.8,
  },
  {
    id: 'prod_22',
    name: 'Chuột không dây Logitech MX Master 3S Darkfield',
    price: 2190000,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80',
    category: 'Phụ kiện',
    rating: 5.0,
  },
  {
    id: 'prod_23',
    name: 'Bàn phím cơ không dây Keychron K8 Pro RGB Hot-swap',
    price: 2450000,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
    category: 'Phụ kiện',
    rating: 4.9,
  },
  {
    id: 'prod_24',
    name: 'Pin sạc dự phòng Anker 20.000mAh 30W Power Delivery',
    price: 890000,
    image: 'https://images.unsplash.com/photo-1609592807664-8848c7757997?w=600&auto=format&fit=crop&q=80',
    category: 'Phụ kiện',
    rating: 4.8,
  },
  {
    id: 'prod_25',
    name: 'Webcam Logitech 4K Brio Ultra HD HDR Microphone',
    price: 3890000,
    image: 'https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=600&auto=format&fit=crop&q=80',
    category: 'Phụ kiện',
    rating: 4.8,
  },
  {
    id: 'prod_26',
    name: 'Đế sạc không dây 3 in 1 MagSafe Hít Nam Châm',
    price: 1150000,
    image: 'https://images.unsplash.com/photo-1622445262464-84b24e406223?w=600&auto=format&fit=crop&q=80',
    category: 'Phụ kiện',
    rating: 4.7,
  },
  {
    id: 'prod_27',
    name: 'Cáp sạc nhanh Type-C to Type-C 100W Bọc Dù Siêu Bền',
    price: 250000,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80',
    category: 'Phụ kiện',
    rating: 4.9,
  },
];

/** Lấy sản phẩm tức thì phục vụ initialData (0ms, không bao giờ bị màn hình loading) */
export const getInitialProducts = (): LocalProduct[] => {
  return DEFAULT_DATABASE_PRODUCTS;
};

/** Lấy toàn bộ danh sách sản phẩm từ Database nội bộ thiết bị */
export const getLocalProductsDB = async (): Promise<LocalProduct[]> => {
  try {
    const raw = await AsyncStorage.getItem(LOCAL_PRODUCTS_KEY);
    if (!raw) {
      await AsyncStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(DEFAULT_DATABASE_PRODUCTS));
      return DEFAULT_DATABASE_PRODUCTS;
    }
    const parsed: LocalProduct[] = JSON.parse(raw);
    if (parsed.length === 0) {
      await AsyncStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(DEFAULT_DATABASE_PRODUCTS));
      return DEFAULT_DATABASE_PRODUCTS;
    }
    return parsed;
  } catch (error) {
    console.warn('[LocalDB] Lỗi đọc sản phẩm:', error);
    return DEFAULT_DATABASE_PRODUCTS;
  }
};

/** Lưu danh sách sản phẩm vào Database thiết bị */
export const saveLocalProductsDB = async (products: LocalProduct[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(products));
  } catch (error) {
    console.warn('[LocalDB] Lỗi lưu sản phẩm:', error);
  }
};

/** Lấy toàn bộ danh sách tài khoản đã đăng ký trên thiết bị */
export const getLocalUsers = async (): Promise<UserAccount[]> => {
  try {
    const raw = await AsyncStorage.getItem(LOCAL_USERS_KEY);
    if (!raw) {
      const initialUsers = [DEFAULT_DEMO_USER];
      await AsyncStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(initialUsers));
      return initialUsers;
    }
    const users: UserAccount[] = JSON.parse(raw);
    if (!users.some((u) => u.email.toLowerCase() === DEFAULT_DEMO_USER.email.toLowerCase())) {
      users.push(DEFAULT_DEMO_USER);
      await AsyncStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
    }
    return users;
  } catch (error) {
    console.warn('[LocalDB] Lỗi đọc danh sách tài khoản:', error);
    return [DEFAULT_DEMO_USER];
  }
};

/** Đăng ký tài khoản mới trên thiết bị */
export const registerLocalUser = async (data: {
  email: string;
  password: string;
  name: string;
}): Promise<{ user: UserAccount }> => {
  const users = await getLocalUsers();
  const normalizedEmail = data.email.trim().toLowerCase();

  const existing = users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (existing) {
    throw new Error('Email này đã được đăng ký tài khoản. Vui lòng đăng nhập!');
  }

  const newUser: UserAccount = {
    id: `usr_${Date.now()}`,
    email: normalizedEmail,
    password: data.password,
    name: data.name.trim() || 'Người dùng ShopAI',
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  await AsyncStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));

  return { user: newUser };
};

/** Đăng nhập tài khoản */
export const loginLocalUser = async (data: {
  email: string;
  password: string;
}): Promise<{ accessToken: string; user: UserAccount }> => {
  const users = await getLocalUsers();
  const normalizedEmail = data.email.trim().toLowerCase();

  const user = users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (!user) {
    throw new Error('Tài khoản chưa tồn tại. Vui lòng đăng ký tài khoản mới!');
  }

  if (user.password !== data.password) {
    throw new Error('Mật khẩu không chính xác. Vui lòng kiểm tra lại!');
  }

  const accessToken = `shopai_token_${Date.now()}_${user.id}`;
  await setItemAsync('accessToken', accessToken);
  await AsyncStorage.setItem(CURRENT_USER_SESSION_KEY, JSON.stringify(user));

  return { accessToken, user };
};

/** Lưu thông tin user đang đăng nhập */
export const saveCurrentSessionUser = async (user: Partial<UserAccount>): Promise<void> => {
  try {
    await AsyncStorage.setItem(CURRENT_USER_SESSION_KEY, JSON.stringify(user));
  } catch (e) {
    console.warn('[LocalDB] Lỗi lưu session user:', e);
  }
};

/** Lấy thông tin user phiên đăng nhập hiện tại */
export const getCurrentSessionUser = async (): Promise<UserAccount | null> => {
  try {
    const raw = await AsyncStorage.getItem(CURRENT_USER_SESSION_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('[LocalDB] Lỗi lấy session user:', e);
  }
  return null;
};

/** Xóa session user khi đăng xuất */
export const clearCurrentSessionUser = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(CURRENT_USER_SESSION_KEY);
  } catch (e) {
    console.warn('[LocalDB] Lỗi xóa session user:', e);
  }
};

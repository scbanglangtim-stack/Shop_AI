// src/store/__tests__/useCartStore.test.ts
// Unit Test cho useCartStore Zustand Store bảo vệ logic liên quan tới TIỀN (Chương 11 - Bước 6b)
import { useCartStore } from '../useCartStore';

// Dữ liệu mẫu — khai báo một chỗ, dùng lại ở mọi test
const iphone = { id: 'p1', name: 'iPhone 15', price: 25000000, image: 'https://x.com/a.jpg' };
const airpods = { id: 'p2', name: 'AirPods Pro', price: 6000000, image: 'https://x.com/b.jpg' };

describe('useCartStore', () => {
  beforeEach(() => {
    // Zustand cho phép set State trực tiếp từ ngoài React — cách reset sạch nhất giữa các test.
    useCartStore.setState({ items: [] });
  });

  // ===== NHÓM 1: ĐƯỜNG HẠNH PHÚC =====
  describe('addItem', () => {
    it('thêm một sản phẩm mới vào giỏ hàng trống', () => {
      useCartStore.getState().addItem(iphone);

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(1);
      expect(items[0].id).toBe('p1');
      expect(items[0].quantity).toBe(1);
    });

    it('thêm hai sản phẩm KHÁC NHAU tạo ra hai dòng riêng biệt', () => {
      useCartStore.getState().addItem(iphone);
      useCartStore.getState().addItem(airpods);

      expect(useCartStore.getState().items).toHaveLength(2);
    });

    // ===== NHÓM 2: TRƯỜNG HỢP BIÊN — nơi bug hay ẩn nấp nhất =====
    it('thêm CÙNG một sản phẩm 2 lần thì gộp số lượng, KHÔNG tạo dòng mới', () => {
      useCartStore.getState().addItem(iphone);
      useCartStore.getState().addItem(iphone);

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(1); // Vẫn 1 dòng
      expect(items[0].quantity).toBe(2); // Nhưng số lượng là 2
    });
  });

  describe('totalPrice', () => {
    it('trả về 0 khi giỏ hàng trống', () => {
      expect(useCartStore.getState().totalPrice()).toBe(0);
    });

    it('tính đúng tổng tiền của một sản phẩm', () => {
      useCartStore.getState().addItem(iphone);
      expect(useCartStore.getState().totalPrice()).toBe(25000000);
    });

    it('tính đúng tổng tiền khi có nhiều sản phẩm và nhiều số lượng', () => {
      useCartStore.getState().addItem(iphone); // 25.000.000 x 2
      useCartStore.getState().addItem(iphone);
      useCartStore.getState().addItem(airpods); //  6.000.000 x 1

      // 25.000.000 * 2 + 6.000.000 * 1 = 56.000.000
      expect(useCartStore.getState().totalPrice()).toBe(56000000);
    });
  });

  describe('totalQuantity', () => {
    it('đếm TỔNG SỐ MÓN, không phải số dòng trong giỏ', () => {
      useCartStore.getState().addItem(iphone);
      useCartStore.getState().addItem(iphone);
      useCartStore.getState().addItem(airpods);

      expect(useCartStore.getState().items).toHaveLength(2); // 2 dòng
      expect(useCartStore.getState().totalQuantity()).toBe(3); // nhưng 3 món
    });
  });

  describe('removeItem', () => {
    it('xóa đúng sản phẩm được chỉ định', () => {
      useCartStore.getState().addItem(iphone);
      useCartStore.getState().addItem(airpods);

      useCartStore.getState().removeItem('p1');

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(1);
      expect(items[0].id).toBe('p2');
    });

    // ===== NHÓM 3: ĐƯỜNG LỖI =====
    it('không làm sập App khi xóa một id không tồn tại', () => {
      useCartStore.getState().addItem(iphone);

      expect(() => useCartStore.getState().removeItem('id_khong_ton_tai')).not.toThrow();
      expect(useCartStore.getState().items).toHaveLength(1);
    });
  });

  describe('clearCart', () => {
    it('xóa sạch giỏ hàng sau khi đặt hàng thành công (Chương 9, Bước 9c)', () => {
      useCartStore.getState().addItem(iphone);
      useCartStore.getState().addItem(airpods);

      useCartStore.getState().clearCart();

      expect(useCartStore.getState().items).toHaveLength(0);
      expect(useCartStore.getState().totalPrice()).toBe(0);
      expect(useCartStore.getState().totalQuantity()).toBe(0);
    });
  });
});

// src/utils/__tests__/formatCurrency.test.ts
// Unit Test cho hàm formatCurrency (Chương 11 - Bước 6)
import { formatCurrency } from '../formatCurrency';

describe('formatCurrency', () => {
  it('định dạng đúng số tiền VND có dấu phân cách hàng nghìn', () => {
    const formatted = formatCurrency(1500).replace(/\s/g, ' ');
    expect(formatted).toMatch(/1\.500\s*₫/);
  });

  it('xử lý đúng giá trị 0 đồng', () => {
    const formatted = formatCurrency(0).replace(/\s/g, ' ');
    expect(formatted).toMatch(/0\s*₫/);
  });

  it('xử lý đúng số tiền lớn (sản phẩm giá cao)', () => {
    const formatted = formatCurrency(19990000).replace(/\s/g, ' ');
    expect(formatted).toMatch(/19\.990\.000\s*₫/);
  });
});

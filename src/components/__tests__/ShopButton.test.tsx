// src/components/__tests__/ShopButton.test.tsx
// Integration Test với React Native Testing Library (RNTL) cho ShopButton (Chương 11 - Bước 8)
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ShopButton from '../ShopButton';

describe('ShopButton', () => {
  it('hiển thị đúng title được truyền vào', async () => {
    const screen = await render(<ShopButton title="Xác nhận thanh toán" onPress={() => {}} />);
    expect(screen.getByText('Xác nhận thanh toán')).toBeTruthy();
  });

  it('gọi đúng hàm onPress khi người dùng bấm vào nút', async () => {
    const handlePress = jest.fn();
    const screen = await render(<ShopButton title="Đăng nhập ngay" onPress={handlePress} />);

    fireEvent.press(screen.getByText('Đăng nhập ngay'));

    expect(handlePress).toHaveBeenCalledTimes(1);
  });

  it('KHÔNG gọi onPress khi nút đang ở trạng thái disabled', async () => {
    const handlePress = jest.fn();
    const screen = await render(<ShopButton title="Đang xử lý" onPress={handlePress} disabled />);

    fireEvent.press(screen.getByText('Đang xử lý'));

    expect(handlePress).not.toHaveBeenCalled();
  });
});

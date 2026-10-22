// src/services/geminiService.ts
// Lớp bọc dịch vụ Trợ lý Mua Sắm AI ShopAI Store
// Tự động chuyển đổi mượt mà giữa Server NestJS và Bộ máy Trí tuệ Nhân tạo Nội bộ
import axiosClient from '@api/axiosClient';

export type ChatTurn = {
  role: 'user' | 'model';
  parts?: { text: string }[];
  text?: string;
};

/** Trả lời bằng kho tri thức Mua Sắm AI nội bộ của ShopAI Store */
export const answerFromLocalKnowledge = (question: string): string => {
  const lower = question.toLowerCase();

  // 1. TUYỆT ĐỐI TỪ CHỐI câu hỏi về 11 chương giáo trình công nghệ & lập trình
  const curriculumKeywords = [
    'chương',
    'chuong',
    'giáo trình',
    'giao trinh',
    'đề cương',
    'de cuong',
    'tài liệu',
    'tai lieu',
    'lập trình',
    'lap trinh',
    'react native',
    'nestjs',
    'metro',
    'yoga engine',
    'zustand vs redux',
    'tanstack query',
    'prisma',
    'sqlite',
    'devops',
    'crashlytics',
    'jest',
    'maestro',
    'ci/cd',
    'clean architecture',
    'code',
    'mã nguồn',
  ];
  if (curriculumKeywords.some((kw) => lower.includes(kw))) {
    return 'Dạ em là Trợ lý Mua Sắm AI của ShopAI Store. Em chỉ hỗ trợ tư vấn chọn mua sản phẩm, hướng dẫn đặt hàng, thanh toán, kiểm tra đơn hàng, giao hàng và các dịch vụ mua sắm tại cửa hàng thôi ạ. Em không giải đáp các câu hỏi về giáo trình công nghệ lập trình ạ!';
  }

  // 2. Từ chối câu hỏi ngoài lề (thời tiết, ca sĩ, bóng đá, nấu ăn, chính trị...)
  const offTopicKeywords = [
    'thời tiết',
    'chính trị',
    'ca sĩ',
    'diễn viên',
    'bóng đá',
    'thể thao',
    'thơ',
    'tình yêu',
    'nấu ăn',
    'món ăn',
    'phim',
    'du lịch',
    'tin tức',
    'tổng thống',
    'chiến tranh',
    'tử vi',
    'bói toán',
    'lịch sử thế giới',
  ];
  if (offTopicKeywords.some((kw) => lower.includes(kw))) {
    return 'Dạ em là Trợ lý Mua Sắm AI của ShopAI Store. Em chỉ hỗ trợ tư vấn sản phẩm, hướng dẫn đặt hàng, thanh toán, kiểm tra phí ship và bảo hành trên app ShopAI thôi ạ!';
  }

  // 3. Tư vấn Điện thoại thông minh (Smartphones)
  if (
    lower.includes('điện thoại') ||
    lower.includes('iphone') ||
    lower.includes('samsung') ||
    lower.includes('galaxy') ||
    lower.includes('xiaomi') ||
    lower.includes('pixel') ||
    lower.includes('chụp ảnh') ||
    lower.includes('pin trâu')
  ) {
    return `📱 Gợi ý điện thoại nổi bật tại ShopAI Store:
1. iPhone 15 Pro Max 256GB (29.990.000đ): Khung titan siêu nhẹ, chip A17 Pro cực mạnh, camera zoom quang học 5x sắc nét.
2. Samsung Galaxy S24 Ultra 512GB (28.500.000đ): Màn hình 120Hz chống chói, bút S-Pen tiện lợi, camera 200MP zoom 100x.
3. Xiaomi 14 Pro 5G (17.990.000đ): Sạc siêu tốc 120W (chỉ 18 phút đầy pin), ống kính Leica cao cấp.
4. Google Pixel 8 Pro (19.500.000đ): Chụp ảnh thiếu sáng và quay phim xuất sắc, mượt mà thuần Android.
Quý khách có thể bấm chọn danh mục "Điện thoại" trên Trang chủ để xem chi tiết và thêm vào giỏ hàng ngay ạ!`;
  }

  // 4. Tư vấn Máy tính xách tay (Laptop)
  if (
    lower.includes('laptop') ||
    lower.includes('macbook') ||
    lower.includes('máy tính') ||
    lower.includes('dell') ||
    lower.includes('asus') ||
    lower.includes('thinkpad') ||
    lower.includes('gaming')
  ) {
    return `💻 Gợi ý Laptop chính hãng tại ShopAI Store:
1. MacBook Air M2 13.6 inch (24.490.000đ): Mỏng nhẹ 1.24kg, pin trâu 18 tiếng, tối ưu cho học tập và làm việc văn phòng.
2. MacBook Pro 14 M3 Pro (48.990.000đ): Màn hình Liquid Retina XDR 120Hz, chuyên đồ họa 3D, dựng phim và lập trình chuyên nghiệp.
3. Dell XPS 13 Plus (35.900.000đ): Thiết kế viền siêu mỏng vô cực, bàn phím cảm ứng tàng hình cực kỳ sang trọng.
4. ASUS ROG Zephyrus G14 (39.990.000đ): Laptop gaming nhỏ gọn, card đồ họa RTX 4060, màn hình OLED 3K 120Hz mượt mà.
Quý khách có thể lọc danh mục "Laptop" tại Trang chủ để chọn chiếc máy phù hợp nhất!`;
  }

  // 5. Tư vấn Tai nghe (Headphones & Earbuds)
  if (
    lower.includes('tai nghe') ||
    lower.includes('airpods') ||
    lower.includes('sony') ||
    lower.includes('marshall') ||
    lower.includes('chống ồn')
  ) {
    return `🎧 Gợi ý Tai nghe chống ồn đỉnh cao tại ShopAI:
1. AirPods Pro 2 MagSafe USB-C (5.690.000đ): Chống ồn chủ động gấp 2 lần, âm thanh không gian Spatial Audio sống động.
2. Sony WH-1000XM5 (7.990.000đ): Tai nghe chụp tai chống ồn số 1 thị trường, đệm tai êm ái, pin bền bỉ 30 giờ.
3. Marshall Major IV (3.290.000đ): Chất âm rock cổ điển đặc trưng, thời lượng pin kỷ lục lên tới 80 tiếng.
4. Galaxy Buds2 Pro (2.890.000đ): Âm thanh vòm 24-bit Hi-Fi, thiết kế nhỏ gọn ôm khít tai.
Mời quý khách vào danh mục "Tai nghe" trên Trang chủ để đặt hàng nhé!`;
  }

  // 6. Tư vấn Đồng hồ thông minh (Smartwatches)
  if (
    lower.includes('đồng hồ') ||
    lower.includes('watch') ||
    lower.includes('garmin') ||
    lower.includes('vòng đeo')
  ) {
    return `⌚ Gợi ý Đồng hồ thông minh bán chạy tại ShopAI:
1. Apple Watch Series 9 GPS 45mm (9.890.000đ): Cử chỉ chạm 2 lần Double Tap kỳ diệu, đo nhịp tim, ECG và nồng độ oxy trong máu SpO2.
2. Apple Watch SE (5.990.000đ): Giá thành hợp lý, đầy đủ tính năng theo dõi sức khỏe và phát hiện té ngã.
3. Samsung Galaxy Watch 6 LTE (6.490.000đ): Viền xoay vật lý tinh tế, theo dõi giấc ngủ chuyên sâu.
4. Garmin Venu 3 AMOLED (11.290.000đ): Thời lượng pin 14 ngày, chuyên gia huấn luyện thể thao và chạy bộ.
Quý khách có thể chọn danh mục "Đồng hồ" để thêm sản phẩm vào giỏ!`;
  }

  // 7. Tư vấn Phụ kiện & Đồ chơi công nghệ
  if (
    lower.includes('phụ kiện') ||
    lower.includes('sạc') ||
    lower.includes('chuột') ||
    lower.includes('bàn phím') ||
    lower.includes('pin dự phòng') ||
    lower.includes('webcam')
  ) {
    return `🔌 Gợi ý Phụ kiện công nghệ cao cấp tại ShopAI:
1. Củ sạc nhanh Baseus GaN 65W (690.000đ): 3 cổng sạc đồng thời cho cả Laptop, Điện thoại và Tai nghe.
2. Chuột Logitech MX Master 3S (2.190.000đ): Cuộn siêu tốc Magspeed 1.000 dòng/giây, click êm ái chống ồn 90%.
3. Bàn phím cơ Keychron K8 Pro (2.450.000đ): Gõ cực êm, kết nối không dây Bluetooth 3 thiết bị cùng lúc.
4. Sạc dự phòng Anker 20.000mAh 30W (890.000đ): Sạc nhanh PowerIQ 3.0, dung lượng lớn dùng cho cả tuần.
Mời quý khách vào danh mục "Phụ kiện" để khám phá thêm nhiều món đồ hấp dẫn!`;
  }

  // 8. Hướng dẫn Mua hàng, Giỏ hàng & Thanh toán
  if (
    lower.includes('mua hàng') ||
    lower.includes('thanh toán') ||
    lower.includes('đặt hàng') ||
    lower.includes('giỏ hàng') ||
    lower.includes('cách mua')
  ) {
    return `🛍️ Hướng dẫn mua hàng dễ dàng trên ShopAI:
1. Chọn sản phẩm bạn thích tại Trang chủ, bấm nút "Mua ngay" hoặc "Thêm vào giỏ" để chọn số lượng.
2. Bấm vào tab "Giỏ hàng" (icon giỏ hàng ở thanh điều hướng đáy màn hình).
3. Kiểm tra danh sách sản phẩm, số lượng và tổng tiền -> Bấm "Tiến hành đặt hàng".
4. Điền địa chỉ nhận hàng, chọn phương thức (Thanh toán khi nhận hàng COD hoặc Chuyển khoản ngân hàng) và bấm "Xác nhận đặt hàng".
Đơn hàng của bạn sẽ được tạo thành công ngay lập tức!`;
  }

  // 9. Hướng dẫn Quét mã vạch sản phẩm bằng Camera
  if (
    lower.includes('quét') ||
    lower.includes('mã vạch') ||
    lower.includes('barcode') ||
    lower.includes('qr') ||
    lower.includes('camera')
  ) {
    return `📷 Cách quét mã vạch sản phẩm bằng Camera:
1. Tại Trang chủ hoặc mục "Tài khoản", bạn bấm vào nút "Quét mã" (icon máy ảnh).
2. Khi hệ thống hiển thị pop-up, hãy cấp quyền truy cập Camera cho ứng dụng.
3. Hướng camera về phía mã Barcode hoặc mã QR trên bao bì sản phẩm.
4. Khi nhận diện đúng mã, điện thoại sẽ rung phản hồi (Haptic) và tự động tìm kiếm hiển thị sản phẩm tương ứng trong cửa hàng!`;
  }

  // 10. Phí ship giao hàng & Kho GPS
  if (
    lower.includes('phí ship') ||
    lower.includes('vận chuyển') ||
    lower.includes('giao hàng') ||
    lower.includes('gps') ||
    lower.includes('kho hàng')
  ) {
    return `📍 Chính sách tính phí giao hàng thông minh theo khoảng cách GPS:
• Kho hàng ShopAI đặt tại trung tâm Quận 1, TP. Hồ Chí Minh (10.7769°N, 106.7009°E).
• Ứng dụng tự động đo khoảng cách từ kho tới địa chỉ của bạn bằng công thức GPS Haversine:
  - Dưới 5 km: Miễn phí giao hàng (0đ).
  - Từ 5 km đến 15 km: Phí ship ưu đãi chỉ 25.000đ.
  - Trên 15 km: Phí ship toàn quốc chỉ 45.000đ.
Bạn có thể xem vị trí kho và khoảng cách tại màn hình Thanh toán hoặc mục Tài khoản!`;
  }

  // 11. Chính sách Bảo hành & Đổi trả
  if (
    lower.includes('bảo hành') ||
    lower.includes('đổi trả') ||
    lower.includes('chính sách') ||
    lower.includes('lỗi')
  ) {
    return `🛡️ Chính sách bảo hành & hậu mãi tại ShopAI Store:
• Bảo hành chính hãng 12 tháng cho toàn bộ sản phẩm Điện thoại, Laptop, Đồng hồ, Tai nghe và Phụ kiện.
• Chính sách 1 ĐỔI 1 TRONG 30 NGÀY ĐẦU nếu phát sinh lỗi từ nhà sản xuất.
• Hỗ trợ bảo hành nhanh chóng tại tất cả trung tâm bảo hành ủy quyền trên toàn quốc.
• Miễn phí hoàn hàng và hỗ trợ khách hàng 24/7!`;
  }

  // 12. Xem Lịch sử đơn hàng
  if (
    lower.includes('lịch sử') ||
    lower.includes('đơn hàng') ||
    lower.includes('hóa đơn') ||
    lower.includes('pending') ||
    lower.includes('paid')
  ) {
    return `📋 Cách kiểm tra lịch sử đơn hàng:
- Bấm vào tab "Đơn hàng" (icon kẹp tài liệu ở thanh đáy ứng dụng).
- Bạn sẽ thấy toàn bộ các hóa đơn đã mua, gồm mã đơn, thời gian đặt, tổng tiền và trạng thái:
  • PENDING: Đang xử lý / chuẩn bị đóng gói giao hàng.
  • PAID: Đã hoàn tất thanh toán.
- Bấm vào bất kỳ đơn nào để xem hóa đơn chi tiết và thông tin chuyển khoản ngân hàng!`;
  }

  // 13. Giao diện Dark Mode & Tài khoản
  if (
    lower.includes('dark mode') ||
    lower.includes('nền tối') ||
    lower.includes('giao diện') ||
    lower.includes('tài khoản') ||
    lower.includes('đăng nhập')
  ) {
    return `⚙️ Cài đặt giao diện & Tài khoản ShopAI:
- Đổi giao diện Sáng / Tối: Bấm nút Mặt trời/Mặt trăng ở góc trên Trang chủ, hoặc vào tab "Tài khoản" ở ngoài cùng bên phải gạt công tắc "Chế độ nền tối".
- Bảo mật: Tài khoản được bảo vệ bằng Khóa phần cứng Keystore và Vân tay / Face ID.
- Quý khách có thể quản lý thông tin, xem mã kho hàng và đăng xuất an toàn tại tab "Tài khoản"!`;
  }

  // Câu trả lời mặc định thân thiện cho khách mua sắm
  return 'Dạ em là Trợ lý Mua Sắm AI của ShopAI Store. Em có thể tư vấn các sản phẩm Điện thoại, Laptop, Tai nghe, Đồng hồ, Phụ kiện, hướng dẫn đặt hàng, thanh toán, tính phí ship GPS và chính sách bảo hành. Quý khách cần em hỗ trợ tìm kiếm sản phẩm nào ạ?';
};

/** Gọi NestJS /api/ai/chat — Bắt buộc phải qua Backend Server */
export const askShopAI = async (
  question: string,
  history: ChatTurn[] = [],
): Promise<string> => {
  // Mọi tương tác AI bắt buộc phải gửi qua NestJS Backend
  const { data } = await axiosClient.post<{ reply: string }>(
    '/api/ai/chat',
    {
      message: question,
      history: history.map((h) => ({
        role: h.role,
        text: h.parts?.[0]?.text ?? h.text ?? '',
      })),
    },
    { timeout: 8000 }
  );

  if (data?.reply) {
    return data.reply;
  }
  throw new Error('Máy chủ Backend không phản hồi nội dung tư vấn.');
};

export const toFriendlyError = (error: unknown): string => {
  return '⚠️ Không thể kết nối tới máy chủ Backend! Mọi yêu cầu tư vấn AI bắt buộc phải thông qua Backend Server của ShopAI. Vui lòng kiểm tra lại kết nối mạng hoặc đảm bảo Server đang chạy.';
};

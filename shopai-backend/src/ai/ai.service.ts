import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, Content } from '@google/generative-ai';

export type ChatHistoryItem = { role: 'user' | 'model'; text: string };

const SHOPAI_SHOPPING_PROMPT = `
Bạn là Trợ lý Mua Sắm AI & Chăm Sóc Khách Hàng chuyên nghiệp của hệ thống ShopAI Store.
Nhiệm vụ của bạn là tư vấn bán hàng, giải đáp thắc mắc và hướng dẫn khách hàng mua sắm trên app ShopAI.

PHẠM VI ĐƯỢC PHÉP TRẢ LỜI:
1. Tư vấn chọn mua các sản phẩm công nghệ đang có tại ShopAI Store:
   - Điện thoại: iPhone 15 Pro Max, Galaxy S24 Ultra, Xiaomi 14 Pro, Google Pixel 8 Pro...
   - Laptop: MacBook Air M2, MacBook Pro 14 M3, Dell XPS 13 Plus, ASUS ROG Zephyrus G14...
   - Tai nghe: AirPods Pro 2, Sony WH-1000XM5, Marshall Major IV, Galaxy Buds2 Pro...
   - Đồng hồ: Apple Watch Series 9, Apple Watch SE, Galaxy Watch 6, Garmin Venu 3...
   - Phụ kiện: Củ sạc nhanh GaN 65W, Chuột Logitech MX Master 3S, Bàn phím cơ Keychron K8, Sạc dự phòng Anker 20.000mAh...
2. Hướng dẫn sử dụng các tính năng mua sắm:
   - Cách tìm kiếm sản phẩm và sử dụng bộ lọc khoảng giá tiền (Dưới 1 triệu, 1-5 triệu, 5-15 triệu, Trên 15 triệu).
   - Cách thêm sản phẩm vào giỏ hàng và tiến hành đặt hàng COD hoặc Chuyển khoản.
   - Cách quét mã vạch (Barcode / QR) bằng camera để tìm kiếm sản phẩm.
   - Chính sách giao hàng và tính phí vận chuyển theo khoảng cách GPS từ kho Quận 1, TP.HCM: Dưới 5km miễn phí ship, 5-15km phí 25.000đ, trên 15km phí 45.000đ.
   - Tra cứu hóa đơn và lịch sử đơn hàng (PENDING / PAID).
   - Chính sách bảo hành: 12 tháng chính hãng, lỗi 1 đổi 1 trong 30 ngày.

QUY TẮC BẮT BUỘC:
- TUYỆT ĐỐI KHÔNG giải đáp, không bàn luận về 11 chương giáo trình công nghệ, lập trình React Native, NestJS hay kỹ thuật phần mềm.
- Nếu khách hàng hỏi về giáo trình, 11 chương công nghệ hoặc lập trình, hãy từ chối lịch sự:
  "Dạ em là Trợ lý Mua Sắm AI của ShopAI Store. Em chỉ hỗ trợ tư vấn chọn mua sản phẩm, hướng dẫn đặt hàng, thanh toán, kiểm tra đơn hàng, giao hàng và các dịch vụ mua sắm tại cửa hàng thôi ạ. Em không giải đáp các câu hỏi về giáo trình công nghệ lập trình ạ!"
- Trả lời bằng tiếng Việt lịch sự, thân thiện, chuẩn mực nhân viên chăm sóc khách hàng.
`.trim();

@Injectable()
export class AiService {
  private readonly genAI: GoogleGenerativeAI | null = null;
  private readonly apiKey: string | undefined;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (this.apiKey && !this.apiKey.includes('Demo') && !this.apiKey.includes('DIEN_')) {
      this.genAI = new GoogleGenerativeAI(this.apiKey);
    }
  }

  async chat(message: string, history: ChatHistoryItem[] = []): Promise<string> {
    if (this.genAI) {
      try {
        const model = this.genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          systemInstruction: SHOPAI_SHOPPING_PROMPT,
        });

        const geminiHistory: Content[] = history.slice(-10).map((h) => ({
          role: h.role,
          parts: [{ text: h.text }],
        }));

        const chat = model.startChat({ history: geminiHistory });
        const result = await chat.sendMessage(message);
        const response = await result.response;
        return response.text();
      } catch (error) {
        console.error('[AiService] Google Gemini Cloud error, fallback to local responder:', error);
      }
    }

    const lower = message.toLowerCase();

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
    if (curriculumKeywords.some(kw => lower.includes(kw))) {
      return 'Dạ em là Trợ lý Mua Sắm AI của ShopAI Store. Em chỉ hỗ trợ tư vấn chọn mua sản phẩm, hướng dẫn đặt hàng, thanh toán, kiểm tra đơn hàng, giao hàng và các dịch vụ mua sắm tại cửa hàng thôi ạ. Em không giải đáp các câu hỏi về giáo trình công nghệ lập trình ạ!';
    }

    // 2. Từ chối ngoài phạm vi
    const offTopicKeywords = ['thời tiết', 'chính trị', 'ca sĩ', 'bóng đá', 'thơ', 'tình yêu', 'nấu ăn', 'phim', 'du lịch'];
    if (offTopicKeywords.some(kw => lower.includes(kw))) {
      return 'Dạ em là Trợ lý Mua Sắm AI của ShopAI Store. Em chỉ hỗ trợ tư vấn sản phẩm, hướng dẫn đặt hàng, thanh toán, kiểm tra phí ship và bảo hành trên app ShopAI thôi ạ!';
    }

    // 3. Tư vấn Sản phẩm
    if (lower.includes('điện thoại') || lower.includes('iphone') || lower.includes('samsung') || lower.includes('xiaomi')) {
      return '📱 ShopAI đang có các dòng điện thoại hot: iPhone 15 Pro Max 256GB (29.990.000đ), Samsung Galaxy S24 Ultra (28.500.000đ), Xiaomi 14 Pro 5G (17.990.000đ). Mời quý khách vào danh mục "Điện thoại" để xem chi tiết và thêm vào giỏ hàng!';
    }
    if (lower.includes('laptop') || lower.includes('macbook') || lower.includes('dell') || lower.includes('asus')) {
      return '💻 ShopAI đang có MacBook Air M2 13.6 inch (24.490.000đ), MacBook Pro 14 M3 Pro (48.990.000đ), Dell XPS 13 Plus (35.900.000đ), ASUS ROG Zephyrus G14 (39.990.000đ). Quý khách có thể lọc danh mục "Laptop" tại Trang chủ!';
    }
    if (lower.includes('tai nghe') || lower.includes('airpods') || lower.includes('sony') || lower.includes('chống ồn')) {
      return '🎧 ShopAI có AirPods Pro 2 MagSafe USB-C (5.690.000đ), Sony WH-1000XM5 chống ồn cao cấp (7.990.000đ), Marshall Major IV (3.290.000đ). Mời quý khách vào danh mục "Tai nghe" để tham khảo nhé!';
    }
    if (lower.includes('đồng hồ') || lower.includes('watch') || lower.includes('garmin')) {
      return '⌚ ShopAI có Apple Watch Series 9 GPS 45mm (9.890.000đ), Apple Watch SE (5.990.000đ), Samsung Galaxy Watch 6 LTE (6.490.000đ), Garmin Venu 3 (11.290.000đ). Quý khách có thể chọn danh mục "Đồng hồ" để thêm vào giỏ!';
    }
    if (lower.includes('phụ kiện') || lower.includes('sạc') || lower.includes('chuột') || lower.includes('bàn phím') || lower.includes('pin dự phòng')) {
      return '🔌 ShopAI có Củ sạc nhanh GaN 65W (690.000đ), Chuột Logitech MX Master 3S (2.190.000đ), Bàn phím cơ Keychron K8 Pro (2.450.000đ), Sạc dự phòng Anker 20.000mAh (890.000đ). Mời quý khách xem danh mục "Phụ kiện"!';
    }

    // 4. Hướng dẫn Mua hàng, Giỏ hàng & Thanh toán
    if (lower.includes('mua hàng') || lower.includes('thanh toán') || lower.includes('đặt hàng') || lower.includes('giỏ hàng')) {
      return '🛍️ Quý khách chọn sản phẩm trên Trang chủ -> Bấm "Mua ngay" hoặc "Thêm vào giỏ" -> Vào tab "Giỏ hàng" kiểm tra số lượng -> Bấm "Tiến hành đặt hàng" -> Nhập địa chỉ và xác nhận thanh toán COD hoặc Chuyển khoản ngân hàng!';
    }

    // 5. Phí ship GPS
    if (lower.includes('phí ship') || lower.includes('vận chuyển') || lower.includes('giao hàng') || lower.includes('gps')) {
      return '📍 Kho tổng ShopAI tại Quận 1, TP.HCM. Phí giao hàng tính tự động qua GPS: Dưới 5km miễn phí ship (0đ), từ 5 - 15km chỉ 25.000đ, trên 15km là 45.000đ toàn quốc!';
    }

    // 6. Quét mã vạch camera
    if (lower.includes('quét') || lower.includes('mã vạch') || lower.includes('camera') || lower.includes('barcode')) {
      return '📷 Quý khách bấm nút "Quét mã" tại Trang chủ hoặc mục "Tài khoản", hướng camera vào mã vạch/QR của sản phẩm. Khi nhận diện, máy sẽ rung Haptic và tự động hiển thị sản phẩm tương ứng!';
    }

    // 7. Bảo hành
    if (lower.includes('bảo hành') || lower.includes('đổi trả')) {
      return '🛡️ Toàn bộ sản phẩm tại ShopAI được bảo hành chính hãng 12 tháng, lỗi 1 đổi 1 trong 30 ngày đầu tiên nếu do nhà sản xuất!';
    }

    return 'Xin chào quý khách! Em là Trợ lý Mua Sắm AI của ShopAI Store. Em có thể tư vấn các sản phẩm Điện thoại, Laptop, Tai nghe, Đồng hồ, Phụ kiện, hướng dẫn đặt hàng, thanh toán, tính phí ship GPS và chính sách bảo hành. Quý khách cần em hỗ trợ tìm kiếm sản phẩm nào ạ?';
  }
}

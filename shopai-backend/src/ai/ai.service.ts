import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, Content } from '@google/generative-ai';

export type ChatHistoryItem = { role: 'user' | 'model'; text: string };

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
          systemInstruction:
            'Bạn là nhân viên bán hàng của ShopAI. Chỉ tư vấn về đồ công nghệ, điện thoại, máy tính. Trả lời cực ngắn dưới 30 chữ. Không nói chuyện chính trị.',
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

    // Intelligent local fallback matching ShopAI RAG guidelines
    const lower = message.toLowerCase();
    if (lower.includes('iphone') || lower.includes('apple')) {
      return 'ShopAI có sẵn iPhone 15 Pro Max chính hãng, giá từ 28.990.000đ, bảo hành 12 tháng!';
    }
    if (lower.includes('samsung') || lower.includes('galaxy')) {
      return 'Galaxy S24 Ultra trang bị camera 200MP và bút S-Pen thông minh, giá ưu đãi 26.990.000đ.';
    }
    if (lower.includes('laptop') || lower.includes('macbook')) {
      return 'MacBook Pro M3 Max và Dell XPS đang sẵn hàng tại showroom ShopAI, hỗ trợ trả góp 0%.';
    }
    if (lower.includes('giá') || lower.includes('rẻ') || lower.includes('khuyến mãi')) {
      return 'ShopAI đang có mã giảm giá 10% cho đơn hàng đầu tiên! Bạn muốn tư vấn phân khúc giá nào?';
    }
    return 'Xin chào! Em là trợ lý AI của ShopAI. Em có thể tư vấn cấu hình điện thoại và máy tính cho bạn.';
  }
}

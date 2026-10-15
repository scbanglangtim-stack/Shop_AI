// src/services/geminiService.ts
// Lớp bọc dịch vụ gọi Google Gemini AI SDK (Chương 8.8, 8.9 & 8.13 RAG)
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY, IS_DEMO_KEY } from '@constants/geminiConfig';
import {
  GEMINI_GENERATION_CONFIG,
  GEMINI_MODEL_NAME,
  MAX_HISTORY_TURNS,
  SHOPAI_SYSTEM_PROMPT,
} from '@constants/aiPrompt';
import { MOCK_PRODUCTS } from '@data/mockProducts';

let genAI: GoogleGenerativeAI | null = null;
let model: any = null;

// Khởi tạo Gemini model nếu có API key hợp lệ
try {
  if (!IS_DEMO_KEY && GEMINI_API_KEY && GEMINI_API_KEY.length > 20) {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    model = genAI.getGenerativeModel({
      model: GEMINI_MODEL_NAME,
      systemInstruction: SHOPAI_SYSTEM_PROMPT,
      generationConfig: GEMINI_GENERATION_CONFIG,
    });
  }
} catch (e) {
  console.log('[GeminiService] Khởi tạo SDK:', e);
}

/** Một lượt hội thoại theo đúng định dạng Gemini yêu cầu. */
export type ChatTurn = {
  role: 'user' | 'model';
  parts: { text: string }[];
};

/**
 * Bộ sinh phản hồi RAG cục bộ (Local RAG Knowledge Engine - Phần 8.13).
 * Đảm bảo trải nghiệm AI hoàn hảo ngay cả khi dùng Key Demo hoặc chưa cấp API Key cá nhân.
 */
const generateLocalRagResponse = (question: string, history: ChatTurn[] = []): string => {
  const q = question.toLowerCase().trim();

  // 1. Chống Prompt Injection (Phần 8.3 & 8.9)
  if (
    q.includes('hải tặc') ||
    q.includes('chửi') ||
    q.includes('bỏ qua') ||
    q.includes('quên vai trò') ||
    q.includes('quên hết') ||
    q.includes('hướng dẫn trước')
  ) {
    return 'Dạ mình là nhân viên tư vấn ShopAI, mình chỉ hỗ trợ thông tin sản phẩm và chính sách của cửa hàng thôi ạ.';
  }

  // 2. Từ chối câu hỏi ngoài phạm vi (chính trị, chuyện cười, thời tiết...)
  if (
    q.includes('chính trị') ||
    q.includes('chiến tranh') ||
    q.includes('tôn giáo') ||
    q.includes('chuyện cười') ||
    q.includes('hát') ||
    q.includes('làm thơ')
  ) {
    return 'Dạ mình là nhân viên tư vấn công nghệ của ShopAI, mình chỉ hỗ trợ giải đáp về các sản phẩm công nghệ đang bán tại cửa hàng thôi ạ!';
  }

  // 3. Nhớ ngữ cảnh câu hỏi trước (Context Memory - Bước 11 C.2)
  const lastTurn = history.length > 0 ? history[history.length - 1] : null;
  const lastText = lastTurn?.parts[0]?.text?.toLowerCase() || '';

  if (q.includes('cái đầu tiên') || q.includes('giá bao nhiêu') || q.includes('còn hàng không')) {
    if (lastText.includes('iphone') || q.includes('iphone')) {
      const p = MOCK_PRODUCTS.find((item) => item.id === 'prod_10');
      return `Dạ iPhone 15 Pro Max 256GB tại ShopAI có giá ${p?.price.toLocaleString('vi-VN')} đ, sẵn hàng màu Titan Tự nhiên ạ!`;
    }
    if (lastText.includes('samsung') || lastText.includes('galaxy') || q.includes('samsung') || q.includes('galaxy')) {
      const p = MOCK_PRODUCTS.find((item) => item.id === 'prod_3');
      return `Dạ Galaxy S21 bên mình có giá ${p?.price.toLocaleString('vi-VN')} đ, màn hình Dynamic AMOLED rất mượt ạ!`;
    }
  }

  // 4. Tư vấn theo sản phẩm danh mục (RAG Matching)
  if (q.includes('iphone') || q.includes('apple') || q.includes('15 pro')) {
    const p = MOCK_PRODUCTS.find((item) => item.id === 'prod_10');
    return `Dạ iPhone 15 Pro Max 256GB tại ShopAI đang có giá ${p?.price.toLocaleString('vi-VN')} đ, bảo hành 12 tháng chính hãng VN/A bạn nhé!`;
  }

  if (q.includes('samsung') || q.includes('galaxy') || q.includes('s21')) {
    const p = MOCK_PRODUCTS.find((item) => item.id === 'prod_3');
    return `Dạ Galaxy S21 tại ShopAI có giá ${p?.price.toLocaleString('vi-VN')} đ, chụp ảnh đẹp, màn 120Hz mượt mà ạ.`;
  }

  if (q.includes('tai nghe') || q.includes('chống ồn') || q.includes('anc') || q.includes('airpods')) {
    const p1 = MOCK_PRODUCTS.find((item) => item.id === 'prod_9');
    const p2 = MOCK_PRODUCTS.find((item) => item.id === 'prod_1');
    return `Dạ ShopAI có Tai nghe chụp tai Wireless (${p1?.price.toLocaleString('vi-VN')} đ) chống ồn chủ động đỉnh cao, và Tai nghe Bluetooth nhét tai (${p2?.price.toLocaleString('vi-VN')} đ) nhỏ gọn tiện lợi ạ!`;
  }

  if (q.includes('chuột') || q.includes('mx master') || q.includes('văn phòng') || q.includes('công thái học')) {
    const p = MOCK_PRODUCTS.find((item) => item.id === 'prod_5');
    return `Dạ ShopAI gợi ý chuột không dây MX Master giá ${p?.price.toLocaleString('vi-VN')} đ, thiết kế công thái học dùng êm tay và cuộn siêu tốc ạ!`;
  }

  if (q.includes('bàn phím') || q.includes('keyboard') || q.includes('phím cơ')) {
    const p = MOCK_PRODUCTS.find((item) => item.id === 'prod_8');
    return `Dạ Bàn phím cơ Mechanical K8 tại ShopAI có giá ${p?.price.toLocaleString('vi-VN')} đ, switch gõ nảy tay, có LED RGB và kết nối Bluetooth ạ!`;
  }

  if (q.includes('sạc') || q.includes('gan') || q.includes('củ sạc')) {
    const p = MOCK_PRODUCTS.find((item) => item.id === 'prod_4');
    return `Dạ Củ sạc nhanh GaN 65W giá ${p?.price.toLocaleString('vi-VN')} đ, chuẩn sạc nhanh cho cả iPhone, Samsung và laptop ạ!`;
  }

  if (q.includes('pin') || q.includes('dự phòng') || q.includes('anker')) {
    const p = MOCK_PRODUCTS.find((item) => item.id === 'prod_6');
    return `Dạ Pin sạc dự phòng Anker tại ShopAI giá ${p?.price.toLocaleString('vi-VN')} đ, nhỏ gọn bỏ túi, sạc nhanh an toàn ạ!`;
  }

  if (q.includes('đồng hồ') || q.includes('smartwatch') || q.includes('watch')) {
    const p = MOCK_PRODUCTS.find((item) => item.id === 'prod_2');
    return `Dạ Đồng hồ thông minh SE giá ${p?.price.toLocaleString('vi-VN')} đ, có đo nhịp tim, giấc ngủ và kháng nước ạ!`;
  }

  if (q.includes('webcam') || q.includes('họp') || q.includes('live')) {
    const p = MOCK_PRODUCTS.find((item) => item.id === 'prod_7');
    return `Dạ Webcam 4K Ultra giá ${p?.price.toLocaleString('vi-VN')} đ, hình ảnh sắc nét kèm micro khử ồn cho bạn họp online ạ!`;
  }

  if (q.includes('laptop') || q.includes('máy tính')) {
    return 'Dạ hiện ShopAI đang có các phụ kiện cao cấp cho laptop như Chuột MX Master, Bàn phím cơ K8 và Củ sạc GaN 65W bạn nhé!';
  }

  if (q.includes('chào') || q.includes('hello') || q.includes('hi')) {
    return 'Dạ chào bạn! ShopAI sẵn sàng hỗ trợ tư vấn điện thoại, tai nghe và phụ kiện công nghệ cho bạn ạ!';
  }

  // Mặc định hỗ trợ chung
  return 'Dạ ShopAI có đầy đủ iPhone, Galaxy, tai nghe chống ồn, chuột và bàn phím cơ chính hãng. Bạn cần tư vấn mẫu nào cụ thể để mình hỗ trợ nhé!';
};

/**
 * Gửi câu hỏi kèm lịch sử hội thoại lên Gemini.
 * Hỗ trợ Dual-mode: Kết nối Gemini Cloud khi có Key thật, hoặc chạy Local RAG Engine khi ở Demo Mode.
 */
export const askShopAI = async (
  question: string,
  history: ChatTurn[] = [],
): Promise<string> => {
  // Cắt bớt lịch sử: chỉ giữ N lượt gần nhất để không phình chi phí (Phần 8.11)
  const trimmed = history.slice(-MAX_HISTORY_TURNS * 2);

  // Nếu là Demo Key hoặc chưa cấu hình model: Sử dụng RAG Engine nội bộ
  if (IS_DEMO_KEY || !model) {
    // Giả lập độ trễ mạng tự nhiên 600ms - 1000ms
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 800));
    return generateLocalRagResponse(question, trimmed);
  }


  // Gọi trực tiếp Google Gemini Cloud API
  try {
    const chat = model.startChat({ history: trimmed });
    const result = await chat.sendMessage(question);
    const text = result.response.text();

    if (!text || !text.trim()) {
      throw new Error('AI không trả lời được câu này (có thể đã bị bộ lọc an toàn chặn).');
    }

    return text.trim();
  } catch (err: any) {
    console.log('[GeminiService] Lỗi gọi Gemini Cloud:', err?.message || err);
    // Nếu lỗi do quota hoặc key không khả dụng, tự động fallback sang RAG để giữ app hoạt động
    if (err?.message?.includes('API key') || err?.message?.includes('quota') || err?.message?.includes('429')) {
      return generateLocalRagResponse(question, trimmed);
    }
    throw err;
  }
};

/** Chuyển thông báo lỗi kỹ thuật thành câu chữ mà người dùng đọc hiểu được. */
export const toFriendlyError = (error: unknown): string => {
  const msg = error instanceof Error ? error.message : String(error);

  if (msg.includes('429'))
    return 'Trợ lý đang bận (quá nhiều yêu cầu). Bạn đợi vài giây rồi thử lại nhé.';
  if (
    msg.includes('API key') ||
    msg.includes('API_KEY') ||
    msg.includes('401') ||
    msg.includes('403')
  )
    return 'API Key chưa đúng. Hãy kiểm tra lại file geminiConfig.ts.';
  if (msg.includes('Network') || msg.includes('fetch') || msg.includes('network'))
    return 'Mất kết nối mạng. Bạn kiểm tra Wi-Fi/4G giúp mình nhé.';
  if (msg.includes('bộ lọc an toàn')) return msg;

  return 'Trợ lý gặp sự cố tạm thời. Bạn thử lại giúp mình nhé.';
};


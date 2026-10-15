import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AiService, ChatHistoryItem } from './ai.service';

@ApiTags('AI Assistant')
@Controller('api/ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  @ApiOperation({ summary: 'Gửi tin nhắn tới trợ lý AI Gemini (Key được bảo vệ tại Server)' })
  async chat(@Body() body: { message: string; history?: ChatHistoryItem[] }) {
    const reply = await this.aiService.chat(body.message, body.history ?? []);
    return { reply };
  }
}

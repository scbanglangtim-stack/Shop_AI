import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Cho phép CORS để gọi từ browser/Postman
  app.enableCors();

  // 2. Trạm kiểm soát ValidationPipe toàn cục
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 3. Tự sinh tài liệu API Swagger / OpenAPI
  const swaggerConfig = new DocumentBuilder()
    .setTitle('ShopAI API Documentation')
    .setDescription('Tài liệu API chuẩn RESTful kết nối Mobile App ShopAI (Chương 9)')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  // 4. Lắng nghe mọi card mạng (0.0.0.0) trên port 3000
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 ShopAI Backend đang chạy tại: http://localhost:${port}`);
  console.log(`📖 Tài liệu Swagger UI: http://localhost:${port}/api/docs`);
}
bootstrap();

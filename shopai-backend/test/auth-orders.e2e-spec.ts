// test/auth-orders.e2e-spec.ts
// E2E Test bằng Supertest cho POST /api/auth/login và POST /api/orders (Chương 11 - Phần 11.15.4 & Bước 11f)
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { AppModule } from '../src/app.module';

describe('Auth + Orders (e2e)', () => {
  let app: INestApplication;
  let accessToken: string; // Lưu lại Token từ nhóm test Login, dùng tiếp cho Orders

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/auth/login', () => {
    it('trả về 201 kèm accessToken khi đăng nhập đúng', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'demo@shopai.com', password: '123456' });

      expect(res.status).toBe(201);
      expect(res.body.accessToken).toBeDefined();

      accessToken = res.body.accessToken;
    });

    it('trả về 401 khi sai mật khẩu', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'demo@shopai.com', password: 'sai_mat_khau' });

      expect(res.status).toBe(401);
    });

    it('trả về 400 khi email sai định dạng (ValidationPipe chặn trước khi vào AuthService)', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'khong-phai-email', password: '123456' });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/orders (bảo vệ bằng JwtAuthGuard)', () => {
    const validOrder = {
      items: [{ productId: 'backend_prod_0', quantity: 2 }],
      total: 2000000,
    };

    it('trả về 401 khi KHÔNG gửi kèm Token', async () => {
      const res = await request(app.getHttpServer()).post('/api/orders').send(validOrder);

      expect(res.status).toBe(401);
    });

    it('trả về 401 khi gửi Token SAI/giả mạo', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/orders')
        .set('Authorization', 'Bearer token_gia_mao_khong_hop_le')
        .send(validOrder);

      expect(res.status).toBe(401);
    });

    it('trả về 201 khi gửi kèm Token hợp lệ', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/orders')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(validOrder);

      expect(res.status).toBe(201);
      const returnedId = res.body.id || res.body.orderId;
      expect(returnedId).toMatch(/ORD-/);
    });
  });
});

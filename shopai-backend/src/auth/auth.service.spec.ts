import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let prisma: { user: { findUnique: any } };

  const passwordHash = bcrypt.hashSync('123456', 10);

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: vi.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        {
          provide: JwtService,
          useValue: { sign: vi.fn().mockReturnValue('fake.jwt.token') },
        },
      ],
    }).compile();

    service = module.get(AuthService);
    jwtService = module.get(JwtService);
  });

  describe('login', () => {
    it('trả về accessToken khi email và mật khẩu đều đúng', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'u_001',
        email: 'demo@shopai.com',
        password: passwordHash,
        name: 'Demo User',
      });

      const result = await service.login({ email: 'demo@shopai.com', password: '123456' });

      expect(result.accessToken).toBe('fake.jwt.token');
      expect(result.user.email).toBe('demo@shopai.com');
      expect(jwtService.sign).toHaveBeenCalled();
    });
  });

  describe('validateUser', () => {
    it('trả về null khi email không tồn tại', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      const user = await service.validateUser('khong_ton_tai@shopai.com', '123456');
      expect(user).toBeNull();
    });

    it('trả về null khi sai mật khẩu', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'u_001',
        email: 'demo@shopai.com',
        password: passwordHash,
      });
      const user = await service.validateUser('demo@shopai.com', 'sai_mat_khau');
      expect(user).toBeNull();
    });

    it('login ném UnauthorizedException khi thông tin sai', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(
        service.login({ email: 'khong_ton_tai@shopai.com', password: '123456' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});

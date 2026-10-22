import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { REAL_TECH_PRODUCTS } from './real-products.data';

@Injectable()
export class ProductService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.ensureProductsSeeded();
  }

  async ensureProductsSeeded() {
    try {
      const existing = await this.prisma.product.findMany();
      const needsUpdate =
        existing.length === 0 ||
        existing.some((p) => !p.category || p.id.startsWith('backend_prod_'));

      if (needsUpdate) {
        console.log('📦 Tự động khởi tạo và cập nhật đầy đủ danh mục cho sản phẩm...');
        await this.prisma.product.deleteMany({
          where: { id: { startsWith: 'backend_prod_' } },
        });

        for (const prod of REAL_TECH_PRODUCTS) {
          await this.prisma.product.upsert({
            where: { id: prod.id },
            update: {
              name: prod.name,
              price: prod.price,
              image: prod.image,
              category: prod.category,
              rating: prod.rating,
              discount: prod.discount,
            },
            create: {
              id: prod.id,
              name: prod.name,
              price: prod.price,
              image: prod.image,
              category: prod.category,
              rating: prod.rating,
              discount: prod.discount,
            },
          });
        }
        console.log(`✅ Đã đồng bộ ${REAL_TECH_PRODUCTS.length} sản phẩm thực tế vào SQLite Database!`);
      }
    } catch (e) {
      console.error('Lỗi khi nạp dữ liệu sản phẩm thực tế:', e);
    }
  }

  async getAllProducts() {
    await this.ensureProductsSeeded();
    return await this.prisma.product.findMany();
  }

  async getProductById(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Không tìm thấy sản phẩm có id = ${id}`);
    }
    return product;
  }

  async findRawById(id: string) {
    return await this.prisma.product.findUnique({ where: { id } });
  }

  async createProduct(dto: CreateProductDto) {
    const id = `backend_prod_${Date.now()}`;
    return await this.prisma.product.create({
      data: {
        id,
        name: dto.name,
        price: dto.price,
        image: dto.image,
      },
    });
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllProducts() {
    const products = await this.prisma.product.findMany();
    if (products.length > 0) {
      return products;
    }
    // Fallback nếu database trống
    return Array.from({ length: 20 }).map((_, i) => ({
      id: `backend_prod_${i}`,
      name: `Sản phẩm từ NestJS Server ${i}`,
      price: 1000000 + i * 10000,
      image: `https://picsum.photos/id/${200 + i}/400/400`,
    }));
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

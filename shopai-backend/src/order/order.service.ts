import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { IOrderRepository } from './order.repository';
import { ProductService } from '../product/product.service';

@Injectable()
export class OrderService {
  constructor(
    @Inject('IOrderRepository')
    private readonly orderRepository: IOrderRepository,
    private readonly productService: ProductService,
  ) {}

  async createOrder(userId: string, dto: CreateOrderDto) {
    let calculatedTotal = 0;
    const resolvedItems: { productId: string; quantity: number; price: number }[] = [];

    for (const item of dto.items) {
      const product = await this.productService.findRawById(item.productId);
      if (!product) {
        throw new BadRequestException(`Sản phẩm id=${item.productId} không tồn tại`);
      }
      calculatedTotal += product.price * item.quantity;
      resolvedItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    const orderId = `ORD-${Date.now()}`;
    return await this.orderRepository.save({
      id: orderId,
      userId,
      total: calculatedTotal,
      items: resolvedItems,
    });
  }

  async getOrdersByUser(userId: string) {
    return await this.orderRepository.findByUserId(userId);
  }

  async getOrderById(orderId: string, userId: string) {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundException(`Không tìm thấy đơn hàng id=${orderId}`);
    }
    if (order.userId !== userId) {
      throw new NotFoundException('Đơn hàng không thuộc về tài khoản của bạn');
    }
    return order;
  }

  async payOrder(orderId: string, userId: string) {
    const order = await this.getOrderById(orderId, userId);
    if (order.status === 'PAID') {
      return order;
    }
    return await this.orderRepository.updateStatus(orderId, 'PAID');
  }
}

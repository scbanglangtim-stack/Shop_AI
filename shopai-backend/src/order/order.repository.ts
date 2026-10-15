import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateOrderInput {
  id: string;
  userId: string;
  total: number;
  items: { productId: string; quantity: number; price: number }[];
}

export interface OrderRecord {
  id: string;
  userId: string;
  total: number;
  status: string;
  createdAt: Date;
  items: { productId: string; quantity: number; price: number }[];
}

export interface IOrderRepository {
  save(order: CreateOrderInput): Promise<OrderRecord>;
  findAll(): Promise<OrderRecord[]>;
  findByUserId(userId: string): Promise<OrderRecord[]>;
  findById(orderId: string): Promise<OrderRecord | null>;
  updateStatus(orderId: string, status: string): Promise<OrderRecord>;
}

@Injectable()
export class PrismaOrderRepository implements IOrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(input: CreateOrderInput): Promise<OrderRecord> {
    const order = await this.prisma.order.create({
      data: {
        id: input.id,
        userId: input.userId,
        total: input.total,
        status: 'PENDING',
        items: {
          create: input.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return {
      id: order.id,
      userId: order.userId,
      total: order.total,
      status: order.status,
      createdAt: order.createdAt,
      items: order.items.map((it) => ({
        productId: it.productId,
        quantity: it.quantity,
        price: it.price,
      })),
    };
  }

  async findAll(): Promise<OrderRecord[]> {
    const orders = await this.prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
    return orders.map((o) => ({
      id: o.id,
      userId: o.userId,
      total: o.total,
      status: o.status,
      createdAt: o.createdAt,
      items: o.items.map((it) => ({
        productId: it.productId,
        quantity: it.quantity,
        price: it.price,
      })),
    }));
  }

  async findByUserId(userId: string): Promise<OrderRecord[]> {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
    return orders.map((o) => ({
      id: o.id,
      userId: o.userId,
      total: o.total,
      status: o.status,
      createdAt: o.createdAt,
      items: o.items.map((it) => ({
        productId: it.productId,
        quantity: it.quantity,
        price: it.price,
      })),
    }));
  }

  async findById(orderId: string): Promise<OrderRecord | null> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });
    if (!order) return null;
    return {
      id: order.id,
      userId: order.userId,
      total: order.total,
      status: order.status,
      createdAt: order.createdAt,
      items: order.items.map((it) => ({
        productId: it.productId,
        quantity: it.quantity,
        price: it.price,
      })),
    };
  }

  async updateStatus(orderId: string, status: string): Promise<OrderRecord> {
    const order = await this.prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: { items: true },
    });
    return {
      id: order.id,
      userId: order.userId,
      total: order.total,
      status: order.status,
      createdAt: order.createdAt,
      items: order.items.map((it) => ({
        productId: it.productId,
        quantity: it.quantity,
        price: it.price,
      })),
    };
  }
}

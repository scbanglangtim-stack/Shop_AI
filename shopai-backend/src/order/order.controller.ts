import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo đơn hàng mới (Trạng thái PENDING, Server tự tính lại tiền)' })
  createOrder(@Request() req: any, @Body() dto: CreateOrderDto) {
    return this.orderService.createOrder(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách lịch sử đơn hàng của User đang đăng nhập' })
  getMyOrders(@Request() req: any) {
    return this.orderService.getOrdersByUser(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết đơn hàng theo ID' })
  getOrderById(@Request() req: any, @Param('id') id: string) {
    return this.orderService.getOrderById(id, req.user.id);
  }

  @Post(':id/pay')
  @ApiOperation({ summary: 'Thanh toán đơn hàng (Chuyển trạng thái từ PENDING -> PAID)' })
  payOrder(@Request() req: any, @Param('id') id: string) {
    return this.orderService.payOrder(id, req.user.id);
  }
}

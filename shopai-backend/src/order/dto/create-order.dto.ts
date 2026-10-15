import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsNumber, IsString, Min, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OrderItemDto {
  @ApiProperty({ example: 'backend_prod_0', description: 'Mã sản phẩm' })
  @IsString()
  productId: string;

  @ApiProperty({ example: 2, description: 'Số lượng mua' })
  @IsNumber()
  @Min(1, { message: 'Số lượng tối thiểu là 1' })
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ type: [OrderItemDto], description: 'Danh sách sản phẩm trong giỏ hàng' })
  @IsArray()
  @ArrayNotEmpty({ message: 'Giỏ hàng đang trống, không thể đặt hàng' })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ example: 2000000, description: 'Tổng tiền client đối chiếu' })
  @IsNumber()
  @Min(0)
  total: number;
}

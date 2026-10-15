import { IsNotEmpty, IsNumber, IsString, IsUrl, MaxLength, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'iPhone 15 Pro Max', description: 'Tên sản phẩm' })
  @IsString()
  @IsNotEmpty({ message: 'Tên sản phẩm không được để trống' })
  @MaxLength(200, { message: 'Tên sản phẩm tối đa 200 ký tự' })
  name: string;

  @ApiProperty({ example: 28990000, description: 'Giá tiền VND' })
  @IsNumber({}, { message: 'Giá phải là một con số' })
  @Min(0, { message: 'Giá sản phẩm không được âm' })
  price: number;

  @ApiProperty({ example: 'https://picsum.photos/400/400', description: 'Đường dẫn ảnh sản phẩm' })
  @IsUrl({}, { message: 'Ảnh sản phẩm phải là một URL hợp lệ' })
  image: string;
}

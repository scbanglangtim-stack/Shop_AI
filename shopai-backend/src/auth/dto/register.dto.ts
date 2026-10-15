import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'newuser@shopai.com', description: 'Email đăng ký mới' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @ApiProperty({ example: '123456', description: 'Mật khẩu (ít nhất 6 ký tự)' })
  @IsString()
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @MinLength(6, { message: 'Mật khẩu phải từ 6 ký tự trở lên' })
  password: string;

  @ApiProperty({ example: 'Nguyễn Văn A', required: false, description: 'Họ và tên' })
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Tên phải từ 2 ký tự trở lên' })
  name?: string;
}

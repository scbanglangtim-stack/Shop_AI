import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';

@ApiTags('Products')
@Controller('api/products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy toàn bộ danh sách sản phẩm' })
  getProducts() {
    return this.productService.getAllProducts();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết 1 sản phẩm theo ID' })
  getProductById(@Param('id') id: string) {
    return this.productService.getProductById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Thêm sản phẩm mới (minh họa ValidationPipe)' })
  createProduct(@Body() dto: CreateProductDto) {
    return this.productService.createProduct(dto);
  }
}

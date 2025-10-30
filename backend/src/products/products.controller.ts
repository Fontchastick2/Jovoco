import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './product.entity';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Post()
  async create(@Body() product: Partial<Product>): Promise<Product> {
    return this.productsService.create(product);
  }

  @Get()
  async findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Get(':productId')
  async findById(@Param('productId') productId: string): Promise<Product | null> {
    return this.productsService.findById(productId);
  }

  @Get('category/:category')
  async findByCategory(@Param('category') category: string): Promise<Product[]> {
    return this.productsService.findByCategory(category);
  }

  @Put(':productId/stock')
  async updateStock(
    @Param('productId') productId: string,
    @Body() body: { quantity: number },
  ): Promise<Product | null> {
    return this.productsService.updateStock(productId, body.quantity);
  }

  @Put(':productId/price')
  async updatePrice(
    @Param('productId') productId: string,
    @Body() body: { price: number },
  ): Promise<Product | null> {
    return this.productsService.updatePrice(productId, body.price);
  }

  @Put(':productId')
  async update(
    @Param('productId') productId: string,
    @Body() product: Partial<Product>,
  ): Promise<Product | null> {
    return this.productsService.update(productId, product);
  }

  @Delete(':productId')
  async delete(@Param('productId') productId: string): Promise<void> {
    return this.productsService.delete(productId);
  }
}

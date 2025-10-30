import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { CartsService } from './carts.service';
import type { CartItem } from './cart.entity';
import { Cart } from './cart.entity';

@Controller('carts')
export class CartsController {
  constructor(private cartsService: CartsService) {}

  @Post()
  async create(@Body() cart: Partial<Cart>): Promise<Cart> {
    return this.cartsService.create(cart);
  }

  @Get()
  async findAll(): Promise<Cart[]> {
    return this.cartsService.findAll();
  }

  @Get(':cartId')
  async findById(@Param('cartId') cartId: string): Promise<Cart | null> {
    return this.cartsService.findById(cartId);
  }

  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: string): Promise<Cart | null> {
    return this.cartsService.findByUserId(userId);
  }

  @Get('session/:sessionId')
  async findBySessionId(@Param('sessionId') sessionId: string): Promise<Cart | null> {
    return this.cartsService.findBySessionId(sessionId);
  }

  @Post(':cartId/items')
  async addItem(
    @Param('cartId') cartId: string,
    @Body() item: CartItem,
  ): Promise<Cart | null> {
    return this.cartsService.addItem(cartId, item);
  }

  @Delete(':cartId/items/:productId')
  async removeItem(
    @Param('cartId') cartId: string,
    @Param('productId') productId: string,
  ): Promise<Cart | null> {
    return this.cartsService.removeItem(cartId, productId);
  }

  @Put(':cartId/items/:productId')
  async updateItemQuantity(
    @Param('cartId') cartId: string,
    @Param('productId') productId: string,
    @Body() body: { quantity: number },
  ): Promise<Cart | null> {
    return this.cartsService.updateItemQuantity(cartId, productId, body.quantity);
  }

  @Delete(':cartId/clear')
  async clearCart(@Param('cartId') cartId: string): Promise<Cart | null> {
    return this.cartsService.clearCart(cartId);
  }

  @Delete(':cartId')
  async delete(@Param('cartId') cartId: string): Promise<void> {
    return this.cartsService.delete(cartId);
  }
}

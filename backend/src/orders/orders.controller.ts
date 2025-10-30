import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from './order.entity';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  async create(@Body() order: Partial<Order>): Promise<Order> {
    return this.ordersService.create(order);
  }

  @Get()
  async findAll(): Promise<Order[]> {
    return this.ordersService.findAll();
  }

  @Get('cart/:userId')
  async getCart(@Param('userId') userId: string): Promise<Order> {
    return this.ordersService.getCart(userId);
  }

  @Get('status/:status')
  async findByStatus(@Param('status') status: string): Promise<Order[]> {
    return this.ordersService.findByStatus(status);
  }

  @Post(':orderId/add-item')
  async addItemToCart(
    @Param('orderId') orderId: string,
    @Body() body: { productId: string; quantity: number },
  ): Promise<Order | null> {
    return this.ordersService.addItemToCart(orderId, body.productId, body.quantity);
  }

  @Delete(':orderId/items/:productId')
  async removeItemFromCart(
    @Param('orderId') orderId: string,
    @Param('productId') productId: string,
  ): Promise<Order | null> {
    return this.ordersService.removeItemFromCart(orderId, productId);
  }

  @Get(':orderId')
  async findById(@Param('orderId') orderId: string): Promise<Order | null> {
    return this.ordersService.findById(orderId);
  }

  @Put(':orderId')
  async update(
    @Param('orderId') orderId: string,
    @Body() order: Partial<Order>,
  ): Promise<Order | null> {
    return this.ordersService.update(orderId, order);
  }

  @Put(':orderId/status')
  async updateStatus(
    @Param('orderId') orderId: string,
    @Body() body: { status: string },
  ): Promise<Order | null> {
    return this.ordersService.updateStatus(orderId, body.status);
  }

  @Post(':orderId/checkout')
  async checkout(
    @Param('orderId') orderId: string,
  ): Promise<Order | null> {
    return this.ordersService.updateStatus(orderId, 'packing');
  }

  @Delete(':orderId')
  async delete(@Param('orderId') orderId: string): Promise<void> {
    return this.ordersService.delete(orderId);
  }
}

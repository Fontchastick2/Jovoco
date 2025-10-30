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

  @Get(':orderId')
  async findById(@Param('orderId') orderId: string): Promise<Order | null> {
    return this.ordersService.findById(orderId);
  }

  @Get('status/:status')
  async findByStatus(@Param('status') status: string): Promise<Order[]> {
    return this.ordersService.findByStatus(status);
  }

  @Get('cart/:userId')
  async getCart(@Param('userId') userId: string): Promise<Order> {
    return this.ordersService.getCart(userId);
  }

  @Post(':orderId/add-item')
  async addItemToCart(
    @Param('orderId') orderId: string,
    @Body() body: { productId: string; quantity: number },
  ): Promise<Order | null> {
    return this.ordersService.addItemToCart(orderId, body.productId, body.quantity);
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

  @Delete(':orderId')
  async delete(@Param('orderId') orderId: string): Promise<void> {
    return this.ordersService.delete(orderId);
  }
}

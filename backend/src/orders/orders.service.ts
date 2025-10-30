import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) { }

  async create(order: Partial<Order>): Promise<Order> {
    const newOrder = this.ordersRepository.create(order);
    const savedOrder = await this.ordersRepository.save(newOrder);
    return this.findById(savedOrder.orderId) as Promise<Order>;
  }

  async findAll(): Promise<Order[]> {
    return this.ordersRepository.find();
  }

  async findById(orderId: string): Promise<Order | null> {
    return this.ordersRepository.findOne({ where: { orderId } });
  }

  async findByStatus(status: string): Promise<Order[]> {
    return this.ordersRepository.find({ where: { status } });
  }

  async update(orderId: string, order: Partial<Order>): Promise<Order | null> {
    await this.ordersRepository.update(orderId, order);
    return this.findById(orderId);
  }

  async updateStatus(orderId: string, status: string): Promise<Order | null> {
    await this.ordersRepository.update(orderId, { status });
    return this.findById(orderId);
  }

  async delete(orderId: string): Promise<void> {
    await this.ordersRepository.delete(orderId);
  }
}

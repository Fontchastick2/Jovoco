import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async create(product: Partial<Product>): Promise<Product> {
    const newProduct = this.productsRepository.create(product);
    return this.productsRepository.save(newProduct);
  }

  async findAll(): Promise<Product[]> {
    return this.productsRepository.find();
  }

  async findById(productId: string): Promise<Product | null> {
    return this.productsRepository.findOne({ where: { productId } });
  }

  async findByCategory(category: string): Promise<Product[]> {
    return this.productsRepository.find({ where: { category } });
  }

  async updateStock(productId: string, quantity: number): Promise<Product | null> {
    await this.productsRepository.update(productId, { stockQuantity: quantity });
    return this.findById(productId);
  }

  async updatePrice(productId: string, price: number): Promise<Product | null> {
    await this.productsRepository.update(productId, { price });
    return this.findById(productId);
  }

  async delete(productId: string): Promise<void> {
    await this.productsRepository.delete(productId);
  }
}

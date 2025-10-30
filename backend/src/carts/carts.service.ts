import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart, CartItem } from './cart.entity';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart)
    private cartsRepository: Repository<Cart>,
  ) { }

  async create(cart: Partial<Cart>): Promise<Cart> {
    const newCart = this.cartsRepository.create(cart);
    const savedCart = await this.cartsRepository.save(newCart);
    return this.findById(savedCart.cartId) as Promise<Cart>;
  }

  async findAll(): Promise<Cart[]> {
    return this.cartsRepository.find();
  }

  async findById(cartId: string): Promise<Cart | null> {
    return this.cartsRepository.findOne({ where: { cartId } });
  }

  async findByUserId(userId: string): Promise<Cart | null> {
    return this.cartsRepository.findOne({ where: { userId } });
  }

  async findBySessionId(sessionId: string): Promise<Cart | null> {
    return this.cartsRepository.findOne({ where: { sessionId } });
  }

  async addItem(cartId: string, item: CartItem): Promise<Cart | null> {
    const cart = await this.findById(cartId);
    if (!cart) return null;

    const existingItem = cart.items.find(i => i.productId === item.productId);
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      cart.items.push(item);
    }

    cart.totalPrice = this.calculateTotal(cart.items);
    return this.cartsRepository.save(cart);
  }

  async removeItem(cartId: string, productId: string): Promise<Cart | null> {
    const cart = await this.findById(cartId);
    if (!cart) return null;

    cart.items = cart.items.filter(i => i.productId !== productId);
    cart.totalPrice = this.calculateTotal(cart.items);
    return this.cartsRepository.save(cart);
  }

  async updateItemQuantity(cartId: string, productId: string, quantity: number): Promise<Cart | null> {
    const cart = await this.findById(cartId);
    if (!cart) return null;

    const item = cart.items.find(i => i.productId === productId);
    if (item) {
      if (quantity <= 0) {
        cart.items = cart.items.filter(i => i.productId !== productId);
      } else {
        item.quantity = quantity;
      }
      cart.totalPrice = this.calculateTotal(cart.items);
      return this.cartsRepository.save(cart);
    }
    return null;
  }

  async clearCart(cartId: string): Promise<Cart | null> {
    const cart = await this.findById(cartId);
    if (!cart) return null;

    cart.items = [];
    cart.totalPrice = 0;
    return this.cartsRepository.save(cart);
  }

  async delete(cartId: string): Promise<void> {
    await this.cartsRepository.delete(cartId);
  }

  private calculateTotal(items: CartItem[]): number {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
}

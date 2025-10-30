import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('carts')
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  cartId: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  userId: string; // For authenticated users, null for anonymous

  @Column({ type: 'varchar', length: 255, nullable: true })
  sessionId: string; // For anonymous users

  @Column({ type: 'simple-json', default: '[]' })
  items: CartItem[];

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalPrice: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
}

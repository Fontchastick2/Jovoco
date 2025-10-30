import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Product {
    productId: string;
    name: string;
    description: string;
    price: number;
    stockQuantity: number;
    category: string;
    imageUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface OrderItem {
    orderItemId: string;
    productId: string;
    quantity: number;
    orderId: string;
    product?: Product;
}

export interface Order {
    orderId: string;
    userId: string;
    status: string;
    items: OrderItem[];
    createdAt: Date;
    updatedAt: Date;
}

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private readonly API_URL = 'http://localhost:3000/orders';
    private currentOrder: Order | null = null;

    private orderSubject = new BehaviorSubject<OrderItem[]>([]);
    public order$ = this.orderSubject.asObservable();

    private cartCountSubject = new BehaviorSubject<number>(0);
    public cartCount$ = this.cartCountSubject.asObservable();

    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) {
        this.loadOrder();
    }

    private loadOrder(): void {
        const userId = this.authService.getUserIdFromToken();
        if (userId) {
            this.loadShoppingCart();
        } else {
            console.warn('No userId found in token');
            this.orderSubject.next([]);
        }
    }

    loadShoppingCart(): void {
        const userId = this.authService.getUserIdFromToken();
        if (!userId) {
            console.error('User not authenticated');
            return;
        }

        console.log('Loading shopping cart for user:', userId);
        this.http.get<Order>(`${this.API_URL}/cart/${userId}`).subscribe({
            next: (order) => {
                console.log('Shopping cart loaded from API:', order);
                this.currentOrder = order;
                this.orderSubject.next(order.items || []);
            },
            error: (err) => {
                console.error('Error loading shopping cart from database:', err);
                this.orderSubject.next([]);
            }
        });
    }

    private getCartId(callback: (orderId: string) => void): void {
        const userId = this.authService.getUserIdFromToken();
        if (!userId) {
            console.error('User not authenticated');
            return;
        }

        console.log('Fetching cart for user:', userId);
        this.http.get<Order>(`${this.API_URL}/cart/${userId}`).subscribe({
            next: (cart) => {
                console.log('Cart fetched:', cart);
                callback(cart.orderId);
            },
            error: (err) => {
                console.error('Error fetching cart:', err);
            }
        });
    }

    addOrderItem(product: any, quantity: number = 1): void {
        this.getCartId((orderId) => {
            console.log('Adding item to cart:', product.productId);
            this.http.post(`${this.API_URL}/${orderId}/add-item`, {
                productId: product.productId,
                quantity
            }).subscribe({
                next: (response: any) => {
                    console.log('Order item added:', product.name);
                    this.currentOrder = response;
                    this.orderSubject.next(response.items || []);
                },
                error: (err) => {
                    console.error('Error adding order item:', err);
                }
            });
        });
    }

    getCartTotal(): number {
        if (!this.currentOrder || !this.currentOrder.items) {
            return 0;
        }
        return this.currentOrder.items.reduce((total, item) => total + (Number(item.product?.price || 0) * item.quantity), 0);
    }

    getCartItemCount(): number {
        if (!this.currentOrder || !this.currentOrder.items) {
            return 0;
        }
        return this.currentOrder.items.reduce((total, item) => total + item.quantity, 0);
    }

}

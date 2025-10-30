import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { BehaviorSubject, Observable } from 'rxjs';

export interface OrderItem {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    imageUrl?: string;
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
            console.log('Loading order for user:', userId);
            this.http.get<Order>(`${this.API_URL}/user/${userId}`).subscribe({
                next: (order) => {
                    console.log('Order loaded from API:', order);
                    this.currentOrder = order;
                    this.orderSubject.next(order.items || []);
                },
                error: (err) => {
                    console.error('Error loading order from database:', err);
                    this.orderSubject.next([]);
                }
            });
        } else {
            console.warn('No userId found in token');
            this.orderSubject.next([]);
        }
    }

    addOrderItem(product: any): void {
        const userId = this.authService.getUserIdFromToken();
        if (!userId) {
            console.error('User not authenticated');
            return;
        }

        const newItem: OrderItem = {
            productId: product.productId,
            productName: product.name,
            price: product.price,
            quantity: 1,
            imageUrl: product.imageUrl
        };

        console.log('Adding order item:', newItem);
        this.http.post(`${this.API_URL}/add-item`, { userId, item: newItem }).subscribe({
            next: (response: any) => {
                console.log('Order item added:', product.name);
                this.currentOrder = response;
                this.orderSubject.next(response.items || []);
            },
            error: (err) => {
                console.error('Error adding order item:', err);
            }
        });
    }

}

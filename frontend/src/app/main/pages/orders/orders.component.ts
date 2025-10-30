import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { OrderService, OrderItem } from '../../../services/order.service';
import { Subscription } from 'rxjs';

interface Order {
    orderId: string;
    customerName: string;
    customerEmail: string;
    customerAddress?: string;
    totalAmount: number;
    status: string;
    items: OrderItem[];
    createdAt: string;
}

@Component({
    selector: 'app-orders',
    standalone: true,
    imports: [CommonModule, FormsModule, MatIconModule],
    templateUrl: './orders.component.html',
    styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit, OnDestroy {
    orders: Order[] = [];
    cartItems: OrderItem[] = [];
    loading = false;
    error = '';
    selectedOrder: Order | null = null;
    activeTab: 'cart' | 'orders' = 'cart';

    private apiUrl = 'http://localhost:3000';
    private cartSubscription: Subscription | null = null;

    constructor(
        private http: HttpClient,
        private cd: ChangeDetectorRef,
        private orderService: OrderService
    ) { }

    ngOnInit(): void {
        this.loadOrders();
        this.subscribeToCart();
    }

    ngOnDestroy(): void {
        if (this.cartSubscription) {
            this.cartSubscription.unsubscribe();
        }
    }

    private subscribeToCart(): void {
        this.cartSubscription = this.orderService.order$.subscribe(items => {
            this.cartItems = items;
            this.cd.markForCheck();
        });
    }

    loadOrders(): void {
        this.loading = true;
        this.error = '';

        this.http.get<Order[]>(`${this.apiUrl}/orders`).subscribe({
            next: (data) => {
                this.orders = data;
                this.loading = false;
                this.cd.markForCheck();
            },
            error: (err) => {
                this.error = 'Erreur lors du chargement des commandes';
                console.error(err);
                this.loading = false;
                this.cd.markForCheck();
            }
        });
    }

    selectOrder(order: Order): void {
        this.selectedOrder = this.selectedOrder?.orderId === order.orderId ? null : order;
    }

    getStatusBadgeClass(status: string): string {
        switch (status) {
            case 'pending':
                return 'badge-pending';
            case 'confirmed':
                return 'badge-confirmed';
            case 'shipped':
                return 'badge-shipped';
            case 'delivered':
                return 'badge-delivered';
            case 'cancelled':
                return 'badge-cancelled';
            default:
                return 'badge-pending';
        }
    }

    getStatusLabel(status: string): string {
        const labels: { [key: string]: string } = {
            pending: 'En attente',
            confirmed: 'Confirmée',
            shipped: 'Expédiée',
            delivered: 'Livrée',
            cancelled: 'Annulée'
        };
        return labels[status] || status;
    }

    formatPrice(price: number): string {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR'
        }).format(price);
    }

    formatDate(date: string): string {
        return new Date(date).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    deleteOrder(orderId: string): void {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
            this.http.delete(`${this.apiUrl}/orders/${orderId}`).subscribe({
                next: () => {
                    this.orders = this.orders.filter(o => o.orderId !== orderId);
                    this.selectedOrder = null;
                },
                error: (err) => {
                    this.error = 'Erreur lors de la suppression';
                    console.error(err);
                }
            });
        }
    }

    removeFromCart(productId: string): void {
        this.orderService.removeFromCart(productId);
    }

    updateQuantity(productId: string, quantity: number): void {
        if (quantity > 0) {
            // this.orderService.updateQuantity(productId, quantity);
        }
    }

    getCartTotal(): number {
        return this.orderService.getCartTotal();
    }

    clearCart(): void {
        if (confirm('Êtes-vous sûr de vouloir vider le panier ?')) {
            // this.orderService.clearCart();
        }
    }

    checkout(): void {
        if (this.cartItems.length === 0) {
            this.error = 'Votre panier est vide';
            return;
        }
        this.orderService.checkout();
    }
}

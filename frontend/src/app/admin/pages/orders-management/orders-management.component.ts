import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { Order, OrderItem } from '../../../services/order.service';

@Component({
    selector: 'app-orders-management',
    standalone: true,
    imports: [CommonModule, FormsModule, MatIconModule],
    templateUrl: './orders-management.component.html',
    styleUrl: './orders-management.component.css'
})
export class OrdersManagementComponent implements OnInit {
    orders: Order[] = [];
    loading = false;
    error = '';
    private apiUrl = 'http://localhost:3000/orders';
    expandedOrders: { [key: string]: boolean } = {};
    
    statusOptions = ['packing', 'in_delivery', 'delivered', 'returned'];
    statusColors: { [key: string]: string } = {
        'packing': '#ffc107',
        'in_delivery': '#007bff',
        'delivered': '#28a745',
        'returned': '#dc3545'
    };

    constructor(
        private http: HttpClient,
        private cd: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.loadOrders();
    }

    loadOrders(): void {
        this.loading = true;
        this.error = '';

        this.http.get<Order[]>(`${this.apiUrl}`).subscribe({
            next: (data) => {
                // Filtrer les orders qui ne sont pas "in_cart"
                this.orders = data.filter(order => order.status !== 'in_cart');
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

    updateStatus(order: Order, newStatus: string): void {
        this.http.put(`${this.apiUrl}/${order.orderId}/status`, { status: newStatus }).subscribe({
            next: (response: any) => {
                order.status = newStatus;
                this.cd.markForCheck();
            },
            error: (err) => {
                this.error = 'Erreur lors de la mise à jour du statut';
                console.error(err);
                this.cd.markForCheck();
            }
        });
    }

    formatPrice(price: any): string {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR'
        }).format(Number(price) || 0);
    }

    getOrderTotal(order: Order): number {
        if (!order.items) return 0;
        return order.items.reduce((total, item) => total + (Number(item.product?.price || 0) * item.quantity), 0);
    }

    formatDate(date: any): string {
        return new Date(date).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    toggleOrderItems(orderId: string): void {
        this.expandedOrders[orderId] = !this.expandedOrders[orderId];
    }

    isOrderExpanded(orderId: string): boolean {
        return this.expandedOrders[orderId] || false;
    }
}

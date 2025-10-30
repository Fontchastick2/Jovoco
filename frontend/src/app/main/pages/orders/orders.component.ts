import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';

interface OrderItem {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    imageUrl?: string;
}

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
export class OrdersComponent implements OnInit {
    orders: Order[] = [];
    loading = false;
    error = '';
    selectedOrder: Order | null = null;

    private apiUrl = 'http://localhost:3000';

    constructor(private http: HttpClient, private cd: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.loadOrders();
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
}

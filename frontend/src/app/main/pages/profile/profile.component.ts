import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { Subscription } from 'rxjs';

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
    totalAmount: number;
    status: string;
    items: OrderItem[];
    createdAt: string;
}

interface WishlistItem {
    productId: string;
    productName: string;
    price: number;
    imageUrl?: string;
    addedAt: string;
}

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, FormsModule, MatIconModule],
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
    activeTab: 'info' | 'settings' | 'orders' | 'wishlist' = 'info';
    user: any = null;
    orders: Order[] = [];
    wishlist: WishlistItem[] = [];
    loading = false;
    error = '';

    // Settings
    language = 'en';
    notificationsEnabled = true;
    emailNotifications = true;
    pushNotifications = false;

    private apiUrl = 'http://localhost:3000';
    private userSubscription: Subscription | null = null;

    constructor(
        private authService: AuthService,
        private userService: UserService,
        private http: HttpClient,
        private router: Router,
        private cd: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.loadUserData();
        this.loadOrders();
        this.loadWishlist();
    }

    ngOnDestroy(): void {
        if (this.userSubscription) {
            this.userSubscription.unsubscribe();
        }
    }

    private loadUserData(): void {
        this.userSubscription = this.userService.user$.subscribe(user => {
            this.user = user;
            this.cd.markForCheck();
        });
    }

    loadOrders(): void {
        this.loading = true;
        this.http.get<Order[]>(`${this.apiUrl}/orders`).subscribe({
            next: (data) => {
                this.orders = data;
                this.loading = false;
                this.cd.markForCheck();
            },
            error: (err) => {
                console.error('Error loading orders:', err);
                this.loading = false;
                this.cd.markForCheck();
            }
        });
    }

    loadWishlist(): void {
        // Simulated wishlist data - replace with actual API call
        this.wishlist = [];
    }

    setActiveTab(tab: 'info' | 'settings' | 'orders' | 'wishlist'): void {
        this.activeTab = tab;
    }

    saveSettings(): void {
        // Save settings to backend
        console.log('Settings saved:', {
            language: this.language,
            notificationsEnabled: this.notificationsEnabled,
            emailNotifications: this.emailNotifications,
            pushNotifications: this.pushNotifications
        });
    }

    logout(): void {
        this.authService.logout();
        this.router.navigate(['/auth/sign-in']);
    }

    formatPrice(price: number): string {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    }

    formatDate(date: string): string {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
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
            pending: 'Pending',
            confirmed: 'Confirmed',
            shipped: 'Shipped',
            delivered: 'Delivered',
            cancelled: 'Cancelled'
        };
        return labels[status] || status;
    }

    removeFromWishlist(productId: string): void {
        this.wishlist = this.wishlist.filter(item => item.productId !== productId);
    }
}

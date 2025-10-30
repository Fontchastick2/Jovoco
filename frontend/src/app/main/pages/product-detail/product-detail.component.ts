import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';

interface Product {
    productId: string;
    name: string;
    description?: string;
    category?: string;
    price: number;
    stockQuantity: number;
    imageUrl?: string;
    createdAt: string;
}

@Component({
    selector: 'app-product-detail',
    standalone: true,
    imports: [CommonModule, FormsModule, MatIconModule],
    templateUrl: './product-detail.component.html',
    styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit, OnDestroy {
    product: Product | null = null;
    loading = false;
    error = '';
    quantity = 1;

    private apiUrl = 'http://localhost:3000';
    private subscription: Subscription | null = null;
    private routeSubscription: Subscription | null = null;

    constructor(
        private http: HttpClient,
        private route: ActivatedRoute,
        private router: Router,
        private cd: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.routeSubscription = this.route.params.subscribe(params => {
            const articleId = params['articleId'];
            if (articleId) {
                this.loadProduct(articleId);
            }
        });
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        if (this.routeSubscription) {
            this.routeSubscription.unsubscribe();
        }
    }

    loadProduct(articleId: string): void {
        this.loading = true;
        this.error = '';

        this.subscription = this.http.get<Product>(`${this.apiUrl}/products/${articleId}`).subscribe({
            next: (data) => {
                this.product = data;
                this.loading = false;
                this.cd.markForCheck();
            },
            error: (err) => {
                this.error = 'Produit non trouvé';
                console.error(err);
                this.loading = false;
                this.cd.markForCheck();
            }
        });
    }

    addToCart(): void {
        if (this.product) {
            console.log(`Ajouter ${this.quantity}x ${this.product.name} au panier`);
            // À implémenter
        }
    }

    buyNow(): void {
        if (this.product) {
            console.log(`Acheter maintenant: ${this.quantity}x ${this.product.name}`);
            // À implémenter
        }
    }

    addToWishlist(): void {
        if (this.product) {
            console.log(`Ajouter ${this.product.name} à la wishlist`);
            // À implémenter
        }
    }

    goBack(): void {
        this.router.navigate(['/main/catalog']);
    }

    formatPrice(price: number): string {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR'
        }).format(price);
    }

    increaseQuantity(): void {
        if (this.product && this.quantity < this.product.stockQuantity) {
            this.quantity++;
        }
    }

    decreaseQuantity(): void {
        if (this.quantity > 1) {
            this.quantity--;
        }
    }
}

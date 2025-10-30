import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { OrderService } from '../../../services/order.service';

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
    selector: 'app-catalog',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, MatIconModule],
    templateUrl: './catalog.component.html',
    styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit, OnDestroy {
    allProducts: Product[] = [];
    filteredProducts: Product[] = [];
    loading = false;
    error = '';

    // Filtres
    selectedCategory = '';
    priceRange = 1000;
    searchQuery = '';
    sortBy = 'newest';

    categories: string[] = [];
    private apiUrl = 'http://localhost:3000';
    private subscription: Subscription | null = null;
    private queryParamSubscription: Subscription | null = null;

    constructor(
        private http: HttpClient,
        private route: ActivatedRoute,
        private cd: ChangeDetectorRef,
        private orderService: OrderService
    ) { }

    ngOnInit(): void {
        // Listen to query params changes
        this.queryParamSubscription = this.route.queryParams.subscribe(params => {
            if (params['search']) {
                this.searchQuery = params['search'];
            }
            this.loadProducts();
        });
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        if (this.queryParamSubscription) {
            this.queryParamSubscription.unsubscribe();
        }
    }

    loadProducts(): void {
        this.loading = true;
        this.error = '';

        this.subscription = this.http.get<Product[]>(`${this.apiUrl}/products`).subscribe(datas => {
            this.allProducts = datas;
            this.extractCategories();
            this.applyFilters();
            this.loading = false;
            this.cd.markForCheck();

        });
    }

    extractCategories(): void {
        const cats = new Set(this.allProducts.map(p => p.category).filter(c => c));
        this.categories = Array.from(cats) as string[];
    }

    applyFilters(): void {
        let filtered = this.allProducts;

        // Filter by category
        if (this.selectedCategory) {
            filtered = filtered.filter(p => p.category === this.selectedCategory);
        }

        // Filter by price
        filtered = filtered.filter(p => p.price <= this.priceRange);

        // Sort
        switch (this.sortBy) {
            case 'price-asc':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'newest':
            default:
                filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }

        this.filteredProducts = filtered;
    }

    onFilterChange(): void {
        this.applyFilters();
    }

    resetFilters(): void {
        this.selectedCategory = '';
        this.priceRange = 1000;
        this.searchQuery = '';
        this.sortBy = 'newest';
        this.applyFilters();
    }

    formatPrice(price: number): string {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR'
        }).format(price);
    }

    addToCart(product: Product): void {
        this.orderService.addOrderItem(product);
    }

    addToWishlist(product: Product): void {
        console.log('Add to wishlist:', product);
        // To implement
    }
}

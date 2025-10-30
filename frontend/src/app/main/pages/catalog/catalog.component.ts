import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
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
    selector: 'app-catalog',
    standalone: true,
    imports: [CommonModule, FormsModule],
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

    constructor(private http: HttpClient) { }

    ngOnInit(): void {
        this.loadProducts();
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    loadProducts(): void {
        this.loading = true;
        this.error = '';

        this.subscription = this.http.get<Product[]>(`${this.apiUrl}/products`).subscribe({
            next: (data) => {
                this.allProducts = data;
                this.extractCategories();
                this.applyFilters();
                this.loading = false;
            },
            error: (err) => {
                this.error = 'Erreur lors du chargement des produits';
                console.error(err);
                this.loading = false;
            }
        });
    }

    extractCategories(): void {
        const cats = new Set(this.allProducts.map(p => p.category).filter(c => c));
        this.categories = Array.from(cats) as string[];
    }

    applyFilters(): void {
        let filtered = this.allProducts;

        // Filtre par catégorie
        if (this.selectedCategory) {
            filtered = filtered.filter(p => p.category === this.selectedCategory);
        }

        // Filtre par prix
        filtered = filtered.filter(p => p.price <= this.priceRange);

        // Filtre par recherche
        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(query) ||
                p.description?.toLowerCase().includes(query)
            );
        }

        // Tri
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
        console.log('Ajouter au panier:', product);
        // À implémenter
    }
}

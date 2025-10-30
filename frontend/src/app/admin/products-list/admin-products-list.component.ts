import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { HttpClient } from '@angular/common/http';

interface Product {
    productId: string;
    name: string;
    category: string;
    price: number;
    stockQuantity: number;
    createdAt: string;
}

@Component({
    selector: 'app-admin-products-list',
    standalone: true,
    imports: [
        CommonModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatPaginatorModule
    ],
    templateUrl: './admin-products-list.component.html',
    styleUrls: ['./admin-products-list.component.css']
})
export class AdminProductsListComponent implements OnInit {
    allProducts: Product[] = [];
    displayedProducts: Product[] = [];
    loading = false;
    error = '';
    displayedColumns: string[] = ['name', 'category', 'price', 'stockQuantity', 'createdAt', 'actions'];

    // Pagination (frontend only)
    pageSize = 10;
    currentPage = 1;

    private apiUrl = 'http://localhost:3000';

    constructor(private http: HttpClient) { }

    ngOnInit(): void {
        this.loadProducts();
    }

    loadProducts(): void {
        this.loading = true;
        this.error = '';

        this.http.get<Product[]>(`${this.apiUrl}/products`).subscribe({
            next: (data) => {
                this.allProducts = data;
                this.updateDisplayedProducts();
                this.loading = false;
            },
            error: (err) => {
                this.error = 'Erreur lors du chargement des produits';
                this.loading = false;
                console.error(err);
            }
        });
    }

    updateDisplayedProducts(): void {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        this.displayedProducts = this.allProducts.slice(startIndex, endIndex);
    }

    onPageChange(event: PageEvent): void {
        this.currentPage = event.pageIndex + 1;
        this.pageSize = event.pageSize;
        this.updateDisplayedProducts();
    }

    deleteProduct(productId: string): void {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
            this.http.delete(`${this.apiUrl}/products/${productId}`).subscribe({
                next: () => {
                    this.loadProducts();
                },
                error: (err) => {
                    this.error = 'Erreur lors de la suppression';
                    console.error(err);
                }
            });
        }
    }

    editProduct(productId: string): void {
        console.log('Éditer produit:', productId);
        // À implémenter
    }

    formatPrice(price: number): string {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR'
        }).format(price);
    }
}

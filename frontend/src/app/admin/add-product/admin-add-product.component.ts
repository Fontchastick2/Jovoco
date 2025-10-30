import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-admin-add-product',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './admin-add-product.component.html',
  styleUrls: ['./admin-add-product.component.css']
})
export class AdminAddProductComponent {
  name = '';
  description = '';
  price = 0;
  stockQuantity = 0;
  category = '';
  imageUrl = '';
  loading = false;
  error = '';
  success = '';

  private apiUrl = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  addProduct(): void {
    if (!this.name || !this.price) {
      this.error = 'Le nom et le prix sont obligatoires';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    this.http.post(`${this.apiUrl}/products`, {
      name: this.name,
      description: this.description,
      price: parseFloat(this.price.toString()),
      stockQuantity: parseInt(this.stockQuantity.toString()),
      category: this.category,
      imageUrl: this.imageUrl
    }).subscribe({
      next: () => {
        this.success = 'Produit créé avec succès! Redirection...';
        setTimeout(() => {
          this.router.navigate(['/admin/dashboard']);
        }, 2000);
      },
      error: (err) => {
        this.error = err.error?.message || 'Erreur lors de la création du produit';
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/dashboard']);
  }
}

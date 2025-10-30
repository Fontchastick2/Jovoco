import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { OrderService } from '../../../services/order.service';

interface Product {
  productId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  stockQuantity: number;
}

interface Category {
  name: string;
  icon: string;
  count: number;
}

interface Stat {
  icon: string;
  value: string;
  label: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('productsSection') productsSection!: ElementRef;

  featuredProducts: Product[] = [];
  filteredProducts: Product[] = [];
  allProducts: Product[] = [];
  selectedCategory = '';
  wishlist: string[] = [];

  categories: Category[] = [
    { name: 'Electronics', icon: 'devices', count: 0 },
    { name: 'Accessories', icon: 'headphones', count: 0 },
    { name: 'Computers', icon: 'computer', count: 0 },
    { name: 'Phones', icon: 'smartphone', count: 0 }
  ];

  stats: Stat[] = [
    { icon: 'local_shipping', value: 'Free Shipping', label: 'On orders over $50' },
    { icon: 'verified_user', value: 'Secure', label: 'Safe & Secure' },
    { icon: 'support_agent', value: '24/7', label: 'Customer Support' },
    { icon: 'card_giftcard', value: 'Rewards', label: 'Earn points' }
  ];

  private apiUrl = 'http://localhost:3000/products';

  constructor(
    private http: HttpClient,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.http.get<Product[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.allProducts = data;
        this.featuredProducts = data.slice(0, 4);
        this.filteredProducts = data;
        this.updateCategoryCounts();
      },
      error: (err) => {
        console.error('Error loading products:', err);
      }
    });
  }

  updateCategoryCounts(): void {
    this.categories.forEach(cat => {
      cat.count = this.allProducts.filter(p => p.category === cat.name).length;
    });
  }

  filterProducts(): void {
    if (this.selectedCategory) {
      this.filteredProducts = this.allProducts.filter(p => p.category === this.selectedCategory);
    } else {
      this.filteredProducts = this.allProducts;
    }
  }

  addToCart(product: Product): void {
    this.orderService.addOrderItem(product);
  }

  toggleWishlist(product: Product): void {
    const index = this.wishlist.indexOf(product.productId);
    if (index > -1) {
      this.wishlist.splice(index, 1);
    } else {
      this.wishlist.push(product.productId);
    }
  }

  isInWishlist(productId: string): boolean {
    return this.wishlist.includes(productId);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }

  scrollToProducts(): void {
    if (this.productsSection) {
      this.productsSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

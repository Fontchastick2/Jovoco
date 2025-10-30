import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatIconModule, FormsModule],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, OnDestroy {
  searchQuery = '';
  suggestions: string[] = [];
  showSuggestions = false;
  isAuthenticated = false;
  private authSubscription: Subscription | null = null;
  private allSuggestions = [
    'Laptop',
    'Smartphone',
    'Headphones',
    'Tablet',
    'Camera',
    'Monitor',
    'Keyboard',
    'Mouse',
    'Speaker',
    'Charger'
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe(isAuth => {
      this.isAuthenticated = isAuth;
      if (isAuth) {
        this.loadUserData();
      }
    });
  }

  private loadUserData(): void {
    const userId = this.authService.getUserIdFromToken();
    if (userId) {
      this.userService.getUser(userId).subscribe({
        next: (user) => {
          this.userService.setCurrentUser(user);
        },
        error: (err) => {
          console.error('Error loading user data:', err);
        }
      });
    }
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/main/catalog'], {
        queryParams: { search: this.searchQuery }
      });
      this.showSuggestions = false;
    }
  }

  onSearchInput(): void {
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      this.suggestions = this.allSuggestions.filter(s =>
        s.toLowerCase().includes(query)
      );
      this.showSuggestions = this.suggestions.length > 0;
    } else {
      this.suggestions = [];
      this.showSuggestions = false;
    }
  }

  selectSuggestion(suggestion: string): void {
    console.log("suggestion", suggestion);
    this.searchQuery = suggestion;
    this.showSuggestions = false;
    this.onSearch();
  }

  onSearchKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSearch();
    }
  }

  closeSuggestions(): void {
    // Délai pour permettre au click de se déclencher
    setTimeout(() => {
      this.showSuggestions = false;
    }, 100);
  }
}

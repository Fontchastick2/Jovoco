import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatIconModule, FormsModule],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {
  searchQuery = '';
  suggestions: string[] = [];
  showSuggestions = false;
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

  constructor(private router: Router) { }

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

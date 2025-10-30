import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-signup.component.html',
  styleUrls: ['./admin-signup.component.css']
})
export class AdminSignupComponent {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  loading = false;
  error = '';
  success = '';

  private apiUrl = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  signup(): void {
    if (!this.name || !this.email || !this.password || !this.confirmPassword) {
      this.error = 'Veuillez remplir tous les champs';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Les mots de passe ne correspondent pas';
      return;
    }

    if (this.password.length < 6) {
      this.error = 'Le mot de passe doit contenir au moins 6 caractères';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    this.http.post(`${this.apiUrl}/users`, {
      name: this.name,
      email: this.email,
      passwordHash: this.password,
      role: 'ADMIN'
    }).subscribe({
      next: () => {
        this.success = 'Compte créé avec succès! Redirection...';
        setTimeout(() => {
          this.router.navigate(['/admin/login']);
        }, 2000);
      },
      error: (err) => {
        this.error = err.error?.message || 'Erreur lors de la création du compte';
        this.loading = false;
      }
    });
  }
}

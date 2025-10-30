import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-sign-up',
    standalone: true,
    imports: [CommonModule, FormsModule, MatIconModule, RouterLink],
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit, OnDestroy {
    name = '';
    email = '';
    password = '';
    confirmPassword = '';
    showPassword = false;
    loading = false;
    error = '';

    private apiUrl = 'http://localhost:3000';
    private subscription: Subscription | null = null;

    constructor(
        private http: HttpClient,
        private router: Router,
        private authService: AuthService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            const token = localStorage.getItem('authToken');
            if (token) {
                this.router.navigate(['/main/catalog']);
            }
        }
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    togglePasswordVisibility(): void {
        this.showPassword = !this.showPassword;
    }

    signUp(): void {
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

        this.subscription = this.http.post(`${this.apiUrl}/auth/register`, {
            name: this.name,
            email: this.email,
            password: this.password
        }).subscribe({
            next: (response: any) => {
                console.log('Inscription réussie:', response);
                if (response.token) {
                    this.authService.login(response.token, response.user);
                }
                this.loading = false;
                this.router.navigate(['/main/catalog']);
            },
            error: (err) => {
                console.error('Erreur d\'inscription:', err);
                this.error = err.error?.message || 'Erreur lors de l\'inscription';
                this.loading = false;
            }
        });
    }

    loginWithGoogle(): void {
        console.log('Login with Google');
    }

    loginWithApple(): void {
        console.log('Login with Apple');
    }
}

import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-sign-in',
    standalone: true,
    imports: [CommonModule, FormsModule, MatIconModule, RouterLink],
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit, OnDestroy {
    email = '';
    password = '';
    showPassword = false;
    loading = false;
    error = '';

    private apiUrl = 'http://localhost:3000';
    private subscription: Subscription | null = null;

    constructor(
        private http: HttpClient,
        private router: Router,
        private cd: ChangeDetectorRef,
        private authService: AuthService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit(): void {
        // Vérifier si l'utilisateur est déjà connecté
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

    signIn(): void {
        if (!this.email || !this.password) {
            this.error = 'Veuillez remplir tous les champs';
            return;
        }

        this.loading = true;
        this.error = '';

        this.subscription = this.http.post(`${this.apiUrl}/auth/login`, {
            email: this.email,
            password: this.password
        }).subscribe({
            next: (response: any) => {
                console.log('Connexion réussie:', response);
                if (response.token) {
                    this.authService.login(response.token, response.user);
                }
                this.loading = false;
                this.router.navigate(['/main/catalog']);
            },
            error: (err) => {
                console.error('Erreur de connexion:', err);
                this.error = err.error?.message || 'Email ou mot de passe incorrect';
                this.loading = false;
                this.cd.markForCheck();
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

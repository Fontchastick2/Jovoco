import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-sign-in',
    standalone: true,
    imports: [CommonModule, FormsModule, MatIconModule],
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit, OnDestroy {
    email = '';
    password = '';
    showPassword = false;
    loading = false;
    error = '';
    isSignUp = false;
    confirmPassword = '';

    private apiUrl = 'http://localhost:3000';
    private subscription: Subscription | null = null;

    constructor(private http: HttpClient, private router: Router) { }

    ngOnInit(): void {
        // Vérifier si l'utilisateur est déjà connecté
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    togglePasswordVisibility(): void {
        this.showPassword = !this.showPassword;
    }

    toggleSignUpMode(): void {
        this.isSignUp = !this.isSignUp;
        this.error = '';
        this.email = '';
        this.password = '';
        this.confirmPassword = '';
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
                // Stocker le token
                if (response.token) {
                    localStorage.setItem('authToken', response.token);
                    localStorage.setItem('user', JSON.stringify(response.user));
                }
                this.loading = false;
                // Rediriger vers le catalog
                this.router.navigate(['/main/catalog']);
            },
            error: (err) => {
                console.error('Erreur de connexion:', err);
                this.error = err.error?.message || 'Email ou mot de passe incorrect';
                this.loading = false;
            }
        });
    }

    signUp(): void {
        if (!this.email || !this.password || !this.confirmPassword) {
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
            email: this.email,
            password: this.password
        }).subscribe({
            next: (response: any) => {
                console.log('Inscription réussie:', response);
                // Stocker le token
                if (response.token) {
                    localStorage.setItem('authToken', response.token);
                    localStorage.setItem('user', JSON.stringify(response.user));
                }
                this.loading = false;
                // Rediriger vers le catalog
                this.router.navigate(['/main/catalog']);
            },
            error: (err) => {
                console.error('Erreur d\'inscription:', err);
                this.error = err.error?.message || 'Erreur lors de l\'inscription';
                this.loading = false;
            }
        });
    }

    onSubmit(): void {
        if (this.isSignUp) {
            this.signUp();
        } else {
            this.signIn();
        }
    }

    loginWithGoogle(): void {
        console.log('Login with Google');
        // À implémenter
    }

    loginWithApple(): void {
        console.log('Login with Apple');
        // À implémenter
    }
}

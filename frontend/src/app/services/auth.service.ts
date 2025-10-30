import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
    public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

    constructor(@Inject(PLATFORM_ID) private platformId: Object) {
        this.checkAuthStatus();
    }

    private checkAuthStatus(): void {
        if (isPlatformBrowser(this.platformId)) {
            const token = localStorage.getItem('authToken');
            this.isAuthenticatedSubject.next(!!token);
        }
    }

    login(token: string, user: any): void {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('authToken', token);
            localStorage.setItem('user', JSON.stringify(user));
            this.isAuthenticatedSubject.next(true);
        }
    }

    logout(): void {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            this.isAuthenticatedSubject.next(false);
        }
    }

    isAuthenticated(): boolean {
        return this.isAuthenticatedSubject.value;
    }

    getUser(): any {
        if (isPlatformBrowser(this.platformId)) {
            const user = localStorage.getItem('user');
            return user ? JSON.parse(user) : null;
        }
        return null;
    }

    getUserIdFromToken(): string | null {
        if (isPlatformBrowser(this.platformId)) {
            const token = localStorage.getItem('authToken');
            if (token) {
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    return payload.sub;
                } catch (err) {
                    console.error('Error decoding token:', err);
                    return null;
                }
            }
        }
        return null;
    }
}

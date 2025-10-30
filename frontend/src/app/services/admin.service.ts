import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

export interface AdminUser {
    userId: string;
    name: string;
    email: string;
    role: string;
}

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private apiUrl = 'http://localhost:3322';
    private currentAdmin$ = new BehaviorSubject<AdminUser | null>(null);

    constructor(private http: HttpClient) { }

    login(email: string, passwordHash: string): Observable<AdminUser> {
        return this.http.post<AdminUser>(`${this.apiUrl}/users/login`, {
            email,
            passwordHash
        });
    }

    setCurrentAdmin(admin: AdminUser): void {
        this.currentAdmin$.next(admin);
    }

    getCurrentAdmin(): Observable<AdminUser | null> {
        return this.currentAdmin$.asObservable();
    }

    logout(): void {
        this.currentAdmin$.next(null);
    }
}

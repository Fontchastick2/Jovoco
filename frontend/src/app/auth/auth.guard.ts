import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private router: Router) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {
        const token = localStorage.getItem('authToken');
        
        if (token) {
            return true;
        }

        // Rediriger vers sign-in si pas authentifié
        this.router.navigate(['/auth/sign-in'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}

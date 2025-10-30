import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {
        if (!isPlatformBrowser(this.platformId)) {
            return false;
        }

        const token = localStorage.getItem('authToken');
        
        if (token) {
            return true;
        }

        // Rediriger vers sign-in si pas authentifié
        this.router.navigate(['/auth/sign-in'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}

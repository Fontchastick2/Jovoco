import { Routes } from '@angular/router';
import { ADMIN_ROUTES } from './admin/admin.routes';
import { MAIN_ROUTES } from './main/main.routes';
import { AUTH_ROUTES } from './auth/auth.routes';
import { AuthComponent } from './auth/auth.component';

export const routes: Routes = [
    {
        path: 'auth',
        component: AuthComponent,
        children: AUTH_ROUTES
    },
    {
        path: 'admin',
        children: ADMIN_ROUTES
    },
    {
        path: 'main',
        children: MAIN_ROUTES
    },
    { path: '', redirectTo: '/main', pathMatch: 'full' }
];

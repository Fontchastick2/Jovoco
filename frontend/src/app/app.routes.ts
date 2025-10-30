import { Routes } from '@angular/router';
import { ADMIN_ROUTES } from './admin/admin.routes';

export const routes: Routes = [
  {
    path: 'admin',
    children: ADMIN_ROUTES
  },
  { path: '', redirectTo: '/admin/login', pathMatch: 'full' }
];

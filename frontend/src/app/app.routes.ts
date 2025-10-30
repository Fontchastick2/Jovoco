import { Routes } from '@angular/router';
import { ADMIN_ROUTES } from './admin/admin.routes';
import { MAIN_ROUTES } from './main/main.routes';

export const routes: Routes = [
  {
    path: 'admin',
    children: ADMIN_ROUTES
  },
  {
    path: 'main',
    children: MAIN_ROUTES
  },
  { path: '', redirectTo: '/main/home', pathMatch: 'full' }
];

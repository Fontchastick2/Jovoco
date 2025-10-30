import { Routes } from '@angular/router';
import { AdminLoginComponent } from './login/admin-login.component';
import { AdminSignupComponent } from './signup/admin-signup.component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    children: [
      { path: 'login', component: AdminLoginComponent },
      { path: 'signup', component: AdminSignupComponent },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  }
];

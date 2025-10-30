import { Routes } from '@angular/router';
import { AdminLoginComponent } from './login/admin-login.component';
import { AdminSignupComponent } from './signup/admin-signup.component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard.component';
import { AdminUsersListComponent } from './users-list/admin-users-list.component';
import { AdminProductsListComponent } from './products-list/admin-products-list.component';
import { AdminAddProductComponent } from './add-product/admin-add-product.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    children: [
      { path: 'login', component: AdminLoginComponent },
      { path: 'signup', component: AdminSignupComponent },
      {
        path: 'dashboard',
        component: AdminDashboardComponent,
        children: [
          { path: 'users', component: AdminUsersListComponent },
          {
            path: 'products',
            children: [
              { path: '', component: AdminProductsListComponent },
              { path: 'add', component: AdminAddProductComponent },
              { path: 'edit/:id', component: AdminAddProductComponent }
            ]
          },
          { path: '', redirectTo: 'users', pathMatch: 'full' }
        ]
      },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  }
];

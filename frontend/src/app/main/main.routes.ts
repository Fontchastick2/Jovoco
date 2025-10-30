import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CatalogComponent } from './pages/catalog/catalog.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { MainComponent } from './main.component';
import { AuthGuard } from '../auth/auth.guard';

export const MAIN_ROUTES: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: 'catalog', component: CatalogComponent },
      { path: 'catalog/:articleId', component: ProductDetailComponent },
      { path: 'orders', component: OrdersComponent, canActivate: [AuthGuard] },
      { path: 'profile', component: ProfileComponent },
      { path: 'home', component: HomeComponent },
      { path: '', redirectTo: 'catalog', pathMatch: 'full' }
    ]
  }
];

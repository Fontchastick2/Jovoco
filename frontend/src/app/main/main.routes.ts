import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CatalogComponent } from './pages/catalog/catalog.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { MainComponent } from './main.component';

export const MAIN_ROUTES: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: 'catalog', component: CatalogComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'home', component: HomeComponent },
      { path: '', redirectTo: 'catalog', pathMatch: 'full' }
    ]
  }
];

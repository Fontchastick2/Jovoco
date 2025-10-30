import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

export const MAIN_ROUTES: Routes = [
  {
    path: '',
    children: [
      { path: 'home', component: HomeComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  }
];

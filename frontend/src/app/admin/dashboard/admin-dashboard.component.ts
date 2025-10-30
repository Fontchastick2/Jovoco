import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { MatSidenavModule, MatDrawer } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { AdminService } from '../../services/admin.service';
import { AdminUsersListComponent } from '../users-list/admin-users-list.component';
import { AdminProductsListComponent } from '../products-list/admin-products-list.component';
import { AdminAddProductComponent } from '../add-product/admin-add-product.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {
  @ViewChild('drawer') drawer!: MatDrawer;
  showProductsSubmenu = false;

  constructor(
    private adminService: AdminService,
    private router: Router
  ) { }

  logout(): void {
    this.adminService.logout();
    this.router.navigate(['/admin/login']);
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  toggleProductsSubmenu(): void {
    this.showProductsSubmenu = !this.showProductsSubmenu;
  }
}

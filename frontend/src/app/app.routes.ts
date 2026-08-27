import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import {Routes} from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'products', loadComponent: () => import('./pages/products/products.component').then(m => m.ProductsComponent) },
  { path: 'products/:id', loadComponent: () => import('./pages/product-detail/product-detail.component').then(m => m.ProductDetailComponent) },
  { path: 'cart', loadComponent: () => import('./pages/cart/cart.component').then(m => m.CartComponent), canActivate: [authGuard] },
  { path: 'auth', loadComponent: () => import('./pages/auth/auth.component').then(m => m.AuthPageComponent) },
  { path: 'profile', loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent), canActivate: [authGuard] },
  { path: 'admin-dashboard', loadComponent: () => import('./pages/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent), canActivate: [adminGuard] }, // ← adminGuard
  { path: 'admin/products/:id', loadComponent: () => import('./pages/product-detail/admin/product-detail-admin.component').then(m => m.ProductDetailAdminComponent), canActivate: [adminGuard] }, // ← adminGuard
  { path: 'admin-register', loadComponent: () => import('./pages/admin-register/admin-register.component').then(m => m.AdminRegisterComponent) },
  { path: 'admin/login', loadComponent: () => import('./pages/admin-login/admin-login.component').then(m => m.AdminLoginComponent) },
  {path: 'admin/users/:id', loadComponent: () => import('./pages/admin-user-detail/admin-user-detail.component').then(m => m.AdminUserDetailComponent), canActivate: [adminGuard]},
  { path: '**', redirectTo: '' }
];

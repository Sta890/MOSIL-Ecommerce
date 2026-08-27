import {Component, inject, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartApiService } from './services/api/cart-api.service';
import { AuthService } from './services/auth.service';
import {SoundService} from './services/sound.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <!-- ANNOUNCEMENT BAR (cachée pour admin) -->
    <div *ngIf="!authService.isAdmin()" class="bg-gold text-ink text-center py-2 text-xs font-bold tracking-wide">
      🎉 Free shipping over $100 — Use <strong>WELCOME20</strong> for 20% off your first order!
    </div>

        <!-- NAVBAR -->
        <nav class="sticky top-0 z-50 bg-ink border-b border-ink-800 h-16 flex items-center justify-between px-6 lg:px-12">
          <div class="flex items-center gap-6">
            <button (click)="mobileMenu = !mobileMenu" class="lg:hidden bg-transparent border-none text-white text-xl cursor-pointer">☰</button>

            <!-- Liens shop (cachés pour admin) -->
            <div *ngIf="!authService.isAdmin()" class="hidden lg:flex items-center gap-6">
              <a routerLink="/products" [queryParams]="{category:'men'}" class="nav-link">Men</a>
              <a routerLink="/products" [queryParams]="{category:'women'}" class="nav-link">Women</a>
              <a routerLink="/products" [queryParams]="{category:'kids'}" class="nav-link">Kids</a>
              <a routerLink="/products" [queryParams]="{sale:true}" class="text-gold text-xs font-black tracking-widest uppercase no-underline">Sale</a>
            </div>

        <!-- Lien admin -->
        <div *ngIf="authService.isAdmin()" class="hidden lg:flex items-center gap-6">
          <a routerLink="/admin-dashboard" class="nav-link">Dashboard</a>
        </div>
      </div>

      <!-- Center: logo -->
      <a [routerLink]="authService.isAdmin() ? '/admin-dashboard' : '/'"
         class="absolute left-1/2 -translate-x-1/2 font-serif text-2xl font-black text-white no-underline tracking-wide">
        MOSIL-<span class="text-gold">SHOP</span>
      </a>

      <!-- Right -->
      <div class="flex items-center gap-3">

        <!-- Search (cachée pour admin) -->
        <div *ngIf="!authService.isAdmin()" class="relative hidden sm:block">
          <input type="text" [(ngModel)]="searchQuery" (keyup.enter)="doSearch()"
                 placeholder="Search..."
                 class="bg-ink-800 border border-ink-700 text-white placeholder-ink-500 text-xs px-3 py-2 outline-none w-36 focus:border-gold transition-colors">
          <button (click)="doSearch()" class="absolute right-2 top-1/2 -translate-y-1/2 text-ink-400 bg-transparent border-none cursor-pointer text-xs">🔍</button>
        </div>

        <!-- Cart (cachée pour admin) -->
        <a *ngIf="!authService.isAdmin()" routerLink="/cart" class="relative text-white no-underline text-xl leading-none">
          🛒
          <span *ngIf="cartService.count() > 0"
                class="absolute -top-2 -right-2 bg-gold text-ink text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
            {{ cartService.count() }}
          </span>
        </a>

        <!-- Volume toggle (caché pour admin) -->
        <button (click)="toggleSound()"
                class="text-white text-lg bg-transparent border-none cursor-pointer hover:text-gold transition-colors"
                [title]="muted ? 'Activer le son' : 'Couper le son'">
          {{ muted ? '🔇' : '🔊' }}
        </button>

        <!-- Auth -->
        <ng-container *ngIf="authService.isLoggedIn(); else loginBtn">
          <div class="flex items-center gap-2">
            <a *ngIf="!authService.isAdmin()" routerLink="/profile"
               class="text-ink-400 text-xs hidden sm:block hover:text-gold transition-colors no-underline">
              {{ authService.user()?.firstName }}
            </a>
            <span *ngIf="authService.isAdmin()" class="text-gold text-xs font-black hidden sm:block">
              {{ authService.user()?.firstName }}
            </span>
            <button (click)="authService.logout()"
                    class="text-xs font-bold text-ink-400 hover:text-gold transition-colors bg-transparent border-none cursor-pointer">
              Logout
            </button>
          </div>
        </ng-container>
        <ng-template #loginBtn>
          <a [routerLink]="authService.wasAdmin() ? '/admin/login' : '/auth'"
             class="text-xs font-bold tracking-widest uppercase text-ink-400 hover:text-gold transition-colors no-underline">
            Login
          </a>
        </ng-template>
      </div>
    </nav>

    <!-- MOBILE MENU -->
    <div *ngIf="mobileMenu" class="lg:hidden bg-ink-900 border-b border-ink-800 px-6 py-4 flex flex-col gap-4 z-40">
      <ng-container *ngIf="!authService.isAdmin()">
        <a routerLink="/products" [queryParams]="{category:'men'}" (click)="mobileMenu=false" class="nav-link">Men</a>
        <a routerLink="/products" [queryParams]="{category:'women'}" (click)="mobileMenu=false" class="nav-link">Women</a>
        <a routerLink="/products" [queryParams]="{category:'kids'}" (click)="mobileMenu=false" class="nav-link">Kids</a>
        <a routerLink="/products" [queryParams]="{sale:true}" (click)="mobileMenu=false" class="text-gold text-xs font-black tracking-widest uppercase no-underline">Sale</a>
      </ng-container>
      <ng-container *ngIf="authService.isAdmin()">
        <a routerLink="/admin-dashboard" (click)="mobileMenu=false" class="nav-link">Dashboard</a>
      </ng-container>
    </div>

    <!-- PAGE CONTENT -->
    <main class="animate-fade-up">
      <router-outlet></router-outlet>
    </main>

    <!-- FOOTER (caché pour admin) -->
    <footer *ngIf="!authService.isAdmin()" class="bg-ink text-ink-500 px-6 lg:px-16 pt-16 pb-8 border-t border-ink-800">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
        <!-- ... tout le contenu du footer ... -->
      </div>
    </footer>

    <!-- Toujours visible pour tout le monde -->
    <div class="bg-ink py-6 border-t border-ink-800"
         [class.pl-60]="authService.isAdmin()">
      <div class="px-6 lg:px-16">
        <div class="border-b border-ink-800 pb-6 flex flex-wrap justify-between gap-3 text-xs text-ink-500">
          <span>© 2025 MOSIL-SHOP. All rights reserved.</span>
          <span>Privacy Policy · Terms of Service</span>
        </div>
        <div class="pt-4 text-center">
          <p class="text-ink-500 text-xs tracking-widest uppercase">
            Powered by <span class="text-gold font-bold">SkySoft Technology</span>
          </p>
        </div>
      </div>
    </div>
  `
})
export class AppComponent {
  cartService = inject(CartApiService);
  authService = inject(AuthService);
  router = inject(Router);
  searchQuery = '';
  mobileMenu = false;
  wasAdmin = signal(false);

  shopLinks = [
    { label: 'Men', route: '/products', params: { category: 'men' } },
    { label: 'Women', route: '/products', params: { category: 'women' } },
    { label: 'Kids', route: '/products', params: { category: 'kids' } },
    { label: 'Shoes', route: '/products', params: { type: 'shoes' } },
    { label: 'Sale', route: '/products', params: { sale: true } },
  ];

  soundService = inject(SoundService);
  muted = false;

  toggleSound() {
    this.muted = !this.muted;
    this.soundService.setMuted(this.muted);
  }

  doSearch() {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/products'], { queryParams: { search: this.searchQuery } });
      this.searchQuery = '';
    }
  }
}

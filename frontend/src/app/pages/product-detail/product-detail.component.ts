import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ProductApiService } from '../../services/api/product-api.service';
import { CartApiService } from '../../services/api/cart-api.service';
import { Product } from '../../models/product.model';
import { ProductCardComponent } from '../shared/product-card/product-card.component';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
  templateUrl: './product-detail.component.html'
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductApiService);
  cartService = inject(CartApiService);
  authService = inject(AuthService);

  product = signal<Product | null>(null);
  related = signal<Product[]>([]);
  selectedSize = signal<string>('');
  selectedColor = signal<string>('');
  quantity = signal<number>(1);
  added = signal<boolean>(false);
  activeTab = signal<string>('description');
  loading = signal<boolean>(true);

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.loading.set(true);
      this.productService.getById(+params['id']).subscribe({
        next: (product) => {
          this.product.set(product);
          this.selectedSize.set(this.getSizes(product)[0] || '');
          this.selectedColor.set(this.getColors(product)[0] || '');
          this.loading.set(false);
          // Charger les produits liés (même catégorie)
          this.productService.getAll({ category: product.category }).subscribe({
            next: (products) => {
              this.related.set(products.filter(p => p.id !== product.id).slice(0, 4));
            }
          });
        },
        error: () => {
          this.router.navigate(['/products']);
        }
      });
    });
  }

  addToCart() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth']);
      return;
    }
    const p = this.product();
    if (!p) return;
    this.cartService.addItem(p.id, this.selectedSize(), this.selectedColor(), this.quantity())
      .subscribe({
        next: () => {
          this.added.set(true);
          setTimeout(() => this.added.set(false), 3000);
        },
        error: (err) => console.error(err)
      });
  }

  getSizes(product?: Product | null): string[] {
    const p = product || this.product();
    if (!p?.sizes) return [];
    if (Array.isArray(p.sizes)) return p.sizes;
    return (p.sizes as any).split(',');
  }

  getColors(product?: Product | null): string[] {
    const p = product || this.product();
    if (!p?.colors) return [];
    if (Array.isArray(p.colors)) return p.colors;
    return (p.colors as any).split(',');
  }

  getSelectedImage(): string {
    const images = this.getImages();
    const colors = this.getColors();
    const index = colors.indexOf(this.selectedColor());
    return images[index] !== undefined ? images[index] : images[0];
  }

  getImages(): string[] {
    const p = this.product();
    if (!p?.images) return [];
    if (Array.isArray(p.images)) return p.images;
    return (p.images as any).split(',');
  }
  getTags(): string[] {
    const p = this.product();
    if (!p?.tags) return [];
    if (Array.isArray(p.tags)) return p.tags;
    return (p.tags as any).split(',');
  }

  getDiscount(): number {
    const p = this.product();
    if (!p?.originalPrice) return 0;
    return Math.round((1 - p.price / p.originalPrice) * 100);
  }

  getStars(rating: number): string {
    return '★'.repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? '½' : '');
  }

  getColorHex(color: string): string {
    const map: Record<string, string> = {
      'Black': '#111', 'White': '#fff', 'Navy': '#1a237e',
      'Grey': '#888', 'Blue': '#1565c0', 'Red': '#c62828',
      'Pink': '#ffc0cb', 'Beige': '#f5f0e8', 'Brown': '#4a2c2a',
      'Gold': '#D4AF37', 'Nude': '#e8c99a', 'Floral': '#e8a0bf',
    };
    const key = Object.keys(map).find(k => color.includes(k));
    return key ? map[key] : '#ccc';
  }
}

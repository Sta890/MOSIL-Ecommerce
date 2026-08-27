import {Component, Input, inject, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Product } from '../../../models/product.model';
import { CartApiService } from '../../../services/api/cart-api.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-card.component.html'
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  cartService = inject(CartApiService);
  authService = inject(AuthService);
  router = inject(Router);
  added = false;
  selectedColorIndex = signal<number>(0);

  quickAdd(e: Event) {
    e.preventDefault(); e.stopPropagation();

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth']);
      return;
    }

    const sizes = this.getSizes();
    const colors = this.getColors();
    this.cartService.addItem(this.product.id, sizes[0] || '', colors[0] || '', 1).subscribe({
      next: () => {
        this.added = true;
        setTimeout(() => this.added = false, 2000);
      },
      error: (err) => console.error(err)
    });
  }

  getSizes(): string[] {
    if (!this.product.sizes) return [];
    if (Array.isArray(this.product.sizes)) return this.product.sizes;
    return (this.product.sizes as any).split(',');
  }

  getColors(): string[] {
    if (!this.product.colors) return [];
    if (Array.isArray(this.product.colors)) return this.product.colors;
    return (this.product.colors as any).split(',');
  }

  getDiscount(): number {
    if (!this.product.originalPrice) return 0;
    return Math.round((1 - this.product.price / this.product.originalPrice) * 100);
  }

  getColorHex(color: string): string {
    const map: Record<string, string> = {
      'Black': '#111', 'White': '#fff', 'Navy': '#1a237e', 'Olive': '#6b7c4a',
      'Beige': '#f5f0e8', 'Khaki': '#c8b96e', 'Ivory': '#fffff0', 'Blush': '#ffb7c5',
      'Sage': '#9cac94', 'Midnight': '#191970', 'Dark Brown': '#4a2c2a',
      'Tan': '#d2b48c', 'Nude': '#e8c99a', 'Cognac': '#9a4522', 'Camel': '#c19a6b',
      'Cream': '#fffdd0', 'Floral Print': '#e8a0bf', 'Terracotta': '#c0674a',
      'Light Blue': '#add8e6', 'Pink': '#ffc0cb', 'Grey': '#888', 'Blue': '#1565c0',
      'Coral': '#ff7f6e', 'Forest Green': '#228b22', 'Sky Blue': '#87ceeb',
      'Classic Blue': '#1a56a0', 'Light Wash': '#b0c4de', 'Stone': '#b0a090',
    };
    const key = Object.keys(map).find(k => color.includes(k));
    return key ? map[key] : '#ccc';
  }

  getFirstImage(images: any): string {
    if (!images) return 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80';
    if (Array.isArray(images)) return images[0];
    return images.split(',')[0];
  }

  // AJOUTER cette méthode
  getSelectedImage(): string {
    const images = this.getImages();
    const index = this.selectedColorIndex();
    return images[index] !== undefined ? images[index] : images[0];
  }

  // AJOUTER cette méthode
  getImages(): string[] {
    if (!this.product.images) return ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80'];
    if (Array.isArray(this.product.images)) return this.product.images;
    return (this.product.images as any).split(',');
  }
}

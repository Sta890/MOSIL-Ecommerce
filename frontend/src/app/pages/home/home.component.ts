import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductApiService } from '../../services/api/product-api.service';
import { ProductCardComponent } from '../shared/product-card/product-card.component';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductApiService);

  newArrivals = signal<Product[]>([]);
  topRated = signal<Product[]>([]);
  saleItems = signal<Product[]>([]);
  loading = signal<boolean>(true);

  categories = [
    { label: 'Men', value: 'men', image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=600&q=80', count: 6 },
    { label: 'Women', value: 'women', image: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=600&q=80', count: 6 },
    { label: 'Kids', value: 'kids', image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&q=80', count: 4 },
  ];

  brands = ['NOIR', 'BLANC', 'LUMIÈRE', 'VOLT', 'ÉLITE', 'PETITS', 'DENIM CO.'];

  trustItems = [
    { icon: '🚚', title: 'Free Shipping', sub: 'On orders over $100' },
    { icon: '↩️', title: '30-Day Returns', sub: 'Hassle-free returns' },
    { icon: '🔒', title: 'Secure Payment', sub: '100% protected' },
    { icon: '⭐', title: '4.8/5 Rating', sub: '50,000+ reviews' },
  ];

  ngOnInit() {
    this.productService.getNewArrivals().subscribe({
      next: (products) => this.newArrivals.set(products),
      error: (err) => console.error(err)
    });

    this.productService.getTopRated().subscribe({
      next: (products) => this.topRated.set(products),
      error: (err) => console.error(err)
    });

    this.productService.getSaleItems().subscribe({
      next: (products) => {
        this.saleItems.set(products);
        this.loading.set(false);
      },
      error: (err) => console.error(err)
    });
  }

  featured() {
    return undefined;
  }
}

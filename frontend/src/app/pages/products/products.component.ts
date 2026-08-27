import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductApiService } from '../../services/api/product-api.service';
import { ProductCardComponent } from '../shared/product-card/product-card.component';
import { Product } from '../../models/product.model';




@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ProductCardComponent],
  templateUrl: './products.component.html'
})
export class ProductsComponent implements OnInit {
  private productService = inject(ProductApiService);
  route = inject(ActivatedRoute);

  allProducts = signal<Product[]>([]);
  loading = signal<boolean>(true);

  selectedCategory = signal<string>('');
  selectedType = signal<string>('');
  selectedBrand = signal<string>('');
  selectedSort = signal<string>('');
  priceMax = signal<number>(500);
  searchQuery = signal<string>('');
  showFilters = signal<boolean>(true);

  brands = computed(() => {
    const all = this.allProducts().map(p => p.brand);
    return [...new Set(all)];
  });

  products = computed(() => {
    let list = [...this.allProducts()];

    // Filtre category
    if (this.selectedCategory()) {
      list = list.filter(p => p.category === this.selectedCategory());
    }

    // Filtre type
    if (this.selectedType()) {
      list = list.filter(p => p.type === this.selectedType());
    }

    // Filtre brand
    if (this.selectedBrand()) {
      list = list.filter(p => p.brand === this.selectedBrand());
    }

    // Filtre prix
    if (this.priceMax() < 500) {
      list = list.filter(p => p.price <= this.priceMax());
    }

    // Filtre search
    if (this.searchQuery()) {
      const q = this.searchQuery().toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (this.selectedSort()) {
      case 'price-asc': list.sort((a, b) => a.price - b.price); break;
      case 'price-desc': list.sort((a, b) => b.price - a.price); break;
      case 'rating': list.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
      case 'newest': list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
    }

    return list;
  });

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['category']) this.selectedCategory.set(params['category']);
      if (params['sort']) this.selectedSort.set(params['sort']);
      if (params['search']) this.searchQuery.set(params['search']);
    });

    this.productService.getAll().subscribe({
      next: (products) => {
        this.allProducts.set(products);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
      }
    });
  }

  applyFilters() {}

  clearFilters() {
    this.selectedCategory.set('');
    this.selectedType.set('');
    this.selectedBrand.set('');
    this.selectedSort.set('');
    this.priceMax.set(500);
    this.searchQuery.set('');
  }

  hasActiveFilters(): boolean {
    return !!(this.selectedCategory() || this.selectedType() || this.selectedBrand() || this.searchQuery());
  }

  getSizes(product: Product): string[] {
    if (!product.sizes) return [];
    if (Array.isArray(product.sizes)) return product.sizes;
    return (product.sizes as any).split(',');
  }



}

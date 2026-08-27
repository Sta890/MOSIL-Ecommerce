import { Injectable, signal, computed } from '@angular/core';
import { Product, MOCK_PRODUCTS, Category, ProductType } from '../models/product.model';

export interface ProductFilter {
  category?: Category;
  type?: ProductType;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  search?: string;
  sortBy?: 'price-asc' | 'price-desc' | 'rating' | 'newest';
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private _products = signal<Product[]>(MOCK_PRODUCTS);
  private _filter = signal<ProductFilter>({});

  products = computed(() => {
    let filtered = [...this._products()];
    const f = this._filter();
    if (f.category) filtered = filtered.filter(p => p.category === f.category);
    if (f.type) filtered = filtered.filter(p => p.type === f.type);
    if (f.minPrice != null) filtered = filtered.filter(p => p.price >= f.minPrice!);
    if (f.maxPrice != null) filtered = filtered.filter(p => p.price <= f.maxPrice!);
    if (f.brand) filtered = filtered.filter(p => p.brand === f.brand);
    if (f.search) {
      const s = f.search.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(s) || p.brand.toLowerCase().includes(s) ||
        p.tags.some(t => t.includes(s))
      );
    }
    switch (f.sortBy) {
      case 'price-asc': filtered.sort((a, b) => a.price - b.price); break;
      case 'price-desc': filtered.sort((a, b) => b.price - a.price); break;
      case 'rating': filtered.sort((a, b) => b.rating - a.rating); break;
      case 'newest': filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
    }
    return filtered;
  });

  allBrands = computed(() => [...new Set(MOCK_PRODUCTS.map(p => p.brand))]);
  newArrivals = computed(() => MOCK_PRODUCTS.filter(p => p.isNew).slice(0, 8));
  saleItems = computed(() => MOCK_PRODUCTS.filter(p => p.isSale).slice(0, 8));
  featured = computed(() => MOCK_PRODUCTS.filter(p => p.rating >= 4.7).slice(0, 8));

  setFilter(filter: Partial<ProductFilter>) { this._filter.update(f => ({ ...f, ...filter })); }
  clearFilter() { this._filter.set({}); }
  getById(id: number): Product | undefined { return MOCK_PRODUCTS.find(p => p.id === id); }
  getRelated(product: Product): Product[] {
    return MOCK_PRODUCTS.filter(p => p.id !== product.id && (p.category === product.category || p.type === product.type)).slice(0, 4);
  }
  getFilter() { return this._filter(); }
}

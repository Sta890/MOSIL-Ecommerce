import { Injectable, signal, computed } from '@angular/core';
import { CartItem, Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private _items = signal<CartItem[]>([]);
  items = this._items.asReadonly();
  count = computed(() => this._items().reduce((s, i) => s + i.quantity, 0));
  subtotal = computed(() => this._items().reduce((s, i) => s + i.product.price * i.quantity, 0));
  shipping = computed(() => this.subtotal() > 100 ? 0 : 9.99);
  total = computed(() => this.subtotal() + this.shipping());

  addItem(product: Product, size: string, color: string, qty = 1) {
    this._items.update(items => {
      const existing = items.find(i => i.product.id === product.id && i.selectedSize === size && i.selectedColor === color);
      if (existing) return items.map(i => i === existing ? { ...i, quantity: i.quantity + qty } : i);
      return [...items, { product, quantity: qty, selectedSize: size, selectedColor: color }];
    });
  }

  removeItem(productId: number, size: string, color: string) {
    this._items.update(items => items.filter(i => !(i.product.id === productId && i.selectedSize === size && i.selectedColor === color)));
  }

  updateQuantity(productId: number, size: string, color: string, qty: number) {
    if (qty <= 0) { this.removeItem(productId, size, color); return; }
    this._items.update(items => items.map(i => i.product.id === productId && i.selectedSize === size && i.selectedColor === color ? { ...i, quantity: qty } : i));
  }

  clearCart() { this._items.set([]); }
  isInCart(productId: number): boolean { return this._items().some(i => i.product.id === productId); }
}

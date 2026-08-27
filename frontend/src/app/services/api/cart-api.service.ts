import {Injectable, signal, computed, inject} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { API_URL } from '../../config/api.config';
import { AuthService } from '../auth.service';
import {SoundService} from '../sound.service';

export interface CartItemApi {
  id: number;
  product: any;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface CartApi {
  id: number;
  items: CartItemApi[];
}

@Injectable({ providedIn: 'root' })
export class CartApiService {

  private _cart = signal<CartApi>({ id: 0, items: [] });
  cart = this._cart.asReadonly();
  count = computed(() => this._cart().items.reduce((s, i) => s + i.quantity, 0));
  subtotal = computed(() => this._cart().items.reduce((s, i) => s + i.product.price * i.quantity, 0));
  shipping = computed(() => this.subtotal() > 100 ? 0 : 9.99);
  total = computed(() => this.subtotal() + this.shipping());

  constructor(private http: HttpClient, private authService: AuthService) {
    if (this.authService.isLoggedIn()) this.loadCart();
  }

  // Injecter SoundService
  private soundService = inject(SoundService);

  loadCart() {
    this.http.get<CartApi>(`${API_URL}/cart`).subscribe({
      next: (cart) => {
        this._cart.set(cart);
        this.soundService.login();
      },
      error: (err) => console.log('Cart not found:', err)
    });
  }


  addItem(productId: number, size: string, color: string, quantity: number = 1) {
    return this.http.post<CartApi>(`${API_URL}/cart/add`,
      { productId, size, color, quantity },
      { headers: { 'Content-Type': 'application/json' } }
    ).pipe(
      tap(cart => {
        this._cart.set(cart);
        this.soundService.addToCart(); // ← ajouter
      })
    );
  }

  updateItem(itemId: number, quantity: number) {
    return this.http.put<CartApi>(`${API_URL}/cart/items/${itemId}`, { quantity }).pipe(
      tap(cart => this._cart.set(cart))
    );
  }

  removeItem(itemId: number) {
    return this.http.delete<CartApi>(`${API_URL}/cart/items/${itemId}`).pipe(
      tap(cart =>{
        this._cart.set(cart);
        this.soundService.removeFromCart();
      })
    );
  }

  clearCart() {
    return this.http.delete(`${API_URL}/cart/clear`, { responseType: 'text' }).pipe(
      tap(() => this._cart.set({ id: 0, items: [] }))
    );
  }

  isInCart(productId: number): boolean {
    return this._cart().items.some(i => i.product.id === productId);
  }
}

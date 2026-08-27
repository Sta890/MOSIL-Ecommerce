import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CartApiService } from '../../services/api/cart-api.service';
import { OrderApiService } from '../../services/api/order-api.service';
import { AuthService } from '../../services/auth.service';
import { SoundService } from '../../services/sound.service';
import { API_URL } from '../../config/api.config';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './cart.component.html'
})
export class CartComponent {
  cartService = inject(CartApiService);
  orderService = inject(OrderApiService);
  authService = inject(AuthService);
  soundService = inject(SoundService);
  private http = inject(HttpClient);

  promoCode = signal<string>('');
  promoApplied = signal<boolean>(false);
  discount = signal<number>(0);
  checkoutStep = signal<number>(1);
  orderNumber = signal<string>('');
  loading = signal<boolean>(false);
  formErrors = signal<Record<string, string>>({});
  errorMessage = signal<string>('');
  paymentMethod = signal<'momo' | 'orange'>('momo'); // ← nouveau

  form = signal({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', zip: '', country: 'CM',
  });

  applyPromo() {
    const code = this.promoCode().toUpperCase();
    if (code === 'SAVE10') { this.discount.set(0.10); this.promoApplied.set(true); }
    else if (code === 'WELCOME20') { this.discount.set(0.20); this.promoApplied.set(true); }
    else { this.discount.set(0); this.promoApplied.set(false); }
  }

  getFirstImage(images: any): string {
    if (!images) return 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80';
    if (Array.isArray(images)) return images[0];
    return images.split(',')[0];
  }

  getFinalTotal(): number {
    return this.cartService.total() * (1 - this.discount());
  }

  isFormValid(): boolean {
    const f = this.form();
    const errors: Record<string, string> = {};

    if (!f.firstName.trim()) errors['firstName'] = 'First name is required';
    if (!f.lastName.trim()) errors['lastName'] = 'Last name is required';
    if (!f.email.trim()) errors['email'] = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) errors['email'] = 'Invalid email address';
    if (!f.address.trim()) errors['address'] = 'Address is required';
    if (!f.city.trim()) errors['city'] = 'City is required';
    if (!f.zip.trim()) errors['zip'] = 'ZIP code is required';
    if (!f.phone.trim()) errors['phone'] = 'Phone number is required';

    this.formErrors.set(errors);
    return Object.keys(errors).length === 0;
  }

  placeOrder() {
    console.log('placeOrder called');
    console.log('isLoggedIn:', this.authService.isLoggedIn());
    console.log('isFormValid:', this.isFormValid());
    console.log('form:', this.form());
    if (!this.authService.isLoggedIn()) return;
    if (!this.isFormValid()) return;
    this.loading.set(true);

    const f = this.form();

    // 1. Créer la commande
    this.orderService.checkout({
      firstName: f.firstName,
      lastName: f.lastName,
      email: f.email,
      phone: f.phone,
      address: f.address,
      city: f.city,
      zip: f.zip,
      country: f.country,
      promoCode: this.promoCode() || undefined
    }).subscribe({
      next: (order) => {
        this.orderNumber.set(order.orderNumber);

        // 2. Initier le paiement NotchPay
        this.http.post<any>(`${API_URL}/payments/initialize`, {
          email: f.email,
          phone: f.phone,
          amount: this.getFinalTotal(),
          orderNumber: order.orderNumber
        }).subscribe({
          next: (payment) => {
            this.loading.set(false);
            this.cartService.clearCart().subscribe();
            this.soundService.orderSuccess();

            // 3. Rediriger vers la page de paiement NotchPay
            const paymentUrl = payment?.transaction?.payment_url
              || payment?.authorization_url
              || payment?.data?.link;

            if (paymentUrl) {
              window.location.href = paymentUrl; // ← redirection vers NotchPay
            } else {
              // Si pas d'URL, afficher confirmation directement
              this.checkoutStep.set(3);
            }
          },
          error: () => {
            // Si paiement échoue, on affiche quand même la confirmation
            this.loading.set(false);
            this.cartService.clearCart().subscribe();
            this.checkoutStep.set(3);
          }
        });
      },
      error: (err) => {
        const msg = err.error?.error || 'Une erreur est survenue';
        this.errorMessage.set(msg);
        setTimeout(() => this.errorMessage.set(''), 5000);
        this.loading.set(false);
      }
    });
  }

  removeItem(itemId: number) {
    this.cartService.removeItem(itemId).subscribe();
  }

  updateQuantity(itemId: number, quantity: number) {
    this.cartService.updateItem(itemId, quantity).subscribe();
  }

  updateField(field: string, value: string) {
    this.form.update(f => ({ ...f, [field]: value }));
    this.formErrors.update(e => { const copy = { ...e }; delete copy[field]; return copy; });
  }
}

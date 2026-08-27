import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../../config/api.config';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  private http = inject(HttpClient);

  activeTab = signal<'info' | 'orders' | 'password'>('info');
  tabs: {id: 'info' | 'orders' | 'password', icon: string, label: string}[] = [
    {id: 'info', icon: '👤', label: 'My Profile'},
    {id: 'orders', icon: '📦', label: 'My Orders'},
    {id: 'password', icon: '🔒', label: 'Password'}
  ];

  user = signal<any>(null);
  orders = signal<any[]>([]);
  loading = signal(false);
  ordersLoading = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

  profileForm = signal({
    firstName: '', lastName: '', phone: '', address: '', city: '', country: ''
  });

  passwordForm = signal({
    currentPassword: '', newPassword: '', confirmPassword: ''
  });

  ngOnInit() { this.loadProfile(); }

  setTab(tab: 'info' | 'orders' | 'password') {
    this.activeTab.set(tab);
    if (tab === 'orders') this.loadOrders();
  }

  loadProfile() {
    this.loading.set(true);
    this.http.get<any>(`${API_URL}/users/me`).subscribe({
      next: (u) => {
        this.user.set(u);
        this.profileForm.set({
          firstName: u.firstName || '',
          lastName: u.lastName || '',
          phone: u.phone || '',
          address: u.address || '',
          city: u.city || '',
          country: u.country || ''
        });
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  loadOrders() {
    this.ordersLoading.set(true);
    this.http.get<any[]>(`${API_URL}/orders`).subscribe({
      next: (o) => {
        console.log(o);
        this.orders.set(o); this.ordersLoading.set(false); },
      error: () => this.ordersLoading.set(false)
    });
  }

  downloadFacture(orderId: number, orderNumber: string) {
    this.http.get(`${API_URL}/orders/${orderId}/facture`, {
      responseType: 'blob'
    }).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `facture-${orderNumber}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
        this.showSuccess('Facture téléchargée !');
      },
      error: () => this.showError('Erreur lors du téléchargement.')
    });
  }

  updateProfileField(field: string, value: string) {
    this.profileForm.update(f => ({ ...f, [field]: value }));
  }

  updatePasswordField(field: string, value: string) {
    this.passwordForm.update(f => ({ ...f, [field]: value }));
  }

  saveProfile() {
    this.http.put<any>(`${API_URL}/users/me`, this.profileForm()).subscribe({
      next: (u) => {
        this.user.set(u);
        this.showSuccess('Profile updated successfully!');
      },
      error: () => this.showError('Failed to update profile.')
    });
  }

  changePassword() {
    const f = this.passwordForm();
    if (f.newPassword !== f.confirmPassword) {
      this.showError('New passwords do not match!');
      return;
    }
    if (f.newPassword.length < 6) {
      this.showError('Password must be at least 6 characters!');
      return;
    }
    this.http.put(`${API_URL}/users/me/password`, {
      currentPassword: f.currentPassword,
      newPassword: f.newPassword
    }).subscribe({
      next: () => {
        this.showSuccess('Password changed successfully!');
        this.passwordForm.set({ currentPassword: '', newPassword: '', confirmPassword: '' });
      },
      error: () => this.showError('Incorrect current password.')
    });
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-700',
      CONFIRMED: 'bg-blue-100 text-blue-700',
      SHIPPED: 'bg-purple-100 text-purple-700',
      DELIVERED: 'bg-green-100 text-green-700',
      CANCELLED: 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-ink-100 text-ink-600';
  }

  showSuccess(msg: string) {
    this.successMessage.set(msg);
    setTimeout(() => this.successMessage.set(''), 3000);
  }

  showError(msg: string) {
    this.errorMessage.set(msg);
    setTimeout(() => this.errorMessage.set(''), 3000);
  }
}

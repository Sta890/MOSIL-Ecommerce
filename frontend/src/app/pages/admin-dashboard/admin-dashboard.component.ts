import {Component, inject, signal, OnInit, computed} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {Router, RouterModule} from '@angular/router';
import { API_URL } from '../../config/api.config';
import {SoundService} from '../../services/sound.service';
import { jwtDecode } from 'jwt-decode';
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-dashboard.component.html'
})
export class AdminDashboardComponent implements OnInit {
  private http = inject(HttpClient);
  private soundService = inject(SoundService);
  router = inject(Router);

  activeTab = signal<'stats' | 'products' | 'orders' | 'users' | 'finances' | 'super'>('stats');

  // Stats
  stats = signal<any>(null);
  statsLoading = signal(false);

  // Products
  products = signal<any[]>([]);
  productsLoading = signal(false);
  showForm = signal(false);
  editingProduct = signal<any | null>(null);
  uploadingImage = signal(false);
  viewingProduct = signal<any | null>(null);

  // Orders
  orders = signal<any[]>([]);
  ordersLoading = signal(false);

  // Users
  users = signal<any[]>([]);
  usersLoading = signal(false);
  showUserForm = signal(false);
  viewingUser = signal<any | null>(null);

  userForm = signal({
    firstName: '', lastName: '', email: '',
    phone: '', password: '', role: 'USER'
  });

  // Finances data
  financeSummary = signal<any>(null);
  financeRevenue = signal<any[]>([]);
  financeTopProducts = signal<any[]>([]);
  financeLoading = signal(false);
  financePeriod = signal<string>('month');

  // Messages
  successMessage = signal('');
  errorMessage = signal('');

  form = signal({
    name: '', brand: '', price: 0, originalPrice: 0,
    category: 'men', type: 'clothing', description: '',
    stock: 0, sizes: '', colors: '', images: '',
    tags: '', isNew: false, isSale: false,
    rating: 0, reviewCount: 0
  });
  // Pagination
  pageProducts = signal(1);
  pageOrders = signal(1);
  pageUsers = signal(1);
  itemsPerPage = 10;

  // Recherche
  searchProducts = signal('');
  searchOrders = signal('');
  searchUsers = signal('');

// Listes filtrées
  filteredProducts = computed(() => {
    const q = this.searchProducts().toLowerCase();
    if (!q) return this.products();
    return this.products().filter(p =>
      p.name?.toLowerCase().includes(q) ||
      p.brand?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q)
    );
  });

  filteredOrders = computed(() => {
    const q = this.searchOrders().toLowerCase();
    if (!q) return this.orders();
    return this.orders().filter(o =>
      o.orderNumber?.toLowerCase().includes(q) ||
      o.shippingFirstName?.toLowerCase().includes(q) ||
      o.shippingLastName?.toLowerCase().includes(q) ||
      o.shippingEmail?.toLowerCase().includes(q)
    );
  });

  filteredUsers = computed(() => {
    const q = this.searchUsers().toLowerCase();
    if (!q) return this.users();
    return this.users().filter(u =>
      u.firstName?.toLowerCase().includes(q) ||
      u.lastName?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.phone?.toLowerCase().includes(q)
    );
  });
  userRole = signal<string>('');

  ngOnInit() {
    const stored = localStorage.getItem('auth_user');
    if (stored) {
      const user = JSON.parse(stored);
      this.userRole.set(user.role || '');
    }
    this.loadStats();
  }

  // ─── NAVIGATION ───
  get tabs(): {id: 'stats' | 'products' | 'orders' | 'users' | 'finances' | 'super', icon: string, label: string}[] {
    const base: {id: 'stats' | 'products' | 'orders' | 'users' | 'finances' |'super', icon: string, label: string}[] = [
      { id: 'stats',    icon: '📊', label: 'Dashboard' },
      { id: 'products', icon: '👕', label: 'Products' },
      { id: 'orders',   icon: '📦', label: 'Orders' },
      { id: 'users',    icon: '👥', label: 'Users' },
      { id: 'finances', icon: '💰', label: 'Finances' },
    ];
    if (this.userRole() === 'SUPER_ADMIN') {
      base.push({ id: 'super', icon: '🔐', label: 'Super Admin' });
    }
    return base;
  }

  setTab(tab: 'stats' | 'products' | 'orders' | 'users' | 'finances' | 'super') {
    this.activeTab.set(tab);
    if (tab === 'stats') this.loadStats();
    if (tab === 'products') this.loadProducts();
    if (tab === 'orders') this.loadOrders();
    if (tab === 'users') this.loadUsers();
    if (tab === 'finances') this.loadFinances();
    if (tab === 'super') this.loadSuperAdminData();
  }
  // ─── STATS ───
  loadStats() {
    this.statsLoading.set(true);
    this.http.get<any>(`${API_URL}/admin/stats`).subscribe({
      next: (s) => {
        this.stats.set(s);
        this.statsLoading.set(false);
      },
      error: () => this.statsLoading.set(false)
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

  getStatusEntries(): { key: string, value: number }[] {
    const s = this.stats();
    if (!s?.ordersByStatus) return [];
    return Object.entries(s.ordersByStatus).map(([key, value]) => ({key, value: value as number}));
  }

  getDailyRevenue(): { date: string, revenue: number }[] {
    return this.stats()?.dailyRevenue?.slice(0, 7) || [];
  }

  getMaxRevenue(): number {
    const data = this.getDailyRevenue();
    return data.length ? Math.max(...data.map(d => d.revenue)) : 1;
  }

  // ─── PRODUCTS ───

  paginatedProducts = computed(() => {
    const start = (this.pageProducts() - 1) * this.itemsPerPage;
    return this.filteredProducts().slice(start, start + this.itemsPerPage);
  });

  currentPageProducts = signal(1);

  totalPagesProducts = computed(() =>
    Math.ceil(this.filteredProducts().length / this.itemsPerPage)
  );

  getColors(): string[] {
    const colors = this.form().colors;
    if (!colors) return [];
    return colors.split(',').map((c: string) => c.trim()).filter((c: string) => c.length > 0);
  }

  // getImages(): string[] {
  //   const images = this.form().images;
  //   if (!images) return [];
  //   if (Array.isArray(images)) return images;
  //   return (images as any).split(',').filter((i: string) => i.length > 0);
  // }

  loadProducts() {
    this.productsLoading.set(true);
    this.http.get<any[]>(`${API_URL}/products`).subscribe({
      next: (p) => {
        this.products.set(p);
        this.productsLoading.set(false);
      },
      error: () => this.productsLoading.set(false)
    });
  }

  openCreate() {
    this.editingProduct.set(null);
    this.form.set({
      name: '', brand: '', price: 0, originalPrice: 0,
      category: 'men', type: 'clothing', description: '',
      stock: 0, sizes: '', colors: '', images: '',
      tags: '', isNew: false, isSale: false,
      rating: 0, reviewCount: 0
    });
    this.showForm.set(true);
  }
  viewProduct(product: any) {
    console.log("View clicked", product);
    this.viewingProduct.set(product);
    this.router.navigate(['/admin/products', product.id]);
  }


  getViewImages(): string[] {
    const imgs = this.viewingProduct()?.images;
    if (!imgs) return [];
    return imgs.split(',').filter((i: string) => i.trim());
  }

  openEdit(product: any) {
    this.editingProduct.set(product);
    this.form.set({
      name: product.name, brand: product.brand,
      price: product.price, originalPrice: product.originalPrice || 0,
      category: product.category, type: product.type,
      description: product.description || '',
      stock: product.stock, sizes: product.sizes || '',
      colors: product.colors || '', images: product.images || '',
      tags: product.tags || '', isNew: product.isNew || false,
      isSale: product.isSale || false,
      rating: product.rating || 0, reviewCount: product.reviewCount || 0
    });
    this.showForm.set(true);
  }

  updateField(field: string, value: any) {
    this.form.update(f => ({...f, [field]: value}));
  }

  onImageUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.uploadingImage.set(true);
    const formData = new FormData();
    formData.append('file', file);
    this.http.post<{ url: string }>(`${API_URL}/upload`, formData).subscribe({
      next: (res) => {
        const fullUrl = `http://localhost:8080${res.url}`;
        const current = this.form().images;
        this.form.update(f => ({...f, images: current ? current + ',' + fullUrl : fullUrl}));
        this.uploadingImage.set(false);
      },
      error: () => this.uploadingImage.set(false)
    });
  }

  removeImage(index: number) {
    const imgs = this.form().images.split(',').filter((_, i) => i !== index);
    this.form.update(f => ({...f, images: imgs.join(',')}));
  }

  getImages(): string[] {
    return this.form().images ? this.form().images.split(',').filter(i => i.trim()) : [];
  }

  getProductImage(images: string): string {
    if (!images) return '';
    return images.split(',')[0];
  }

  saveProduct() {
    const f = this.form();
    const editing = this.editingProduct();
    const req = editing
      ? this.http.put<any>(`${API_URL}/products/${editing.id}`, f)
      : this.http.post<any>(`${API_URL}/products`, f);

    req.subscribe({
      next: () => {
        editing ? this.soundService.orderSuccess() : this.soundService.addToCart();
        this.showSuccess(editing ? 'Product updated!' : 'Product created!');
        this.showForm.set(false);
        this.loadProducts();
      },
      error: () => {
        this.soundService.error();
        this.showError('Something went wrong.')
      }
    });
  }

  deleteProduct(id: number) {
    if (!confirm('Delete this product?')) return;
    this.http.delete(`${API_URL}/products/${id}`).subscribe({
      next: () => {
        this.soundService.removeFromCart();
        this.showSuccess('Product deleted!');
        this.loadProducts();
      }
    });
  }

  // ─── ORDERS ───

  paginatedOrders = computed(() => {
    console.log('currentPageOrders:', this.currentPageOrders());
    const start = (this.currentPageOrders() - 1) * this.itemsPerPage; // ← corriger ici
    return this.filteredOrders().slice(start, start + this.itemsPerPage);
  });

  currentPageOrders = signal(1);

  totalPagesOrders = computed(() =>
    Math.ceil(this.filteredOrders().length / this.itemsPerPage)
  );

  loadOrders() {
    this.ordersLoading.set(true);
    this.http.get<any[]>(`${API_URL}/orders/admin/all`).subscribe({
      next: (o) => {
        this.orders.set(o);
        this.ordersLoading.set(false);
        // NE PAS reset la page ici
      },
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

  updateOrderStatus(orderId: number, status: string) {
    this.http.put<any>(`${API_URL}/orders/${orderId}/status?status=${status}`, {}).subscribe({
      next: () => {
        if (status === 'CONFIRMED' || status === 'DELIVERED') {
          this.soundService.orderSuccess();
        } else if (status === 'CANCELLED') {
          this.soundService.removeFromCart();
        } else {
          this.soundService.login();
        }
        this.showSuccess('Order status updated!');
        // ← Ne pas appeler loadOrders() ici
      },
      error: () => {
        this.soundService.error();
        this.showError('Failed to update status.');
      }
    });
  }
  getOrderStatuses(): string[] {
    return ['PENDING', 'CONFIRMED', 'DELIVERED', 'CANCELLED'];
  }
  // ─── USERS ───
  paginatedUsers = computed(() => {
    const start = (this.currentPageUsers() - 1) * this.itemsPerPage;
    return this.filteredUsers().slice(start, start + this.itemsPerPage);
  });

  currentPageUsers = signal(1);

  itemsPerPageUsers = 10;


  totalPagesUsers = computed(() =>
    Math.ceil(this.filteredUsers().length / this.itemsPerPage)
  );

  getPages(total: number): number[] {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  loadUsers() {
    this.usersLoading.set(true);
    this.http.get<any[]>(`${API_URL}/admin/users`).subscribe({
      next: (u) => {
        this.users.set(u);
        this.usersLoading.set(false);
      },
      error: () => this.usersLoading.set(false)
    });
  }

  updateUserRole(userId: number, role: string) {
    this.http.put<any>(`${API_URL}/admin/users/${userId}/role?role=${role}`, {}).subscribe({
      next: () => {
        this.showSuccess('User role updated!');
        this.loadUsers();
      },
      error: () => this.showError('Failed to update role.')
    });
  }

  openCreateUser() {
    this.userForm.set({
      firstName: '', lastName: '', email: '',
      phone: '', password: '', role: 'USER'
    });
    this.showUserForm.set(true);
  }

  viewUser(user: any) {
    this.viewingUser.set(user);
    this.router.navigate(['/admin/users', user.id]);
  }

  updateUserField(field: string, value: any) {
    this.userForm.update(f => ({ ...f, [field]: value }));
  }

  saveUser() {
    this.http.post<any>(`${API_URL}/auth/register`, this.userForm()).subscribe({
      next: () => {
        this.showSuccess('User created!');
        this.showUserForm.set(false);
        this.loadUsers();
      },
      error: () => this.showError('Failed to create user.')
    });
  }


  deleteUser(userId: number) {
    if (!confirm('Supprimer cet utilisateur ?')) return;
    this.http.delete(`${API_URL}/users/${userId}`).subscribe({  // ✅ backticks obligatoires
      next: () => {
        this.soundService.removeFromCart();
        this.showSuccess('User deleted!');
        this.loadUsers();
      },
      error: () => {
        this.soundService.error();
        this.showError('Failed to delete user.');
      }
    });
  }

  getPagesArray(total: number): number[] {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  // Finances :
  loadFinances() {
    this.financeLoading.set(true);
    this.http.get<any>(`${API_URL}/admin/finances/summary`).subscribe({
      next: (s) => { this.financeSummary.set(s); this.financeLoading.set(false); },
      error: () => this.financeLoading.set(false)
    });
    this.loadRevenueChart();
    this.http.get<any[]>(`${API_URL}/admin/finances/top-products`).subscribe({
      next: (p) => this.financeTopProducts.set(p)
    });
  }

  loadRevenueChart() {
    this.http.get<any[]>(`${API_URL}/admin/finances/revenue?period=${this.financePeriod()}`).subscribe({
      next: (r) => this.financeRevenue.set(r)
    });
  }

  getMaxChartRevenue(): number {
    const data = this.financeRevenue();
    return data.length ? Math.max(...data.map(d => d.revenue), 1) : 1;
  }

  superFilter = signal<string>('ALL');
  connectionLogs = signal<any[]>([]);

  getAdminCount(): number {
    return this.superAdminUsers().filter(u => u.role === 'ADMIN').length;
  }

  getUserCount(): number {
    return this.superAdminUsers().filter(u => u.role === 'USER').length;
  }

  getSuperAdminCount(): number {
    return this.superAdminUsers().filter(u => u.role === 'SUPER_ADMIN').length;
  }

  getFilteredSuperUsers(): any[] {
    const filter = this.superFilter();
    if (filter === 'ALL') return this.superAdminUsers();
    return this.superAdminUsers().filter(u => u.role === filter);
  }

  // ─── HELPERS ───
  showSuccess(msg: string) {
    this.successMessage.set(msg);
    setTimeout(() => this.successMessage.set(''), 3000);
  }

  showError(msg: string) {
    this.errorMessage.set(msg);
    setTimeout(() => this.errorMessage.set(''), 3000);
  }
  superAdminUsers = signal<any[]>([]);

  loadSuperAdminData() {
    this.http.get<any[]>(`${API_URL}/super-admin/logs/users`).subscribe({
      next: (u) => this.superAdminUsers.set(u),
      error: () => this.showError('Accès refusé.')
    });
    this.http.get<any[]>(`${API_URL}/super-admin/logs/connections`).subscribe({
      next: (logs) => this.connectionLogs.set(logs),
      error: () => console.error('Logs non disponibles')
    });
  }

  makeAdmin(userId: number) {
    this.http.put(`${API_URL}/super-admin/users/${userId}/make-admin`, {}).subscribe({
      next: () => { this.showSuccess('Admin promu !'); this.loadSuperAdminData(); }
    });
  }

  revokeAdmin(userId: number) {
    this.http.put(`${API_URL}/super-admin/users/${userId}/revoke-admin`, {}).subscribe({
      next: () => { this.showSuccess('Admin rétrogradé !'); this.loadSuperAdminData(); }
    });
  }

  superDeleteUser(userId: number) {
    if (!confirm('Supprimer définitivement ?')) return;
    this.http.delete(`${API_URL}/super-admin/users/${userId}`).subscribe({
      next: () => { this.showSuccess('Utilisateur supprimé !'); this.loadSuperAdminData(); }
    });
  }


}

import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../../../config/api.config';

@Component({
  selector: 'app-product-detail-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-detail-admin.component.html'
})
export class ProductDetailAdminComponent implements OnInit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  protected router = inject(Router);

  product = signal<any>(null);
  loading = signal(true);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.http.get<any>(`${API_URL}/products/${id}`).subscribe({
      next: (p) => { this.product.set(p); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  getImages(): string[] {
    const imgs = this.product()?.images;
    if (!imgs) return [];
    return imgs.split(',').filter((i: string) => i.trim());
  }

  getStockColor(): string {
    const stock = this.product()?.stock;
    if (stock > 10) return 'text-green-600';
    if (stock > 0) return 'text-yellow-600';
    return 'text-red-500';
  }
}

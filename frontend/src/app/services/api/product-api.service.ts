import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../../config/api.config';
import { Product } from '../../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductApiService {

  constructor(private http: HttpClient) {}

  getAll(params?: { category?: string; type?: string; search?: string }): Observable<Product[]> {
    let httpParams = new HttpParams();
    if (params?.category) httpParams = httpParams.set('category', params.category);
    if (params?.type) httpParams = httpParams.set('type', params.type);
    if (params?.search) httpParams = httpParams.set('search', params.search);
    return this.http.get<Product[]>(`${API_URL}/products`, { params: httpParams });
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${API_URL}/products/${id}`);
  }

  getNewArrivals(): Observable<Product[]> {
    return this.http.get<Product[]>(`${API_URL}/products/new-arrivals`);
  }

  getSaleItems(): Observable<Product[]> {
    return this.http.get<Product[]>(`${API_URL}/products/sale`);
  }

  getTopRated(): Observable<Product[]> {
    return this.http.get<Product[]>(`${API_URL}/products/top-rated`);
  }

  createProduct(product: any): Observable<any> {
    return this.http.post<any>(`${API_URL}/products`, product);
  }

  updateProduct(id: number, product: any): Observable<any> {
    return this.http.put<any>(`${API_URL}/products/${id}`, product);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${API_URL}/products/${id}`);
  }

  uploadImage(file: File): Observable<{url: string}> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{url: string}>(`${API_URL}/upload`, formData);
  }
}

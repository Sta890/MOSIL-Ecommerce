import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../../config/api.config';

@Injectable({ providedIn: 'root' })
export class OrderApiService {

  constructor(private http: HttpClient) {}

  getMyOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${API_URL}/orders`);
  }

  checkout(request: any): Observable<any> {
    return this.http.post<any>(`${API_URL}/orders/checkout`, request);
  }
}

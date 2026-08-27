import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { API_URL } from '../config/api.config';
import { LoginNotificationService } from './login-notification.service';
import { SoundService } from './sound.service';

export interface AuthUser {
  token: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private _user = signal<AuthUser | null>(this.loadUser());
  user = this._user.asReadonly();
  isLoggedIn = () => !!this._user();
  isAdmin = () => this._user()?.role === 'ADMIN' || this._user()?.role === 'SUPER_ADMIN';

  constructor(
    private http: HttpClient,
    private router: Router,
    private loginNotif: LoginNotificationService,
    private soundService: SoundService
  ) {}

  register(data: any) {
    return this.http.post<AuthUser>(`${API_URL}/auth/register`, data).pipe(
      tap(user => { this.saveUser(user);
        this.soundService.login();
        })
    );
  }

  login(data: any) {
    return this.http.post<AuthUser>(`${API_URL}/auth/login`, data).pipe(
      tap(user => {
        this.saveUser(user);
        this.soundService.login();
        this.loginNotif.sendLoginNotification(user.email, user.firstName);
      })
    );
  }

  logout() {
    const isAdmin = this.isAdmin();
    console.log('logout - isAdmin:', isAdmin);
    console.log('=== LOGOUT ===');
    console.log('isAdmin:', isAdmin);
    console.log('user role:', this._user()?.role);
    localStorage.removeItem('auth_user');
    if (isAdmin) {
      localStorage.setItem('last_role', 'ADMIN'); // ← stocker le rôle
    } else {
      localStorage.removeItem('last_role');
    }
    this._user.set(null);
    if (isAdmin) {
      console.log('→ navigating to /admin/login');
      this.router.navigate(['/admin/login']);
    } else {
      console.log('→ navigating to /');
      this.router.navigate(['/']);
    }
  }

  getToken(): string | null {
    return this._user()?.token || null;
  }

  private saveUser(user: AuthUser) {
    localStorage.setItem('auth_user', JSON.stringify(user));
    this._user.set(user);
  }

  private loadUser(): AuthUser | null {
    const stored = localStorage.getItem('auth_user');
    return stored ? JSON.parse(stored) : null;
  }
  wasAdmin(): boolean {
    return localStorage.getItem('last_role') === 'ADMIN';
  }
}

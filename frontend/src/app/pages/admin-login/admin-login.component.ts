import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-login.component.html'
})
export class AdminLoginComponent {
  loading = signal(false);
  error = signal('');

  loginData = { email: '', password: '' };

  constructor(private authService: AuthService, private router: Router) {
    // Si déjà connecté en tant qu'admin, rediriger
    if (this.authService.isLoggedIn() && this.authService.isAdmin()) {
      this.router.navigate(['/admin-dashboard']);
    }
  }

  login() {
    this.loading.set(true);
    this.error.set('');
    this.authService.login(this.loginData).subscribe({
      next: () => {
        this.loading.set(false);
        if (this.authService.isAdmin()) {
          this.router.navigate(['/admin-dashboard']);
        } else {
          // Si c'est un user normal, déconnectez et affichez erreur
          this.authService.logout();
          this.error.set('Accès refusé. Cette page est réservée aux administrateurs.');
        }
      },
      error: (err) => {
        this.error.set(err.error?.error || 'Identifiants incorrects');
        this.loading.set(false);
      }
    });
  }
}

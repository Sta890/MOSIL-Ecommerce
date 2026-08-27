import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './auth.component.html'
})
export class AuthPageComponent {

  mode = signal<'login' | 'register'>('login');
  loading = signal<boolean>(false);
  error = signal<string>('');

  loginData = { email: '', password: '' };
  registerData = { firstName: '', lastName: '', email: '', password: '', phone: '' };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
    this.loading.set(true);
    this.error.set('');
    this.authService.login(this.loginData).subscribe({
      next: () => {
        this.loading.set(false);
        if (this.authService.isAdmin()) {
          // Admin connecté sur la page user → déconnecter et rediriger
          this.authService.logout();
          this.error.set('Vous êtes admin. Connectez-vous sur la page admin.');
        } else {
          const returnUrl = this.router.getCurrentNavigation()?.extras?.state?.['returnUrl'] || '/';
          this.router.navigate([returnUrl]);
        }
      },
      error: (err) => {
        this.error.set(err.error?.error || 'Invalid credentials');
        this.loading.set(false);
      }
    });
  }

  register() {
    this.loading.set(true);
    this.error.set('');
    this.authService.register(this.registerData).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/']); // register = toujours USER
      },
      error: (err) => {
        this.error.set(err.error?.error || 'Registration failed');
        this.loading.set(false);
      }
    });
  }
}

import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../../config/api.config';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-admin-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-register.component.html'
})
export class AdminRegisterComponent {
  loading = signal(false);
  error = signal('');
  success = signal('');

  registerData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    role: 'ADMIN'
  };

  constructor(private http: HttpClient, private router: Router,  private authService: AuthService) {}


  register() {
    if (!this.registerData.firstName || !this.registerData.lastName ||
      !this.registerData.email || !this.registerData.password) {
      this.error.set('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    this.loading.set(true);
    this.error.set('');
    this.success.set('');

    this.http.post<any>(`${API_URL}/auth/register`, this.registerData).subscribe({
      next: () => {
        // Connecter automatiquement après register
        this.authService.login({
          email: this.registerData.email,
          password: this.registerData.password
        }).subscribe({
          next: () => {
            this.success.set('Compte admin créé avec succès !');
            this.loading.set(false);
            setTimeout(() => this.router.navigate(['/admin-dashboard']), 1500);
          },
          error: () => {
            // Si login échoue, rediriger vers login
            this.success.set('Compte créé ! Veuillez vous connecter.');
            this.loading.set(false);
            setTimeout(() => this.router.navigate(['/admin-login']), 1500);
          }
        });
      },
      error: (err) => {
        this.error.set(err.error?.error || 'Erreur lors de la création du compte.');
        this.loading.set(false);
      }
    });
  }
}

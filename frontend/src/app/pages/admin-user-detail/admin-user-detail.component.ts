import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../../config/api.config';

@Component({
  selector: 'app-admin-user-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-user-detail.component.html'
})
export class AdminUserDetailComponent implements OnInit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  user = signal<any>(null);
  loading = signal(true);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.http.get<any[]>(`${API_URL}/admin/users`).subscribe({
      next: (users) => {
        const found = users.find(u => u.id == id);
        this.user.set(found);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  goBack() {
    this.router.navigate(['/admin-dashboard']);
  }
}

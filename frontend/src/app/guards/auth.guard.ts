import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('Guard called - isLoggedIn:', authService.isLoggedIn());

  if (authService.isLoggedIn()) {
    return true;
  }

  // Rediriger vers admin/login si on essaie d'accéder au dashboard admin
  if (state.url.includes('admin')) {
    router.navigate(['/admin/login']);
  } else {
    router.navigate(['/auth'], { state: { returnUrl: state.url } });
  }

  return false;
};

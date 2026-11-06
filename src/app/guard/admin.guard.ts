import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.estaLogueado() && auth.puedeAdministrar()) {
    return true;
  }

  return router.createUrlTree([
    auth.estaLogueado() ? '/inicio' : '/inicioSesion'
  ]);
}
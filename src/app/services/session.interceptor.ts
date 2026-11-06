import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { AuthService } from './auth-service';

export const sessionInterceptor: HttpInterceptorFn = (request, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const apiUrl = new URL(API_BASE_URL);
  const requestUrl = new URL(request.url, API_BASE_URL);
  const perteneceApi =
    requestUrl.origin === apiUrl.origin &&
    requestUrl.pathname.startsWith(`${apiUrl.pathname}/`);
  const esLogin = requestUrl.pathname.endsWith('/usuarios/login');

  return next(request).pipe(
    catchError((error: unknown) => {
      if (
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        perteneceApi &&
        !esLogin &&
        auth.estaLogueado()
      ) {
        auth.logout();
        void router.navigate(['/inicioSesion']);
      }

      return throwError(() => error);
    })
  );
};

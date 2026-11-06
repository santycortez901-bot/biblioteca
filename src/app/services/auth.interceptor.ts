import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { API_BASE_URL } from '../config/api.config';
import { AuthService } from './auth-service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const apiUrl = new URL(API_BASE_URL);
  const requestUrl = new URL(request.url, API_BASE_URL);
  const perteneceApi =
    requestUrl.origin === apiUrl.origin &&
    requestUrl.pathname.startsWith(`${apiUrl.pathname}/`);
  const esRutaPublica = [
    '/usuarios/login',
    '/usuarios/registro'
  ].some(ruta => requestUrl.pathname.endsWith(ruta));

  const token = inject(AuthService).getToken();

  if (!token || !perteneceApi || esRutaPublica) {
    return next(request);
  }

  return next(request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  }));
};

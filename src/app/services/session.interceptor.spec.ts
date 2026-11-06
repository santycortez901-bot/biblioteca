import {
  HttpClient,
  provideHttpClient,
  withInterceptors
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { sessionInterceptor } from './session.interceptor';

describe('sessionInterceptor', () => {
  let httpTesting: HttpTestingController;
  const navigate = vi.fn();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([sessionInterceptor])),
        provideHttpClientTesting(),
        { provide: Router, useValue: { navigate } }
      ]
    });
    httpTesting = TestBed.inject(HttpTestingController);
    navigate.mockClear();
  });

  afterEach(() => {
    httpTesting.verify();
    localStorage.clear();
  });

  it('clears a revoked session when the API returns 401', () => {
    localStorage.setItem('token', 'token-revocado');
    localStorage.setItem('usuario', JSON.stringify({
      id: 3,
      nombre: 'Admin',
      rol: 'admin'
    }));

    TestBed.inject(HttpClient)
      .get('http://localhost/api_proyecto_biblioteca/public/usuarios/admins')
      .subscribe({ error: () => undefined });

    httpTesting.expectOne(
      'http://localhost/api_proyecto_biblioteca/public/usuarios/admins'
    ).flush({ error: 'La cuenta ya no existe' }, {
      status: 401,
      statusText: 'Unauthorized'
    });

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('usuario')).toBeNull();
    expect(navigate).toHaveBeenCalledWith(['/inicioSesion']);
  });
});

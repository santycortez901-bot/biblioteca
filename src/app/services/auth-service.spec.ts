import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { AuthService } from './auth-service';

describe('AuthService', () => {
  let service: AuthService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(AuthService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send the backend password field and persist the session', () => {
    service.login('admin@example.com', 'clave-segura').subscribe();

    const request = httpTesting.expectOne(
      'http://localhost/api_proyecto_biblioteca/public/usuarios/login'
    );
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      email: 'admin@example.com',
      contrasenia: 'clave-segura'
    });

    request.flush({
      token: 'jwt-de-prueba',
      usuario: { id: 1, nombre: 'Admin', rol: 'admin' }
    });

    expect(service.getToken()).toBe('jwt-de-prueba');
    expect(service.esAdmin()).toBe(true);
    expect(service.puedeAdministrar()).toBe(true);
  });

  it('should recognize superadmin without treating it as a regular admin', () => {
    localStorage.setItem('usuario', JSON.stringify({
      id: 2,
      nombre: 'Superadmin',
      rol: 'super_admin'
    }));

    expect(service.esSuperAdmin()).toBe(true);
    expect(service.esAdmin()).toBe(false);
    expect(service.puedeAdministrar()).toBe(true);
  });
});

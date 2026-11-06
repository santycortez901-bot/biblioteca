import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import {
  HttpClient,
  provideHttpClient,
  withInterceptors
} from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting()
      ]
    });
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
    localStorage.removeItem('token');
  });

  it('adds the saved bearer token to protected requests', () => {
    localStorage.setItem('token', 'jwt-de-prueba');

    TestBed.inject(HttpClient)
      .get('http://localhost/api_proyecto_biblioteca/public/prestamos')
      .subscribe();

    const request = httpTesting.expectOne(
      'http://localhost/api_proyecto_biblioteca/public/prestamos'
    );
    expect(request.request.headers.get('Authorization'))
      .toBe('Bearer jwt-de-prueba');
    request.flush([]);
  });

  it('does not send the token to the public login endpoint', () => {
    localStorage.setItem('token', 'jwt-de-prueba');

    TestBed.inject(HttpClient)
      .post('http://localhost/api_proyecto_biblioteca/public/usuarios/login', {})
      .subscribe();

    const request = httpTesting.expectOne(
      'http://localhost/api_proyecto_biblioteca/public/usuarios/login'
    );
    expect(request.request.headers.has('Authorization')).toBe(false);
    request.flush({});
  });

  it('does not send the token outside the configured API', () => {
    localStorage.setItem('token', 'jwt-de-prueba');

    TestBed.inject(HttpClient)
      .get('https://example.com/resource')
      .subscribe();

    const request = httpTesting.expectOne('https://example.com/resource');
    expect(request.request.headers.has('Authorization')).toBe(false);
    request.flush({});
  });
});

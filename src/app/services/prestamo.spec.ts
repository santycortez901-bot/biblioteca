import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { API_BASE_URL } from '../config/api.config';
import { PrestamoService } from './prestamo';

describe('PrestamoService', () => {
  let service: PrestamoService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(PrestamoService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('loads loans and maps the API fields to the view model', () => {
    let result: ReturnType<typeof service.obtenerPrestamos> = [];

    service.cargarPrestamos().subscribe(prestamos => result = prestamos);
    http.expectOne(`${API_BASE_URL}/prestamos`).flush([{
      id: 'PR001',
      socio_id: 7,
      libro_id: 'INV001',
      inventario: 'INV001-01',
      fecha_inicio: '2026-09-01 00:00:00',
      fecha_vencimiento: '2026-10-01 00:00:00',
      estado: 'activo',
      renovaciones: 0,
      motivo_suspension: null,
      socio_nombre: 'Ana López',
      libro_titulo: 'El Principito'
    }]);

    expect(result[0]).toMatchObject({
      id: 'PR001',
      socioId: 7,
      socio: 'Ana López',
      libro: 'El Principito',
      libroId: 'INV001',
      fechaInicio: '2026-09-01',
      estado: 'activo'
    });
  });
});

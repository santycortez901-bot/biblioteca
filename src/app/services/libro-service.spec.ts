import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { API_BASE_URL } from '../config/api.config';
import { LibroService } from './libro-service';

describe('LibroService', () => {
  let service: LibroService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(LibroService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('loads books from the configured API', () => {
    service.cargarLibros().subscribe(libros => {
      expect(libros[0]).toMatchObject({
        id: 'INV001',
        titulo: 'El Principito',
        copias: 1,
        copiasTotales: 2
      });
    });

    http.expectOne(`${API_BASE_URL}/libros`).flush([{
      id: 'INV001',
      titulo: 'El Principito',
      autor: 'Antoine de Saint-Exupéry',
      copias: 1,
      copiasTotales: 2,
      estado: 'disponible',
      listaCopias: [{ id: 'INV001-01', estado: 'Disponible' }]
    }]);
  });
});

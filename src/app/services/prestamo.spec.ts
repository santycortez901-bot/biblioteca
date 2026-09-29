import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockLibroService = {
  libros: [
    {
      id: 'INV001',
      titulo: 'El Principito',
      autor: 'Antoine de Saint-Exupéry',
      copias: 1,
      copiasTotales: 1,
      estado: 'disponible',
      listaCopias: [{ id: 'INV001-01', estado: 'Disponible' }],
    },
  ],
  prestarCopia: vi.fn(() => true),
  devolverCopiaPorInventario: vi.fn(),
};

vi.mock('@angular/core', async () => {
  const actual = await vi.importActual<typeof import('@angular/core')>('@angular/core');

  return {
    ...actual,
    Injectable: () => (target: unknown) => target,
    inject: vi.fn(() => mockLibroService),
  };
});

import { PrestamoService } from './prestamo';

describe('PrestamoService', () => {
  let service: PrestamoService;

  beforeEach(() => {
    mockLibroService.prestarCopia.mockClear();
    mockLibroService.devolverCopiaPorInventario.mockClear();
    service = new PrestamoService();
  });

  it('should reject a second active loan for the same socio', () => {
    const primerPrestamo = {
      id: 'PR001',
      socioId: 7,
      socio: 'Ana López',
      libro: 'El Principito',
      libroId: 'INV001',
      inventario: 'INV001-01',
      fechaInicio: '2026-09-01',
      fechaVencimiento: '2026-10-01',
      estado: 'activo' as const,
      renovaciones: 0,
    };

    const segundoPrestamo = {
      id: 'PR002',
      socioId: 7,
      socio: 'Ana López',
      libro: 'El Principito',
      libroId: 'INV001',
      inventario: 'INV001-01',
      fechaInicio: '2026-09-15',
      fechaVencimiento: '2026-10-15',
      estado: 'activo' as const,
      renovaciones: 0,
    };

    expect(service.agregarPrestamo(primerPrestamo)).toBe(true);
    expect(service.agregarPrestamo(segundoPrestamo)).toBe(false);
    expect(service.obtenerPrestamos()).toHaveLength(1);
  });
});

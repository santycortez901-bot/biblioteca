import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { Prestamos } from './prestamos';
import { PrestamoService } from '../services/prestamo';
import { SocioServicio } from '../services/socio';
import { LibroService } from '../services/libro-service';
import { ActividadServicio } from '../services/actividade-service';

describe('Prestamos', () => {
  let component: Prestamos;
  let fixture: ComponentFixture<Prestamos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Prestamos],
      providers: [
        provideRouter([]),
        {
          provide: PrestamoService,
          useValue: { cargarPrestamos: () => of([]), obtenerPrestamos: () => [] }
        },
        {
          provide: SocioServicio,
          useValue: { cargarSocios: () => of([]), tenerSocios: () => [] }
        },
        {
          provide: LibroService,
          useValue: { cargarLibros: () => of([]), libros$: of([]) }
        },
        { provide: ActividadServicio, useValue: { registrarActividad: vi.fn() } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Prestamos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

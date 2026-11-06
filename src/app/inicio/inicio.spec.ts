import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { Inicio } from './inicio';
import { ActividadServicio } from '../services/actividade-service';
import { SocioServicio } from '../services/socio';
import { PrestamoService } from '../services/prestamo';
import { AuthService } from '../services/auth-service';

describe('Inicio', () => {
  let component: Inicio;
  let fixture: ComponentFixture<Inicio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Inicio],
      providers: [
        provideRouter([]),
        {
          provide: ActividadServicio,
          useValue: { cargarActividades: () => of([]), obtenerActividades: () => [] }
        },
        {
          provide: SocioServicio,
          useValue: { cargarSocios: () => of([]), tenerSocios: () => [] }
        },
        {
          provide: PrestamoService,
          useValue: { cargarPrestamos: () => of([]), obtenerPrestamos: () => [] }
        },
        { provide: AuthService, useValue: { estaLogueado: () => false } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Inicio);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

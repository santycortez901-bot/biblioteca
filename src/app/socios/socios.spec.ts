import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { Socios } from './socios';
import { SocioServicio } from '../services/socio';
import { ActividadServicio } from '../services/actividade-service';

describe('Socios', () => {
  let component: Socios;
  let fixture: ComponentFixture<Socios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Socios],
      providers: [
        provideRouter([]),
        {
          provide: SocioServicio,
          useValue: {
            cargarSocios: () => of([]),
            tenerSocios: () => [],
            agregarSocio: vi.fn(() => of(undefined)),
            actualizarSocio: vi.fn(() => of(undefined))
          }
        },
        { provide: ActividadServicio, useValue: { registrarActividad: vi.fn() } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Socios);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
  
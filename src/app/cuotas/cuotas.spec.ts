import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { Cuotas } from './cuotas';
import { CuotasService } from '../services/cuotas-service';
import { ActividadServicio } from '../services/actividade-service';

describe('Cuotas', () => {
  let component: Cuotas;
  let fixture: ComponentFixture<Cuotas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cuotas],
      providers: [
        provideRouter([]),
        {
          provide: CuotasService,
          useValue: {
            cargarCuotas: () => of([]),
            cobrarCuota: vi.fn(() => of(undefined)),
            darDeBaja: vi.fn(() => of(undefined)),
            darDeAlta: vi.fn(() => of(undefined))
          }
        },
        { provide: ActividadServicio, useValue: { registrarActividad: vi.fn() } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Cuotas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not render the cobrar button for inactive members', () => {
    component.cuotas = [
      {
        id: 1,
        numCarnet: 'A-001',
        nombre: 'Ana López',
        edad: 30,
        dni: '30123456',
        telefono: '5491123456789',
        email: 'ana@test.com',
        estado: 'inactivo',
        cuota: 'pendiente',
        prestamos: 'Libre',
      },
    ];

    fixture.detectChanges(false);

    const buttons: HTMLButtonElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>
    );
    const cobrarButton = buttons.find(button =>
      button.textContent?.includes('Cobrar')
    );

    expect(cobrarButton).toBeUndefined();
  });
});

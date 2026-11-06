import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { Libros } from './libros';
import { LibroService } from '../services/libro-service';
import { ActividadServicio } from '../services/actividade-service';

describe('Libros', () => {
  let component: Libros;
  let fixture: ComponentFixture<Libros>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Libros],
      providers: [
        provideRouter([]),
        {
          provide: LibroService,
          useValue: { libros$: of([]), cargarLibros: () => of([]), guardarLibro: () => of(undefined) }
        },
        { provide: ActividadServicio, useValue: { registrarActividad: vi.fn() } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Libros);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

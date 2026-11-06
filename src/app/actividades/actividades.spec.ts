import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { Actividades } from './actividades';
import { ActividadServicio } from '../services/actividade-service';

describe('Actividades', () => {
  let component: Actividades;
  let fixture: ComponentFixture<Actividades>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Actividades],
      providers: [
        { provide: ActividadServicio, useValue: { cargarActividades: () => of([]) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Actividades);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

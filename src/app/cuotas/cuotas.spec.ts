import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cuotas } from './cuotas';

describe('Cuotas', () => {
  let component: Cuotas;
  let fixture: ComponentFixture<Cuotas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cuotas],
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

    fixture.detectChanges();

    const buttons = Array.from(fixture.nativeElement.querySelectorAll('button'));
    const cobrarButton = buttons.find((button: HTMLButtonElement) =>
      button.textContent?.includes('Cobrar')
    );

    expect(cobrarButton).toBeUndefined();
  });
});

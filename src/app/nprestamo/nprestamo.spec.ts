import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Nprestamo } from './nprestamo';

describe('Nprestamo', () => {
  let component: Nprestamo;
  let fixture: ComponentFixture<Nprestamo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Nprestamo],
    }).compileComponents();

    fixture = TestBed.createComponent(Nprestamo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';
import { Prestamos } from './prestamos';

describe('Prestamos', () => {
  let component: Prestamos;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Prestamos]
    }).compileComponents();

    const fixture = TestBed.createComponent(Prestamos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

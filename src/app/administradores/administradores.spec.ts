import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { GestionAdministradores } from './administradores';

describe('GestionAdministradores', () => {
  it('should create', async () => {
    await TestBed.configureTestingModule({
      imports: [GestionAdministradores],
      providers: [
        provideHttpClient(),
        provideRouter([])
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(GestionAdministradores);
    expect(fixture.componentInstance).toBeTruthy();
  });
});

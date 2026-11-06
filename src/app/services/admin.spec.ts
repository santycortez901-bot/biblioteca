import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AdminComponent } from './admin';
import { AuthService } from './auth-service';

describe('AdminComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AdminComponent],
      providers: [
        { provide: AuthService, useValue: { logout: vi.fn() } },
        { provide: Router, useValue: { navigate: vi.fn() } },
      ],
    });
  });

  it('should be created', () => {
    const fixture = TestBed.createComponent(AdminComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { CuotasService } from './cuotas-service';

describe('CuotasService', () => {
  let service: CuotasService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(CuotasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { SocioServicio } from './socio';

describe('SocioServicio', () => {
  let service: SocioServicio;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(SocioServicio);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

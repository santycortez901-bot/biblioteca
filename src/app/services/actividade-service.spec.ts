import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { ActividadServicio } from './actividade-service';

describe('ActividadServicio', () => {
  let service: ActividadServicio;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(ActividadServicio);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

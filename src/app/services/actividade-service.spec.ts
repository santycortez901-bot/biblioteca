import { TestBed } from '@angular/core/testing';

import { ActividadeService } from './actividade-service';

describe('ActividadeService', () => {
  let service: ActividadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActividadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

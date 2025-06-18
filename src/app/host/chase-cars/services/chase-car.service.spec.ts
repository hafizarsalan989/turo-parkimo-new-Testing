import { TestBed } from '@angular/core/testing';

import { ChaseCarService } from './chase-car.service';

describe('ChaseCarService', () => {
  let service: ChaseCarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChaseCarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

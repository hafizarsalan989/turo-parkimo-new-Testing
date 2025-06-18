import { TestBed } from '@angular/core/testing';

import { FuelTankService } from './fuel-tank.service';

describe('FuelTankService', () => {
  let service: FuelTankService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FuelTankService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

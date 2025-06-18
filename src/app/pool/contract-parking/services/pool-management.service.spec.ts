import { TestBed } from '@angular/core/testing';

import { PoolManagementService } from './pool-management.service';

describe('PoolManagementService', () => {
  let service: PoolManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PoolManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

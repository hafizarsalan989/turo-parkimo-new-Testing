import { TestBed } from '@angular/core/testing';

import { HostManagementService } from './host-management.service';

describe('HostManagementService', () => {
  let service: HostManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HostManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

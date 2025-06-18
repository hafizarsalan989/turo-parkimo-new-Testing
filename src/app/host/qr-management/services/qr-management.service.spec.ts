import { TestBed } from '@angular/core/testing';

import { QrManagementService } from './qr-management.service';

describe('QrManagementService', () => {
  let service: QrManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QrManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

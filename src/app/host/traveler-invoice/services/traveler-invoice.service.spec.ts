import { TestBed } from '@angular/core/testing';

import { TravelerInvoiceService } from './traveler-invoice.service';

describe('TravelerInvoiceService', () => {
  let service: TravelerInvoiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TravelerInvoiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

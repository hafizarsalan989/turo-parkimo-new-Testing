import { TestBed } from '@angular/core/testing';

import { CardOnFileService } from './card-on-file.service';

describe('CardOnFileService', () => {
  let service: CardOnFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardOnFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

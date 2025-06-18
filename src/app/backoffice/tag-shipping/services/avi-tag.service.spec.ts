import { TestBed } from '@angular/core/testing';

import { AviTagService } from './avi-tag.service';

describe('AviTagService', () => {
  let service: AviTagService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AviTagService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { TagOrderingService } from './tag-ordering.service';

describe('TagOrderingService', () => {
  let service: TagOrderingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TagOrderingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

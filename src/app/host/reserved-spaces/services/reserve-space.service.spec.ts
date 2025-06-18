import { TestBed } from '@angular/core/testing';

import { ReserveSpaceService } from './reserve-space.service';

describe('ReserveSpaceService', () => {
  let service: ReserveSpaceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReserveSpaceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { TagMasterService } from './tag-master.service';

describe('TagMasterService', () => {
  let service: TagMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TagMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

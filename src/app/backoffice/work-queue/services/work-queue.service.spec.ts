import { TestBed } from '@angular/core/testing';

import { WorkQueueService } from './work-queue.service';

describe('WorkQueueService', () => {
  let service: WorkQueueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkQueueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

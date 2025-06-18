import { TestBed } from '@angular/core/testing';

import { LegacyPayGuard } from './legacy-pay.guard';

describe('LegacyPayGuard', () => {
  let guard: LegacyPayGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(LegacyPayGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { QueryParamsGuard } from './query-params.guard';

describe('QueryParamsGuard', () => {
  let guard: QueryParamsGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(QueryParamsGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

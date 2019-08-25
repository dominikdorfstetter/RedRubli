import { TestBed, async, inject } from '@angular/core/testing';

import { SalesGuard } from './sales.guard';

describe('SalesGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SalesGuard]
    });
  });

  it('should ...', inject([SalesGuard], (guard: SalesGuard) => {
    expect(guard).toBeTruthy();
  }));
});

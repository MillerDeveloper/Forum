import { TestBed } from '@angular/core/testing';

import { CabinetGuard } from './cabinet.guard';

describe('CabinetGuard', () => {
  let guard: CabinetGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CabinetGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

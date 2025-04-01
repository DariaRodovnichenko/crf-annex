import { TestBed } from '@angular/core/testing';

import { CoffeeLogService } from './coffee-log.service';

describe('CoffeeLogService', () => {
  let service: CoffeeLogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoffeeLogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

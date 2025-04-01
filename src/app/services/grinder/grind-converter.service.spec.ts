import { TestBed } from '@angular/core/testing';

import { GrindConverterService } from './grind-converter.service';

describe('GrindConverterService', () => {
  let service: GrindConverterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GrindConverterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

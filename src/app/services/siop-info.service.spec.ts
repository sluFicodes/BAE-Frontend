import { TestBed } from '@angular/core/testing';

import { SiopInfoService } from './siop-info.service';

describe('SiopInfoService', () => {
  let service: SiopInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SiopInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

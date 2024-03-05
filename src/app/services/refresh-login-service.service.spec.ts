import { TestBed } from '@angular/core/testing';

import { RefreshLoginServiceService } from './refresh-login-service.service';

describe('RefreshLoginServiceService', () => {
  let service: RefreshLoginServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RefreshLoginServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

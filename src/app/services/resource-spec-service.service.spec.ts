import { TestBed } from '@angular/core/testing';

import { ResourceSpecServiceService } from './resource-spec-service.service';

describe('ResourceSpecServiceService', () => {
  let service: ResourceSpecServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResourceSpecServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { ProductSpecServiceService } from './product-spec-service.service';

describe('ProductSpecServiceService', () => {
  let service: ProductSpecServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductSpecServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

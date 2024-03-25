import { TestBed } from '@angular/core/testing';

import { ProductInventoryServiceService } from './product-inventory-service.service';

describe('ProductInventoryServiceService', () => {
  let service: ProductInventoryServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductInventoryServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

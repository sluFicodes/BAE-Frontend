import { TestBed } from '@angular/core/testing';

import { ShoppingCartServiceService } from './shopping-cart-service.service';

describe('ShoppingCartServiceService', () => {
  let service: ShoppingCartServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShoppingCartServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

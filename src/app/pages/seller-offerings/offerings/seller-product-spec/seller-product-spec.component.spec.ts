import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerProductSpecComponent } from './seller-product-spec.component';

describe('SellerProductSpecComponent', () => {
  let component: SellerProductSpecComponent;
  let fixture: ComponentFixture<SellerProductSpecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerProductSpecComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SellerProductSpecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerOfferComponent } from './seller-offer.component';

describe('SellerOfferComponent', () => {
  let component: SellerOfferComponent;
  let fixture: ComponentFixture<SellerOfferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SellerOfferComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SellerOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerOfferingsComponent } from './seller-offerings.component';

describe('SellerOfferingsComponent', () => {
  let component: SellerOfferingsComponent;
  let fixture: ComponentFixture<SellerOfferingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerOfferingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SellerOfferingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

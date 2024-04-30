import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerServiceSpecComponent } from './seller-service-spec.component';

describe('SellerServiceSpecComponent', () => {
  let component: SellerServiceSpecComponent;
  let fixture: ComponentFixture<SellerServiceSpecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SellerServiceSpecComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SellerServiceSpecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerResourceSpecComponent } from './seller-resource-spec.component';

describe('SellerResourceSpecComponent', () => {
  let component: SellerResourceSpecComponent;
  let fixture: ComponentFixture<SellerResourceSpecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SellerResourceSpecComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SellerResourceSpecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

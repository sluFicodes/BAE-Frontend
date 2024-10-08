import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductInvDetailComponent } from './product-inv-detail.component';

describe('ProductInvDetailComponent', () => {
  let component: ProductInvDetailComponent;
  let fixture: ComponentFixture<ProductInvDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductInvDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductInvDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

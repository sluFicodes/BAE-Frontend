import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerCatalogsComponent } from './seller-catalogs.component';

describe('SellerCatalogsComponent', () => {
  let component: SellerCatalogsComponent;
  let fixture: ComponentFixture<SellerCatalogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SellerCatalogsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SellerCatalogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

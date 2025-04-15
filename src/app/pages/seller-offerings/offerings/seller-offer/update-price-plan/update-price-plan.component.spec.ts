import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePricePlanComponent } from './update-price-plan.component';

describe('UpdatePricePlanComponent', () => {
  let component: UpdatePricePlanComponent;
  let fixture: ComponentFixture<UpdatePricePlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdatePricePlanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdatePricePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPricePlanComponent } from './new-price-plan.component';

describe('NewPricePlanComponent', () => {
  let component: NewPricePlanComponent;
  let fixture: ComponentFixture<NewPricePlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewPricePlanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewPricePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

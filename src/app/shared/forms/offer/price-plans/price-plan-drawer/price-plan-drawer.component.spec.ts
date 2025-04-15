import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricePlanDrawerComponent } from './price-plan-drawer.component';

describe('PricePlanDrawerComponent', () => {
  let component: PricePlanDrawerComponent;
  let fixture: ComponentFixture<PricePlanDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PricePlanDrawerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PricePlanDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

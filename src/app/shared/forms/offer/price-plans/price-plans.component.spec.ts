import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricePlansComponent } from './price-plans.component';

describe('PricePlansComponent', () => {
  let component: PricePlansComponent;
  let fixture: ComponentFixture<PricePlansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PricePlansComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PricePlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

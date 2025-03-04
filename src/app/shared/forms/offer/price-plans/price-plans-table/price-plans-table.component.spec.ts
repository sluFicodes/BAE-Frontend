import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricePlansTableComponent } from './price-plans-table.component';

describe('PricePlansTableComponent', () => {
  let component: PricePlansTableComponent;
  let fixture: ComponentFixture<PricePlansTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PricePlansTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PricePlansTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceComponentDrawerComponent } from './price-component-drawer.component';

describe('PriceComponentDrawerComponent', () => {
  let component: PriceComponentDrawerComponent;
  let fixture: ComponentFixture<PriceComponentDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PriceComponentDrawerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PriceComponentDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

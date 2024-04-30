import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatformBenefitsComponent } from './platform-benefits.component';

describe('PlatformBenefitsComponent', () => {
  let component: PlatformBenefitsComponent;
  let fixture: ComponentFixture<PlatformBenefitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlatformBenefitsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlatformBenefitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

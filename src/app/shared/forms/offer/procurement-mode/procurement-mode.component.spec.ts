import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcurementModeComponent } from './procurement-mode.component';

describe('ProcurementModeComponent', () => {
  let component: ProcurementModeComponent;
  let fixture: ComponentFixture<ProcurementModeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcurementModeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProcurementModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

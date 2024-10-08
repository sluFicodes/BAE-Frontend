import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryServicesComponent } from './inventory-services.component';

describe('InventoryServicesComponent', () => {
  let component: InventoryServicesComponent;
  let fixture: ComponentFixture<InventoryServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InventoryServicesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InventoryServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

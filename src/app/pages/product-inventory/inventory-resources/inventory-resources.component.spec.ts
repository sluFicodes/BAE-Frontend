import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryResourcesComponent } from './inventory-resources.component';

describe('InventoryResourcesComponent', () => {
  let component: InventoryResourcesComponent;
  let fixture: ComponentFixture<InventoryResourcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InventoryResourcesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InventoryResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

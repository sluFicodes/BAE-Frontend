import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProductSpecComponent } from './update-product-spec.component';

describe('UpdateProductSpecComponent', () => {
  let component: UpdateProductSpecComponent;
  let fixture: ComponentFixture<UpdateProductSpecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateProductSpecComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateProductSpecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

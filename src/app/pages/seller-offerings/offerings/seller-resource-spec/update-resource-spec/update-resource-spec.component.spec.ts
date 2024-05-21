import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateResourceSpecComponent } from './update-resource-spec.component';

describe('UpdateResourceSpecComponent', () => {
  let component: UpdateResourceSpecComponent;
  let fixture: ComponentFixture<UpdateResourceSpecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateResourceSpecComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateResourceSpecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

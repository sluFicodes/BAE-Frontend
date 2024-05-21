import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateServiceSpecComponent } from './update-service-spec.component';

describe('UpdateServiceSpecComponent', () => {
  let component: UpdateServiceSpecComponent;
  let fixture: ComponentFixture<UpdateServiceSpecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateServiceSpecComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateServiceSpecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

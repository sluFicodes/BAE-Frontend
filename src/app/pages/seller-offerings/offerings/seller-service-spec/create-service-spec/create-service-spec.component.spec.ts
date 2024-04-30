import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateServiceSpecComponent } from './create-service-spec.component';

describe('CreateServiceSpecComponent', () => {
  let component: CreateServiceSpecComponent;
  let fixture: ComponentFixture<CreateServiceSpecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateServiceSpecComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateServiceSpecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

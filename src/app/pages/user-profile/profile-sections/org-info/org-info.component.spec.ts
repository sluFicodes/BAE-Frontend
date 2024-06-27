import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgInfoComponent } from './org-info.component';

describe('OrgInfoComponent', () => {
  let component: OrgInfoComponent;
  let fixture: ComponentFixture<OrgInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrgInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrgInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

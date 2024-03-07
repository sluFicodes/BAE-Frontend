import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreDomeComponent } from './explore-dome.component';

describe('ExploreDomeComponent', () => {
  let component: ExploreDomeComponent;
  let fixture: ComponentFixture<ExploreDomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExploreDomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExploreDomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

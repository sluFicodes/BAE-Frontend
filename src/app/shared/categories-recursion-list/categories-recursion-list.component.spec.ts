import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesRecursionListComponent } from './categories-recursion-list.component';

describe('CategoriesRecursionListComponent', () => {
  let component: CategoriesRecursionListComponent;
  let fixture: ComponentFixture<CategoriesRecursionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CategoriesRecursionListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CategoriesRecursionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

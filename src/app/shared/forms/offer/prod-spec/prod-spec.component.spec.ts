import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdSpecComponent } from './prod-spec.component';

describe('ProdSpecComponent', () => {
  let component: ProdSpecComponent;
  let fixture: ComponentFixture<ProdSpecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProdSpecComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProdSpecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

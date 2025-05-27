import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicesInfoComponent } from './invoices-info.component';

describe('InvoiceInfoComponent', () => {
  let component: InvoicesInfoComponent;
  let fixture: ComponentFixture<InvoicesInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoicesInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoicesInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkdownTextareaComponent } from './markdown-textarea.component';

describe('MarkdownTextareaComponent', () => {
  let component: MarkdownTextareaComponent;
  let fixture: ComponentFixture<MarkdownTextareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarkdownTextareaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MarkdownTextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

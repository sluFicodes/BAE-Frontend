import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MarkdownTextareaComponent} from "../../../markdown-textarea/markdown-textarea.component";
import {TranslateModule} from "@ngx-translate/core";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-price-component-drawer',
  standalone: true,
  templateUrl: './price-component-drawer.component.html',
  imports: [
    ReactiveFormsModule,
    MarkdownTextareaComponent,
    TranslateModule,
    NgClass
  ],
  styleUrl: './price-component-drawer.component.css'
})
export class PriceComponentDrawerComponent implements OnInit {
  @Input() component: any | null = null;
  @Output() close = new EventEmitter<any | null>();
  @Output() save = new EventEmitter<any>();

  isOpen = false;
  initialized = false;

  priceComponentForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initialized = false;
    setTimeout(() => {
      this.isOpen = true;
      this.initialized = true;
    }, 50);

    this.priceComponentForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      priceType: ['one-time', Validators.required],
      discountValue: [null],
      discountUnit: ['percentage'],
      discountDuration: [null],
      discountDurationUnit: ['days'],
      recurringPeriod: ['monthly'],
      usageUnit: ['']
    });

    if (this.component) {
      this.priceComponentForm.patchValue(this.component);
    }
  }

  submitForm() {
    if (this.priceComponentForm.valid) {
      this.save.emit(this.priceComponentForm.value);
      this.closeDrawer();
    }
  }

  closeDrawer() {
    this.isOpen = false;
    // If editing, do nothing; if creating, clear form
    setTimeout(() => this.close.emit(null), 500);
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscapeKey(event: KeyboardEvent) {
    event.stopPropagation();  // Prevent closing parent drawer
    this.closeDrawer();
  }
}

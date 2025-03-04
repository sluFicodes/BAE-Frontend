import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MarkdownTextareaComponent} from "../../../markdown-textarea/markdown-textarea.component";

@Component({
  selector: 'app-price-component-drawer',
  standalone: true,
  templateUrl: './price-component-drawer.component.html',
  imports: [
    ReactiveFormsModule,
    MarkdownTextareaComponent
  ],
  styleUrl: './price-component-drawer.component.css'
})
export class PriceComponentDrawerComponent implements OnInit {
  @Input() component: any | null = null;
  @Output() close = new EventEmitter<any | null>();

  priceComponentForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
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
      this.close.emit(this.priceComponentForm.value);
    }
  }

  closeWithoutSaving() {
    this.close.emit(null);
  }
}

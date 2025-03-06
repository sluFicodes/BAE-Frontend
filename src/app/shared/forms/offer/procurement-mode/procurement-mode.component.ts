import {AfterViewInit, ChangeDetectorRef, Component, forwardRef, Input, OnInit} from '@angular/core';
import {DatePipe, NgClass, NgIf, NgTemplateOutlet} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {initFlowbite} from "flowbite";

@Component({
  selector: 'app-procurement-mode',
  standalone: true,
  imports: [
    TranslateModule,
    NgIf,
    NgTemplateOutlet,
    ReactiveFormsModule,
    NgClass
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ProcurementModeComponent),
      multi: true
    }
  ],
  templateUrl: './procurement-mode.component.html',
  styleUrl: './procurement-mode.component.css'
})
export class ProcurementModeComponent implements ControlValueAccessor, AfterViewInit, OnInit {
  @Input() form!: AbstractControl;
  @Input() formType!: string;
    //PROCUREMENT
    procurementModes = [{
      id: 'manual',
      name: 'Manual'
    }, {
      id: 'payment-automatic',
      name: 'Payment Automatic - Procurement Manual'
    }, {
      id: 'automatic',
      name: 'Automatic'
    }];
    procurementMode: string = 'manual';

    get formGroup(): FormGroup {
      return this.form as FormGroup;  // Lo convierte en FormGroup
    }

    get idControl(): FormControl | null {
      const control = this.formGroup.get('id');
      return control instanceof FormControl ? control : null;
    }
  
    get nameControl(): FormControl | null {
      const control = this.formGroup.get('name');
      return control instanceof FormControl ? control : null;
    }
    

  constructor(
    private cdr: ChangeDetectorRef) {
  }

  // As ControlValueAccessor
  onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(pmode: any): void {
    this.procurementMode = pmode;
    this.onChange(pmode);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  ngOnInit() {
    this.formGroup.addControl('id', new FormControl<string>('manual'));
    this.formGroup.addControl('name', new FormControl<string>('Manual'));
  }

  ngAfterViewInit() {

    setTimeout(() => this.cdr.detectChanges(), 0);
  }

  changeProcurement(event: any) {
    this.procurementMode = event.target.value;
    let pm = this.procurementModes.find(mode => mode.id === event.target.value);
    this.formGroup.setValue({
      id: event.target.value,
      name: pm?.name
    });
    
  }

}

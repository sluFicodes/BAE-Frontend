import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {SharedModule} from "../../../shared.module";
import {MarkdownTextareaComponent} from "../../markdown-textarea/markdown-textarea.component";
import {StatusSelectorComponent} from "../../status-selector/status-selector.component";

@Component({
  selector: 'app-general-info-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SharedModule,
    MarkdownTextareaComponent,
    StatusSelectorComponent
  ],
  templateUrl: './general-info.component.html',
  styleUrl: './general-info.component.css'
})
export class GeneralInfoComponent implements OnInit {
  @Input() form!: AbstractControl;
  @Input() formType!: string;
  @Input() data: any;

  get formGroup(): FormGroup {
    return this.form as FormGroup;  // Lo convierte en FormGroup
  }

  get nameControl(): FormControl | null {
    const control = this.formGroup.get('name');
    return control instanceof FormControl ? control : null;
  }

  get descControl(): FormControl | null {
    const control = this.formGroup.get('description');
    return control instanceof FormControl ? control : null;
  }

  get versionControl(): FormControl | null {
    const control = this.formGroup.get('version');
    return control instanceof FormControl ? control : null;
  }

  get statusControl(): FormControl | null {
    const control = this.formGroup.get('status');
    return control instanceof FormControl ? control : null;
  }

  ngOnInit() {
    if (this.formType === 'update' && this.data) {
      this.formGroup.addControl('name', new FormControl<string>(this.data.name, [Validators.required, Validators.maxLength(100)]));
      this.formGroup.addControl('status', new FormControl<string>(this.data.lifecycleStatus));
      this.formGroup.addControl('description', new FormControl<string>(this.data.description));
      this.formGroup.addControl('version', new FormControl<string>(this.data.version, [Validators.required,Validators.pattern('^-?[0-9]\\d*(\\.\\d*)?$')]));
    } else {
      this.formGroup.addControl('name', new FormControl<string>('', [Validators.required, Validators.maxLength(100)]));
      this.formGroup.addControl('status', new FormControl<string>('Active'));
      this.formGroup.addControl('description', new FormControl<string>(''));
      this.formGroup.addControl('version', new FormControl<string>('0.1', [Validators.required,Validators.pattern('^-?[0-9]\\d*(\\.\\d*)?$')]));
    }
  }

  protected readonly FormControl = FormControl;
}

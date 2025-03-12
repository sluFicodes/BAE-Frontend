import {Component, Input, OnInit} from '@angular/core';
import {MarkdownTextareaComponent} from "../../markdown-textarea/markdown-textarea.component";
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {StatusSelectorComponent} from "../../status-selector/status-selector.component";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-license-form',
  standalone: true,
    imports: [
        MarkdownTextareaComponent,
        ReactiveFormsModule,
        TranslateModule
    ],
  templateUrl: './license.component.html',
  styleUrl: './license.component.css'
})
export class LicenseComponent implements OnInit {
  @Input() form!: AbstractControl;
  @Input() formType!: string;
  @Input() data: any;

  freeLicenseSelected: boolean = false;

  get formGroup(): FormGroup {
    return this.form as FormGroup;  // Lo convierte en FormGroup
  }

  get treatmentControl(): FormControl | null {
    const control = this.formGroup.get('treatment');
    return control instanceof FormControl ? control : null;
  }

  get descControl(): FormControl | null {
    const control = this.formGroup.get('description');
    return control instanceof FormControl ? control : null;
  }

  ngOnInit() {
    if (this.formType === 'update' && this.data) {
      console.log(this.data);
      //LICENSE
      if (Array.isArray(this.data.productOfferingTerm)) {
        this.formGroup.addControl('treatment', new FormControl<string>(this.data.productOfferingTerm[0].name));
        this.formGroup.addControl('description', new FormControl<string>(this.data.productOfferingTerm[0].description));
      } else {
        this.formGroup.addControl('treatment', new FormControl<string>(''));
        this.formGroup.addControl('description', new FormControl<string>(''));
      }
    } else {
      this.formGroup.addControl('treatment', new FormControl<string>(''));
      this.formGroup.addControl('description', new FormControl<string>(''));
    }
  }
}

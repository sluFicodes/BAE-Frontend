import { Component, Input, OnInit, forwardRef, ChangeDetectorRef } from '@angular/core';
import {
  ControlValueAccessor, FormArray,
  FormBuilder,
  FormGroup,
  NG_VALUE_ACCESSOR,
  Validators
} from '@angular/forms';
import {PricePlansTableComponent} from "./price-plans-table/price-plans-table.component";
import {TranslateModule} from "@ngx-translate/core";
import {PricePlanDrawerComponent} from "./price-plan-drawer/price-plan-drawer.component";
import { v4 as uuidv4 } from 'uuid';
import {pricePlanValidator} from "../../../../validators/validators";

@Component({
  selector: 'app-price-plans-form',
  standalone: true,
  templateUrl: './price-plans.component.html',
  styleUrl: './price-plans.component.css',
  imports: [
    PricePlansTableComponent,
    TranslateModule,
    PricePlanDrawerComponent
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PricePlansComponent),
      multi: true
    }
  ]
})
export class PricePlansComponent implements OnInit, ControlValueAccessor {
  @Input() form!: FormGroup;  // Recibe el formulario del padre
  @Input() prodSpec: any | null = null;  // Y con este se acceder a prodSpec

  pricePlansForm = this.fb.array<FormGroup>([], { validators: [] });

  pricePlans: any[] = [];
  selectedPricePlan: any | null = null;
  showDrawer = false;
  pricePlanForm!: FormGroup;  // This will be passed to the drawer
  action = 'create'; // What are we doing?

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.pricePlanForm = this.createPricePlanForm();

    // ✅ Get existing price plans from parent form
    const existingPlans = this.form.get('pricePlans')?.value || [];
    this.pricePlansForm = this.fb.array<FormGroup>(
      existingPlans.map((plan: any) => this.createPricePlanForm(plan))
    );

    // ✅ Sync the displayed list with the form array
    this.pricePlans = this.pricePlansForm.value;
  }

  private createPricePlanForm(plan: any = null): FormGroup {
    return this.fb.group(
      {
        id: [plan?.id || this.generateId()],
        href: [plan?.href || null],
        name: [
          plan?.name || '',
          { validators: [Validators.required] }
        ],
        description: [
          plan?.description || '',
          { validators: [Validators.required] }
        ],
        isBundle: [plan?.isBundle || false],
        lastUpdate: [plan?.lastUpdate || null],
        lifecycleStatus: [plan?.lifecycleStatus || 'Active'],
        paymentOnline: [plan?.paymentOnline ?? !!plan?.price],
        priceType: [plan?.priceType || 'custom'],
        prodSpecCharValueUse: [plan?.prodSpecCharValueUse || null],
        currency: [plan?.price?.unit || 'EUR'],
        unitOfMeasure: [plan?.unitOfMeasure || null],
        productProfile: plan?.productProfile ? plan.productProfile : this.mapProductProfile(plan?.prodSpecCharValueUse || []),
        priceComponents: [plan?.priceComponents || []],
        validFor: [plan?.validFor || null],
      },
      { validators: [pricePlanValidator] } // Custom validator
    );
  }

  private mapProductProfile(prodSpecCharValueUse: any[]): FormGroup {
    return this.fb.group({
      selectedValues: this.fb.array(
        prodSpecCharValueUse.map(spec =>
          this.fb.group({
            id: [spec.id],
            name: [spec.name],
            selectedValue: [
              spec.productSpecCharacteristicValue.find((v: { isDefault: boolean }) => v.isDefault)?.value || null,
              Validators.required
            ]
          })
        )
      )
    });
  }

  addPricePlan(plan?: any) {
    const pricePlanGroup = this.createPricePlanForm(plan);

    this.pricePlansForm.push(pricePlanGroup);
    this.syncPricePlans(); // ✅ Update the displayed list
  }

  removePricePlan(index: number) {
    if (index !== -1) {
      this.pricePlansForm.removeAt(index);
      this.syncPricePlans(); // ✅ Ensure list updates after removal
    }
  }

  savePricePlan(plan: any) {
    const index = this.pricePlansForm.controls.findIndex(p => p.value.id === this.selectedPricePlan?.value.id);

    if (index > -1) {
      this.pricePlansForm.at(index).patchValue(plan); // ✅ Update existing plan
    } else {
      this.addPricePlan(plan); // ✅ Add new plan
    }

    this.syncPricePlans();
    this.showDrawer = false;
    this.selectedPricePlan = null;
  }

  private generateId(): string {
    return `temp-id:${uuidv4()}`; // Generates a random ID
  }

  openPricePlanDrawer(plan: any = null) {
    if (plan) {
      console.log('📝 Editing existing price plan:', plan);

      // Buscar el FormGroup en pricePlansForm en base al ID del plan
      const index = this.pricePlansForm.controls.findIndex(p => p.value.id === plan.id);

      if (index !== -1) {
        this.selectedPricePlan = this.pricePlansForm.at(index) as FormGroup;
      } else {
        // Si no lo encuentra, creamos un nuevo FormGroup con los datos del plan
        this.selectedPricePlan = this.createPricePlanForm(plan);
      }

      this.action = 'edit';
    } else {
      console.log('➕ Creating a new price plan');
      this.action = 'create';
      this.selectedPricePlan = this.createPricePlanForm();
      this.pricePlansForm.push(this.selectedPricePlan);
    }

    this.showDrawer = true;
  }


  editPricePlan(plan: any) {
    console.log('Editing Price Plan:', plan);

    if (plan) {
      this.action = 'edit';
      this.selectedPricePlan = this.createPricePlanForm(plan);  // Ensure it's a FormGroup
    } else {
      this.action = 'create';
      this.selectedPricePlan = this.createPricePlanForm();  // Create a new one
    }
    this.cdr

    console.log('📝 Form after patching:', this.selectedPricePlan.value);
    this.cdr.detectChanges();
    this.showDrawer = true;
  }

  private syncPricePlans() {
    this.pricePlans = this.pricePlansForm.value;
    this.form.get('pricePlans')?.setValue(this.pricePlans); // ✅ Update parent form
    this.onChange(this.pricePlans);
  }

  // Métodos del ControlValueAccessor para conectar con `formControlName`
  onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: any): void {
    this.pricePlansForm.clear();
    value?.forEach((plan: any) => this.addPricePlan(plan));
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}

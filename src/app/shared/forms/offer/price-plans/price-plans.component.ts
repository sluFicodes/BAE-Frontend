import { Component, Input, OnInit, forwardRef } from '@angular/core';
import {ControlValueAccessor, FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {PricePlansTableComponent} from "./price-plans-table/price-plans-table.component";
import {TranslateModule} from "@ngx-translate/core";
import {PricePlanDrawerComponent} from "./price-plan-drawer/price-plan-drawer.component";

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
  pricePlans: any[] = [];
  selectedPricePlan: any | null = null;
  showDrawer = false;
  pricePlanForm!: FormGroup;  // This will be passed to the drawer

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    if (!this.form) {
      console.error('Error: the form is not defined in PricePlansComponent');
      return;
    }

    // Ensure the form has 'pricePlans' control
    if (!this.form.get('pricePlans')) {
      this.form.addControl('pricePlans', new FormControl([]));
    }

    // Initialize with existing data
    this.pricePlans = this.form.get('pricePlans')?.value || [];
    console.log('✅ pricePlans initialized:', this.pricePlans);

    // Create the form for the drawer
    this.pricePlanForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      paymentOnline: [false],
      priceType: ['custom', Validators.required],
      currency: ['EUR'], // Por defecto EUR
      productProfile: [null], // Selector de características
      priceComponents: [[]] // Lista de componentes de precio
    });

  }

  openPricePlanDrawer(plan: any = null) {
    this.selectedPricePlan = plan;

    if (plan) {
      this.pricePlanForm.patchValue(plan);  // Load existing data
    } else {
      this.pricePlanForm.reset();  // New price plan
    }

    this.showDrawer = true;
  }

  editPricePlan(plan: any) {
    this.selectedPricePlan = plan;
    this.showDrawer = true;
  }

  savePricePlan(plan: any) {
    const control = this.form.get('pricePlans');

    if (!control) {
      console.error('❌ Error: `pricePlans` FormControl does not exist!');
      return;
    }

    let currentPlans: any[] = Array.isArray(control.value) ? control.value : [];

    console.log('🔹 Current Plans before update:', currentPlans);

    if (this.selectedPricePlan) {
      // Update existing plan
      const index = currentPlans.findIndex((p: any) => p.id === this.selectedPricePlan.id);
      if (index > -1) {
        currentPlans[index] = plan;
      }
    } else {
      // Add new plan
      currentPlans = [...currentPlans, plan];
    }

    console.log('✅ Updated Plans:', currentPlans);


    control.setValue(currentPlans);
    this.pricePlans = currentPlans;
    this.onChange(this.pricePlans); // Notify Angular Forms

    this.showDrawer = false;
    this.selectedPricePlan = null;
  }

  deletePricePlan(id: string) {
    this.pricePlans = this.pricePlans.filter(plan => plan.id !== id);
    this.form.get('pricePlans')?.setValue([...this.pricePlans]);

    this.onChange(this.pricePlans); // Notify Angular Forms
  }

  // Métodos del ControlValueAccessor para conectar con `formControlName`
  onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: any): void {
    this.pricePlans = value || [];
    this.form.get('pricePlans')?.setValue(this.pricePlans);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}

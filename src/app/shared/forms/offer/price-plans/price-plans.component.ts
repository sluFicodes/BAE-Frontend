import { Component, Input, OnInit, forwardRef, ChangeDetectorRef } from '@angular/core';
import {
  ControlValueAccessor, FormArray,
  FormBuilder,
  FormGroup,
  NG_VALUE_ACCESSOR,
  Validators,
  FormControl
} from '@angular/forms';
import {PricePlansTableComponent} from "./price-plans-table/price-plans-table.component";
import {TranslateModule} from "@ngx-translate/core";
import {PricePlanDrawerComponent} from "./price-plan-drawer/price-plan-drawer.component";
import { v4 as uuidv4 } from 'uuid';
import {pricePlanValidator} from "../../../../validators/validators";
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-price-plans-form',
  standalone: true,
  templateUrl: './price-plans.component.html',
  styleUrl: './price-plans.component.css',
  imports: [
    PricePlansTableComponent,
    TranslateModule,
    PricePlanDrawerComponent,
    ReactiveFormsModule
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
  paymentOnline = false;  // Estado global del checkbox
  paymentOnlineControl = new FormControl({ value: false, disabled: false });

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
    
    // Set initial payment online state based on existing plans
    if (this.pricePlans.length > 0) {
      this.paymentOnline = this.pricePlans[0].paymentOnline;
      this.paymentOnlineControl.setValue(this.paymentOnline);
      this.paymentOnlineControl.disable();
    }
  }

  onPaymentOnlineChange(event: any) {
    // Solo permitir cambios si no hay price plans
    if (this.pricePlans.length === 0) {
      this.paymentOnline = event.target.checked;
      this.paymentOnlineControl.setValue(this.paymentOnline);
      this.cdr.detectChanges();
    }
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
        paymentOnline: [plan?.paymentOnline ?? this.paymentOnline],  // Use global state
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
    // Determinar el valor correcto de paymentOnline
    const paymentOnlineValue = plan?.paymentOnline ?? this.paymentOnline;

    const pricePlanGroup = this.createPricePlanForm({
      ...plan,
      paymentOnline: paymentOnlineValue
    });
    this.pricePlansForm.push(pricePlanGroup);
    this.syncPricePlans();
  }

  removePricePlan(index: number) {
    if (index !== -1) {
      this.pricePlansForm.removeAt(index);
      this.syncPricePlans();
      
      // Si se eliminaron todos los price plans, permitir cambiar el estado de payment online
      if (this.pricePlans.length === 0) {
        this.paymentOnline = false;
        this.paymentOnlineControl.setValue(false);
        this.paymentOnlineControl.enable();
        this.cdr.detectChanges();
      }
    }
  }

  savePricePlan(plan: any) {
    const index = this.pricePlansForm.controls.findIndex(p => p.getRawValue().id === this.selectedPricePlan?.getRawValue().id);

    // Determinar el valor correcto de paymentOnline
    const paymentOnlineValue = this.action === 'edit' 
      ? this.selectedPricePlan?.getRawValue().paymentOnline // Mantener el valor original para edición
      : this.paymentOnline; // Usar el valor global para nuevos planes

    // Asegurarse de que el plan mantenga el valor de paymentOnline correcto
    const updatedPlan = {
      ...plan,
      paymentOnline: paymentOnlineValue
    };

    if (index > -1) {
      this.pricePlansForm.at(index).patchValue(updatedPlan);
    } else {
      this.addPricePlan(updatedPlan);
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
      // Crear el nuevo price plan con el valor actual de paymentOnline
      this.selectedPricePlan = this.createPricePlanForm({
        paymentOnline: this.paymentOnline
      });
      this.pricePlansForm.push(this.selectedPricePlan);
    }

    this.showDrawer = true;
  }


  editPricePlan(plan: any) {
    console.log('Editing Price Plan:', plan);

    if (plan) {
      this.action = 'edit';
      // Mantener el valor de paymentOnline del plan original
      this.selectedPricePlan = this.createPricePlanForm({
        ...plan,
        paymentOnline: plan.paymentOnline // Asegurarse de mantener el valor original
      });
    } else {
      this.action = 'create';
      this.selectedPricePlan = this.createPricePlanForm({
        paymentOnline: this.paymentOnline // Usar el valor global para nuevos planes
      });
    }

    console.log('📝 Form after patching:', this.selectedPricePlan.value);
    this.cdr.detectChanges();
    this.showDrawer = true;
  }

  private syncPricePlans() {
    // Usar getRawValue() para incluir campos deshabilitados
    this.pricePlans = this.pricePlansForm.controls.map(control => control.getRawValue());
    this.form.get('pricePlans')?.setValue(this.pricePlans);
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

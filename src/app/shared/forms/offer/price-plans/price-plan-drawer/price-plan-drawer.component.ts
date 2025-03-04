import {Component, EventEmitter, Input, Output, OnInit, HostListener, SimpleChanges, OnChanges} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MarkdownTextareaComponent} from "../../../markdown-textarea/markdown-textarea.component";
import {TranslateModule} from "@ngx-translate/core";
import {NgClass, NgIf} from "@angular/common";
import {PriceComponentsTableComponent} from "../price-components-table/price-components-table.component";
import {PriceComponentDrawerComponent} from "../price-component-drawer/price-component-drawer.component";
import {currencies} from "currencies.json";


@Component({
  selector: 'app-price-plan-drawer',
  standalone: true,
  templateUrl: './price-plan-drawer.component.html',
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    NgClass,
    MarkdownTextareaComponent,
    NgIf,
    PriceComponentDrawerComponent,
    PriceComponentsTableComponent
  ],
  styleUrl: './price-plan-drawer.component.css'
})
export class PricePlanDrawerComponent implements OnInit {
  @Input() form!: FormGroup;  // Receive the parent form
  @Input() selectedPricePlan: any | null = null;
  @Output() save = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  isOpen = false;
  initialized = false;
  pricePlanForm!: FormGroup;
  showPriceComponentDrawer = false;
  editingComponent: any = null;
  protected readonly currencies = currencies;

  constructor() {}

  ngOnInit() {

    this.initialized = false; // Ensure we apply the initial transform
    setTimeout(() => {
      this.isOpen = true;
      this.initialized = true; // Allow animation to work
    }, 50);

    // Esto está por ver...
    // if (this.selectedPricePlan) {
    //  this.pricePlanForm.patchValue(this.selectedPricePlan);
    // }

    // set custom priceType if paymentOnline is false
    this.form.get('paymentOnline')?.valueChanges.subscribe(value => {
      if (!value) {
        this.form.get('priceType')?.setValue('custom');
      }
    });
  }

  savePricePlan() {
    if (this.form.invalid) return; // Prevent saving if invalid
    this.save.emit(this.form.value);  // Send form data back to parent
    this.closeDrawer();// Close drawer
  }

  closeForm() {
    this.save.emit();
  }

  openPriceComponentDrawer(component: any = null) {
    this.editingComponent = component;
    this.showPriceComponentDrawer = true;
  }

  closePriceComponentDrawer(updatedComponent: any | null) {
    if (updatedComponent) {
      const components = this.pricePlanForm.get('priceComponents')?.value || [];
      if (this.editingComponent) {
        // Editar componente existente
        const index = components.findIndex((c: { id: string }) => c.id === this.editingComponent.id);
        if (index > -1) {
          components[index] = updatedComponent;
        }
      } else {
        // Agregar nuevo componente
        components.push(updatedComponent);
      }
      this.pricePlanForm.get('priceComponents')?.setValue(components);
    }
    this.showPriceComponentDrawer = false;
    this.editingComponent = null;
  }

  editPriceComponent(component: any) {
    this.openPriceComponentDrawer(component);
  }

  deletePriceComponent(componentId: string) {
    const components = this.pricePlanForm.get('priceComponents')?.value || [];
    this.pricePlanForm.get('priceComponents')?.setValue(
      components.filter((c: { id: string }) => c.id !== componentId)
    );
  }

  get pricePlanTranslationKey(): string {
    return this.selectedPricePlan ? 'FORMS.PRICE_PLANS._edit_price_plan' : 'FORMS.PRICE_PLANS._new_price_plan';
  }

  closeDrawer() {
    this.isOpen = false;
    setTimeout(() => this.close.emit(), 1000); // Delay closing to match animation
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscapeKey(event: KeyboardEvent) {
    this.closeDrawer();
  }

}

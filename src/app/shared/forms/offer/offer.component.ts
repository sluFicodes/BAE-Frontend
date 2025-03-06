import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {GeneralInfoComponent} from "./general-info/general-info.component";
import {TranslateModule} from "@ngx-translate/core";
import {ProdSpecComponent} from "./prod-spec/prod-spec.component";
import {NgClass, NgIf} from "@angular/common";
import {ApiServiceService} from "../../../services/product-service.service";
import {CategoryComponent} from "./category/category.component";
import {LicenseComponent} from "./license/license.component";
import {PricePlansComponent} from "./price-plans/price-plans.component";

@Component({
  selector: 'app-offer-form',
  standalone: true,
  imports: [
    GeneralInfoComponent,
    TranslateModule,
    ProdSpecComponent,
    NgIf,
    ReactiveFormsModule,
    CategoryComponent,
    LicenseComponent,
    PricePlansComponent,
    NgClass
  ],
  templateUrl: './offer.component.html',
  styleUrl: './offer.component.css'
})
export class OfferComponent implements OnInit{

  @Input() formType: 'create' | 'update' = 'create';
  @Input() offer: any = {};
  @Input() partyId: any;

  productOfferForm: FormGroup;
  currentStep = 0;
  steps = [
    'General Info',
    'Product Specification',
    'Category',
    'License',
    'Price Plans',
    'Procurement Mode',
    'Replication & Visibility',
    'Summary'
  ];
  isFormValid = false;
  selectedProdSpec: any;
  pricePlans:any = [];

  constructor(private api: ApiServiceService,
              private fb: FormBuilder) {
    this.productOfferForm = this.fb.group({
      generalInfo: this.fb.group({}),
      prodSpec: new FormControl(null),
      category: new FormControl([]),
      license: this.fb.group({}),
      pricePlans: new FormControl([]),
      procurementMode: this.fb.group({}),
      replicationMode: this.fb.group({})
    });

    // Suscribirse a cambios en la validación
    this.productOfferForm.statusChanges.subscribe(status => {
      this.isFormValid = status === 'VALID';
    });
  }

  goToStep(index: number) {
    this.currentStep = index;
  }

  submitForm() {
    console.log(this.productOfferForm.value);
  }

  async ngOnInit() {
    if (this.formType === 'update' && this.offer) {
      await this.loadOfferData();
    }

  }
  async loadOfferData() {
    console.log('Loading offer into form...', this.offer);

    // Product Specification
    if (this.offer.productSpecification) {
      await this.api.getProductSpecification(this.offer.productSpecification.id).then(async data => {
        this.selectedProdSpec = data;
      })
      this.productOfferForm.patchValue({
        prodSpec: this.selectedProdSpec || null // Cargar si existe, o dejar en null
      });
    }

    // Price Plans
    if (Array.isArray(this.offer.productOfferingPrice) && this.offer.productOfferingPrice.length > 0) {
     for (let pop of this.offer.productOfferingPrice) {
       const pricePlan = await this.api.getOfferingPrice(pop.id);
       this.pricePlans.push(pricePlan);
     }
     console.log('Price Plans existentes: ', this.pricePlans);
      this.productOfferForm.patchValue({
        pricePlans: this.pricePlans || null // Cargar si existe, o dejar en null
      });
    }
  }
}

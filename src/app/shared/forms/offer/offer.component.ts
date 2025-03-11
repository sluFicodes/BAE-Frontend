import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {GeneralInfoComponent} from "./general-info/general-info.component";
import {TranslateModule} from "@ngx-translate/core";
import {ProdSpecComponent} from "./prod-spec/prod-spec.component";
import {NgClass, NgIf} from "@angular/common";
import {ApiServiceService} from "../../../services/product-service.service";
import {CategoryComponent} from "./category/category.component";
import {LicenseComponent} from "./license/license.component";
import {PricePlansComponent} from "./price-plans/price-plans.component";
import {CatalogueComponent} from "./catalogue/catalogue.component";
import {ProcurementModeComponent} from "./procurement-mode/procurement-mode.component"
import {ReplicationVisibilityComponent} from "./replication-visibility/replication-visibility.component"
import { lastValueFrom } from 'rxjs';
import {components} from "src/app/models/product-catalog";
import {EventMessageService} from "src/app/services/event-message.service";

type ProductOffering_Create = components["schemas"]["ProductOffering_Create"];
type ProductOfferingPrice = components["schemas"]["ProductOfferingPrice"]
 
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
    CatalogueComponent,
    ProcurementModeComponent,
    ReplicationVisibilityComponent,
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
    'Catalogue',
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

  errorMessage:any='';
  showError:boolean=false;
  bundleChecked:boolean=false;
  offersBundle:any[]=[];

  offerToCreate:ProductOffering_Create | undefined;

  constructor(private api: ApiServiceService,
              private eventMessage: EventMessageService,
              private fb: FormBuilder) {
    this.productOfferForm = this.fb.group({
      generalInfo: this.fb.group({}),
      prodSpec: new FormControl(null),
      catalogue: new FormControl(null),
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
    this.createOffer();
  }

  async ngOnInit() {
    if (this.formType === 'update' && this.offer) {
      await this.loadOfferData();
      this.steps = [
        'General Info',
        'Product Specification',
        //'Catalogue',
        'Category',
        'License',
        'Price Plans',
        'Procurement Mode',
        'Replication & Visibility',
        'Summary'
      ];
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

    //CATEGORIES
    if(this.offer.category){
      this.productOfferForm.patchValue({
        category: this.offer.category || null // Cargar si existe, o dejar en null
      });
    }

    //LICENSE
    if(this.offer.productOfferingTerm){
      this.productOfferForm.patchValue({
        license: {
          treatment: this.offer.productOfferingTerm[0].name,
          description: this.offer.productOfferingTerm[0].description
        }
      });

      //PROCUREMENT
      this.offer.productOfferingTerm.forEach((term: any) => {
        if(term.name == 'procurement') {
          this.productOfferForm.patchValue({
            procurementMode: {
              treatment: term.name,
              description: term.description
            }
          });
        }
      })
    }

    // Price Plans
    if (Array.isArray(this.offer.productOfferingPrice) && this.offer.productOfferingPrice.length > 0) {
     for (let pop of this.offer.productOfferingPrice) {
       const pricePlan = await this.api.getOfferingPrice(pop.id);
       let priceInfo: any = {
        id: pricePlan.id,
        name: pricePlan.name,
        description: pricePlan.description,
        lifecycleStatus: pricePlan.lifecycleStatus,
        paymentOnline: pricePlan?.paymentOnline ?? !!pricePlan?.bundledPopRelationship        
      }
      if(pricePlan.priceType){
        priceInfo.priceType=pricePlan.priceType;
      }
      if(pricePlan.prodSpecCharValueUse){
        priceInfo.selectedCharacteristic=pricePlan.prodSpecCharValueUse;
      }
      if(pricePlan?.price?.unit){
        priceInfo.currency=pricePlan?.price?.unit
      }  
      if(pricePlan.bundledPopRelationship){
      let relatedPrices:any[] = [];
      for(let i=0;i<pricePlan.bundledPopRelationship.length;i++){
        await this.api.getOfferingPrice(pricePlan.bundledPopRelationship[i].id).then(data => {
          relatedPrices.push({
            id:data.id,
            href:data.href,
            name:data?.name,
            description:data?.description,
            isBundle:data?.isBundle,
            priceType:data?.priceType,
            lastUpdate:data?.lastUpdate,
            lifecycleStatus:data?.lifecycleStatus,
            paymentOnline: data?.paymentOnline ?? !!data?.bundledPopRelationship,
            selectedCharacteristic: data?.prodSpecCharValueUse || null,
            currency: data?.price?.unit || 'EUR',
            unitOfMeasure: data?.unitOfMeasure?.units || null,
            recurringPeriod: data?.recurringChargePeriodType || 'monthly',
            productProfile: this.mapProductProfile(data?.prodSpecCharValueUse || []),
            price: data?.price?.value,
            validFor: data?.validFor || null,
          })
          if(data?.price?.unit){
            priceInfo.currency=data?.price?.unit
          }
        })
      }
      priceInfo.priceComponents=relatedPrices;
      }
      if(pricePlan.priceType=='usage'){
        priceInfo.usageUnit=pricePlan.unitOfMeasure
      }
      console.log('info del price plan recogido----')
      console.log(pricePlan)
      if(pricePlan.priceType=='recurring' || pricePlan.priceType=='recurring-prepaid'){
        priceInfo.recurringPeriod=pricePlan.recurringChargePeriodType
      }

      this.pricePlans.push(priceInfo);
     }
     console.log('Price Plans existentes: ', this.pricePlans);

    this.productOfferForm.patchValue({
      pricePlans: this.pricePlans // Cargar si existe, o dejar en null
    });
    }
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

  async createOffer(){

    if(this.productOfferForm.value.pricePlans.length>0){
      for(let i=0; i < this.productOfferForm.value.pricePlans.length; i++){
        let bundleCompsCheck=[];
        if(this.productOfferForm.value.pricePlans[i].priceComponents){
          bundleCompsCheck=this.productOfferForm.value.pricePlans[i].priceComponents
        }
        console.log(bundleCompsCheck)
        if(bundleCompsCheck.length>0){
          let components=this.productOfferForm.value.pricePlans[i].priceComponents;
          let compRel:any[]=[];
          if(components != undefined){
            for(let j=0;j<components.length;j++){
              //Creating price component
              let priceCompToCreate: ProductOfferingPrice = {        
                name: components[j].name,
                description: components[j].description,
                lifecycleStatus: components[j].lifecycleStatus,
                priceType: components[j].priceType,
                price: {
                  unit: this.productOfferForm.value.pricePlans[i].currency,
                  value: components[j]?.price
                }
              }
              if(components[j].priceType=='recurring'){
                priceCompToCreate.recurringChargePeriodType=components[j].recurringPeriod;
                //Set to 1 by default so monthly will be every 1 month, daily every day, and so on.
                priceCompToCreate.recurringChargePeriodLength=1;
              }
              if(components[j].priceType=='recurring-prepaid'){
                priceCompToCreate.recurringChargePeriodType=components[j].recurringPeriod;
                //Set to 1 by default so monthly will be every 1 month, daily every day, and so on.
                priceCompToCreate.recurringChargePeriodLength=1;
              }
              if(components[j].priceType=='usage'){
                priceCompToCreate.unitOfMeasure=components[j].unitOfMeasure
              }
              if(components[j].prodSpecCharValueUse){
                priceCompToCreate.prodSpecCharValueUse=components[j].prodSpecCharValueUse
              }
              if(components[j].unitOfMeasure){
                priceCompToCreate.unitOfMeasure=components[j].unitOfMeasure
              }
              let priceAlterations = components[j].popRelationship;
              if(priceAlterations != undefined){
                //Creating price alteration
                let priceAlterToCreate: ProductOfferingPrice ={
                  name: priceAlterations[0]?.name,
                  priceType: priceAlterations[0]?.priceType,
                  validFor: priceAlterations[0]?.validFor,
                }
                if(priceAlterations[0].percentage){
                  priceAlterToCreate.percentage = priceAlterations[0]?.percentage;
                } else {
                  priceAlterToCreate.price = priceAlterations[0]?.price;
                }
                try{
                  let priceAlterCreated = await lastValueFrom(this.api.postOfferingPrice(priceAlterToCreate))
                  console.log('price Alteration')
                  console.log(priceAlterCreated)
                  priceCompToCreate.popRelationship=[{
                    id: priceAlterCreated.id,
                    href: priceAlterCreated.id,
                    name: priceAlterCreated.name
                  }]
                } catch (error:any) {
                  console.error('There was an error while creating offers price!', error);
                  if(error.error.error){
                    console.log(error)
                    this.errorMessage='Error: '+error.error.error;
                  } else {
                    this.errorMessage='There was an error while creating offers price!';
                  }
                  this.showError=true;
                  setTimeout(() => {
                    this.showError = false;
                  }, 3000);     
                }
              }
              try{
                let priceCompCreated = await lastValueFrom(this.api.postOfferingPrice(priceCompToCreate))
                compRel.push({
                  id: priceCompCreated.id,
                  href: priceCompCreated.id,
                  name: priceCompCreated.name
                }) 
                console.log('componente')
                console.log(priceCompCreated)
              } catch (error:any) {
                console.error('There was an error while creating offers price!', error);
                if(error.error.error){
                  console.log(error)
                  this.errorMessage='Error: '+error.error.error;
                } else {
                  this.errorMessage='There was an error while creating offers price!';
                }
                this.showError=true;
                setTimeout(() => {
                  this.showError = false;
                }, 3000);     
              }
            }
            //Creating price plan
            let priceToCreate: ProductOfferingPrice = {
              name: this.productOfferForm.value.pricePlans[i].name,
              isBundle: true,
              description: this.productOfferForm.value.pricePlans[i].description,
              lifecycleStatus: this.productOfferForm.value.pricePlans[i].lifecycleStatus,
              bundledPopRelationship: compRel
            }
            if(this.productOfferForm.value.pricePlans[i].prodSpecCharValueUse){
              priceToCreate.prodSpecCharValueUse=this.productOfferForm.value.pricePlans[i].prodSpecCharValueUse
            }
            if(this.productOfferForm.value.pricePlans[i].unitOfMeasure){
              priceToCreate.unitOfMeasure=this.productOfferForm.value.pricePlans[i].unitOfMeasure
            }
            try{
              let pricePlanCreated = await lastValueFrom(this.api.postOfferingPrice(priceToCreate))
              console.log('precio')
              console.log(pricePlanCreated)
              this.productOfferForm.value.pricePlans[i].id=pricePlanCreated.id;
              if(i==this.productOfferForm.value.pricePlans.length-1){
                this.saveOfferInfo();
              }
            } catch (error:any){
              console.error('There was an error while creating offers price!', error);
              if(error.error.error){
                console.log(error)
                this.errorMessage='Error: '+error.error.error;
              } else {
                this.errorMessage='There was an error while creating offers price!';
              }
              this.showError=true;
              setTimeout(() => {
                this.showError = false;
              }, 3000);
            }
        }
        }else{  
          //Not bundled price plan        
          let priceToCreate: ProductOfferingPrice = {
            name: this.productOfferForm.value.pricePlans[i].name,
            isBundle: false,
            description: this.productOfferForm.value.pricePlans[i].description,
            lifecycleStatus: this.productOfferForm.value.pricePlans[i].lifecycleStatus,
            priceType: this.productOfferForm.value.pricePlans[i].priceType,   
          }
          if(this.productOfferForm.value.pricePlans[i].priceType!='custom'){
            priceToCreate.price= {
              unit: this.productOfferForm.value.pricePlans[i]?.currency,
              value: this.productOfferForm.value.pricePlans[i]?.price
            }
          }
          if(this.productOfferForm.value.pricePlans[i].priceType=='recurring'){
            priceToCreate.recurringChargePeriodType=this.productOfferForm.value.pricePlans[i].recurringPeriod;
            priceToCreate.recurringChargePeriodLength=1;
          }
          if(this.productOfferForm.value.pricePlans[i].priceType=='recurring-prepaid'){
            priceToCreate.recurringChargePeriodType=this.productOfferForm.value.pricePlans[i].recurringPeriod;
            priceToCreate.recurringChargePeriodLength=1;
          }
          if(this.productOfferForm.value.pricePlans[i].priceType=='usage'){
            priceToCreate.unitOfMeasure=this.productOfferForm.value.pricePlans[i].unitOfMeasure
          }
          if(this.productOfferForm.value.pricePlans[i].prodSpecCharValueUse){
            priceToCreate.prodSpecCharValueUse=this.productOfferForm.value.pricePlans[i].prodSpecCharValueUse;
          }
          if(this.productOfferForm.value.pricePlans[i].unitOfMeasure){
            priceToCreate.unitOfMeasure=this.productOfferForm.value.pricePlans[i].unitOfMeasure
          }
          try{
            let createdPrices = await lastValueFrom(this.api.postOfferingPrice(priceToCreate))
            console.log('precio')
            console.log(createdPrices)
            this.productOfferForm.value.pricePlans[i].id=createdPrices.id;
            if(i==this.productOfferForm.value.pricePlans.length-1){
              this.saveOfferInfo();
            }
          } catch (error:any){
            console.error('There was an error while creating offers price!', error);
            if(error.error.error){
              console.log(error)
              this.errorMessage='Error: '+error.error.error;
            } else {
              this.errorMessage='There was an error while creating offers price!';
            }
            this.showError=true;
            setTimeout(() => {
              this.showError = false;
            }, 3000);
          }
        }
      }
    } else {
      //this.createdPrices=[];
      this.saveOfferInfo();
    }
    console.log(this.offerToCreate)
  }

  saveOfferInfo(){
    let offercats = [];
    let offerprices = [];
    for(let i = 0; i < this.productOfferForm.value.category.length; i++){
      offercats.push({
        id: this.productOfferForm.value.category[i].id,
        href: this.productOfferForm.value.category[i].id
      })
    }
    for(let i = 0; i < this.productOfferForm.value.pricePlans.length; i++){
      offerprices.push({
        id: this.productOfferForm.value.pricePlans[i].id,
        href: this.productOfferForm.value.pricePlans[i].id
      })
    }
    this.offerToCreate={
      name: this.productOfferForm.value.generalInfo.name,
      description: this.productOfferForm.value.generalInfo.description != null ? this.productOfferForm.value.generalInfo.description : '',
      lifecycleStatus: this.formType == 'update' ? this.productOfferForm.value.generalInfo.description : "Active",
      isBundle: this.bundleChecked,
      bundledProductOffering: this.offersBundle,
      place: [],
      version: this.productOfferForm.value.generalInfo.version,
      category: offercats,
      productOfferingPrice: offerprices,
      validFor: {
        startDateTime: (new Date()).toISOString()
      },
    }
    if(!this.bundleChecked && this.formType=='create'){
      this.offerToCreate.productSpecification = {
        id: this.productOfferForm.value.prodSpec.id,
        href: this.productOfferForm.value.prodSpec.href
      }
    }
    if(this.productOfferForm.value.license.treatment!=''){
      this.offerToCreate.productOfferingTerm= [
        {
            name: this.productOfferForm.value.license.treatment,
            description: this.productOfferForm.value.license.description,
            validFor: {}
        }
      ]
    } else {
      this.offerToCreate.productOfferingTerm = [
        {
            name: '',
            description: '',
            validFor: {}
        }
      ]        
    }

    this.offerToCreate.productOfferingTerm.push({
      name: 'procurement',
      description: this.productOfferForm.value.procurementMode.id,
    })

    if(this.formType=='create'){
      this.api.postProductOffering(this.offerToCreate,this.productOfferForm.value.catalogue.id).subscribe({
        next: data => {
          console.log('product offer created:')
          console.log(data)
          this.goBack();
        },
        error: error => {
          console.error('There was an error while creating the offer!', error);
          if(error.error.error){
            console.log(error)
            this.errorMessage='Error: '+error.error.error;
          } else {
            this.errorMessage='There was an error while creating the offer!';
          }
          this.showError=true;
          setTimeout(() => {
            this.showError = false;
          }, 3000);
        }
      });
    } else {
      this.api.updateProductOffering(this.offerToCreate,this.offer.id).subscribe({
        next: data => {
          console.log('product offer created:')
          console.log(data)
          this.goBack();
        },
        error: error => {
          console.error('There was an error while updating!', error);
          if(error.error.error){
            console.log(error)
            this.errorMessage='Error: '+error.error.error;
          } else {
            this.errorMessage='There was an error while updating the offer!';
          }
          this.showError=true;
          setTimeout(() => {
            this.showError = false;
          }, 3000);
        }
      });
    }


  }

  goBack() {
    this.eventMessage.emitSellerOffer(true);
  }
  
}

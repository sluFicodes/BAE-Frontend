import { Component, OnInit, ChangeDetectorRef, HostListener, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {components} from "src/app/models/product-catalog";
import { environment } from 'src/environments/environment';
import { ApiServiceService } from 'src/app/services/product-service.service';
import { ProductSpecServiceService } from 'src/app/services/product-spec-service.service';
import {LocalStorageService} from "src/app/services/local-storage.service";
import {EventMessageService} from "src/app/services/event-message.service";
import {AttachmentServiceService} from "src/app/services/attachment-service.service";
import { ServiceSpecServiceService } from 'src/app/services/service-spec-service.service';
import { ResourceSpecServiceService } from 'src/app/services/resource-spec-service.service';
import { LoginInfo } from 'src/app/models/interfaces';
import { initFlowbite } from 'flowbite';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { countries } from 'src/app/models/country.const'
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { certifications } from 'src/app/models/certification-standards.const'
import * as moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { currencies } from 'currencies.json';

type ProductOffering_Create = components["schemas"]["ProductOffering_Create"];
type BundledProductOffering = components["schemas"]["BundledProductOffering"];
type ProductOfferingPriceRefOrValue = components["schemas"]["ProductOfferingPriceRefOrValue"];
type ProductOfferingPrice = components["schemas"]["ProductOfferingPrice"]


@Component({
  selector: 'create-offer',
  templateUrl: './create-offer.component.html',
  styleUrl: './create-offer.component.css'
})
export class CreateOfferComponent implements OnInit {

  //PAGE SIZES:
  PROD_SPEC_LIMIT: number = environment.PROD_SPEC_LIMIT;
  PRODUCT_LIMIT: number = environment.PRODUCT_LIMIT;
  CATALOG_LIMIT: number= environment.CATALOG_LIMIT;

  //CONTROL VARIABLES:
  showGeneral:boolean=true;
  showBundle:boolean=false;
  showSummary:boolean=false;
  showProdSpec:boolean=false;
  showCatalog:boolean=false;
  showCategory:boolean=false;
  showLicense:boolean=false;
  showSLA:boolean=false;
  showPrice:boolean=false;

  //Check if step was done
  generalDone:boolean=false;
  bundleDone:boolean=false;
  prodSpecDone:boolean=false;
  catalogsDone:boolean=false;
  categoriesDone:boolean=false;
  licenseDone:boolean=false;
  slaDone:boolean=false;
  priceDone:boolean=false;

  stepsElements:string[]=['general-info','bundle','prodspec','catalog','category','license','sla','price','summary'];
  stepsCircles:string[]=['general-circle','bundle-circle','prodspec-circle','catalog-circle','category-circle','license-circle','sla-circle','price-circle','summary-circle'];

  showPreview:boolean=false;
  showEmoji:boolean=false;
  description:string='';  
  partyId:any='';

  //OFFER GENERAL INFO:
  generalForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    version: new FormControl('0.1', [Validators.required,Validators.pattern('^-?[0-9]\\d*(\\.\\d*)?$')]),
    description: new FormControl(''),
  });

  //BUNDLE INFO:
  bundleChecked:boolean=false;
  bundlePage=0;
  bundlePageCheck:boolean=false;
  loadingBundle:boolean=false;
  loadingBundle_more:boolean=false;
  bundledOffers:any[]=[];
  //final selected products inside bundle
  offersBundle:BundledProductOffering[]=[];

  //PROD SPEC INFO:
  prodSpecPage=0;
  prodSpecPageCheck:boolean=false;
  loadingProdSpec:boolean=false;
  loadingProdSpec_more:boolean=false;
  selectedProdSpec:any={id:''};
  prodSpecs:any[]=[];

  //CATALOG INFO:
  catalogPage=0;
  catalogPageCheck:boolean=false;
  loadingCatalog:boolean=false;
  loadingCatalog_more:boolean=false;
  selectedCatalog:any={id:''};
  catalogs:any[]=[];

  //CATEGORIES
  categoryPage=0;
  categoryPageCheck:boolean=false;
  loadingCategory:boolean=false;
  loadingCategory_more:boolean=false;
  selectedCategories:any[]=[];
  unformattedCategories:any[]=[];
  categories:any[]=[];

  //LICENSE
  freeLicenseSelected:boolean=true;
  licenseForm = new FormGroup({
    treatment: new FormControl('', [Validators.required]),
    description: new FormControl(''),
  });
  licenseDescription:string='';
  createdLicense:any={
    treatment: '',
    description: ''
  };

  //SLA
  createdSLAs:any[]=[];
  availableSLAs:any[]=['UPDATES RATE', 'RESPONSE TIME', 'DELAY'];
  showCreateSLA:boolean=false;
  updatesSelected:boolean=true;
  responseSelected:boolean=false;
  delaySelected:boolean=false;
  creatingSLA:any={type:'UPDATES RATE',description:'Expected number of updates in the given period.',threshold:'',unitMeasure:'day'}

  //PRICE
  currencies=currencies;
  createdPrices:ProductOfferingPriceRefOrValue[]=[];
  postedPrices:any[]=[];
  creatingPrice:any;
  priceDescription:string='';
  showCreatePrice:boolean=false;
  toggleOpenPrice:boolean=false;
  oneTimeSelected:boolean=true;
  recurringSelected:boolean=false;
  selectedPeriod:any='DAILY';
  selectedPeriodAlter:any='DAILY';
  usageSelected:boolean=false;
  customSelected:boolean=false;
  priceForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    price: new FormControl('', [Validators.required]),
    description: new FormControl(''),
  });
  priceAlterForm = new FormGroup({
    price: new FormControl('', [Validators.required]),
    condition: new FormControl(''),
    description: new FormControl(''),
  });
  selectedPriceUnit:any=currencies[0].code;
  priceTypeAlter:any='ONE TIME';
  priceComponentSelected:boolean=false;
  discountSelected:boolean=false;
  noAlterSelected:boolean=true;
  errorMessage:any='';
  showError:boolean=false;

  //FINAL OFFER USING API CALL STRUCTURE
  offerToCreate:ProductOffering_Create | undefined;

  @ViewChild('updatemetric') updatemetric!: ElementRef;
  @ViewChild('responsemetric') responsemetric!: ElementRef;
  @ViewChild('delaymetric') delaymetric!: ElementRef;
  @ViewChild('usageUnit') usageUnit!: ElementRef;
  @ViewChild('usageUnitAlter') usageUnitAlter!: ElementRef;  

  constructor(
    private router: Router,
    private api: ApiServiceService,
    private prodSpecService: ProductSpecServiceService,
    private cdr: ChangeDetectorRef,
    private localStorage: LocalStorageService,
    private eventMessage: EventMessageService,
    private elementRef: ElementRef,
    private attachmentService: AttachmentServiceService,
    private servSpecService: ServiceSpecServiceService,
    private resSpecService: ResourceSpecServiceService,
  ) {
    this.eventMessage.messages$.subscribe(ev => {
      if(ev.type === 'CategoryAdded') {
        this.addCategory(ev.value);
      }
      if(ev.type === 'ChangedSession') {
        this.initPartyInfo();
      }
    })
  }

  @HostListener('document:click')
  onClick() {
    if(this.showEmoji==true){
      this.showEmoji=false;
      this.cdr.detectChanges();
    }
  }

  ngOnInit() {
    this.initPartyInfo();
  }

  initPartyInfo(){
    let aux = this.localStorage.getObject('login_items') as LoginInfo;
    if(JSON.stringify(aux) != '{}' && (((aux.expire - moment().unix())-4) > 0)) {
      if(aux.logged_as==aux.id){
        this.partyId = aux.partyId;
      } else {
        let loggedOrg = aux.organizations.find((element: { id: any; }) => element.id == aux.logged_as)
        this.partyId = loggedOrg.partyId
      }
    }
  }

  goBack() {
    this.eventMessage.emitSellerOffer(true);
  }

  toggleGeneral(){
    this.selectStep('general-info','general-circle');
    this.showBundle=false;
    this.showGeneral=true;
    this.showSummary=false;
    this.showProdSpec=false;
    this.showCatalog=false;
    this.showCategory=false;
    this.showLicense=false;
    this.showSLA=false;
    this.showPrice=false;
  }

  toggleBundle(){
    this.selectStep('bundle','bundle-circle');
    this.showBundle=true;
    this.showGeneral=false;
    this.showSummary=false;
    this.showProdSpec=false;
    this.showCatalog=false;
    this.showCategory=false;
    this.showLicense=false;
    this.showSLA=false;
    this.showPrice=false;
  }

  toggleBundleCheck(){
    this.bundledOffers=[];
    this.bundlePage=0;
    this.bundleChecked=!this.bundleChecked;
    if(this.bundleChecked==true){
      this.loadingBundle=true;
      this.getSellerOffers();
    } else {
      this.offersBundle=[];
    }
  }

  toggleProdSpec(){
    this.prodSpecs=[];
    this.prodSpecPage=0;
    this.loadingProdSpec=true;
    this.getSellerProdSpecs();
    this.selectStep('prodspec','prodspec-circle');
    this.showBundle=false;
    this.showGeneral=false;
    this.showSummary=false;
    this.showProdSpec=true;
    this.showCatalog=false;
    this.showCategory=false;
    this.showLicense=false;
    this.showSLA=false;
    this.showPrice=false;
  }

  toggleCatalogs(){
    this.catalogs=[];
    this.catalogPage=0;
    this.loadingCatalog=true;
    this.getSellerCatalogs();
    this.selectStep('catalog','catalog-circle');
    this.showBundle=false;
    this.showGeneral=false;
    this.showSummary=false;
    this.showProdSpec=false;
    this.showCatalog=true;
    this.showCategory=false;
    this.showLicense=false;
    this.showSLA=false;
    this.showPrice=false;
  }

  toggleCategories(){
    this.categories=[];
    this.loadingCategory=true;
    this.getCategories();
    console.log('CATEGORIES FORMATTED')
    console.log(this.categories)
    this.selectStep('category','category-circle');
    this.showBundle=false;
    this.showGeneral=false;
    this.showSummary=false;
    this.showProdSpec=false;
    this.showCatalog=false;
    this.showCategory=true;
    this.showLicense=false;
    this.showSLA=false;
    this.showPrice=false;
  }

  toggleLicense(){
    this.selectStep('license','license-circle');
    this.showBundle=false;
    this.showGeneral=false;
    this.showSummary=false;
    this.showProdSpec=false;
    this.showCatalog=false;
    this.showCategory=false;
    this.showLicense=true;
    this.showSLA=false;
    this.showPrice=false;
  }

  toggleSLA(){
    this.saveLicense();
    this.selectStep('sla','sla-circle');
    this.showBundle=false;
    this.showGeneral=false;
    this.showSummary=false;
    this.showProdSpec=false;
    this.showCatalog=false;
    this.showCategory=false;
    this.showLicense=false;
    this.showSLA=true;
    this.showPrice=false;
  }

  togglePrice(){
    this.saveLicense();
    this.selectStep('price','price-circle');
    this.showBundle=false;
    this.showGeneral=false;
    this.showSummary=false;
    this.showProdSpec=false;
    this.showCatalog=false;
    this.showCategory=false;
    this.showLicense=false;
    this.showSLA=false;
    this.showPrice=true; 
  }

  saveLicense(){
    if(this.licenseForm.value.treatment){
      this.createdLicense={
        treatment: this.licenseForm.value.treatment,
        description: this.licenseForm.value.description != '' ? this.licenseForm.value.description : ''
      };
    } 

  }

  onPriceTypeSelected(event: any){
    if(event.target.value=='ONE TIME'){
      this.oneTimeSelected=true;
      this.recurringSelected=false;
      this.usageSelected=false;
      this.customSelected=false;
    } else if (event.target.value=='RECURRING'){
      this.oneTimeSelected=false;
      this.recurringSelected=true;
      this.usageSelected=false;
      this.customSelected=false;
    } else if (event.target.value=='USAGE'){
      this.oneTimeSelected=false;
      this.recurringSelected=false;
      this.usageSelected=true;
      this.customSelected=false;
    } else if (event.target.value=='CUSTOM'){
      this.oneTimeSelected=false;
      this.recurringSelected=false;
      this.usageSelected=false;
      this.customSelected=true;
    }
  }

  onPriceTypeAlterSelected(event: any){
    this.priceTypeAlter=event.target.value;
  }

  onPriceAlterSelected(event: any){
    if(event.target.value=='none'){
      this.priceComponentSelected=false;
      this.discountSelected=false;
      this.noAlterSelected=true;
    } else if (event.target.value=='price'){
      this.priceComponentSelected=true;
      this.discountSelected=false;
      this.noAlterSelected=false;
    } else if (event.target.value=='discount'){
      this.priceComponentSelected=false;
      this.discountSelected=true;
      this.noAlterSelected=false;
    }
  }

  onPricePeriodChange(event: any){
    this.selectedPeriod=event.target.value;
  }

  onPricePeriodAlterChange(event: any){
    this.selectedPeriodAlter=event.target.value;
  }

  onPriceUnitChange(event:any){
    this.selectedPriceUnit=event.target.value;
  }

  checkValidPrice(){
    if(this.customSelected && this.priceForm.value.name != ''){
      return false
    } else if(!this.priceForm.invalid){
      return false
    } else {
      return true
    }
  }

  savePrice(){
    if(this.priceForm.value.name){
      let priceToCreate: ProductOfferingPriceRefOrValue = {
        id: uuidv4(),
        name: this.priceForm.value.name,
        description: this.priceForm.value.description ? this.priceForm.value.description : '',
        lifecycleStatus: "Active",
        priceType: this.recurringSelected ? 'recurring' : this.usageSelected ? 'usage' : this.oneTimeSelected ? 'one time' : 'custom',
      }
      if(!this.customSelected && this.priceForm.value.price){
        priceToCreate.price = {
          percentage: 0,
          taxRate: 20,
          dutyFreeAmount: {
              unit: this.selectedPriceUnit,
              value: 0
          },
          taxIncludedAmount: {
              unit: this.selectedPriceUnit,
              value: parseFloat(this.priceForm.value.price)
          }
        }
      }
      if(this.recurringSelected){
        console.log('recurring')
        priceToCreate.recurringChargePeriod=this.selectedPeriod;
      }
      if(this.usageSelected){
        console.log('usage')
        priceToCreate.unitOfMeasure= {
          amount: 1,
          units: this.usageUnit.nativeElement.value
        }
      }
      if(this.priceComponentSelected && this.priceAlterForm.value.price){
        priceToCreate.priceAlteration = [
          {
              description: this.priceAlterForm.value.description ? this.priceAlterForm.value.description : '',
              name: "fee",
              priceType: this.priceComponentSelected ? this.priceTypeAlter : this.recurringSelected ? 'recurring' : this.usageSelected ? 'usage' : this.oneTimeSelected ? 'one time' : 'custom',
              priority: 0,
              recurringChargePeriod: (this.priceComponentSelected && this.priceTypeAlter == 'RECURRING') ? this.selectedPeriodAlter  : '',
              price: {
                  percentage: this.discountSelected ? parseFloat(this.priceAlterForm.value.price) : 0,
                  dutyFreeAmount: {
                      unit: this.selectedPriceUnit,
                      value: 0
                  },
                  taxIncludedAmount: {
                      unit: this.selectedPriceUnit,
                      value: this.priceComponentSelected ? parseFloat(this.priceAlterForm.value.price) : 0
                  }
              },
              unitOfMeasure: {
                  amount: 1,
                  units: (this.priceComponentSelected && this.priceTypeAlter == 'USAGE') ? this.usageUnitAlter.nativeElement.value  : '',
              }
          }
        ]
      }
      this.createdPrices.push(priceToCreate)   
      console.log('--- price ---')
      console.log(this.createdPrices)      
    }
    this.priceAlterForm.reset()
    this.priceAlterForm.controls['condition'].setValue('');
    this.priceAlterForm.controls['price'].setValue('');
    this.priceForm.reset();
    this.priceForm.controls['name'].setValue('');
    this.priceForm.controls['price'].setValue('');
    this.cdr.detectChanges();

    this.selectedPeriod='DAILY';
    this.selectedPeriodAlter='DAILY';
    this.selectedPriceUnit=currencies[0].code;
    this.priceTypeAlter='ONE TIME';
    this.priceComponentSelected=false;
    this.discountSelected=false;
    this.noAlterSelected=true;
    this.showCreatePrice=false;    
    this.usageSelected=false;
    this.recurringSelected=false;
    this.customSelected=false;
    this.oneTimeSelected=true;
  }

  removePrice(price:any){
    const index = this.createdPrices.findIndex(item => item.id === price.id);
    if (index !== -1) {
      this.createdPrices.splice(index, 1);
    }
  }

  checkCustom(){
    if(this.createdPrices.length==1 && this.createdPrices[0].priceType=='custom'){
      return true
    } else {
      return false
    }
  }

  onSLAMetricChange(event: any) {
    this.creatingSLA.unitMeasure=event.target.value;
  }

  onSLAChange(event: any) {
    if(event.target.value=='UPDATES RATE'){
      this.updatesSelected=true;
      this.responseSelected=false;
      this.delaySelected=false;
      this.creatingSLA.type='UPDATES RATE';
      this.creatingSLA.description='Expected number of updates in the given period.';
      this.creatingSLA.unitMeasure='day';
    }else if (event.target.value=='RESPONSE TIME'){
      this.updatesSelected=false;
      this.responseSelected=true;
      this.delaySelected=false;
      this.creatingSLA.type='RESPONSE TIME';
      this.creatingSLA.description='Total amount of time to respond to a data request (GET).';
      this.creatingSLA.unitMeasure='ms';
    }else if (event.target.value=='DELAY'){
      this.updatesSelected=false;
      this.responseSelected=false;
      this.delaySelected=true;
      this.creatingSLA.type='DELAY';
      this.creatingSLA.description='Total amount of time to deliver a new update (SUBSCRIPTION).';
      this.creatingSLA.unitMeasure='ms';
    }
  }

  showCreateSLAMetric(){
    if(this.availableSLAs[0]=='UPDATES RATE'){
      this.updatesSelected=true;
      this.responseSelected=false;
      this.delaySelected=false;
      this.creatingSLA.type='UPDATES RATE';
      this.creatingSLA.description='Expected number of updates in the given period.';
      this.creatingSLA.unitMeasure='day';
    }else if (this.availableSLAs[0]=='RESPONSE TIME'){
      this.updatesSelected=false;
      this.responseSelected=true;
      this.delaySelected=false;
      this.creatingSLA.type='RESPONSE TIME';
      this.creatingSLA.description='Total amount of time to respond to a data request (GET).';
      this.creatingSLA.unitMeasure='ms';
    }else if (this.availableSLAs[0]=='DELAY'){
      this.updatesSelected=false;
      this.responseSelected=false;
      this.delaySelected=true;
      this.creatingSLA.type='DELAY';
      this.creatingSLA.description='Total amount of time to deliver a new update (SUBSCRIPTION).';
      this.creatingSLA.unitMeasure='ms';
    }
    this.showCreateSLA=true;
  }

  addSLA(){
    const index = this.availableSLAs.findIndex(item => item === this.creatingSLA.type);
    if(this.updatesSelected == true){
      this.creatingSLA.threshold=this.updatemetric.nativeElement.value;
      this.createdSLAs.push({type: this.creatingSLA.type, description: this.creatingSLA.description, threshold: this.creatingSLA.threshold, unitMeasure: this.creatingSLA.unitMeasure});
      this.availableSLAs.splice(index, 1);
      this.updatesSelected=false;
    } else if (this.responseSelected == true){
      this.creatingSLA.threshold=this.responsemetric.nativeElement.value;
      this.createdSLAs.push({type: this.creatingSLA.type, description: this.creatingSLA.description, threshold: this.creatingSLA.threshold, unitMeasure: this.creatingSLA.unitMeasure});
      this.availableSLAs.splice(index, 1);
      this.responseSelected=false;
    } else {
      this.creatingSLA.threshold=this.delaymetric.nativeElement.value;
      this.createdSLAs.push({type: this.creatingSLA.type, description: this.creatingSLA.description, threshold: this.creatingSLA.threshold, unitMeasure: this.creatingSLA.unitMeasure});
      this.availableSLAs.splice(index, 1);
      this.delaySelected=false;
    }
    this.showCreateSLA=false;
  }

  removeSLA(sla:any){
    const index = this.createdSLAs.findIndex(item => item.type === sla.type);
    if (index !== -1) {
      this.createdSLAs.splice(index, 1);
    }
    this.availableSLAs.push(sla.type)
  }

  checkThreshold(){
    if(this.updatesSelected == true){
      if(this.updatemetric.nativeElement.value == ''){
        return true
      } else {
        return false
      }
    } else if (this.responseSelected == true){
      if(this.responsemetric.nativeElement.value == ''){
        return true
      } else {
        return false
      }
    } else {
      if(this.delaymetric.nativeElement.value == ''){
        return true
      } else {
        return false
      }
    }
  }

  getCategories(){
    /*this.api.getCatalog(this.selectedCatalog.id).then(data => {
      if(data.category){
        for (let i=0; i<data.category.length; i++){
          this.api.getCategoryById(data.category[i].id).then(categoryInfo => {
            this.findChildrenByParent(categoryInfo);
          })
        }
        initFlowbite();
      } else {
        this.api.getCategories().then(data => {
          for(let i=0; i < data.length; i++){
            this.findChildren(data[i],data)
          }
          this.cdr.detectChanges();
          initFlowbite();
        })           
      }
    })*/
    console.log('Getting categories...')
    this.api.getCategories().then(data => {      
      for(let i=0; i < data.length; i++){
        this.findChildren(data[i],data);
        this.unformattedCategories.push(data[i]);
      }
      this.loadingCategory=false;
      this.cdr.detectChanges();
      initFlowbite();
    }) 
  }

  findChildren(parent:any,data:any[]){
    let childs = data.filter((p => p.parentId === parent.id));
    parent["children"] = childs;
    if(parent.isRoot == true){
      this.categories.push(parent)
    } else {
      this.saveChildren(this.categories,parent)
    }
    if(childs.length != 0){
      for(let i=0; i < childs.length; i++){
        this.findChildren(childs[i],data)
      }
    }
  }

  findChildrenByParent(parent:any){
    let childs: any[] = []
    this.api.getCategoriesByParentId(parent.id).then(c => {
      childs=c;
      parent["children"] = childs;
      if(parent.isRoot == true){
        this.categories.push(parent)
      } else {
        this.saveChildren(this.categories,parent)
      }
      if(childs.length != 0){
        for(let i=0; i < childs.length; i++){
          this.findChildrenByParent(childs[i])
        }
      }
      initFlowbite();
    })

  }

  saveChildren(superCategories:any[],parent:any){
    for(let i=0; i < superCategories.length; i++){
      let children = superCategories[i].children;
      if (children != undefined){
        let check = children.find((element: { id: any; }) => element.id == parent.id) 
        if (check != undefined) {
          let idx = children.findIndex((element: { id: any; }) => element.id == parent.id)
          children[idx] = parent
          superCategories[i].children = children         
        }
        this.saveChildren(children,parent)
      }          
    }
  }

  addParent(parentId:any){    
    const index = this.unformattedCategories.findIndex(item => item.id === parentId);
    if (index != -1) {
      //Si el padre no está seleccionado se añade a la selección      
      if(this.unformattedCategories[index].isRoot==false){
        this.addCategory(this.unformattedCategories[index])
      } else {
        this.selectedCategories.push(this.unformattedCategories[index]);
      }
    }
  }

  addCategory(cat:any){
    const index = this.selectedCategories.findIndex(item => item.id === cat.id);
    if (index !== -1) {
      console.log('eliminar')
      this.selectedCategories.splice(index, 1);
    } else {
      console.log('añadir')
      this.selectedCategories.push(cat);
    } 

    if(cat.isRoot==false){
      //const parentIdx = this.categories.findIndex(item => item.id === cat.parentId);
      const parentIdxSelected = this.selectedCategories.findIndex(item => item.id === cat.parentId);
      if (index==-1 && parentIdxSelected == -1) {
        this.addParent(cat.parentId);     
      }
    }
    console.log(this.selectedCategories)
    this.cdr.detectChanges();
    console.log(this.selectedCategories)
  }

  isCategorySelected(cat:any){
    const index = this.selectedCategories.findIndex(item => item.id === cat.id);
    if (index !== -1) {
      return true;
    } else {
      return false;
    } 
  }

  selectCatalog(cat:any){
    this.selectedCatalog=cat;
    this.selectedCategories=[];
  }

  getSellerCatalogs(){
    this.api.getCatalogsByUser(this.catalogPage,undefined,this.partyId,['Active','Launched']).then(data => {
      if(data.length<this.CATALOG_LIMIT){
        this.catalogPageCheck=false;
        this.cdr.detectChanges();
      }else{
        this.catalogPageCheck=true;
        this.cdr.detectChanges();
      }
      for(let i=0; i < data.length; i++){
        this.catalogs.push(data[i])
      }
      this.loadingCatalog=false;
      this.loadingCatalog_more=false;
      console.log('--- catalogs')
      console.log(this.catalogs)
    })
  }

  async nextCatalog(){
    this.loadingCatalog_more=true;
    this.catalogPage=this.catalogPage+this.CATALOG_LIMIT;
    this.cdr.detectChanges;
    console.log(this.catalogPage)
    await this.getSellerCatalogs();
  }

  selectProdSpec(prod:any){
    this.selectedProdSpec=prod;
  }

  getSellerProdSpecs(){
    this.prodSpecService.getProdSpecByUser(this.prodSpecPage,['Active','Launched'],this.partyId,undefined,false).then(data => {
      if(data.length<this.PROD_SPEC_LIMIT){
        this.prodSpecPageCheck=false;
        this.cdr.detectChanges();
      }else{
        this.prodSpecPageCheck=true;
        this.cdr.detectChanges();
      }
      for(let i=0; i < data.length; i++){
        this.prodSpecs.push(data[i])
      }
      this.loadingProdSpec=false;
      this.loadingProdSpec_more=false;
      console.log('--- prodSpecs')
      console.log(this.prodSpecs)
    })
  }

  async nextProdSpec(){
    this.loadingProdSpec_more=true;
    this.prodSpecPage=this.prodSpecPage+this.PROD_SPEC_LIMIT;
    this.cdr.detectChanges;
    console.log(this.prodSpecPage)
    await this.getSellerProdSpecs();
  }

  getSellerOffers(){    
    this.api.getProductOfferByOwner(this.bundlePage,['Active','Launched'],this.partyId,undefined,false).then(data => {
      if(data.length<this.PRODUCT_LIMIT){
        this.bundlePageCheck=false;
        this.cdr.detectChanges();
      }else{
        this.bundlePageCheck=true;
        this.cdr.detectChanges();
      }
      for(let i=0; i < data.length; i++){
        this.bundledOffers.push(data[i])
      }
      this.loadingBundle=false;
      this.loadingBundle_more=false;
      console.log('--- bundledOffers')
      console.log(this.bundledOffers)
      console.log(data)
    })
  }

  async nextBundle(){
    this.loadingBundle_more=true;
    this.bundlePage=this.bundlePage+this.PRODUCT_LIMIT;
    this.cdr.detectChanges;
    console.log(this.bundlePage)
    await this.getSellerOffers();
  }

  addProdToBundle(prod:any){
    const index = this.offersBundle.findIndex(item => item.id === prod.id);
    if (index !== -1) {
      console.log('eliminar')
      this.offersBundle.splice(index, 1);
    } else {
      console.log('añadir')
      this.offersBundle.push({
        id: prod.id,
        href: prod.href,
        lifecycleStatus: prod.lifecycleStatus,
        name: prod.name
      });
    }    
    this.cdr.detectChanges();
    console.log(this.offersBundle)
  }

  isProdInBundle(prod:any){
    const index = this.offersBundle.findIndex(item => item.id === prod.id);
    if (index !== -1) {
      return true
    } else {
      return false;
    } 
  }

  showFinish(){
    this.priceAlterForm.reset()
    this.priceAlterForm.controls['condition'].setValue('');
    this.priceAlterForm.controls['price'].setValue('');
    this.priceForm.reset();
    this.priceForm.controls['name'].setValue('');
    this.priceForm.controls['price'].setValue('');

    this.selectedPeriod='DAILY';
    this.selectedPeriodAlter='DAILY';
    this.selectedPriceUnit=currencies[0].code;
    this.priceTypeAlter='ONE TIME';
    this.priceComponentSelected=false;
    this.discountSelected=false;
    this.noAlterSelected=true;
    this.showCreatePrice=false;    
    this.usageSelected=false;
    this.recurringSelected=false;
    this.customSelected=false;
    this.oneTimeSelected=true;
    if(this.generalForm.value.name && this.generalForm.value.version){
      this.offerToCreate={
        name: this.generalForm.value.name,
        description: this.generalForm.value.description != null ? this.generalForm.value.description : '',
        version: this.generalForm.value.version,
        lifecycleStatus: "Active",
      }
    }

    this.selectStep('summary','summary-circle');
    this.showBundle=false;
    this.showGeneral=false;    
    this.showProdSpec=false;
    this.showCatalog=false;
    this.showCategory=false;
    this.showLicense=false;
    this.showSLA=false;
    this.showPrice=false;
    this.showSummary=true;
  }

  async createOffer(){
    this.postedPrices=[];
    if(this.createdPrices.length>0){
      for(let i=0; i < this.createdPrices.length; i++){
        let priceToCreate: ProductOfferingPrice = {
          description: this.createdPrices[i].description,
          lifecycleStatus: this.createdPrices[i].lifecycleStatus,
          name: this.createdPrices[i].name,
          //percentage: 0,
          priceType: this.createdPrices[i].priceType,
          price: {
              unit: this.createdPrices[i].price?.taxIncludedAmount?.unit,
              value: this.createdPrices[i].price?.taxIncludedAmount?.value
          }
        }
        if(this.createdPrices[i].priceType == 'recurring'){
          console.log('recurring')
          priceToCreate.recurringChargePeriodType=this.createdPrices[i].recurringChargePeriod;
        }
        if(this.createdPrices[i].priceType == 'usage'){
          console.log('usage')
          priceToCreate.unitOfMeasure= this.createdPrices[i].unitOfMeasure
        }
        await this.api.postOfferingPrice(priceToCreate).subscribe({
          next: data => {
            console.log('precio')
            console.log(data)
            this.createdPrices[i].id=data.id;
            if(i==this.createdPrices.length-1){
              this.saveOfferInfo();
            }            
          },
          error: error => {
            console.error('There was an error while creating offers price!', error);
            this.errorMessage='There was an error while creating offers price!';
            this.showError=true;
            setTimeout(() => {
              this.showError = false;
            }, 3000);
          }
        });
      }
    } else {
      this.createdPrices=[];
      this.saveOfferInfo();
    }
    console.log(this.offerToCreate)

  }

  saveOfferInfo(){
    let offercats = [];
    let offerprices = [];
    for(let i = 0; i < this.selectedCategories.length; i++){
      offercats.push({
        id: this.selectedCategories[i].id,
        href: this.selectedCategories[i].id
      })
    }
    for(let i = 0; i < this.createdPrices.length; i++){
      offerprices.push({
        id: this.createdPrices[i].id,
        href: this.createdPrices[i].id
      })
    }
    if(this.generalForm.value.name!=null && this.generalForm.value.version!=null){
      this.offerToCreate={
        name: this.generalForm.value.name,
        description: this.generalForm.value.description != null ? this.generalForm.value.description : '',
        lifecycleStatus: "Active",
        isBundle: this.bundleChecked,
        bundledProductOffering: this.offersBundle,
        place: [],
        version: this.generalForm.value.version,
        category: offercats,
        productOfferingPrice: offerprices,
        validFor: {
          startDateTime: (new Date()).toISOString()
        },
      }
      if(!this.bundleChecked){
        this.offerToCreate.productSpecification = {
          id: this.selectedProdSpec.id,
          href: this.selectedProdSpec.id
        }
      }
      if(this.createdLicense.treatment!=''){
        this.offerToCreate.productOfferingTerm= [
          {
              name: this.createdLicense.treatment,
              description: this.createdLicense.description,
              validFor: {}
          }
        ]
      }
    }

    this.api.postProductOffering(this.offerToCreate,this.selectedCatalog.id).subscribe({
      next: data => {
        console.log('product offer created:')
        console.log(data)
        /*if(this.createdSLAs.length!=0){
          let sla = {
            offerId: data.id,
            services: this.createdSLAs
          }
          this.api.postSLA(sla).subscribe({
            next: data => {
              console.log('SLA')
              console.log(data)              
            },
            error: error => {
              console.error('There was an error while updating!', error);
            }
          });
        }*/
        this.goBack();
      },
      error: error => {
        console.error('There was an error while creating the offer!', error);
        this.errorMessage='There was an error while creating the offer!';
        this.showError=true;
        setTimeout(() => {
          this.showError = false;
        }, 3000);
      }
    });
  }

  //STEPS CSS EFFECTS:
  selectStep(step:string,stepCircle:string){
    const index = this.stepsElements.findIndex(item => item === step);
    if (index !== -1) {
      this.stepsElements.splice(index, 1);
      this.selectMenu(document.getElementById(step),'text-primary-100')
      for(let i=0; i<this.stepsElements.length;i++){
        this.unselectMenu(document.getElementById(this.stepsElements[i]),'text-primary-100')
      }
      this.stepsElements.push(step);
    }
    const circleIndex = this.stepsCircles.findIndex(item => item === stepCircle);
    if (index !== -1) {
      this.stepsCircles.splice(circleIndex, 1);
      this.selectMenu(document.getElementById(stepCircle),'border-primary-100')
      this.unselectMenu(document.getElementById(stepCircle),'border-gray-400');
      for(let i=0; i<this.stepsCircles.length;i++){
        this.unselectMenu(document.getElementById(this.stepsCircles[i]),'border-primary-100')
        this.selectMenu(document.getElementById(this.stepsCircles[i]),'border-gray-400');
      }
      this.stepsCircles.push(stepCircle);
    }
  }

  removeClass(elem: HTMLElement, cls:string) {
    var str = " " + elem.className + " ";
    elem.className = str.replace(" " + cls + " ", " ").replace(/^\s+|\s+$/g, "");
  }

  addClass(elem: HTMLElement, cls:string) {
      elem.className += (" " + cls);
  }

  unselectMenu(elem:HTMLElement | null,cls:string){
    if(elem != null){
      if(elem.className.match(cls)){
        this.removeClass(elem,cls)
      } else {
        console.log('already unselected')
      }
    }
  }

  selectMenu(elem:HTMLElement| null,cls:string){
    if(elem != null){
      if(elem.className.match(cls)){
        console.log('already selected')
      } else {
        this.addClass(elem,cls)
      }
    }
  }

  //Markdown actions:
  addBold() {
    if(this.showGeneral){
      const currentText = this.generalForm.value.description;
      this.generalForm.patchValue({
        description: currentText + ' **bold text** '
      });
    } else if(this.showPrice) {
      const currentText = this.priceForm.value.description;
      this.priceForm.patchValue({
        description: currentText + ' **bold text** '
      });
    } else if(this.showLicense){
      const currentText = this.licenseForm.value.description;
      this.licenseForm.patchValue({
        description: currentText + ' **bold text** '
      });    
    }

  }

  addItalic() {
    if(this.showGeneral){
      const currentText = this.generalForm.value.description;
      this.generalForm.patchValue({
        description: currentText + ' _italicized text_ '
      });
    } else if(this.showPrice) {
      const currentText = this.priceForm.value.description;
      this.priceForm.patchValue({
        description: currentText + ' _italicized text_ '
      });
    } else if(this.showLicense){
      const currentText = this.licenseForm.value.description;
      this.licenseForm.patchValue({
        description: currentText + ' _italicized text_ '
      });    
    }
  }

  addList(){
    if(this.showGeneral){
      const currentText = this.generalForm.value.description;
      this.generalForm.patchValue({
        description: currentText + '\n- First item\n- Second item'
      });
    } else if(this.showPrice) {
      const currentText = this.priceForm.value.description;
      this.priceForm.patchValue({
        description: currentText + '\n- First item\n- Second item'
      });
    } else if(this.showLicense){
      const currentText = this.licenseForm.value.description;
      this.licenseForm.patchValue({
        description: currentText + '\n- First item\n- Second item'
      });    
    }
  }

  addOrderedList(){
    if(this.showGeneral){
      const currentText = this.generalForm.value.description;
      this.generalForm.patchValue({
        description: currentText + '\n1. First item\n2. Second item'
      });
    } else if(this.showPrice) {
      const currentText = this.priceForm.value.description;
      this.priceForm.patchValue({
        description: currentText + '\n1. First item\n2. Second item'
      });
    } else if(this.showLicense){
      const currentText = this.licenseForm.value.description;
      this.licenseForm.patchValue({
        description: currentText + '\n1. First item\n2. Second item'
      });    
    } 
  }

  addCode(){
    if(this.showGeneral){
      const currentText = this.generalForm.value.description;
      this.generalForm.patchValue({
        description: currentText + '\n`code`'
      });
    } else if(this.showPrice) {
      const currentText = this.priceForm.value.description;
      this.priceForm.patchValue({
        description: currentText + '\n`code`'
      });
    } else if(this.showLicense){
      const currentText = this.licenseForm.value.description;
      this.licenseForm.patchValue({
        description: currentText + '\n`code`'
      });    
    }
  }

  addCodeBlock(){
    if(this.showGeneral){
      const currentText = this.generalForm.value.description;
      this.generalForm.patchValue({
        description: currentText + '\n```\ncode\n```'
      });
    } else if(this.showPrice) {
      const currentText = this.priceForm.value.description;
      this.priceForm.patchValue({
        description: currentText + '\n```\ncode\n```'
      });
    } else if(this.showLicense){
      const currentText = this.licenseForm.value.description;
      this.licenseForm.patchValue({
        description: currentText + '\n```\ncode\n```'
      });    
    }
  }

  addBlockquote(){
    if(this.showGeneral){
      const currentText = this.generalForm.value.description;
      this.generalForm.patchValue({
        description: currentText + '\n> blockquote'
      }); 
    } else if(this.showPrice) {
      const currentText = this.priceForm.value.description;
      this.priceForm.patchValue({
        description: currentText + '\n> blockquote'
      });
    } else if(this.showLicense){
      const currentText = this.licenseForm.value.description;
      this.licenseForm.patchValue({
        description: currentText + '\n> blockquote'
      });    
    }   
  }

  addLink(){
    if(this.showGeneral){
      const currentText = this.generalForm.value.description;
      this.generalForm.patchValue({
        description: currentText + ' [title](https://www.example.com) '
      });
    } else if(this.showPrice) {
      const currentText = this.priceForm.value.description;
      this.priceForm.patchValue({
        description: currentText + ' [title](https://www.example.com) '
      });
    } else if(this.showLicense){
      const currentText = this.licenseForm.value.description;
      this.licenseForm.patchValue({
        description: currentText + ' [title](https://www.example.com) '
      });    
    }  
  } 

  addTable(){
    if(this.showGeneral){
      const currentText = this.generalForm.value.description;
      this.generalForm.patchValue({
        description: currentText + '\n| Syntax | Description |\n| ----------- | ----------- |\n| Header | Title |\n| Paragraph | Text |'
      });
    } else if(this.showPrice) {
      const currentText = this.priceForm.value.description;
      this.priceForm.patchValue({
        description: currentText + '\n| Syntax | Description |\n| ----------- | ----------- |\n| Header | Title |\n| Paragraph | Text |'
      });
    } else if(this.showLicense){
      const currentText = this.licenseForm.value.description;
      this.licenseForm.patchValue({
        description: currentText + '\n| Syntax | Description |\n| ----------- | ----------- |\n| Header | Title |\n| Paragraph | Text |'
      });    
    } 
  }

  addEmoji(event:any){
    if(this.showGeneral){
      this.showEmoji=false;
      const currentText = this.generalForm.value.description;
      this.generalForm.patchValue({
        description: currentText + event.emoji.native
      });
    } else if(this.showPrice) {
      const currentText = this.priceForm.value.description;
      this.priceForm.patchValue({
        description: currentText + event.emoji.native
      });
    } else if(this.showLicense){
      const currentText = this.licenseForm.value.description;
      this.licenseForm.patchValue({
        description: currentText + event.emoji.native
      });    
    } 
  }

  togglePreview(){
    if(this.showGeneral){
      if(this.generalForm.value.description){
        this.description=this.generalForm.value.description;
      }
    } else if(this.showPrice) {
      if(this.priceForm.value.description){
        this.priceDescription=this.priceForm.value.description;
      }
    } else if(this.showLicense) {
      if(this.licenseForm.value.description){
        this.licenseDescription=this.licenseForm.value.description;
      }
    } 
  }
}

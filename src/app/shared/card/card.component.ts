import {Component, Input, OnInit, ChangeDetectorRef} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {BadgeComponent} from "../badge/badge.component";
import {components} from "../../models/product-catalog";
type Product = components["schemas"]["ProductOffering"];
type ProductSpecification = components["schemas"]["ProductSpecification"];
type AttachmentRefOrValue = components["schemas"]["AttachmentRefOrValue"];
import {LocalStorageService} from "../../services/local-storage.service";
import {EventMessageService} from "../../services/event-message.service";
import { ApiServiceService } from 'src/app/services/api-service.service';
import { Modal } from 'flowbite';
import { Router } from '@angular/router';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'bae-off-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent implements OnInit {

  @Input() productOff: Product | undefined;
  category: string = 'none';
  categories: any[] | undefined  = [];
  price: string = '';
  images: AttachmentRefOrValue[]  = [];
  toastVisibility: boolean = false;
  detailsModalVisibility: boolean = false;
  lastAddedProd:Product | undefined;
  targetModal: any;
  modal: Modal;
  prodSpec:ProductSpecification = {};
  complianceProf:any[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private localStorage: LocalStorageService,
    private eventMessage: EventMessageService,
    private api: ApiServiceService,
    private router: Router
    ) {
      this.targetModal = document.getElementById('details-modal');
      this.modal = new Modal(this.targetModal);
      this.complianceProf.push({id: 'cloudRulebook', name: 'EU Cloud Rulebook', value: 'Not achieved yet', href:'#'})
      this.complianceProf.push({id: 'cloudSecurity', name: 'EU Cloud Security', value: 'Not achieved yet', href:'#'})    
      this.complianceProf.push({id: 'iso27001', name: 'ISO 27001', value: 'Not achieved yet', href:'#'})
      this.complianceProf.push({id: 'iso27017', name: 'ISO 27017', value: 'Not achieved yet', href:'#'})
      this.complianceProf.push({id: 'iso17025', name: 'ISO 17025', value: 'Not achieved yet', href:'#'})
    }

  ngOnInit() {    
    this.category = this.productOff?.category?.at(0)?.name ?? 'none';
    this.categories = this.productOff?.category;
    this.price = this.productOff?.productOfferingPrice?.at(0)?.price?.value + ' ' +
      this.productOff?.productOfferingPrice?.at(0)?.price?.unit ?? 'n/a';
    this.images = this.productOff?.attachment?.filter(item => item.attachmentType === 'Picture') ?? [];
    let specId:any|undefined=this.productOff?.productSpecification?.id;
    if(specId != undefined){
      this.api.getProductSpecification(specId).then(spec => {
        this.prodSpec=spec;
        for(let z=0; z < this.complianceProf.length; z++){
          if(this.prodSpec.productSpecCharacteristic != undefined){
            let compProf = this.prodSpec.productSpecCharacteristic.find((p => p.name === this.complianceProf[z].id));
            if(compProf != undefined){
              this.complianceProf[z].href = compProf.productSpecCharacteristicValue?.at(0)?.value
              this.complianceProf[z].value = 'Yes'
            }
          }
        }
      })
    }
  }

  getProductImage() {
    return this.images.length > 0 ? this.images?.at(0)?.url : 'https://placehold.co/600x400/svg';
  }
  getPrice() {
    let priceType = this.productOff?.productOfferingPrice?.at(0)?.priceType
    if(priceType == 'recurring'){
      priceType= this.productOff?.productOfferingPrice?.at(0)?.recurringChargePeriodType
    }
    if(priceType == 'usage'){
      priceType= '/ '+this.productOff?.productOfferingPrice?.at(0)?.unitOfMeasure?.units
    }
    return {
      price: this.productOff?.productOfferingPrice?.at(0)?.price?.value + ' ' +
        this.productOff?.productOfferingPrice?.at(0)?.price?.unit ?? 'n/a',
      priceType: priceType
    }
  }

  addProductToCart(productOff:Product| undefined){
    console.log('Producto...')
    console.log(productOff)
    this.localStorage.addCartItem(productOff as Product);
    if(productOff!== undefined){
      console.log('emit message')
      this.eventMessage.emitAddedCartItem(productOff as Product);
    }    
    //TOGGLE TOAST
    this.toastVisibility=true;
    this.lastAddedProd=productOff;
    this.cdr.detectChanges();
    //document.getElementById("progress-bar")?.classList.toggle("hover:w-100");
    let element = document.getElementById("progress-bar")
    let parent = document.getElementById("toast-add-cart")
    if (element != null && parent != null) {
      console.log(document.getElementById("toast-add-cart"))
      element.style.width = '0%'
      element.offsetWidth
      element.style.width = '100%'
      setTimeout(() => {   
        this.toastVisibility=false
      }, 3500);

    }
    
    this.cdr.detectChanges();
  }

  deleteProduct(product: Product | undefined){
    if(product !== undefined) {
      this.localStorage.removeCartItem(product);
      this.eventMessage.emitRemovedCartItem(product as Product);
    }
    this.toastVisibility=false;
  }

  toggleDetailsModal(product: Product | undefined){
    console.log('Producto details...')
    console.log(this.productOff)
    console.log(this.productOff?.name)
    this.cdr.detectChanges();
    initFlowbite();
    this.targetModal = document.getElementById('details-modal');
    this.modal = new Modal(this.targetModal);
    this.cdr.detectChanges();
    this.modal.toggle();
    this.cdr.detectChanges();
    initFlowbite();
    console.log('hola')
  }

  hideModal() {
    this.targetModal = document.getElementById('details-modal');
    this.modal = new Modal(this.targetModal);
    this.modal.hide();
    document.querySelector("body > div[modal-backdrop]")?.remove()
  }

  goToProductDetails(productOff:Product| undefined) {
    document.querySelector("body > div[modal-backdrop]")?.remove()
    this.router.navigate(['/search', productOff?.id]);
  }
}

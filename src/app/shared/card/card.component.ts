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

  constructor(
    private cdr: ChangeDetectorRef,
    private localStorage: LocalStorageService,
    private eventMessage: EventMessageService,
    private api: ApiServiceService) {
      this.targetModal = document.getElementById('details-modal');
      this.modal = new Modal(this.targetModal);
    }

  ngOnInit() {    
    this.category = this.productOff?.category?.at(0)?.name ?? 'none';
    this.categories = this.productOff?.category;
    console.log('---categories---')
    console.log(this.categories)
    this.price = this.productOff?.productOfferingPrice?.at(0)?.price?.value + ' ' +
      this.productOff?.productOfferingPrice?.at(0)?.price?.unit ?? 'n/a';
    this.images = this.productOff?.attachment?.filter(item => item.attachmentType === 'Picture') ?? [];
    let specId:any|undefined=this.productOff?.productSpecification?.id;
    if(specId != undefined){
      this.api.getProductSpecification(specId).then(spec => {
        this.prodSpec=spec;
        console.log('----Prod Spec...')
        console.log(this.prodSpec)
      })
    }
  }

  getProductImage() {
    return this.images.length > 0 ? this.images?.at(0)?.url : 'https://placehold.co/600x400/svg';
  }
  getPrice() {
    let priceType = this.productOff?.productOfferingPrice?.at(0)?.priceType
    if(priceType == 'recurring'){
      priceType= 'recurring '+this.productOff?.productOfferingPrice?.at(0)?.recurringChargePeriodType
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
    this.targetModal = document.getElementById('details-modal');
    this.modal = new Modal(this.targetModal);
    this.cdr.detectChanges();
    this.modal.toggle();
    console.log('hola')
  }

  hideModal() {
    this.targetModal = document.getElementById('details-modal');
    this.modal = new Modal(this.targetModal);
    this.modal.hide();
    document.querySelector("body > div[modal-backdrop]")?.remove()
  }
}

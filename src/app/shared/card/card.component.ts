import {Component, Input, OnInit, ChangeDetectorRef} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {BadgeComponent} from "../badge/badge.component";
import {components} from "../../models/product-catalog";
type Product = components["schemas"]["ProductOffering"];
type AttachmentRefOrValue = components["schemas"]["AttachmentRefOrValue"];
import {LocalStorageService} from "../../services/local-storage.service";
import {EventMessageService} from "../../services/event-message.service";

@Component({
  selector: 'bae-off-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent implements OnInit {

  @Input() productOff: Product | undefined;
  category: string = 'none';
  price: string = '';
  images: AttachmentRefOrValue[]  = [];
  toastVisibility: boolean = false;
  lastAddedProd:Product | undefined;

  constructor(private cdr: ChangeDetectorRef, private localStorage: LocalStorageService, private eventMessage: EventMessageService) {}

  ngOnInit() {
    this.category = this.productOff?.category?.at(0)?.name ?? 'none';
    this.price = this.productOff?.productOfferingPrice?.at(0)?.price?.taxIncludedAmount?.value + ' ' +
      this.productOff?.productOfferingPrice?.at(0)?.price?.taxIncludedAmount?.unit ?? 'n/a';
    this.images = this.productOff?.attachment?.filter(item => item.attachmentType === 'image') ?? [];
  }

  getProductImage() {
    return this.images.length > 0 ? this.images?.at(0)?.url : 'https://placehold.co/600x400/svg';
  }
  getPrice() {
    return {
      price: this.productOff?.productOfferingPrice?.at(0)?.price?.taxIncludedAmount?.value + ' ' +
        this.productOff?.productOfferingPrice?.at(0)?.price?.taxIncludedAmount?.unit ?? 'n/a',
      priceType: this.productOff?.productOfferingPrice?.at(0)?.priceType
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
}

import {Component, Input, OnInit, ChangeDetectorRef} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {BadgeComponent} from "../badge/badge.component";
import {components} from "../../models/product-catalog";
type Product = components["schemas"]["ProductOffering"];
type AttachmentRefOrValue = components["schemas"]["AttachmentRefOrValue"];

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

  constructor(private cdr: ChangeDetectorRef) {}

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

  toggleToast(){
    this.toastVisibility=true;
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
}

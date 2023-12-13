import { Component } from '@angular/core';
import {
  faCartShopping
} from "@fortawesome/sharp-solid-svg-icons";
import {components} from "../../models/product-catalog";
type ProductOffering = components["schemas"]["ProductOffering"];

@Component({
  selector: 'app-cart-drawer',
  templateUrl: './cart-drawer.component.html',
  styleUrl: './cart-drawer.component.css'
})
export class CartDrawerComponent {
  protected readonly faCartShopping = faCartShopping;
  p1: ProductOffering;
  p2: ProductOffering;
  items: ProductOffering[] = [];
  totalPrice:any;

  constructor() {
    this.p1 = {
      id: '1',
      name: 'ETABox Vessel (IDOM)',
      description: 'Advanced cloud-based solution utilizing AI-driven predictive models to estimate vessel arrivals and departures, tailored for port authorities and shipping companies. Features real-time ETA/ETD dashboards and precise algorithmic accuracy statistics.',
      productOfferingPrice: [
        { priceType: 'per 100 requests',
          price: {
          dutyFreeAmount: {
            unit: 'EUR',
            value: 200
          },
          taxIncludedAmount: {
            unit: 'EUR',
            value: 242 }
          }
        }
      ],
      category: [{ id: '1', name: 'IaaS' }],
      attachment: [{url: 'assets/images/ETABoxVessel_IDOM-Transparent.png', attachmentType: 'image'}]
    }
    this.p2 = {
      id: '2',
      name: 'ETABox Container (IDOM)',
      description: 'AI-enhanced cloud service offering dynamic container arrival predictions, synchronizing transport services. Integrates multi-source data for accurate terminal operations, intuitive interface and comprehensive API support.',
      productOfferingPrice: [{ priceType: 'per 100 requests', price: {dutyFreeAmount: {unit: 'EUR', value: 200}, taxIncludedAmount: {unit: 'EUR', value: 242 }}}],
      category: [{ id: '1', name: 'IaaS' }],
      attachment: [{url: 'assets/images/ETABoxCN_IDOM-Transparent.png', attachmentType: 'image'}]
    }
    this.items.push(this.p1);
    this.items.push(this.p2)
  }

  getProductImage(attachment:any[]) {
    if(attachment.length > 0){
      for(let i=0; i<attachment.length; i++){
        if(attachment[i].attachmentType == 'image'){
          return attachment[i].url
        }
      }
    } else {
      return 'https://placehold.co/600x400/svg'
    }
  }
  getPrice(productOfferingPrice:any[]) {
    return {
      price: productOfferingPrice.at(0)?.price?.taxIncludedAmount?.value + ' ' +
      productOfferingPrice.at(0)?.price?.taxIncludedAmount?.unit ?? 'n/a',
      priceType: productOfferingPrice.at(0)?.priceType
    }
  }

  getTotalPrice(){
    for(let i=0; i<this.items.length; i++){

    }
  }
}

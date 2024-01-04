import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {
  faCartShopping
} from "@fortawesome/sharp-solid-svg-icons";
import {components} from "../../models/product-catalog";
type ProductOffering = components["schemas"]["ProductOffering"];
import {LocalStorageService} from "../../services/local-storage.service";
import {EventMessageService} from "../../services/event-message.service";

@Component({
  selector: 'app-cart-drawer',
  templateUrl: './cart-drawer.component.html',
  styleUrl: './cart-drawer.component.css'
})
export class CartDrawerComponent implements OnInit{
  protected readonly faCartShopping = faCartShopping;
  //p1: ProductOffering;
  //p2: ProductOffering;
  //p3: ProductOffering;
  items: ProductOffering[] = [];
  totalPrice:any;

  constructor(private localStorage: LocalStorageService, private eventMessage: EventMessageService, private cdr: ChangeDetectorRef) {

  }

  ngOnInit(): void {
    this.eventMessage.messages$.subscribe(ev => {
      if(ev.type === 'AddedCartItem') {
        console.log('Elemento añadido')
        const index = this.items.indexOf(ev.value as ProductOffering, 0);
        if(index === -1) {
          this.items.push(ev.value as ProductOffering)
        }
        this.getTotalPrice();
      } else if(ev.type === 'RemovedCartItem') {
        const index = this.items.indexOf(ev.value as ProductOffering, 0);
        if(index > -1) {
          this.items.splice(index,1);
        }
        this.getTotalPrice();
      }
    })
    this.items = this.localStorage.getObject('cart_items') as ProductOffering[] || [] ;
    this.cdr.detectChanges();
    this.getTotalPrice();
    console.log('Elementos en el carrito....')
    console.log(this.items)
  }

  getProductImage(attachment:any[]) {
    if(attachment.length > 0){
      for(let i=0; i<attachment.length; i++){
        if(attachment[i].attachmentType == 'Picture'){
          return attachment[i].url
        }
      }
    } else {
      return 'https://placehold.co/600x400/svg'
    }
  }
  getPrice(productOfferingPrice:any[]) {
    let priceType = productOfferingPrice?.at(0)?.priceType
    if(priceType == 'recurring'){
      priceType= 'recurring '+productOfferingPrice?.at(0)?.recurringChargePeriodType
    }
    return {
      price: productOfferingPrice.at(0)?.price?.value + ' ' +
      productOfferingPrice.at(0)?.price?.unit ?? 'n/a',
      priceType: priceType
    }
  }

  getTotalPrice(){
    this.totalPrice=[];
    let insertCheck = false;
    let priceInfo={};
    for(let i=0; i<this.items.length; i++){
      insertCheck = false;
      console.log(this.items[i].productOfferingPrice?.at(0)?.priceType)
      if(this.totalPrice.length == 0){
        let priceType = this.items[i].productOfferingPrice?.at(0)?.priceType
        if(priceType == 'recurring'){
          priceType= 'recurring '+this.items[i].productOfferingPrice?.at(0)?.recurringChargePeriodType
        }
        priceInfo = {
          'priceType': priceType,
          'price': this.items[i].productOfferingPrice?.at(0)?.price?.value,
          'unit': this.items[i].productOfferingPrice?.at(0)?.price?.unit
        }
        this.totalPrice.push(priceInfo);
      } else {
        for(let j=0; j<this.totalPrice.length; j++){
          if(this.items[i].productOfferingPrice?.at(0)?.priceType == 'recurring'){
            let priceType= 'recurring '+this.items[i].productOfferingPrice?.at(0)?.recurringChargePeriodType
            if(priceType == this.totalPrice[j].priceType && this.items[i].productOfferingPrice?.at(0)?.price?.unit == this.totalPrice[j].unit){
              this.totalPrice[j].price=this.totalPrice[j].price+this.items[i].productOfferingPrice?.at(0)?.price?.value;
              insertCheck=true;
            } else {
              priceInfo = {
                'priceType': priceType,
                'price': this.items[i].productOfferingPrice?.at(0)?.price?.value,
                'unit': this.items[i].productOfferingPrice?.at(0)?.price?.unit
              }        
            }

          } else {
            if(this.items[i].productOfferingPrice?.at(0)?.priceType == this.totalPrice[j].priceType && this.items[i].productOfferingPrice?.at(0)?.price?.unit == this.totalPrice[j].unit){
              this.totalPrice[j].price=this.totalPrice[j].price+this.items[i].productOfferingPrice?.at(0)?.price?.value;
              insertCheck=true;
            } else {
              let priceType = this.items[i].productOfferingPrice?.at(0)?.priceType
              if(priceType == 'recurring'){
                priceType= 'recurring '+this.items[i].productOfferingPrice?.at(0)?.recurringChargePeriodType
              }
              priceInfo = {
                'priceType': priceType,
                'price': this.items[i].productOfferingPrice?.at(0)?.price?.value,
                'unit': this.items[i].productOfferingPrice?.at(0)?.price?.unit
              }        
            }
          }
        }
        if(insertCheck==false){
          this.totalPrice.push(priceInfo);
          insertCheck=true;
        }       
      }
    }
  }

  deleteProduct(product: ProductOffering){
    this.localStorage.removeCartItem(product);
    this.eventMessage.emitRemovedCartItem(product as ProductOffering);
  }
}

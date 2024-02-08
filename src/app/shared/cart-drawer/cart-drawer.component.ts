import { Component, OnInit, ChangeDetectorRef, HostListener } from '@angular/core';
import {
  faCartShopping
} from "@fortawesome/sharp-solid-svg-icons";
import {components} from "../../models/product-catalog";
type ProductOffering = components["schemas"]["ProductOffering"];
import {LocalStorageService} from "../../services/local-storage.service";
import {EventMessageService} from "../../services/event-message.service";
import { Drawer } from 'flowbite';
import { PriceServiceService } from 'src/app/services/price-service.service';

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
  showBackDrop:boolean=true;

  constructor(
    private localStorage: LocalStorageService,
    private eventMessage: EventMessageService,
    private priceService: PriceServiceService,
    private cdr: ChangeDetectorRef) {

  }

  /*@HostListener('document:click')
  onClick() {
    document.querySelector("body > div[drawer-backdrop]")?.remove()
  }*/

  ngOnInit(): void {
    this.showBackDrop=true;
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

  getPrice(prod:ProductOffering){
    let result:any= this.priceService.formatCheapestPricePlan(prod);
    return {
      "price": result.price,
      "unit": result.unit,
      "priceType": result.priceType,
      "text": result.text
    }
  }

  getTotalPrice(){
    this.totalPrice=[];
    let insertCheck = false;
    let priceInfo:any  ={};
    for(let i=0; i<this.items.length; i++){
      console.log('totalprice')
      console.log(this.items[i])
      insertCheck = false;
      if(this.totalPrice.length == 0){
        priceInfo = this.priceService.formatCheapestPricePlan(this.items[i]);
        this.totalPrice.push(priceInfo);
        console.log('Añade primero')
      } else {
        for(let j=0; j<this.totalPrice.length; j++){
          priceInfo = this.priceService.formatCheapestPricePlan(this.items[i]);
          if(priceInfo.priceType == this.totalPrice[j].priceType && priceInfo.unit == this.totalPrice[j].unit && priceInfo.text == this.totalPrice[j].text){
            this.totalPrice[j].price=this.totalPrice[j].price+priceInfo.price;
            insertCheck=true;
            console.log('suma')
          }
          console.log('precio segundo')
          console.log(priceInfo)
        }
        if(insertCheck==false){
          this.totalPrice.push(priceInfo);
          insertCheck=true;
          console.log('añade segundo')
        }       
      }
    }
    console.log(this.totalPrice)
  }

  deleteProduct(product: ProductOffering){
    this.localStorage.removeCartItem(product);
    this.eventMessage.emitRemovedCartItem(product as ProductOffering);
  }

  hideCart(){
    this.eventMessage.emitToggleDrawer(false);
    console.log('hola')
  }
}

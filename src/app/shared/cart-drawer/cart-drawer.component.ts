import { Component, OnInit, ChangeDetectorRef, HostListener } from '@angular/core';
import {
  faCartShopping
} from "@fortawesome/sharp-solid-svg-icons";
import {components} from "../../models/product-catalog";
import {LocalStorageService} from "../../services/local-storage.service";
import { ShoppingCartServiceService } from 'src/app/services/shopping-cart-service.service';
import {EventMessageService} from "../../services/event-message.service";
import { Drawer } from 'flowbite';
import { PriceServiceService } from 'src/app/services/price-service.service';
import { ApiServiceService } from 'src/app/services/product-service.service';
import { cartProduct } from '../../models/interfaces';
import { TYPES } from 'src/app/models/types.const';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-drawer',
  templateUrl: './cart-drawer.component.html',
  styleUrl: './cart-drawer.component.css'
})
export class CartDrawerComponent implements OnInit{
  protected readonly faCartShopping = faCartShopping;
  items: cartProduct[] = [];
  totalPrice:any;
  showBackDrop:boolean=true;
  check_custom:boolean=false;

  constructor(
    private localStorage: LocalStorageService,
    private eventMessage: EventMessageService,
    private priceService: PriceServiceService,
    private cartService: ShoppingCartServiceService,
    private api: ApiServiceService,
    private cdr: ChangeDetectorRef,
    private router: Router,) {

  }

  /*@HostListener('document:click')
  onClick() {
    document.querySelector("body > div[drawer-backdrop]")?.remove()
  }*/

  ngOnInit(): void {
    this.showBackDrop=true;
    this.cartService.getShoppingCart().then(data => {
      console.log('---CARRITO API---')
      console.log(data)
      this.items=data;
      this.cdr.detectChanges();
      this.getTotalPrice();
      console.log('------------------')
    })
    this.eventMessage.messages$.subscribe(ev => {
      if(ev.type === 'AddedCartItem') {
        console.log('Elemento añadido')
        this.cartService.getShoppingCart().then(data => {
          console.log('---CARRITO API---')
          console.log(data)
          this.items=data;
          this.cdr.detectChanges();
          this.getTotalPrice();
          console.log('------------------')
        })
      } else if(ev.type === 'RemovedCartItem') {
        this.cartService.getShoppingCart().then(data => {
          console.log('---CARRITO API---')
          console.log(data)
          this.items=data;
          this.cdr.detectChanges();
          this.getTotalPrice();
          console.log('------------------')
        })
      }
    })
    console.log('Elementos en el carrito....')
    console.log(this.items)
  }

  /*getProductImage(attachment:any[]) {
    if(attachment.length > 0){
      for(let i=0; i<attachment.length; i++){
        if(attachment[i].attachmentType == 'Picture'){
          return attachment[i].url
        }
      }
    } else {
      return 'https://placehold.co/600x400/svg'
    }
  }*/

  getPrice(item: any) {
    if(item.options.pricing != undefined){
      console.log('PRECIO----')
      console.log(item.options.pricing)
      if(item.options.pricing.priceType=='custom'){
        this.check_custom=true;
        return null
      } else {
        return {
          'priceType': item.options.pricing.priceType,
          'price': item.options.pricing.price?.value,
          'unit': item.options.pricing.price?.unit,
          'text': item.options.pricing.priceType?.toLocaleLowerCase() == TYPES.PRICE.RECURRING ? item.options.pricing.recurringChargePeriodType : item.options.pricing.priceType?.toLocaleLowerCase() == TYPES.PRICE.USAGE ? '/ ' + item.options.pricing?.unitOfMeasure?.units : ''
        }
      }
    } else {
      return null
    }
  }

  get objectKeys() {
    return Object.keys;
  }

  getPricingValue(pricing: Record<string, any>, key: string): any {
    return pricing[key];
  }

  /*getTotalPrice() {
    this.totalPrice = [];
    let insertCheck = false;
    this.check_custom=false;
    this.cdr.detectChanges();
    let priceInfo: any = {};
    for (let i = 0; i < this.items.length; i++) {
      console.log('totalprice')
      console.log(this.items[i])
      insertCheck = false;
      if (this.totalPrice.length == 0) {
        priceInfo = this.getPrice(this.items[i]);
        if(priceInfo!=null){
          this.totalPrice.push(priceInfo);
          console.log('Añade primero')
        }
      } else {
        for (let j = 0; j < this.totalPrice.length; j++) {
          priceInfo = this.getPrice(this.items[i]);
          if(priceInfo!=null){
            if (priceInfo.priceType == this.totalPrice[j].priceType && priceInfo.unit == this.totalPrice[j].unit && priceInfo.text == this.totalPrice[j].text) {
              this.totalPrice[j].price = this.totalPrice[j].price + priceInfo.price;
              insertCheck = true;
              console.log('suma')
            }
            console.log('precio segundo')
            console.log(priceInfo)
          }
        }
        if (insertCheck == false && priceInfo!=null) {
          this.totalPrice.push(priceInfo);
          insertCheck = true;
          console.log('añade segundo')
        }
      }
    }
    console.log(this.totalPrice)
  }*/

  getTotalPrice() {
    this.totalPrice = [];
    let insertCheck = false;
    this.check_custom=false;
    this.cdr.detectChanges();
    let priceInfo: any = {
      'Upfront Fee': 0,
      'Monthly Fee': 0,
      'Weekly Fee': 0,
      'Single Payment': 0,
    };
    for (let i = 0; i < this.items.length; i++) {
      let price = this.items[i].options.pricing
      if(price != undefined){
        if('Upfront Fee' in price){ 
          priceInfo['Upfront Fee']=priceInfo['Upfront Fee']+price['Upfront Fee']
        }
        if('Monthly Fee' in price){ 
          priceInfo['Monthly Fee']=priceInfo['Monthly Fee']+price['Monthly Fee']
        }
        if('Weekly Fee' in price){ 
          priceInfo['Weekly Fee']=priceInfo['Weekly Fee']+price['Weekly Fee']
        }
        if('Single Payment' in price){ 
          priceInfo['Single Payment']=priceInfo['Single Payment']+price['Single Payment']
        }
        if('Custom' in price){
          this.check_custom=true;
        }
        //this.totalPrice.push(priceInfo);
      }
    }
    this.totalPrice.push(priceInfo);
    console.log(this.totalPrice)
  }

  deleteProduct(product: cartProduct){
    this.cartService.removeItemShoppingCart(product.id).subscribe(() => console.log('deleted'));
    this.eventMessage.emitRemovedCartItem(product as cartProduct);
  }

  hideCart(){
    this.eventMessage.emitToggleDrawer(false);
  }


  goToShoppingCart() {
    this.hideCart();
    this.router.navigate(['/checkout']);
  }
}

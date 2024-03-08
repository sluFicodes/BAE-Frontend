import { Component, OnInit, ChangeDetectorRef, HostListener, AfterViewInit } from '@angular/core';
import {
  faCartShopping
} from "@fortawesome/sharp-solid-svg-icons";
import {EventMessageService} from "../../services/event-message.service";
import { ApiServiceService } from 'src/app/services/api-service.service';
import { cartProduct, billingAccountCart } from '../../models/interfaces';
import { TYPES } from 'src/app/models/types.const';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.css'
})
export class ShoppingCartComponent implements OnInit, AfterViewInit{
  protected readonly faCartShopping = faCartShopping;
  items: cartProduct[] = [];
  totalPrice:any;
  showBackDrop:boolean=true;
  billing_accounts: billingAccountCart[] =[];

  constructor(
    private eventMessage: EventMessageService,
    private api: ApiServiceService,
    private cdr: ChangeDetectorRef) {

  }

  ngOnInit(): void {
    //initFlowbite();
    this.showBackDrop=true;
    this.api.getShoppingCart().then(data => {
      console.log('---CARRITO API---')
      console.log(data)
      this.items=data;
      this.cdr.detectChanges();
      this.getTotalPrice();
      console.log('------------------')
      initFlowbite();
    })
    this.api.getBillingAccount().then(data => {
      for(let i=0; i< data.length;i++){
        let email =''
        let phone=''
        let address = {
          "city": '',
          "country": '',
          "postCode": '',
          "stateOrProvince": '',
          "street": ''
        }
        for(let j=0; j<data[i].contact[0].contactMedium.length;j++){
          if(data[i].contact[0].contactMedium[j].mediumType == 'Email'){
            email = data[i].contact[0].contactMedium[j].characteristic.emailAddress
          } else if (data[i].contact[0].contactMedium[j].mediumType == 'PostalAddress'){
            address = {
              "city": data[i].contact[0].contactMedium[j].characteristic.city,
              "country": data[i].contact[0].contactMedium[j].characteristic.country,
              "postCode": data[i].contact[0].contactMedium[j].characteristic.postCode,
              "stateOrProvince": data[i].contact[0].contactMedium[j].characteristic.stateOrProvince,
              "street": data[i].contact[0].contactMedium[j].characteristic.street1
            }
          } else if (data[i].contact[0].contactMedium[j].mediumType == 'TelephoneNumber'){
            phone = data[i].contact[0].contactMedium[j].characteristic.phoneNumber
          }
        }
        this.billing_accounts.push({
          "id": data[i].id,
          "email": email,
          "postalAddress": address,
          "telephoneNumber": phone,
          "selected": i==0 ? true : false
        })
      }
      console.log('billing account...')
      console.log(this.billing_accounts)
      this.cdr.detectChanges();
    })
    console.log('Elementos en el carrito....')
    console.log(this.items)
  }

  ngAfterViewInit() {
    initFlowbite();
  }

  getPrice(item:any){
    return {
      'priceType': item.options.pricing.priceType,
      'price': item.options.pricing.price?.value,
      'unit': item.options.pricing.price?.unit,
      'text': item.options.pricing.priceType?.toLocaleLowerCase() == TYPES.PRICE.RECURRING ? item.options.pricing.recurringChargePeriodType : item.options.pricing.priceType?.toLocaleLowerCase() == TYPES.PRICE.USAGE ? '/ '+ item.options.pricing?.unitOfMeasure?.units : ''
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
        priceInfo = this.getPrice(this.items[i]);
        this.totalPrice.push(priceInfo);
        console.log('Añade primero')
      } else {
        for(let j=0; j<this.totalPrice.length; j++){
          priceInfo = this.getPrice(this.items[i]);
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

  deleteProduct(product: cartProduct){
    this.api.removeItemShoppingCart(product.id).subscribe(() => console.log('deleted'));
    this.eventMessage.emitRemovedCartItem(product as cartProduct);
  }

  removeClass(elem: HTMLElement, cls:string) {
    var str = " " + elem.className + " ";
    elem.className = str.replace(" " + cls + " ", " ").replace(/^\s+|\s+$/g, "");
  }

  addClass(elem: HTMLElement, cls:string) {
      elem.className += (" " + cls);
  }

  clickDropdown(id:any){
    let elem = document.getElementById(id)
    if(elem != null){
      if(elem.className.match('hidden') ) { 
        this.removeClass(elem,"hidden")
      } else {
        this.addClass(elem,"hidden")
      }
    }
  }

  selectBill(idx:number){
    for(let i = 0; i<this.billing_accounts.length; i++){
      if(idx==i){
        this.billing_accounts[i].selected=true;
        this.cdr.detectChanges();
      } else {
        this.billing_accounts[i].selected=false;
        this.cdr.detectChanges();
      }
    }
    console.log('selecting bill')
    console.log(this.billing_accounts)
    this.cdr.detectChanges();
  }
}

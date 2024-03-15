import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { LoginInfo, billingAccountCart } from 'src/app/models/interfaces';
import { ApiServiceService } from 'src/app/services/product-service.service';
import { AccountServiceService } from 'src/app/services/account-service.service';
import {LocalStorageService} from "../../services/local-storage.service";
import { ProductOrderService } from 'src/app/services/product-order-service.service';
import { FastAverageColor } from 'fast-average-color';
import {components} from "../../models/product-catalog";
import { Router } from '@angular/router';
type ProductOffering = components["schemas"]["ProductOffering"];
import * as moment from 'moment';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit{
  loading: boolean = false;
  show_profile: boolean = true;
  show_orders: boolean = false;
  show_billing: boolean = false;
  orders:any[]=[];
  profile:any;
  partyId:any='';
  token:string='';
  email:string='';
  billing_accounts: billingAccountCart[] =[];
  selectedBilling:any;

  constructor(
    private localStorage: LocalStorageService,
    private api: ApiServiceService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private accountService: AccountServiceService,
    private orderService: ProductOrderService
  ) {}

  ngOnInit() {
    this.loading=true;
    let aux = this.localStorage.getObject('login_items') as LoginInfo;
    if(JSON.stringify(aux) != '{}' && (((aux.expire - moment().unix())-4) > 0)) {
      this.token=aux.token;
      this.email=aux.email;
      this.partyId=aux.partyId;
      this.getProfile();
    }
  }

  getProfile(){
    this.selectGeneral();
    this.accountService.getUserInfo(this.partyId).then(data=> {
      console.log(data)
      this.profile=data;
      this.loading=false;
      this.cdr.detectChanges();
    })
    this.show_billing=false;
    this.show_profile=true;
    this.show_orders=false;
    this.cdr.detectChanges();
  }

  getBilling(){
    this.selectBilling();
    this.billing_accounts=[];
    this.accountService.getBillingAccount().then(data => {
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
          "href": data[i].href,
          "name": data[i].name,
          "email": email,
          "postalAddress": address,
          "telephoneNumber": phone,
          "selected": i==0 ? true : false
        })
        if(i==0){
          this.selectedBilling={
            "id": data[i].id,
            "href": data[i].href,
            "name": data[i].name,
            "email": email,
            "postalAddress": address,
            "telephoneNumber": phone,
            "selected": true
          }
        }
      }
      console.log('billing account...')
      console.log(this.billing_accounts)
      this.loading=false;
      this.cdr.detectChanges();
    })
    this.show_billing=true;
    this.show_profile=false;
    this.show_orders=false;
    this.cdr.detectChanges();
  }

  getProductImage(prod:ProductOffering) {
    let images = prod.attachment?.filter(item => item.attachmentType === 'Picture') ?? [];
    return images.length > 0 ? images?.at(0)?.url : 'https://placehold.co/600x400/svg';
  }

  getOrders(){
    this.selectOrder();
    this.orders=[];
    if(this.partyId!=''){
      this.orderService.getProductOrders(this.partyId,0).then(orders=> {
        for(let i=0;i<orders.length;i++){
          let items:any[] = [];
          this.orders.push(orders[i]);
          for(let j=0;j<orders[i].productOrderItem.length;j++){
            this.api.getProductById(orders[i].productOrderItem[j].id).then(item => {
              this.api.getProductSpecification(item.productSpecification.id).then(spec => {
                this.api.getProductPrice(item.productOfferingPrice[0].id).then(prodprice => {
                  items.push({
                    id: item.id,
                    name: item.name,
                    category: item.category,
                    description: item.description,
                    lastUpdate: item.lastUpdate,
                    attachment: spec.attachment,
                    productOfferingPrice: {
                      "price": prodprice.price.value,
                      "unit": prodprice.price.unit,
                      "priceType": prodprice.priceType,
                      "text": prodprice.unitOfMeasure != undefined ? '/'+prodprice.unitOfMeasure.units : prodprice.recurringChargePeriodType
                    },
                    productSpecification: item.productSpecification,
                    productOfferingTerm: item.productOfferingTerm,
                    version: item.version
                  })
                })
              })
            })
          }
          this.orders[i].productOrderItem=items;
        }
        console.log(this.orders)
      })
    }

    this.show_billing=false;
    this.show_profile=false;
    this.show_orders=true;
    this.loading=false;
    this.cdr.detectChanges();
  }

  selectGeneral(){
    let bill_button = document.getElementById('bill-button')
    let general_button = document.getElementById('general-button')
    let order_button = document.getElementById('order-button')

    this.selectMenu(general_button,'text-white bg-primary-100');
    this.unselectMenu(bill_button,'text-white bg-primary-100');
    this.unselectMenu(order_button,'text-white bg-primary-100');
  }

  selectBilling(){
    let bill_button = document.getElementById('bill-button')
    let general_button = document.getElementById('general-button')
    let order_button = document.getElementById('order-button')

    this.selectMenu(bill_button,'text-white bg-primary-100');
    this.unselectMenu(general_button,'text-white bg-primary-100');
    this.unselectMenu(order_button,'text-white bg-primary-100');
  }

  selectBill(idx:number){
    for(let i = 0; i<this.billing_accounts.length; i++){
      if(idx==i){
        this.billing_accounts[i].selected=true;
        this.selectedBilling=this.billing_accounts[i];
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

  selectOrder(){
    let bill_button = document.getElementById('bill-button')
    let general_button = document.getElementById('general-button')
    let order_button = document.getElementById('order-button')

    this.selectMenu(order_button,'text-white bg-primary-100');
    this.unselectMenu(bill_button,'text-white bg-primary-100');
    this.unselectMenu(general_button,'text-white bg-primary-100');
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
}

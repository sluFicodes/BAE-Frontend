import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { LoginInfo, billingAccountCart } from 'src/app/models/interfaces';
import { ApiServiceService } from 'src/app/services/product-service.service';
import { AccountServiceService } from 'src/app/services/account-service.service';
import {LocalStorageService} from "../../services/local-storage.service";
import { ProductOrderService } from 'src/app/services/product-order-service.service';
import { FastAverageColor } from 'fast-average-color';
import {components} from "../../models/product-catalog";
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
type ProductOffering = components["schemas"]["ProductOffering"];
import { phoneNumbers } from '../../models/country-prefix.const'
import { initFlowbite } from 'flowbite';
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
  billToDelete:any;
  billToUpdate:any;
  editBill:boolean=false;
  deleteBill:boolean=false;
  prefixCheck:boolean=false;
  prefixCheckUpdate:boolean=false;
  billingForm = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
    country: new FormControl(''),
    city: new FormControl(''),
    stateOrProvince: new FormControl(''),
    postCode: new FormControl(''),
    street: new FormControl(''),
    telephoneNumber: new FormControl(''),
    telephoneType: new FormControl('')
  });
  billingFormUpdate = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
    country: new FormControl(''),
    city: new FormControl(''),
    stateOrProvince: new FormControl(''),
    postCode: new FormControl(''),
    street: new FormControl(''),
    telephoneNumber: new FormControl(''),
    telephoneType: new FormControl('')
  });
  prefixes: any[] = phoneNumbers;
  createPrefix:any=phoneNumbers[0];
  updatePrefix:any=phoneNumbers[0];

  constructor(
    private localStorage: LocalStorageService,
    private api: ApiServiceService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private accountService: AccountServiceService,
    private orderService: ProductOrderService
  ) {}

  @HostListener('document:click')
  onClick() {
    if(this.editBill==true){
      this.editBill=false;
      this.cdr.detectChanges();
    }
    if(this.deleteBill==true){
      this.deleteBill=false;
      this.cdr.detectChanges();
    }
  }

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
    this.accountService.getBillingAccount().then(data => {
      this.billing_accounts=[];
      for(let i=0; i< data.length;i++){
        let email =''
        let phone=''
        let phoneType = ''
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
            phoneType = data[i].contact[0].contactMedium[j].characteristic.contactType
          }
        }
        this.billing_accounts.push({
          "id": data[i].id,
          "href": data[i].href,
          "name": data[i].name,
          "email": email,
          "postalAddress": address,
          "telephoneNumber": phone,
          "telephoneType": phoneType,
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
    if(this.partyId!=''){
      this.orderService.getProductOrders(this.partyId,0).then(orders=> {
        this.orders=[];
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

  selectBill(baddr: billingAccountCart){
    for(let ba of this.billing_accounts){
      ba.selected = false;
    }
    this.selectedBilling = baddr;
    this.cdr.detectChanges();
  }

  onDeletedBill(baddr: billingAccountCart) {
    console.log('--- DELETE BILLING ADDRESS ---')
    this.accountService.deleteBillingAccount(baddr.id).subscribe(() => this.getBilling());
    
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

  toggleEditBill(bill:billingAccountCart){    
    let pref = this.prefixes.filter(item => item.code === bill.telephoneNumber.slice(0, -9));
    if(pref.length > 0){
      this.updatePrefix= pref[0];
    }
    this.billToUpdate=bill;
    this.cdr.detectChanges();
    console.log(bill.telephoneNumber.slice(0, -9))
    console.log(this.updatePrefix)
    initFlowbite()
    this.editBill=true;
    //Get old bilAcc values
    this.billingFormUpdate.controls['name'].setValue(bill.name);
    this.billingFormUpdate.controls['email'].setValue(bill.email);
    this.billingFormUpdate.controls['country'].setValue(bill.postalAddress.country);
    this.billingFormUpdate.controls['city'].setValue(bill.postalAddress.city);
    this.billingFormUpdate.controls['stateOrProvince'].setValue(bill.postalAddress.stateOrProvince);
    this.billingFormUpdate.controls['street'].setValue(bill.postalAddress.street);
    this.billingFormUpdate.controls['postCode'].setValue(bill.postalAddress.postCode);
    this.billingFormUpdate.controls['telephoneNumber'].setValue(bill.telephoneNumber.slice(-9));
    this.billingFormUpdate.controls['telephoneType'].setValue(bill.telephoneType);
  }

  toggleDeleteBill(bill:billingAccountCart){
    this.deleteBill=true;
    this.billToDelete=bill;
  }

  createBilling(){
    let aux = this.localStorage.getObject('login_items') as LoginInfo;
    let billacc = {
      name: this.billingForm.value.name,
      contact: [{
        contactMedium: [
          {
            mediumType: 'Email',
            //Revisar
            preferred: this.billing_accounts.length > 0 ? false : true,
            characteristic: {
              contactType: 'Email',
              emailAddress: this.billingForm.value.email
            }
          },
          {
            mediumType: 'PostalAddress',
            //Revisar
            preferred: this.billing_accounts.length > 0 ? false : true,
            characteristic: {
              contactType: 'PostalAddress',
              city: this.billingForm.value.city,
              country: this.billingForm.value.country,
              postCode: this.billingForm.value.postCode,
              stateOrProvince: this.billingForm.value.stateOrProvince,
              street1: this.billingForm.value.street
            }            
          },
          {
            mediumType: 'TelephoneNumber',
            //Revisar
            preferred: this.billing_accounts.length > 0 ? false : true,
            characteristic: {
              contactType: this.billingForm.value.telephoneType,
              phoneNumber: this.createPrefix.code+this.billingForm.value.telephoneNumber
            }              
          }
        ]
      }],
      relatedParty:[{
        href: aux.partyId,
        id: aux.partyId,
        role: "bill receiver"
      }],
      state: "Defined"
    }
    this.accountService.postBillingAccount(billacc).subscribe({
      next: data => {
          console.log(billacc)
          this.getBilling();
          this.billingForm.reset();
      },
      error: error => {
          console.error('There was an error while updating!', error);
      }
    });
  }

  updateBilling(){
    let aux = this.localStorage.getObject('login_items') as LoginInfo;
    this.cdr.detectChanges();
    let billacc = {
      name: this.billingFormUpdate.value.name,
      contact: [{
        contactMedium: [
          {
            mediumType: 'Email',
            //Revisar
            preferred: this.billing_accounts.length > 0 ? false : true,
            characteristic: {
              contactType: 'Email',
              emailAddress: this.billingFormUpdate.value.email
            }
          },
          {
            mediumType: 'PostalAddress',
            //Revisar
            preferred: this.billing_accounts.length > 0 ? false : true,
            characteristic: {
              contactType: 'PostalAddress',
              city: this.billingFormUpdate.value.city,
              country: this.billingFormUpdate.value.country,
              postCode: this.billingFormUpdate.value.postCode,
              stateOrProvince: this.billingFormUpdate.value.stateOrProvince,
              street1: this.billingFormUpdate.value.street
            }            
          },
          {
            mediumType: 'TelephoneNumber',
            //Revisar
            preferred: this.billing_accounts.length > 0 ? false : true,
            characteristic: {
              contactType: this.billingFormUpdate.value.telephoneType,
              phoneNumber: this.updatePrefix.code+this.billingFormUpdate.value.telephoneNumber
            }              
          }
        ]
      }],
      relatedParty:[{
        href: aux.partyId,
        id: aux.partyId,
        role: "bill receiver"
      }],
      state: "Defined"
    }
    this.accountService.updateBillingAccount(this.billToUpdate.id,billacc).subscribe({
      next: data => {
          console.log(billacc)
          this.getBilling();
          this.billingFormUpdate.reset();
          this.editBill=false;
      },
      error: error => {
          console.error('There was an error while updating!', error);
      }
    });
  }

  selectPrefix(pref:any,op:any){
    console.log(pref)
    if(op=='create'){
      this.prefixCheck=false;
      this.createPrefix=pref;
    } else if(op=='update'){
      this.prefixCheckUpdate=false;
      this.updatePrefix=pref;
    }
    
    
  }
}

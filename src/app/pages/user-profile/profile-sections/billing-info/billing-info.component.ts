import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { LoginInfo, billingAccountCart } from 'src/app/models/interfaces';
import { ApiServiceService } from 'src/app/services/product-service.service';
import { AccountServiceService } from 'src/app/services/account-service.service';
import {LocalStorageService} from "src/app/services/local-storage.service";
import { ProductOrderService } from 'src/app/services/product-order-service.service';
import {components} from "src/app/models/product-catalog";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
type ProductOffering = components["schemas"]["ProductOffering"];
import { phoneNumbers, countries } from 'src/app/models/country.const'
import { initFlowbite } from 'flowbite';
import {EventMessageService} from "src/app/services/event-message.service";
import * as moment from 'moment';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'billing-info',
  templateUrl: './billing-info.component.html',
  styleUrl: './billing-info.component.css'
})
export class BillingInfoComponent implements OnInit{
  loading: boolean = false;
  orders:any[]=[];
  profile:any;
  partyId:any='';
  billing_accounts: billingAccountCart[] =[];
  selectedBilling:any;
  billToDelete:any;
  billToUpdate:any;
  editBill:boolean=false;
  deleteBill:boolean=false;
  showOrderDetails:boolean=false;
  orderToShow:any;
  dateRange = new FormControl();
  selectedDate:any;
  countries: any[] = countries;
  preferred:boolean=false;

  constructor(
    private localStorage: LocalStorageService,
    private api: ApiServiceService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private accountService: AccountServiceService,
    private orderService: ProductOrderService,
    private eventMessage: EventMessageService
  ) {
    this.eventMessage.messages$.subscribe(ev => {
      if(ev.type === 'BillAccChanged') {
        this.getBilling();
      }
      if(ev.value == false){
        this.editBill=false;
      }
    })
  }

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
    if(this.showOrderDetails==true){
      this.showOrderDetails=false;
      this.cdr.detectChanges();
    }
  }

  ngOnInit() {
    this.loading=true;
    let today = new Date();
    today.setMonth(today.getMonth()-1);
    this.selectedDate = today.toISOString();
    let aux = this.localStorage.getObject('login_items') as LoginInfo;
    if(JSON.stringify(aux) != '{}' && (((aux.expire - moment().unix())-4) > 0)) {
      this.partyId = aux.partyId;
      this.getBilling();
    }
    initFlowbite();
  }

  getBilling(){   
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
      if(this.billing_accounts.length>0){
        this.preferred=false;
      }else{
        this.preferred=true;
      }
      this.cdr.detectChanges();
    })
    this.cdr.detectChanges();
    initFlowbite();
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
    //this.accountService.deleteBillingAccount(baddr.id).subscribe(() => this.getBilling());
    this.deleteBill=false;
    this.cdr.detectChanges();
  }

  toggleEditBill(bill:billingAccountCart){
    this.billToUpdate=bill;    
    this.editBill=true;
    this.cdr.detectChanges();
  }

  toggleDeleteBill(bill:billingAccountCart){
    this.deleteBill=true;
    this.billToDelete=bill;
  }

}
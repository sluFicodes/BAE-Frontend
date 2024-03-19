import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild, AfterViewInit, HostListener, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AccountServiceService } from 'src/app/services/account-service.service';
import {LocalStorageService} from "../../services/local-storage.service";
import { Router } from '@angular/router';
import {components} from "../../models/product-catalog";
type ProductOffering = components["schemas"]["ProductOffering"];
import { phoneNumbers, countries } from '../../models/country.const'
import { initFlowbite } from 'flowbite';
import * as moment from 'moment';
import { LoginInfo, billingAccountCart } from 'src/app/models/interfaces';
import {EventMessageService} from "../../services/event-message.service";
import parsePhoneNumber from 'libphonenumber-js'

@Component({
  selector: 'app-billing-account-form',
  templateUrl: './billing-account-form.component.html',
  styleUrl: './billing-account-form.component.css'
})
export class BillingAccountFormComponent implements OnInit {

  @Input() billAcc: billingAccountCart | undefined;

  billingForm = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
    country: new FormControl(''),
    city: new FormControl(''),
    stateOrProvince: new FormControl(''),
    postCode: new FormControl('', [
      Validators.required,
      Validators.pattern("^[0-9]*$")
    ]),
    street: new FormControl(''),
    telephoneNumber: new FormControl('',[
      Validators.required,
      Validators.pattern("^[0-9]*$"),
      Validators.maxLength(9),
    ]),
    telephoneType: new FormControl('')
  });
  billing_accounts: billingAccountCart[] =[];
  prefixes: any[] = phoneNumbers;
  countries: any[] = countries;
  phonePrefix:any=phoneNumbers[0];
  prefixCheck:boolean=false;
  toastVisibility:boolean=false;

  partyId:any;
  loading:boolean=false;
  is_create:boolean=false;


  constructor(
    private localStorage: LocalStorageService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private accountService: AccountServiceService,
    private eventMessage: EventMessageService
  ) {}


  ngOnInit() {
    this.loading=true;
    if(this.billAcc != undefined){
      this.is_create=false;
    } else {
      this.is_create=true;
    }
    let aux = this.localStorage.getObject('login_items') as LoginInfo;
    if(JSON.stringify(aux) != '{}' && (((aux.expire - moment().unix())-4) > 0)) {
      this.partyId=aux.partyId;
    }
    this.getBilling();
    if(this.is_create==false){
      this.setDefaultValues();
    }    
    
  }

  setDefaultValues(){
    if(this.billAcc != undefined){
      const phoneNumber = parsePhoneNumber(this.billAcc.telephoneNumber)
      if (phoneNumber) {
        let pref = this.prefixes.filter(item => item.code === '+'+phoneNumber.countryCallingCode);
        if(pref.length > 0){
          this.phonePrefix= pref[0];
        }
        this.billingForm.controls['telephoneNumber'].setValue(phoneNumber.nationalNumber);
      }
      //Get old bilAcc values
      this.billingForm.controls['name'].setValue(this.billAcc.name);
      this.billingForm.controls['email'].setValue(this.billAcc.email);
      this.billingForm.controls['country'].setValue(this.billAcc.postalAddress.country);
      this.billingForm.controls['city'].setValue(this.billAcc.postalAddress.city);
      this.billingForm.controls['stateOrProvince'].setValue(this.billAcc.postalAddress.stateOrProvince);
      this.billingForm.controls['street'].setValue(this.billAcc.postalAddress.street);
      this.billingForm.controls['postCode'].setValue(this.billAcc.postalAddress.postCode);
      this.billingForm.controls['telephoneType'].setValue(this.billAcc.telephoneType);
    }
    this.cdr.detectChanges()
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
      }
      this.cdr.detectChanges();
    })
    this.cdr.detectChanges();
  }

  createBilling(){
    let aux = this.localStorage.getObject('login_items') as LoginInfo;
    const phoneNumber = parsePhoneNumber(this.phonePrefix.code+this.billingForm.value.telephoneNumber);
    if(phoneNumber){
      if(phoneNumber.isValid() == false){
        console.log('NUMERO INVALIDO')
        this.billingForm.controls['telephoneNumber'].setErrors({ 'invalidPhoneNumber': true });
        this.toastVisibility=true;
        setTimeout(() => {
          this.toastVisibility=false
        }, 2000);
        return;
      } else {
        this.billingForm.controls['telephoneNumber'].setErrors(null);
        this.toastVisibility=false;
      }
    }

    let billacc = {
      name: this.billingForm.value.name,
      contact: [{
        contactMedium: [
          {
            mediumType: 'Email',
            preferred: this.billing_accounts.length > 0 ? false : true,
            characteristic: {
              contactType: 'Email',
              emailAddress: this.billingForm.value.email
            }
          },
          {
            mediumType: 'PostalAddress',
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
            preferred: this.billing_accounts.length > 0 ? false : true,
            characteristic: {
              contactType: this.billingForm.value.telephoneType,
              phoneNumber: this.phonePrefix.code+this.billingForm.value.telephoneNumber
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
          this.eventMessage.emitBillAccChange(true);
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
    const phoneNumber = parsePhoneNumber(this.phonePrefix.code+this.billingForm.value.telephoneNumber);
    if(phoneNumber){
      if(phoneNumber.isValid() == false){
        console.log('NUMERO INVALIDO')
        this.billingForm.controls['telephoneNumber'].setErrors({ 'invalidPhoneNumber': true });
        this.toastVisibility=true;
        setTimeout(() => {
          this.toastVisibility=false
        }, 2000);
        return;
      } else {
        this.billingForm.controls['telephoneNumber'].setErrors(null);
        this.toastVisibility=false;
      }
    }
    if(this.billAcc != undefined){
      let bill_body = {
        name: this.billingForm.value.name,
        contact: [{
          contactMedium: [
            {
              mediumType: 'Email',
              preferred: this.billAcc.selected,
              characteristic: {
                contactType: 'Email',
                emailAddress: this.billingForm.value.email
              }
            },
            {
              mediumType: 'PostalAddress',
              preferred: this.billAcc.selected,
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
              preferred: this.billAcc.selected,
              characteristic: {
                contactType: this.billingForm.value.telephoneType,
                phoneNumber: this.phonePrefix.code+this.billingForm.value.telephoneNumber
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
      this.accountService.updateBillingAccount(this.billAcc.id,bill_body).subscribe({
        next: data => {
            this.eventMessage.emitBillAccChange(false);
            this.getBilling();
            this.billingForm.reset();
        },
        error: error => {
            console.error('There was an error while updating!', error);
        }
      });
    }    
  }

  selectPrefix(pref:any){
    console.log(pref)
    this.prefixCheck=false;
    this.phonePrefix=pref;
  }
  

}

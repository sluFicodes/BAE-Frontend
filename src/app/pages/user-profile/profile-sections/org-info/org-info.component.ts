import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { LoginInfo } from 'src/app/models/interfaces';
import { ApiServiceService } from 'src/app/services/product-service.service';
import { AccountServiceService } from 'src/app/services/account-service.service';
import {LocalStorageService} from "src/app/services/local-storage.service";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { phoneNumbers, countries } from 'src/app/models/country.const'
import {EventMessageService} from "src/app/services/event-message.service";
import { initFlowbite } from 'flowbite';
import * as moment from 'moment';
import {components} from "../../../../models/party-catalog";
import { v4 as uuidv4 } from 'uuid';
import {parsePhoneNumber, getCountries, getCountryCallingCode, CountryCode} from 'libphonenumber-js'

type OrganizationUpdate = components["schemas"]["Organization_Update"];

@Component({
  selector: 'org-info',
  templateUrl: './org-info.component.html',
  styleUrl: './org-info.component.css'
})
export class OrgInfoComponent {
  loading: boolean = false;
  orders:any[]=[];
  profile:any;
  partyId:any='';
  token:string='';
  email:string='';
  selectedDate:any;
  profileForm = new FormGroup({
    name: new FormControl('')
  });
  mediumForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
    country: new FormControl(''),
    city: new FormControl(''),
    stateOrProvince: new FormControl(''),
    postCode: new FormControl(''),
    street: new FormControl(''),
    telephoneNumber: new FormControl(''),
    telephoneType: new FormControl('')
  });
  contactmediums:any[]=[];
  emailSelected:boolean=true;
  addressSelected:boolean=false;
  phoneSelected:boolean=false;
  prefixes: any[] = phoneNumbers;
  countries: any[] = countries;
  phonePrefix: any = phoneNumbers[0];
  prefixCheck: boolean = false;
  showEditMedium: boolean = false;
  selectedMedium:any;
  selectedMediumType:any;
  toastVisibility: boolean = false;

  errorMessage:any='';
  showError:boolean=false;

  constructor(
    private localStorage: LocalStorageService,
    private api: ApiServiceService,
    private cdr: ChangeDetectorRef,
    private accountService: AccountServiceService,
    private eventMessage: EventMessageService
  ) {
    this.eventMessage.messages$.subscribe(ev => {
      if(ev.type === 'ChangedSession') {
        this.initPartyInfo();
      }
    })
  }

  ngOnInit() {
    this.loading=true;
    let today = new Date();
    today.setMonth(today.getMonth()-1);
    this.selectedDate = today.toISOString();
    this.initPartyInfo();
  }

  initPartyInfo(){
    let aux = this.localStorage.getObject('login_items') as LoginInfo;
    if(JSON.stringify(aux) != '{}' && (((aux.expire - moment().unix())-4) > 0)) {
      let loggedOrg = aux.organizations.find((element: { id: any; }) => element.id == aux.logged_as)
      this.partyId = loggedOrg.partyId;

      this.token=aux.token;
      this.email=aux.email;
      //this.partyId = aux.partyId;
      this.getProfile();
    }
    initFlowbite();
  }

  getProfile(){
    this.contactmediums=[];
    this.accountService.getOrgInfo(this.partyId).then(data=> {
      console.log('--org info--')
      console.log(data)
      this.profile=data;
      this.loadProfileData(this.profile)
      this.loading=false;
      this.cdr.detectChanges();
    })

    this.cdr.detectChanges();
    initFlowbite();
  }

  updateProfile(){
    let mediums = [];
    for(let i=0; i<this.contactmediums.length; i++){
      console.log(this.contactmediums)
      if(this.contactmediums[i].mediumType == 'Email'){
        mediums.push({
          mediumType: 'Email',
          preferred: this.contactmediums[i].preferred,
          characteristic: {
            contactType: this.contactmediums[i].characteristic.contactType,
            emailAddress: this.contactmediums[i].characteristic.emailAddress
          }
        })
        console.log(this.contactmediums[i])
      } else if(this.contactmediums[i].mediumType == 'PostalAddress'){
        mediums.push({
          mediumType: this.contactmediums[i].mediumType,
          preferred: this.contactmediums[i].preferred,
          characteristic: {
            contactType: 'PostalAddress',
            city: this.contactmediums[i].characteristic.city,
            country: this.contactmediums[i].characteristic.country,
            postCode: this.contactmediums[i].characteristic.postCode,
            stateOrProvince: this.contactmediums[i].characteristic.stateOrProvince,
            street1: this.contactmediums[i].characteristic.street1
          }
        })
      } else {
        mediums.push({
          mediumType: this.contactmediums[i].mediumType,
          preferred: this.contactmediums[i].preferred,
          characteristic: {
            contactType: this.contactmediums[i].characteristic.contactType,
            phoneNumber: this.contactmediums[i].characteristic.phoneNumber
          }
        })          
      }
    }
    
    let profile = {
      "id": this.partyId,
      "href": this.partyId,
      "tradingName": this.profileForm.value.name,
      "contactMedium": mediums
    }
    console.log(profile)
    this.accountService.updateOrgInfo(this.partyId,profile).subscribe({
      next: data => {
        this.profileForm.reset();
        this.getProfile();        
      },
      error: error => {
          console.error('There was an error while updating!', error);
          if(error.error.error){
            console.log(error)
            this.errorMessage='Error: '+error.error.error;
          } else {
            this.errorMessage='There was an error while updating profile!';
          }
          this.showError=true;
          setTimeout(() => {
            this.showError = false;
          }, 3000);
      }
    });
  }

  loadProfileData(profile:any){
    this.profileForm.controls['name'].setValue(profile.tradingName);
    if(profile.contactMedium){
      for(let i=0; i<this.profile.contactMedium.length; i++){
        if(profile.contactMedium[i].mediumType == 'Email'){
          this.contactmediums.push({
            id: uuidv4(),
            mediumType: 'Email',
            preferred: profile.contactMedium[i].preferred,
            characteristic: {
              contactType: profile.contactMedium[i].characteristic?.contactType,
              emailAddress: profile.contactMedium[i].characteristic.emailAddress
            }
          })
        } else if(profile.contactMedium[i].mediumType == 'PostalAddress'){
          this.contactmediums.push({
            id: uuidv4(),
            mediumType: profile.contactMedium[i].mediumType,
            preferred: profile.contactMedium[i].preferred,
            characteristic: {
              contactType: 'PostalAddress',
              city: profile.contactMedium[i].characteristic.city,
              country: profile.contactMedium[i].characteristic.country,
              postCode: profile.contactMedium[i].characteristic.postCode,
              stateOrProvince: profile.contactMedium[i].characteristic.stateOrProvince,
              street1: profile.contactMedium[i].characteristic.street1
            }
          })
        } else {
          this.contactmediums.push({
            id: uuidv4(),
            mediumType: profile.contactMedium[i].mediumType,
            preferred: profile.contactMedium[i].preferred,
            characteristic: {
              contactType: profile.contactMedium[i].characteristic.contactType,
              phoneNumber: profile.contactMedium[i].characteristic.phoneNumber
            }
          })          
        }
      }
    }
  }

  saveMedium(){
    const phoneNumber = parsePhoneNumber(this.phonePrefix.code + this.mediumForm.value.telephoneNumber);
    if (phoneNumber) {
      if (!phoneNumber.isValid()) {
        console.log('NUMERO INVALIDO')
        this.mediumForm.controls['telephoneNumber'].setErrors({'invalidPhoneNumber': true});
        this.toastVisibility = true;
        setTimeout(() => {
          this.toastVisibility = false
        }, 2000);
        return;
      } else {
        this.mediumForm.controls['telephoneNumber'].setErrors(null);
        this.toastVisibility = false;
      }
    }

    if (this.mediumForm.invalid) {
      this.toastVisibility = true;
      setTimeout(() => {
        this.toastVisibility = false
      }, 2000);
      return;
    } else {
      if(this.emailSelected){
        this.contactmediums.push({
          id: uuidv4(),
          mediumType: 'Email',
          preferred: false,
          characteristic: {
            contactType: 'Email',
            emailAddress: this.mediumForm.value.email
          }
        })
      } else if(this.addressSelected){
        this.contactmediums.push({
          id: uuidv4(),
          mediumType: 'PostalAddress',
          preferred: false,
          characteristic: {
            contactType: 'PostalAddress',
            city: this.mediumForm.value.city,
            country: this.mediumForm.value.country,
            postCode: this.mediumForm.value.postCode,
            stateOrProvince: this.mediumForm.value.stateOrProvince,
            street1: this.mediumForm.value.street
          }
        })
      } else {
        this.contactmediums.push({
          id: uuidv4(),
          mediumType: 'TelephoneNumber',
          preferred: false,
          characteristic: {
            contactType: this.mediumForm.value.telephoneType,
            phoneNumber: this.phonePrefix.code + this.mediumForm.value.telephoneNumber
          }
        })
      }
    }
    this.mediumForm.reset();
    console.log(this.contactmediums)
  }

  removeMedium(medium:any){
    const index = this.contactmediums.findIndex(item => item.id === medium.id);
    if (index !== -1) {
      this.contactmediums.splice(index, 1);
    }
  }

  editMedium(){
    console.log(this.phoneSelected)
    if(this.phoneSelected){
      const phoneNumber = parsePhoneNumber(this.phonePrefix.code + this.mediumForm.value.telephoneNumber);
      if (phoneNumber) {
        if (!phoneNumber.isValid()) {
          console.log('NUMERO INVALIDO')
          this.mediumForm.controls['telephoneNumber'].setErrors({'invalidPhoneNumber': true});
          this.toastVisibility = true;
          setTimeout(() => {
            this.toastVisibility = false
          }, 2000);
          return;
        } else {
          this.mediumForm.controls['telephoneNumber'].setErrors(null);
          this.toastVisibility = false;
        }
      }
    }
    if (this.mediumForm.invalid) {
      this.toastVisibility = true;
      setTimeout(() => {
        this.toastVisibility = false
      }, 2000);
      return;
    } else {
      const index = this.contactmediums.findIndex(item => item.id === this.selectedMedium.id);
      if (index !== -1) {
        if(this.emailSelected){
          this.contactmediums[index]={
            id: this.contactmediums[index].id,
            mediumType: 'Email',
            preferred: false,
            characteristic: {
              contactType: 'Email',
              emailAddress: this.mediumForm.value.email
            }
          }
        } else if(this.addressSelected){
          this.contactmediums[index]={
            id: this.contactmediums[index].id,
            mediumType: 'PostalAddress',
            preferred: false,
            characteristic: {
              contactType: 'PostalAddress',
              city: this.mediumForm.value.city,
              country: this.mediumForm.value.country,
              postCode: this.mediumForm.value.postCode,
              stateOrProvince: this.mediumForm.value.stateOrProvince,
              street1: this.mediumForm.value.street
            }
          }
        } else {
          this.contactmediums[index]={
            id: this.contactmediums[index].id,
            mediumType: 'TelephoneNumber',
            preferred: false,
            characteristic: {
              contactType: this.mediumForm.value.telephoneType,
              phoneNumber: this.phonePrefix.code + this.mediumForm.value.telephoneNumber
            }
          }
        }
        this.mediumForm.reset();
        this.showEditMedium=false;
      }
    }
  }

  showEdit(medium:any){
    this.selectedMedium=medium;
    if(this.selectedMedium.mediumType=='Email'){
      this.selectedMediumType='email';
      this.mediumForm.controls['email'].setValue(this.selectedMedium.characteristic.emailAddress);
      this.emailSelected=true;
      this.addressSelected=false;
      this.phoneSelected=false;
    } else if(this.selectedMedium.mediumType=='PostalAddress'){
      this.selectedMediumType='address';
      this.mediumForm.controls['country'].setValue(this.selectedMedium.characteristic.country);
      this.mediumForm.controls['city'].setValue(this.selectedMedium.characteristic.city);
      this.mediumForm.controls['stateOrProvince'].setValue(this.selectedMedium.characteristic.stateOrProvince);
      this.mediumForm.controls['postCode'].setValue(this.selectedMedium.characteristic.postCode);
      this.mediumForm.controls['street'].setValue(this.selectedMedium.characteristic.street1);
      this.emailSelected=false;
      this.addressSelected=true;
      this.phoneSelected=false;
    } else {
      this.selectedMediumType='phone';
      const phoneNumber = parsePhoneNumber(this.selectedMedium.characteristic.phoneNumber)
      if (phoneNumber) {
        let pref = this.prefixes.filter(item => item.code === '+' + phoneNumber.countryCallingCode);
        if (pref.length > 0) {
          this.phonePrefix = pref[0];
        }
        this.mediumForm.controls['telephoneNumber'].setValue(phoneNumber.nationalNumber);
      }
      this.mediumForm.controls['telephoneType'].setValue(this.selectedMedium.characteristic.contactType);
      this.emailSelected=false;
      this.addressSelected=false;
      this.phoneSelected=true;      
    }
    this.showEditMedium=true;
  }

  selectPrefix(pref:any) {
    console.log(pref)
    this.prefixCheck = false;
    this.phonePrefix = pref;
  }

  onTypeChange(event: any) {
    if(event.target.value=='email'){
      this.emailSelected=true;
      this.addressSelected=false;
      this.phoneSelected=false;
    }else if (event.target.value=='address'){
      this.emailSelected=false;
      this.addressSelected=true;
      this.phoneSelected=false;
    }else{
      this.emailSelected=false;
      this.addressSelected=false;
      this.phoneSelected=true;
    }
    this.mediumForm.reset();
  }

}

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
    let profile = {
      "id": this.partyId,
      "href": this.partyId,
      "tradingName": this.profileForm.value.name
    }
    console.log(profile)
    this.accountService.updateOrgInfo(this.partyId,profile).subscribe({
      next: data => {
        this.profileForm.reset();
        this.getProfile();        
      },
      error: error => {
          console.error('There was an error while updating!', error);
          this.errorMessage='There was an error while updating profile!';
          this.showError=true;
          setTimeout(() => {
            this.showError = false;
          }, 3000);
      }
    });
  }

  loadProfileData(profile:any){
    this.profileForm.controls['name'].setValue(profile.tradingName);
  }

}

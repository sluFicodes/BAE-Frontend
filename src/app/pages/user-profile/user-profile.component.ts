import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { LoginInfo, billingAccountCart } from 'src/app/models/interfaces';
import { ApiServiceService } from 'src/app/services/product-service.service';
import { AccountServiceService } from 'src/app/services/account-service.service';
import {LocalStorageService} from "../../services/local-storage.service";
import { ProductOrderService } from 'src/app/services/product-order-service.service';
import { FastAverageColor } from 'fast-average-color';
import {components} from "../../models/product-catalog";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
type ProductOffering = components["schemas"]["ProductOffering"];
import { phoneNumbers, countries } from '../../models/country.const'
import { initFlowbite } from 'flowbite';
import {EventMessageService} from "../../services/event-message.service";
import * as moment from 'moment';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit{
  loading: boolean = false;
  loadingOrders: boolean = false;
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
  showOrderDetails:boolean=false;
  orderToShow:any;
  userProfileForm = new FormGroup({
    name: new FormControl(''),
    lastname: new FormControl(''),
    treatment: new FormControl(''),
    maritalstatus: new FormControl(''),
    gender: new FormControl(''),
    nacionality: new FormControl(''),
    birthdate: new FormControl(''),
    city: new FormControl(''),
    country: new FormControl(''),
  });
  dateRange = new FormControl();
  selectedDate:any;
  countries: any[] = countries;
  preferred:boolean=false;
  loading_more: boolean = false;
  page_check:boolean = true;
  page: number=0;
  ORDER_LIMIT: number = environment.ORDER_LIMIT;
  filters: any[]=[];

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
      this.token=aux.token;
      this.email=aux.email;
      this.partyId = aux.partyId;
      this.getProfile();
    }
    initFlowbite();
  }

  getProfile(){
    this.show_billing=false;
    this.show_profile=true;
    this.show_orders=false;
    this.selectGeneral();
  }

  getBilling(){
    this.selectBilling();    
    this.show_billing=true;
    this.show_profile=false;
    this.show_orders=false;
    this.cdr.detectChanges();
    initFlowbite();
  }

  goToOrders(){
    this.selectOrder();
    this.show_billing=false;
    this.show_profile=false;
    this.show_orders=true;
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

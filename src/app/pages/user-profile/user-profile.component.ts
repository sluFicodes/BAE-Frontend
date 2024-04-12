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
  show_profile: boolean = true;
  show_orders: boolean = false;
  show_billing: boolean = false;
  profile:any;
  partyId:any='';
  token:string='';
  email:string='';

  constructor(
    private localStorage: LocalStorageService,
    private cdr: ChangeDetectorRef
  ) {

  }

  ngOnInit() {
    let today = new Date();
    today.setMonth(today.getMonth()-1);
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

import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { LoginInfo, billingAccountCart } from 'src/app/models/interfaces';
import { ApiServiceService } from 'src/app/services/product-service.service';
import { AccountServiceService } from 'src/app/services/account-service.service';
import {LocalStorageService} from "src/app/services/local-storage.service";
import { ProductOrderService } from 'src/app/services/product-order-service.service';
import { FastAverageColor } from 'fast-average-color';
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
  selector: 'order-info',
  templateUrl: './order-info.component.html',
  styleUrl: './order-info.component.css'
})

export class OrderInfoComponent implements OnInit, AfterViewInit{
  loading: boolean = false;
  orders:any[]=[];
  profile:any;
  partyId:any='';
  showOrderDetails:boolean=false;
  orderToShow:any;
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
    private accountService: AccountServiceService,
    private orderService: ProductOrderService
  ) {

  }

  @HostListener('document:click')
  onClick() {
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
      this.page=0;
      this.orders=[];
      this.filters=[];
      this.getOrders(0);
    }
    initFlowbite();
  }

  ngAfterViewInit(){
    initFlowbite();
  }

  getProductImage(prod:ProductOffering) {
    let profile = prod?.attachment?.filter(item => item.name === 'Profile Picture') ?? [];
    let images = prod.attachment?.filter(item => item.attachmentType === 'Picture') ?? [];
    if(profile.length!=0){
      images = profile;
    } 
    return images.length > 0 ? images?.at(0)?.url : 'https://placehold.co/600x400/svg';
  }

  getOrders(size:number){        
    if(this.partyId!=''){
      this.orderService.getProductOrders(this.partyId,this.page,this.filters,this.selectedDate).then(orders=> {
        if(orders.length<this.ORDER_LIMIT){
          this.page_check=false;
          this.cdr.detectChanges();
        }else{
          this.page_check=true;
          this.cdr.detectChanges();
        }
        if(orders.length==0){
          this.loading=false;
        }
        //this.orders=[];
        for(let i=0;i<orders.length;i++){          
          this.orders.push(orders[i]);
        }
        for(let i=size;i<this.orders.length;i++){
          let items:any[] = [];
          this.accountService.getBillingAccountById(this.orders[i].billingAccount.id).then(bill => {
            for(let j=0;j<this.orders[i].productOrderItem.length;j++){
              this.api.getProductById(this.orders[i].productOrderItem[j].id).then(item => {
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
                      this.loading=false;
                      this.loading_more=false;
                      initFlowbite();
                  })
                })
              })
            }
            this.orders[i]['billingAccount']=bill;
            this.orders[i].productOrderItem=items;            
          })
          
        }
        console.log('--- ORDERS ---')
        console.log(this.orders)
      })
    }

    //this.loading=false;    
    //this.loading_more=false; 
    this.cdr.detectChanges();
  }

  async next(){
    this.loading=true;
    let existingOrderSize=this.orders.length;
    this.loading_more=true;
    this.page=this.page+this.ORDER_LIMIT;
    this.cdr.detectChanges;
    console.log(this.page)
    await this.getOrders(existingOrderSize);
  }

  onStateFilterChange(filter:string){
    this.loading=true;
    const index = this.filters.findIndex(item => item === filter);
    if (index !== -1) {
      this.filters.splice(index, 1);
      console.log('elimina filtro')
      console.log(this.filters)
    } else {
      console.log('añade filtro')
      console.log(this.filters)
      this.filters.push(filter)
    }
    this.page=0;
    this.orders=[];
    this.getOrders(0);
    initFlowbite();
  }

  filterOrdersByDate(){
    if(this.dateRange.value == 'month'){
      let today = new Date();
      today.setDate(1);
      today.setMonth(today.getMonth()-1);
      this.selectedDate = today.toISOString();
    } else if (this.dateRange.value == 'months'){
      let today = new Date();
      today.setDate(1);
      today.setMonth(today.getMonth()-3);
      this.selectedDate = today.toISOString();
    } else if(this.dateRange.value == 'year'){
      let today = new Date();
      today.setDate(1);
      today.setMonth(0);
      today.setFullYear(today.getFullYear()-1);
      this.selectedDate = today.toISOString();
    } else {
      this.selectedDate = undefined
    }
    console.log(this.selectedDate)
    this.page=0;
    this.orders=[];
    this.getOrders(0);
    initFlowbite();
  }

  getTotalPrice(items:any[]){
    let totalPrice = [];
    let insertCheck = false;
    for(let i=0; i<items.length; i++){
      insertCheck = false;
      if(totalPrice.length == 0){
        totalPrice.push(items[i].productOfferingPrice);
      } else {
        for(let j=0; j<totalPrice.length; j++){
          if(items[i].productOfferingPrice.priceType == totalPrice[j].priceType && items[i].productOfferingPrice.unit == totalPrice[j].unit && items[i].productOfferingPrice.text == totalPrice[j].text){
            totalPrice[j].price=totalPrice[j].price+items[i].productOfferingPrice.price;
            insertCheck=true;
          }
        }
        if(insertCheck==false){
          totalPrice.push(items[i].productOfferingPrice);
          insertCheck=true;
        }
      }
    }
    return totalPrice
  }

  toggleShowDetails(order:any){
    console.log(order)
    this.showOrderDetails=true;
    this.orderToShow=order;
  }

}
